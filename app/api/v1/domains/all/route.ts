import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiRequestWrapper, logApiCall } from '@/lib/api-auth';
import { createClient } from '@/lib/supabase-server';
import { clickhouse } from '@/lib/clickhouse';

/**
 * GET /api/v1/domains/all - Get all user's domains with verification status
 * Returns all domains the user has registered, regardless of verification status
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
    const supabase = await createClient();

    // Get all user's domains (direct ownership)
    const { data: directDomains, error: directError } = await supabase
      .from('domains')
      .select(`
        id,
        domain,
        type,
        company_name,
        description,
        is_verified,
        verified_at,
        visibility,
        created_at,
        updated_at
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (directError) {
      console.error('Failed to fetch direct domains:', directError);
      return NextResponse.json(
        { error: 'Failed to retrieve domains' },
        { status: 500 }
      );
    }

    // Get organization domains
    const { data: userOrg } = await supabase
      .from('user_profiles')
      .select('current_organization_id')
      .eq('user_id', user.id)
      .single();

    let orgDomains: any[] = [];
    if (userOrg?.current_organization_id) {
      const { data: membershipData } = await supabase
        .from('organization_members')
        .select('organization_id, role')
        .eq('user_id', user.id);

      if (membershipData) {
        const orgIds = membershipData.map(m => m.organization_id);
        const { data: orgDomainData } = await supabase
          .from('domains')
          .select(`
            id,
            domain,
            type,
            company_name,
            description,
            is_verified,
            verified_at,
            visibility,
            organization_id,
            added_by,
            created_at,
            updated_at,
            users!inner(name)
          `)
          .in('organization_id', orgIds)
          .order('created_at', { ascending: false });

        orgDomains = orgDomainData || [];
      }
    }

    // Combine and format domains
    const allDomains = [
      ...(directDomains || []).map(domain => ({
        ...domain,
        ownership_type: 'direct',
        access_level: 'owner',
        api_accessible: domain.is_verified
      })),
      ...orgDomains.map(domain => ({
        ...domain,
        ownership_type: 'organization',
        access_level: domain.added_by === user.id ? 'owner' : 'member',
        api_accessible: domain.is_verified &&
                      (domain.visibility === 'organization' || domain.added_by === user.id)
      }))
    ];

    // Get data counts for verified domains only (API accessible)
    const domainsWithCounts = await Promise.all(
      allDomains.map(async (domain) => {
        // Only get count for verified and API accessible domains
        if (!domain.api_accessible) {
          return {
            ...domain,
            total_records: 0
          };
        }

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
            ...domain,
            total_records: totalRecords
          };
        } catch (error) {
          console.error(`Failed to get count for domain ${domain.domain}:`, error);
          return {
            ...domain,
            total_records: 0,
            count_error: true
          };
        }
      })
    );

    // Group by status
    const domainStats = {
      total: allDomains.length,
      verified: allDomains.filter(d => d.is_verified).length,
      pending: allDomains.filter(d => !d.is_verified).length,
      api_accessible: allDomains.filter(d => d.api_accessible).length,
      by_type: {
        URL: allDomains.filter(d => d.type === 'URL').length,
        EMAIL: allDomains.filter(d => d.type === 'EMAIL').length
      },
      by_ownership: {
        direct: allDomains.filter(d => d.ownership_type === 'direct').length,
        organization: allDomains.filter(d => d.ownership_type === 'organization').length
      }
    };

    // Log API call
    const clientIP = request.headers.get('x-forwarded-for') ||
                    request.headers.get('x-real-ip') ||
                    'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    await logApiCall(user.id, '/api/v1/domains/all', 'GET', clientIP, userAgent);

    const responseTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      data: domainsWithCounts,
      stats: {
        ...domainStats,
        total_records: domainsWithCounts.reduce((sum, domain) => sum + (domain.total_records || 0), 0)
      },
      meta: {
        total_domains: allDomains.length,
        verified_domains: domainStats.verified,
        pending_verification: domainStats.pending,
        api_accessible_domains: domainStats.api_accessible,
        total_records: domainsWithCounts.reduce((sum, domain) => sum + (domain.total_records || 0), 0),
        response_time_ms: responseTime,
        api_key_id: apiKey.id.substring(0, 8) + '...',
        user_id: user.id.substring(0, 8) + '...'
      },
      note: 'Only verified domains are accessible via API.',
      help: {
        verification_info: 'Domains must be verified by administrators before API access is granted.',
        contact_support: 'Contact your administrator to verify pending domains.',
        api_access_requirements: [
          'Domain must be verified (is_verified = true)',
          'User must have access permissions based on ownership and visibility settings'
        ]
      }
    });

  } catch (error) {
    console.error('All domains API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to retrieve domain information'
      },
      { status: 500 }
    );
  }
}