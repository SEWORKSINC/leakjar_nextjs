import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST /api/organizations/[organizationId]/invitations - Create invitation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string }> }
) {
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

    const { organizationId } = await params;
    const { email, role } = await request.json();

    // Check if user has permission to invite members
    const { data: member } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', organizationId)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (!member || !['owner', 'admin'].includes(member.role)) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    // Only owners can invite other admins
    if (role === 'admin' && member.role !== 'owner') {
      return NextResponse.json({ error: 'Only owners can invite admins' }, { status: 403 });
    }

    // Check if user is already a member
    const { data: existingMember } = await supabase
      .from('organization_members')
      .select('id')
      .eq('organization_id', organizationId)
      .eq('user_id', (await supabase.from('auth.users').select('id').eq('email', email).single()).data?.id)
      .single();

    if (existingMember) {
      return NextResponse.json({ error: 'User is already a member' }, { status: 400 });
    }

    // Check if invitation already exists
    const { data: existingInvitation } = await supabase
      .from('organization_invitations')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('email', email)
      .eq('status', 'pending')
      .single();

    if (existingInvitation) {
      // Get the base URL from environment or request
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL ||
                      `${request.headers.get('x-forwarded-proto') || 'http'}://${request.headers.get('host')}`;

      console.log('Existing invitation found:', existingInvitation);

      // Return existing invitation with link
      return NextResponse.json({
        error: 'Invitation already sent',
        existingInvitation: true,
        invitation: existingInvitation,
        invitationUrl: `${baseUrl}/invitations/accept?token=${existingInvitation.invitation_token || existingInvitation.token || 'TOKEN_MISSING'}`,
        invitationLink: `${baseUrl}/invitations/accept?token=${existingInvitation.invitation_token || existingInvitation.token || 'TOKEN_MISSING'}`
      }, { status: 200 }); // Return 200 instead of 400 to allow handling in frontend
    }

    // Create invitation
    const invitationToken = uuidv4();
    const { data: invitation, error: inviteError } = await supabase
      .from('organization_invitations')
      .insert({
        organization_id: organizationId,
        email: email,
        role: role,
        invited_by: user.id,
        invitation_token: invitationToken,  // Changed from 'token' to 'invitation_token'
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
      })
      .select()
      .single();

    if (inviteError) {
      console.error('Error creating invitation:', inviteError);
      return NextResponse.json({ error: 'Failed to create invitation' }, { status: 500 });
    }

    // TODO: Send invitation email
    // For now, return the invitation token (in production, this would be sent via email)

    // Get the base URL from environment or request
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ||
                    `${request.headers.get('x-forwarded-proto') || 'http'}://${request.headers.get('host')}`;

    return NextResponse.json({
      invitation,
      invitationUrl: `${baseUrl}/invitations/accept?token=${invitation.invitation_token || invitationToken}`,
      invitationLink: `${baseUrl}/invitations/accept?token=${invitation.invitation_token || invitationToken}`  // For backward compatibility
    });

  } catch (error) {
    console.error('Error in POST /api/organizations/[id]/invitations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/organizations/[organizationId]/invitations - List invitations
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string }> }
) {
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

    const { organizationId } = await params;

    // Check if user has permission to view invitations
    const { data: member } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', organizationId)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (!member || !['owner', 'admin'].includes(member.role)) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    // Get invitations
    const { data: invitations, error: invitationsError } = await supabase
      .from('organization_invitations')
      .select('*')
      .eq('organization_id', organizationId)
      .order('invited_at', { ascending: false });

    if (invitationsError) {
      console.error('Error fetching invitations:', invitationsError);
      return NextResponse.json({ error: 'Failed to fetch invitations' }, { status: 500 });
    }

    return NextResponse.json({ invitations });

  } catch (error) {
    console.error('Error in GET /api/organizations/[id]/invitations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/organizations/[organizationId]/invitations - Cancel invitation
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string }> }
) {
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

    const { organizationId } = await params;
    const { searchParams } = new URL(request.url);
    const invitationId = searchParams.get('invitationId');

    if (!invitationId) {
      return NextResponse.json({ error: 'Invitation ID required' }, { status: 400 });
    }

    // Check if user has permission to cancel invitations
    const { data: member } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', organizationId)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (!member || !['owner', 'admin'].includes(member.role)) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    // Cancel invitation
    const { error: deleteError } = await supabase
      .from('organization_invitations')
      .update({ status: 'cancelled' })
      .eq('id', invitationId)
      .eq('organization_id', organizationId);

    if (deleteError) {
      console.error('Error cancelling invitation:', deleteError);
      return NextResponse.json({ error: 'Failed to cancel invitation' }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error in DELETE /api/organizations/[id]/invitations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}