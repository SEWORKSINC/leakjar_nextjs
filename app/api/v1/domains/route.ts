import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiRequestWrapper, logApiCall } from '@/lib/api-auth';
import { getUserVerifiedDomains } from '@/lib/domain-auth';

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

    const responseTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      data: domains.map(domain => ({
        id: domain.id,
        domain: domain.domain,
        type: domain.type,
        verified_at: domain.verified_at,
        api_accessible: true
      })),
      meta: {
        total_domains: domains.length,
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