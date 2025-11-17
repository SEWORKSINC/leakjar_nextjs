import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/invitations/[token] - Get invitation details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    // Get invitation by token
    const { data: invitation, error } = await supabase
      .from('organization_invitations')
      .select(`
        *,
        organization:organizations(*)
      `)
      .eq('invitation_token', token)
      .eq('status', 'pending')
      .single();

    if (error || !invitation) {
      return NextResponse.json({ error: 'Invalid or expired invitation' }, { status: 404 });
    }

    // Check if invitation is expired
    if (new Date(invitation.expires_at) < new Date()) {
      // Update status to expired
      await supabase
        .from('organization_invitations')
        .update({ status: 'expired' })
        .eq('id', invitation.id);

      return NextResponse.json({ error: 'Invitation has expired' }, { status: 400 });
    }

    // Don't expose the token in the response
    const { token: _, ...invitationData } = invitation;

    return NextResponse.json({ invitation: invitationData });

  } catch (error) {
    console.error('Error in GET /api/invitations/[token]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}