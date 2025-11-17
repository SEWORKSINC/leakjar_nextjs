import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST /api/organizations/switch - Switch current organization
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const body = await request.json();
    const { organizationId } = body;

    if (!organizationId) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });
    }

    // Check if user is a member of the organization
    const { data: membership, error: membershipError } = await supabase
      .from('organization_members')
      .select(`
        *,
        organization:organizations(*)
      `)
      .eq('user_id', user.id)
      .eq('organization_id', organizationId)
      .eq('status', 'active')
      .single();

    if (membershipError || !membership) {
      return NextResponse.json({ error: 'You are not a member of this organization' }, { status: 403 });
    }

    // Update user's current organization
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ current_organization_id: organizationId })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating current organization:', updateError);
      return NextResponse.json({ error: 'Failed to switch organization' }, { status: 500 });
    }

    // Log the activity
    await supabase
      .from('organization_activity_logs')
      .insert({
        organization_id: organizationId,
        user_id: user.id,
        action: 'organization.switched',
        details: { from_org_id: membership.organization_id }
      });

    return NextResponse.json({
      organization: membership.organization,
      member: {
        id: membership.id,
        organizationId: membership.organization_id,
        userId: membership.user_id,
        role: membership.role,
        status: membership.status,
        joinedAt: membership.joined_at
      }
    });

  } catch (error) {
    console.error('Error in POST /api/organizations/switch:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}