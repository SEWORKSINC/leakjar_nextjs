import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export interface DomainAccess {
  hasAccess: boolean;
  isVerified: boolean;
  domainType?: 'URL' | 'EMAIL';
  domainId?: string;
  error?: string;
}

/**
 * Check if user has access to the specified domain and if it's verified
 * This ensures users can only access data for domains they own and that are verified by admin
 */
export async function checkDomainAccess(
  userId: string,
  domain: string
): Promise<DomainAccess> {
  const supabase = await createClient();

  try {
    // Check if user owns this domain and if it's verified
    // Note: Use .limit(1) to handle cases where domain exists with multiple types (URL/EMAIL)
    const { data: domainRecords, error: domainError } = await supabase
      .from('domains')
      .select(`
        id,
        domain,
        is_verified,
        type,
        visibility,
        user_id,
        organization_id
      `)
      .eq('domain', domain)
      .eq('is_verified', true)
      .limit(1);

    const domainRecord = domainRecords?.[0];

    if (domainError) {
      console.error('Domain access check error:', domainError);
      return {
        hasAccess: false,
        isVerified: false,
        error: 'Domain not found or access denied'
      };
    }

    // Check if user owns the domain directly
    if (domainRecord.user_id === userId) {
      return {
        hasAccess: true,
        isVerified: domainRecord.is_verified,
        domainType: domainRecord.type as 'URL' | 'EMAIL',
        domainId: domainRecord.id
      };
    }

    // Check if user has access through organization
    if (domainRecord.organization_id) {
      const { data: userOrg } = await supabase
        .from('user_profiles')
        .select('current_organization_id')
        .eq('user_id', userId)
        .single();

      if (userOrg?.current_organization_id === domainRecord.organization_id) {
        // Check organization membership
        const { data: membership } = await supabase
          .from('organization_members')
          .select('role')
          .eq('organization_id', domainRecord.organization_id)
          .eq('user_id', userId)
          .single();

        if (membership) {
          // Check visibility rules
          const canAccess = domainRecord.visibility === 'organization' ||
                          membership.role === 'ADMIN' ||
                          domainRecord.added_by === userId;

          if (canAccess) {
            return {
              hasAccess: true,
              isVerified: domainRecord.is_verified,
              domainType: domainRecord.type as 'URL' | 'EMAIL',
              domainId: domainRecord.id
            };
          }
        }
      }
    }

    return {
      hasAccess: false,
      isVerified: false,
      error: 'Access denied: You do not have permission to access this domain'
    };

  } catch (error) {
    console.error('Domain access check failed:', error);
    return {
      hasAccess: false,
      isVerified: false,
      error: 'Failed to verify domain access'
    };
  }
}

/**
 * Get all verified domains for a user
 * This can be used to show users what domains they can access via API
 */
export async function getUserVerifiedDomains(userId: string): Promise<{
  domains: Array<{
    id: string;
    domain: string;
    type: 'URL' | 'EMAIL';
    verified_at: string | null;
  }>;
}> {
  const supabase = await createClient();

  try {
    // Direct domains
    const { data: directDomains } = await supabase
      .from('domains')
      .select(`
        id,
        domain,
        type,
        verified_at
      `)
      .eq('user_id', userId)
      .eq('is_verified', true);

    // Organization domains
    const { data: userOrg } = await supabase
      .from('user_profiles')
      .select('current_organization_id')
      .eq('user_id', userId)
      .single();

    let orgDomains: any[] = [];
    if (userOrg?.current_organization_id) {
      const { data } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', userId);

      if (data) {
        const orgIds = data.map(m => m.organization_id);
        const { data: orgDomainData } = await supabase
          .from('domains')
          .select(`
            id,
            domain,
            type,
            verified_at
          `)
          .in('organization_id', orgIds)
          .eq('is_verified', true)
          .in('visibility', ['organization']);

        orgDomains = orgDomainData || [];
      }
    }

    return {
      domains: [...(directDomains || []), ...orgDomains]
    };

  } catch (error) {
    console.error('Failed to get user verified domains:', error);
    return { domains: [] };
  }
}

/**
 * Enhanced API key authentication that also checks domain access
 */
export async function authenticateApiKeyWithDomain(
  request: NextRequest,
  domain: string
): Promise<{
  success: boolean;
  user?: any;
  apiKey?: any;
  domainAccess?: DomainAccess;
  error?: string;
  status?: number;
}> {
  try {
    // Extract API key from Authorization header
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        success: false,
        error: 'Missing or invalid authorization header',
        status: 401
      };
    }

    const apiKey = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Import authentication function
    const { authenticateApiRequestWrapper } = await import('@/lib/api-auth');
    const authResult = await authenticateApiRequestWrapper(request);

    if (!authResult.success) {
      return authResult;
    }

    const { user, apiKey: keyData } = authResult;

    // Check domain access
    const domainAccess = await checkDomainAccess(user.id, domain);

    if (!domainAccess.hasAccess) {
      return {
        success: false,
        error: domainAccess.error || 'Access denied to this domain',
        status: 403
      };
    }

    if (!domainAccess.isVerified) {
      return {
        success: false,
        error: 'Domain is not verified by admin. Contact support for verification.',
        status: 403
      };
    }

    return {
      success: true,
      user,
      apiKey: keyData,
      domainAccess
    };

  } catch (error) {
    console.error('API key and domain authentication failed:', error);
    return {
      success: false,
      error: 'Authentication failed',
      status: 500
    };
  }
}