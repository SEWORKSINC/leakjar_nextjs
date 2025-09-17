import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

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

    // Check if user is super admin (only super admins can delete users)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile || profile.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Only super admins can delete users' }, { status: 403 });
    }

    // Prevent deleting own account
    if (userId === user.id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    // Delete user's domains first
    const { error: domainsError } = await supabaseAdmin
      .from('user_domains')
      .delete()
      .eq('user_id', userId);

    if (domainsError) {
      console.error('Error deleting user domains:', domainsError);
    }

    // Delete user profile
    const { error: profileDeleteError } = await supabaseAdmin
      .from('user_profiles')
      .delete()
      .eq('user_id', userId);

    if (profileDeleteError) {
      console.error('Error deleting user profile:', profileDeleteError);
    }

    // Delete user from auth (this will cascade delete related records)
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error('Error deleting user:', deleteError);
      return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error in delete user API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}