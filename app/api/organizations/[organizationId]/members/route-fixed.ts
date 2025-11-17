import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/organizations/[organizationId]/members
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

    // Check if user is a member of the organization
    const { data: userMember } = await supabase
      .from('organization_members')
      .select('id')
      .eq('organization_id', organizationId)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (!userMember) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    // Get all members
    const { data: members, error: membersError } = await supabase
      .from('organization_members')
      .select('*')
      .eq('organization_id', organizationId)
      .order('joined_at', { ascending: true });

    if (membersError) {
      console.error('Error fetching members:', membersError);
      return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
    }

    // Get user details for all members using service role
    const memberIds = members?.map(m => m.user_id) || [];
    const userPromises = memberIds.map(async (userId) => {
      const { data } = await supabase.auth.admin.getUserById(userId);
      return data.user;
    });

    const users = await Promise.all(userPromises);

    // Format member data
    const formattedMembers = members?.map(member => {
      const user = users.find(u => u?.id === member.user_id);
      return {
        id: member.id,
        organizationId: member.organization_id,
        userId: member.user_id,
        role: member.role,
        status: member.status,
        joinedAt: member.joined_at,
        user: user ? {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
          avatarUrl: user.user_metadata?.avatar_url
        } : null
      };
    }) || [];

    return NextResponse.json({ members: formattedMembers });

  } catch (error) {
    console.error('Error in GET /api/organizations/[id]/members:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/organizations/[organizationId]/members
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
    const memberId = searchParams.get('memberId');

    if (!memberId) {
      return NextResponse.json({ error: 'Member ID required' }, { status: 400 });
    }

    // Check if user has permission to remove members
    const { data: userMember } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', organizationId)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (!userMember || !['owner', 'admin'].includes(userMember.role)) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    // Get member to be removed
    const { data: targetMember } = await supabase
      .from('organization_members')
      .select('role, user_id')
      .eq('id', memberId)
      .eq('organization_id', organizationId)
      .single();

    if (!targetMember) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Prevent removing organization owner
    if (targetMember.role === 'owner') {
      return NextResponse.json({ error: 'Cannot remove organization owner' }, { status: 400 });
    }

    // Prevent non-owners from removing admins
    if (targetMember.role === 'admin' && userMember.role !== 'owner') {
      return NextResponse.json({ error: 'Only owners can remove admins' }, { status: 403 });
    }

    // Remove member
    const { error: deleteError } = await supabase
      .from('organization_members')
      .delete()
      .eq('id', memberId);

    if (deleteError) {
      console.error('Error removing member:', deleteError);
      return NextResponse.json({ error: 'Failed to remove member' }, { status: 500 });
    }

    // Log activity
    await supabase
      .from('organization_activity_logs')
      .insert({
        organization_id: organizationId,
        user_id: user.id,
        action: 'member.removed',
        resource_type: 'member',
        resource_id: memberId,
        details: { removed_user_id: targetMember.user_id }
      });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error in DELETE /api/organizations/[id]/members:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}