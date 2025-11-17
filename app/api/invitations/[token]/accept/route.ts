import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST /api/invitations/[token]/accept - Accept invitation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const authToken = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(authToken);

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const { token } = await params;

    // Get invitation by token
    const { data: invitation, error } = await supabase
      .from('organization_invitations')
      .select('*')
      .eq('invitation_token', token)
      .eq('status', 'pending')
      .single();

    if (error || !invitation) {
      return NextResponse.json({ error: 'Invalid or expired invitation' }, { status: 404 });
    }

    // Check if invitation is expired
    if (new Date(invitation.expires_at) < new Date()) {
      await supabase
        .from('organization_invitations')
        .update({ status: 'expired' })
        .eq('id', invitation.id);

      return NextResponse.json({ error: 'Invitation has expired' }, { status: 400 });
    }

    // Check if invitation is for the current user
    console.log('Invitation email:', invitation.email);
    console.log('Current user email:', user.email);

    if (invitation.email !== user.email) {
      return NextResponse.json({
        error: `This invitation is for ${invitation.email}. Please sign in with that email address or ask for a new invitation to ${user.email}.`
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
      // Update invitation status
      await supabase
        .from('organization_invitations')
        .update({ status: 'accepted' })
        .eq('id', invitation.id);

      return NextResponse.json({
        message: 'You are already a member of this organization'
      });
    }

    // Add user as member
    const { error: memberError } = await supabase
      .from('organization_members')
      .insert({
        organization_id: invitation.organization_id,
        user_id: user.id,
        role: invitation.role,
        status: 'active'
      });

    if (memberError) {
      console.error('Error adding member:', memberError);
      return NextResponse.json({ error: 'Failed to add member' }, { status: 500 });
    }

    // Update invitation status
    const { error: updateError } = await supabase
      .from('organization_invitations')
      .update({
        status: 'accepted',
        accepted_at: new Date().toISOString()
      })
      .eq('id', invitation.id);

    if (updateError) {
      console.error('Error updating invitation:', updateError);
    }

    // Log activity
    await supabase
      .from('organization_activity_logs')
      .insert({
        organization_id: invitation.organization_id,
        user_id: user.id,
        action: 'invitation.accepted',
        resource_type: 'invitation',
        resource_id: invitation.id,
        details: { role: invitation.role }
      });

    // Update user's current organization if they don't have one
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('current_organization_id')
      .eq('user_id', user.id)
      .single();

    if (!profile?.current_organization_id) {
      await supabase
        .from('user_profiles')
        .update({ current_organization_id: invitation.organization_id })
        .eq('user_id', user.id);
    }

    return NextResponse.json({
      success: true,
      organizationId: invitation.organization_id
    });

  } catch (error) {
    console.error('Error in POST /api/invitations/[token]/accept:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}