import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST /api/organizations/invitations/accept - Accept invitation
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
    const { invitationToken } = body;

    if (!invitationToken) {
      return NextResponse.json({ error: 'Invitation token required' }, { status: 400 });
    }

    // Get invitation details
    const { data: invitation, error: inviteError } = await supabase
      .from('organization_invitations')
      .select(`
        *,
        organization:organizations(*)
      `)
      .eq('invitation_token', invitationToken)
      .single();

    if (inviteError || !invitation) {
      return NextResponse.json({ error: 'Invalid invitation token' }, { status: 404 });
    }

    // Check invitation status
    if (invitation.status !== 'pending') {
      return NextResponse.json({
        error: `Invitation has already been ${invitation.status}`
      }, { status: 400 });
    }

    // Check expiration
    if (new Date(invitation.expires_at) < new Date()) {
      // Mark as expired
      await supabase
        .from('organization_invitations')
        .update({ status: 'expired' })
        .eq('id', invitation.id);

      return NextResponse.json({ error: 'Invitation has expired' }, { status: 400 });
    }

    // Check if email matches (if user already exists)
    if (invitation.email !== user.email) {
      return NextResponse.json({
        error: 'This invitation was sent to a different email address'
      }, { status: 403 });
    }

    // Check if user is already a member
    const { data: existingMember } = await supabase
      .from('organization_members')
      .select('id')
      .eq('organization_id', invitation.organization_id)
      .eq('user_id', user.id)
      .single();

    if (existingMember) {
      // User is already a member, just mark invitation as accepted
      await supabase
        .from('organization_invitations')
        .update({
          status: 'accepted',
          accepted_at: new Date().toISOString()
        })
        .eq('id', invitation.id);

      return NextResponse.json({
        message: 'You are already a member of this organization',
        organization: invitation.organization
      });
    }

    // Add user as organization member
    const { data: newMember, error: memberError } = await supabase
      .from('organization_members')
      .insert({
        organization_id: invitation.organization_id,
        user_id: user.id,
        role: invitation.role,
        status: 'active',
        invited_by: invitation.invited_by,
        invited_at: invitation.invited_at,
        joined_at: new Date().toISOString()
      })
      .select()
      .single();

    if (memberError) {
      console.error('Error adding member:', memberError);
      return NextResponse.json({ error: 'Failed to add member' }, { status: 500 });
    }

    // Update invitation status
    await supabase
      .from('organization_invitations')
      .update({
        status: 'accepted',
        accepted_at: new Date().toISOString()
      })
      .eq('id', invitation.id);

    // Log activity
    await supabase
      .from('organization_activity_logs')
      .insert({
        organization_id: invitation.organization_id,
        user_id: user.id,
        action: 'member.joined',
        resource_type: 'member',
        resource_id: newMember.id,
        details: {
          invited_by: invitation.invited_by,
          role: invitation.role
        }
      });

    // If this is user's first organization (besides personal), set it as current
    const { data: memberships } = await supabase
      .from('organization_members')
      .select('organization_id')
      .eq('user_id', user.id)
      .eq('status', 'active');

    if (memberships && memberships.length === 2) {
      // User has personal org + this new org, switch to new org
      await supabase
        .from('user_profiles')
        .update({ current_organization_id: invitation.organization_id })
        .eq('user_id', user.id);
    }

    return NextResponse.json({
      success: true,
      member: newMember,
      organization: invitation.organization
    });

  } catch (error) {
    console.error('Error in POST /api/organizations/invitations/accept:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}