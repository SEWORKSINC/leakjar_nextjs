import { NextResponse } from 'next/server';
import { clickhouse } from '@/lib/clickhouse';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '50');
    const sortField = searchParams.get('sortField') || 'date_collected';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const search = searchParams.get('search') || '';

    const offset = (page - 1) * pageSize;

    // Build where clause for search
    let whereClause = '';
    if (search) {
      whereClause = `WHERE (
        email ILIKE {search:String} OR
        username ILIKE {search:String} OR
        domain ILIKE {search:String} OR
        source ILIKE {search:String}
      )`;
    }

    // Get total count
    const countQuery = `
      SELECT count(*) as total
      FROM leaked_data
      ${whereClause}
    `;

    const countResult = await clickhouse.query({
      query: countQuery,
      format: 'JSONEachRow',
      query_params: search ? { search: `%${search}%` } : {},
    });

    const countData = await countResult.json();
    const total = parseInt(countData[0]?.total || '0');

    // Get paginated data
    const dataQuery = `
      SELECT 
        id,
        email,
        username,
        password,
        domain,
        source,
        date_collected,
        ip_address,
        phone,
        full_name,
        address,
        credit_card,
        social_security,
        api_key,
        private_key
      FROM leaked_data
      ${whereClause}
      ORDER BY ${sortField} ${sortOrder.toUpperCase()}
      LIMIT {limit:UInt32}
      OFFSET {offset:UInt32}
    `;

    const dataResult = await clickhouse.query({
      query: dataQuery,
      format: 'JSONEachRow',
      query_params: {
        limit: pageSize,
        offset: offset,
        ...(search ? { search: `%${search}%` } : {})
      },
    });

    const data = await dataResult.json();

    // Format dates and mask sensitive data
    const formattedData = data.map((row: any) => ({
      ...row,
      date_collected: row.date_collected ? new Date(row.date_collected).toLocaleDateString() : '',
      password: row.password ? '••••••••' : '',
      credit_card: row.credit_card ? '•••• •••• •••• ' + (row.credit_card.slice(-4) || '••••') : '',
      social_security: row.social_security ? '•••-••-' + (row.social_security.slice(-4) || '••••') : '',
      api_key: row.api_key ? row.api_key.slice(0, 8) + '...' : '',
      private_key: row.private_key ? row.private_key.slice(0, 8) + '...' : '',
    }));

    return NextResponse.json({
      data: formattedData,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    });

  } catch (error) {
    console.error('Error fetching leaked data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaked data' },
      { status: 500 }
    );
  }
}