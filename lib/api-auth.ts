import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase-service';
import {
  findApiKeyByHash,
  updateApiKeyLastUsed,
  hashApiKey,
  isValidApiKeyFormat,
  ApiKey
} from './api-keys';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role?: string;
  organization_id?: string | null;
}

export interface ApiAuthResult {
  user: AuthenticatedUser;
  apiKey: ApiKey;
}

/**
 * Extract API key from request headers
 */
export function extractApiKeyFromRequest(request: NextRequest): string | null {
  // Try Authorization header first
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Try X-API-Key header
  const apiKeyHeader = request.headers.get('x-api-key');
  if (apiKeyHeader) {
    return apiKeyHeader;
  }

  return null;
}

/**
 * Rate limiting check per user
 */
export async function checkRateLimit(userId: string): Promise<boolean> {
  const supabase = createServiceClient();

  try {
    // Check requests in last minute
    const oneMinuteAgo = new Date(Date.now() - 60000).toISOString();

    const { count } = await supabase
      .from('audit_logs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('action', 'api_call')
      .gte('created_at', oneMinuteAgo);

    const requestsLastMinute = count || 0;

    // Get user's rate limit based on role
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', userId)
      .single();

    let rateLimit = 100; // Default rate limit
    if (profile?.role === 'ADMIN') {
      rateLimit = 1000;
    } else if (profile?.role === 'PRO') {
      rateLimit = 500;
    }

    return requestsLastMinute < rateLimit;
  } catch (error) {
    console.error('Rate limit check error:', error);
    // Allow request on error (fail open)
    return true;
  }
}

/**
 * Log API call for audit and rate limiting
 */
export async function logApiCall(
  userId: string,
  endpoint: string,
  method: string,
  ipAddress: string | null,
  userAgent: string | null
): Promise<void> {
  const supabase = createServiceClient();

  try {
    await supabase
      .from('audit_logs')
      .insert({
        user_id: userId,
        action: 'api_call',
        entity: 'api',
        entity_id: `${method} ${endpoint}`,
        ip_address: ipAddress,
        user_agent: userAgent,
        created_at: new Date().toISOString()
      });
  } catch (error) {
    console.error('Failed to log API call:', error);
  }
}

/**
 * Update usage statistics
 */
export async function updateUsageStats(userId: string): Promise<void> {
  const supabase = createServiceClient();

  try {
    // Get current billing period
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Upsert usage record
    await supabase
      .from('usage_history')
      .upsert({
        user_id: userId,
        billing_period_start: startOfMonth.toISOString(),
        billing_period_end: endOfMonth.toISOString(),
        api_calls: 1 // We'll use a database function to increment this
      }, {
        onConflict: 'user_id,billing_period_start',
        ignoreDuplicates: false
      });

    // Increment the API calls counter
    await supabase.rpc('increment_api_calls', {
      p_user_id: userId,
      p_billing_period_start: startOfMonth.toISOString()
    });
  } catch (error) {
    console.error('Failed to update usage stats:', error);
  }
}

/**
 * Main API authentication middleware
 */
export async function authenticateApiRequest(
  request: NextRequest
): Promise<ApiAuthResult | NextResponse> {
  try {
    // Extract API key
    const apiKey = extractApiKeyFromRequest(request);
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key required' },
        { status: 401 }
      );
    }

    // Validate API key format
    if (!isValidApiKeyFormat(apiKey)) {
      return NextResponse.json(
        { error: 'Invalid API key format' },
        { status: 401 }
      );
    }

    // Find API key in database
    const keyHash = hashApiKey(apiKey);
    const apiKeyRecord = await findApiKeyByHash(keyHash);

    if (!apiKeyRecord) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    // Check if key is expired
    if (apiKeyRecord.expires_at && new Date() > new Date(apiKeyRecord.expires_at)) {
      return NextResponse.json(
        { error: 'API key expired' },
        { status: 401 }
      );
    }

    // Get user details
    const supabase = createServiceClient();
    const { data: user, error: userError } = await supabase
      .from('user_profiles')
      .select('id, role, current_organization_id')
      .eq('user_id', apiKeyRecord.user_id)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }

    // Check rate limiting
    const rateLimitOk = await checkRateLimit(apiKeyRecord.user_id);
    if (!rateLimitOk) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        {
          status: 429,
          headers: {
            'Retry-After': '60'
          }
        }
      );
    }

    // Update last used timestamp
    await updateApiKeyLastUsed(apiKeyRecord.id);

    // Log the API call
    await logApiCall(
      apiKeyRecord.user_id,
      request.nextUrl.pathname,
      request.method,
      request.ip || request.headers.get('x-forwarded-for') || null,
      request.headers.get('user-agent') || null
    );

    // Update usage stats (async, don't wait)
    updateUsageStats(apiKeyRecord.user_id);

    return {
      user: {
        id: apiKeyRecord.user_id,
        email: '', // Will be populated if needed
        role: user.role,
        organization_id: user.current_organization_id
      },
      apiKey: apiKeyRecord
    };

  } catch (error) {
    console.error('API authentication error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

/**
 * API authentication wrapper that returns consistent result format
 */
export async function authenticateApiRequestWrapper(request: NextRequest): Promise<{
  success: boolean;
  user?: AuthenticatedUser;
  apiKey?: ApiKey;
  error?: string;
  status?: number;
}> {
  try {
    const result = await authenticateApiRequest(request);

    // Check if result is a NextResponse (error case)
    if (result instanceof NextResponse) {
      const errorData = await result.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || 'Authentication failed',
        status: result.status
      };
    }

    // Success case
    return {
      success: true,
      user: result.user,
      apiKey: result.apiKey
    };
  } catch (error) {
    console.error('API authentication wrapper error:', error);
    return {
      success: false,
      error: 'Authentication failed',
      status: 500
    };
  }
}

/**
 * Higher-order function to protect API routes
 */
export function withApiAuth(
  handler: (
    request: NextRequest,
    context: { user: AuthenticatedUser; apiKey: ApiKey }
  ) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const authResult = await authenticateApiRequest(request);

    // If authResult is a NextResponse, it's an error
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    // Otherwise, it's successful authentication
    return handler(request, authResult);
  };
}