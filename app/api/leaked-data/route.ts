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
        id ILIKE {search:String} OR
        user_name ILIKE {search:String} OR
        main_domain ILIKE {search:String} OR
        main_email ILIKE {search:String} OR
        url ILIKE {search:String}
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
        date_collected,
        ip,
        country,
        pc_name,
        user_name,
        url,
        id,
        pw,
        browser,
        main_domain,
        main_email,
        protocol
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
      pw: row.pw ? '••••••••' : '',
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