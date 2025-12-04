import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiKeyWithDomain } from '@/lib/domain-auth';
import { clickhouse } from '@/lib/clickhouse';

/**
 * GET /api/v1/leaked-data/count - Get total count of leaked data for a domain
 * Query parameters:
 * - domain: Filter by domain (required)
 * - date_from: Start date filter (YYYY-MM-DD format)
 * - date_to: End date filter (YYYY-MM-DD format)
 * - type: Data type filter (email, username, password)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Get query parameters
    const domain = searchParams.get('domain');
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');
    const type = searchParams.get('type'); // email, username, password

    // Validate required parameters
    if (!domain) {
      return NextResponse.json(
        { error: 'Domain parameter is required' },
        { status: 400 }
      );
    }

    // Authenticate API key AND check domain access
    const authResult = await authenticateApiKeyWithDomain(request, domain);

    if (!authResult.success) {
      return NextResponse.json(
        {
          error: authResult.error,
          details: authResult.error?.includes('verified')
            ? 'Domains must be verified by administrators before API access is granted. Please contact support.'
            : undefined
        },
        { status: authResult.status }
      );
    }

    // Check if it's URL domain or Email domain
    const isUrlDomain = !domain.includes('@');

    // Build COUNT query
    let query = `
      SELECT count(*) as total
      FROM leaked_data
      WHERE ${isUrlDomain ? 'main_domain' : 'main_email'} = {domain:String}
    `;

    const queryParams: Record<string, any> = {
      domain: domain
    };

    // Add optional filters
    if (dateFrom) {
      query += ` AND date_collected >= {date_from:DateTime}`;
      queryParams.date_from = dateFrom;
    }

    if (dateTo) {
      query += ` AND date_collected <= {date_to:DateTime}`;
      queryParams.date_to = dateTo;
    }

    if (type) {
      switch (type.toLowerCase()) {
        case 'email':
          query += ` AND id != ''`;
          break;
        case 'username':
          query += ` AND user_name != ''`;
          break;
        case 'password':
          query += ` AND pw != '' AND pw != '[NOT_SAVED]'`;
          break;
      }
    }

    // Execute query
    const result = await clickhouse.query({
      query,
      format: 'JSONEachRow',
      query_params: queryParams,
    });

    const data = await result.json();
    const total = data[0]?.total || 0;

    return NextResponse.json({
      success: true,
      domain: domain,
      total: total,
      filters: {
        date_from: dateFrom || null,
        date_to: dateTo || null,
        type: type || null
      },
      pagination_info: {
        total_pages: Math.ceil(total / 1000), // Assuming max limit of 1000
        max_limit_per_page: 1000
      }
    });

  } catch (error) {
    console.error('Leaked data count error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}