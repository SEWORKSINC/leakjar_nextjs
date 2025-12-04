import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiKey, logApiCall, updateUsageStats } from '@/lib/api-auth';
import { clickhouse } from '@/lib/clickhouse';
import { authenticateApiKeyWithDomain } from '@/lib/domain-auth';

/**
 * GET /api/v1/leaked-data - Get leaked data with filtering
 * Query parameters:
 * - domain: Filter by domain (required)
 * - limit: Number of records to return (default: 100, max: 1000)
 * - offset: Number of records to skip (default: 0)
 * - date_from: Start date filter (YYYY-MM-DD format)
 * - date_to: End date filter (YYYY-MM-DD format)
 * - type: Data type filter (email, username, password)
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    const searchParams = request.nextUrl.searchParams;

    // Get query parameters
    const domain = searchParams.get('domain');
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 1000);
    const offset = parseInt(searchParams.get('offset') || '0');
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

    const { user, apiKey, domainAccess } = authResult;

    // Build ClickHouse query - use appropriate field based on domain type
    const isUrlDomain = domainAccess?.domainType === 'URL';

    // Build query parameters object
    const queryParams: any = {
      domain: domain,
      limit: limit,
      offset: offset
    };

    // Add date filters to parameters
    if (dateFrom) {
      queryParams.date_from = dateFrom;
    }
    if (dateTo) {
      queryParams.date_to = dateTo;
    }

    // Build the main query
    let query = `
      SELECT
        id,
        user_name,
        pw,
        main_domain,
        main_email,
        url,
        date_collected,
        ip,
        protocol
      FROM leaked_data
      WHERE ${isUrlDomain ? 'main_domain' : 'main_email'} = {domain:String}
    `;

    // Add optional filters
    if (dateFrom) {
      query += ` AND date_collected >= {date_from:String}`;
    }

    if (dateTo) {
      query += ` AND date_collected <= {date_to:String}`;
    }

    if (type && ['email', 'username', 'password'].includes(type)) {
      if (type === 'email') {
        query += ` AND id != ''`;
      } else if (type === 'username') {
        query += ` AND user_name != ''`;
      } else if (type === 'password') {
        query += ` AND pw != '' AND pw != '[NOT_SAVED]'`;
      }
    }

    // Add ordering and pagination
    query += ` ORDER BY date_collected DESC LIMIT {limit:UInt32} OFFSET {offset:UInt32}`;

    console.log('ClickHouse Query:', query);
    console.log('Parameters:', queryParams);

    // Execute main query
    const result = await clickhouse.query({
      query,
      format: 'JSONEachRow',
      query_params: queryParams,
    });

    const leakedData = await result.json();

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total
      FROM leaked_data
      WHERE ${isUrlDomain ? 'main_domain' : 'main_email'} = {domain:String}
    `;

    const countParams: any = { domain: domain };

    if (dateFrom) {
      countQuery += ` AND date_collected >= {date_from:String}`;
      countParams.date_from = dateFrom;
    }

    if (dateTo) {
      countQuery += ` AND date_collected <= {date_to:String}`;
      countParams.date_to = dateTo;
    }

    if (type && ['email', 'username', 'password'].includes(type)) {
      if (type === 'email') {
        countQuery += ` AND id != ''`;
      } else if (type === 'username') {
        countQuery += ` AND user_name != ''`;
      } else if (type === 'password') {
        countQuery += ` AND pw != '' AND pw != '[NOT_SAVED]'`;
      }
    }

    console.log('Count Query:', countQuery);
    console.log('Count Parameters:', countParams);

    const countResult = await clickhouse.query({
      query: countQuery,
      format: 'JSONEachRow',
      query_params: countParams,
    });

    const countData = await countResult.json();
    const total = parseInt(countData[0]?.total || '0');

    // Return raw data without masking
    const rawData = leakedData;

    // Update usage stats
    await updateUsageStats(apiKey.id, 'leaked_data', rawData.length);

    // Log API call
    await logApiCall(user.id, apiKey.id, 'leaked-data', {
      domain,
      limit,
      offset,
      recordsReturned: rawData.length,
      totalAvailable: total,
      responseTime: Date.now() - startTime
    });

    return NextResponse.json({
      success: true,
      data: rawData,
      pagination: {
        total,
        limit,
        offset,
        has_more: offset + limit < total
      },
      domain_info: {
        domain,
        type: domainAccess?.domainType,
        is_verified: domainAccess?.isVerified,
        domain_id: domainAccess?.domainId
      },
      meta: {
        response_time_ms: Date.now() - startTime,
        api_key_id: apiKey.id.substring(0, 8) + '...',
        user_id: user.id.substring(0, 8) + '...'
      }
    });

  } catch (error) {
    console.error('Error in leaked-data API:', error);

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