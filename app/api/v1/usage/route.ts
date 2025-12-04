import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { authenticateApiRequestWrapper } from '@/lib/api-auth';

/**
 * GET /api/v1/usage - Get API usage statistics for the authenticated user
 * Supports both session auth (for web UI) and API key auth
 */
export async function GET(request: NextRequest) {
  try {
    let user, keyInfo;

    // First try session authentication (for web UI)
    const supabase = await createClient();
    const { data: { user: sessionUser }, error: authError } = await supabase.auth.getUser();

    if (!authError && sessionUser) {
      // Session auth successful - get user's API keys
      user = { id: sessionUser.id, email: sessionUser.email || '', role: 'user' };

      // Get first active API key for usage stats using service client
      const { createServiceClient } = await import('@/lib/supabase-service');
      const serviceSupabase = createServiceClient();

      const { data: apiKeys } = await serviceSupabase
        .from('api_keys')
        .select('*')
        .eq('user_id', sessionUser.id)
        .eq('is_active', true)
        .limit(1);

      keyInfo = apiKeys && apiKeys.length > 0 ? apiKeys[0] : null;
    } else {
      // Try API key authentication
      const authResult = await authenticateApiRequestWrapper(request);

      if (!authResult.success || !authResult.user || !authResult.apiKey) {
        return NextResponse.json(
          { error: authResult.error || 'Authentication failed' },
          { status: authResult.status || 401 }
        );
      }

      user = authResult.user;
      keyInfo = authResult.apiKey;
    }

    // If no API key found, return empty usage stats
    if (!keyInfo) {
      const emptyStats = {
        current_month: {
          requests: 0,
          limit: 10000,
          records_accessed: 0,
          domains_queried: 0,
          period: {
            start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
            end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString()
          }
        },
        daily: {
          requests: 0,
          limit: 500,
          percentage: 0
        },
        monthly: {
          requests: 0,
          limit: 10000,
          percentage: 0
        },
        rate_limit: {
          per_minute: 100
        },
        daily_usage: [],
        all_time: {
          total_requests: 0,
          total_records_accessed: 0,
          account_created: new Date().toISOString()
        },
        usage_by_domain: [],
        api_key: null
      };
      return NextResponse.json(emptyStats);
    }

    // Get current month start and end
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Determine tier based on user role
    const tier = user.role === 'ADMIN' ? 'premium' : 'basic';

    // Return real usage data or minimal stats if no tracking system exists
  const usageData = {
    // Current month usage (minimal real data)
    current_month: {
      requests: 0, // TODO: Implement actual usage tracking
      limit: tier === 'premium' ? 100000 : 10000,
      records_accessed: 0, // TODO: Implement actual usage tracking
      domains_queried: 0, // TODO: Implement actual usage tracking
      period: {
        start: monthStart.toISOString(),
        end: monthEnd.toISOString()
      }
    },

    // Daily usage (for web UI compatibility)
    daily: {
      requests: 0, // TODO: Implement actual daily usage tracking
      limit: tier === 'premium' ? 3000 : 500,
      percentage: 0
    },

    // Monthly usage (for web UI compatibility)
    monthly: {
      requests: 0, // TODO: Implement actual monthly usage tracking
      limit: tier === 'premium' ? 100000 : 10000,
      percentage: 0
    },

    // Rate limit info
    rate_limit: {
      per_minute: tier === 'premium' ? 1000 : 100
    },

    // Empty daily usage until tracking is implemented
    daily_usage: [],

    // All-time usage (based on key creation)
    all_time: {
      total_requests: 0, // TODO: Implement actual usage tracking
      total_records_accessed: 0, // TODO: Implement actual usage tracking
      account_created: keyInfo.created_at
    },

    // Empty domain usage until tracking is implemented
    usage_by_domain: [],

    // API key info
    api_key: {
      id: keyInfo.id,
      name: keyInfo.name,
      tier: tier,
      last_used: keyInfo.last_used
    }
  };

    // Calculate percentages (will be 0 until tracking is implemented)
    usageData.daily.percentage = Math.round((usageData.daily.requests / usageData.daily.limit) * 100);
    usageData.monthly.percentage = Math.round((usageData.monthly.requests / usageData.monthly.limit) * 100);

    // Add rate limit headers
    const remaining = Math.max(0, usageData.current_month.limit - usageData.current_month.requests);

    return NextResponse.json(usageData, {
      headers: {
        'X-RateLimit-Limit': usageData.current_month.limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': monthEnd.toISOString(),
      }
    });

  } catch (error) {
    console.error('Usage API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}