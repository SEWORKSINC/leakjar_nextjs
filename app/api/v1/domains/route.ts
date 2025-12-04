import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiRequestWrapper, logApiCall } from '@/lib/api-auth';
import { getUserVerifiedDomains } from '@/lib/domain-auth';
import { clickhouse } from '@/lib/clickhouse';

/**
 * GET /api/v1/domains - Get user's verified domains for API access
 * Returns all domains the user can access via the API
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Authenticate API key
    const authResult = await authenticateApiRequestWrapper(request);

    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { user, apiKey } = authResult;

    // Get user's verified domains
    const { domains } = await getUserVerifiedDomains(user.id);

    // Log API call
    const clientIP = request.headers.get('x-forwarded-for') ||
                    request.headers.get('x-real-ip') ||
                    'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    await logApiCall(user.id, '/api/v1/domains', 'GET', clientIP, userAgent);

    // Get data counts for each domain
    const domainsWithCounts = await Promise.all(
      domains.map(async (domain) => {
        try {
          const isUrlDomain = domain.type === 'URL';
          const countQuery = `
            SELECT count(*) as total
            FROM leaked_data
            WHERE ${isUrlDomain ? 'main_domain' : 'main_email'} = {domain:String}
          `;

          const result = await clickhouse.query({
            query: countQuery,
            format: 'JSONEachRow',
            query_params: {
              domain: domain.domain
            }
          });

          const countData = await result.json();
          const totalRecords = countData[0]?.total || 0;

          return {
            id: domain.id,
            domain: domain.domain,
            type: domain.type,
            verified_at: domain.verified_at,
            api_accessible: true,
            total_records: totalRecords
          };
        } catch (error) {
          console.error(`Failed to get count for domain ${domain.domain}:`, error);
          return {
            id: domain.id,
            domain: domain.domain,
            type: domain.type,
            verified_at: domain.verified_at,
            api_accessible: true,
            total_records: 0,
            count_error: true
          };
        }
      })
    );

    const responseTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      data: domainsWithCounts,
      meta: {
        total_domains: domains.length,
        total_records: domainsWithCounts.reduce((sum, domain) => sum + (domain.total_records || 0), 0),
        response_time_ms: responseTime,
        api_key_id: apiKey.id.substring(0, 8) + '...',
        user_id: user.id.substring(0, 8) + '...'
      },
      note: 'Only verified domains are accessible via API. To verify additional domains, please contact your administrator.'
    });

  } catch (error) {
    console.error('Domains API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to retrieve verified domains'
      },
      { status: 500 }
    );
  }
}