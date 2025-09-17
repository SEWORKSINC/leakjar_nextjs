import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify the requesting user is an admin
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile || (profile.role !== 'ADMIN' && profile.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // First, fetch all users from auth
    const { data: { users: authUsers }, error: listUsersError } = await supabaseAdmin.auth.admin.listUsers();

    if (listUsersError) {
      console.error('Error listing users:', listUsersError);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    // Then fetch their profiles
    const userIds = authUsers?.map(u => u.id) || [];
    console.log('Fetching domains for users:', userIds.length);

    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('user_profiles')
      .select('user_id, role, created_at')
      .in('user_id', userIds);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
    }

    // Create a map of user profiles
    const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

    // Fetch ALL domains - no filtering by user_id
    const { data: userDomains, error: domainError } = await supabaseAdmin
      .from('domains')
      .select('*');

    console.log('Domain fetch result - count:', userDomains?.length || 0);
    if (domainError) {
      console.error('Domain fetch error:', domainError);
    }

    // Group domains by user
    const domainMap: Record<string, Array<{id: string, domain: string, type: string, description?: string, companyName?: string, isVerified: boolean, verifiedAt?: string}>> = {};
    userDomains?.forEach(d => {
      if (!domainMap[d.user_id]) {
        domainMap[d.user_id] = [];
      }
      domainMap[d.user_id].push({
        id: d.id,
        domain: d.domain,
        type: d.type,
        description: d.description,
        companyName: d.company_name,
        isVerified: d.is_verified || false,
        verifiedAt: d.verified_at
      });
    });

    // Format the response
    const formattedUsers = authUsers?.map(u => ({
      id: u.id,
      email: u.email || '',
      role: profileMap.get(u.id)?.role || 'USER',
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at,
      domains_count: domainMap[u.id]?.length || 0,
      domains: domainMap[u.id] || []
    })) || [];

    return NextResponse.json({ users: formattedUsers });

  } catch (error) {
    console.error('Error in admin users API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}