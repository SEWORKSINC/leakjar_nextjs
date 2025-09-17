import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const body = await request.json();
    const { role } = body;

    // Validate role
    if (!['USER', 'ADMIN', 'SUPER_ADMIN'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

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

    // Check if user is admin or super admin
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile || (profile.role !== 'ADMIN' && profile.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Admin access required to change user roles' }, { status: 403 });
    }

    // Additional check: Only SUPER_ADMIN can promote to SUPER_ADMIN
    if (role === 'SUPER_ADMIN' && profile.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Only super admins can promote users to super admin' }, { status: 403 });
    }

    // Prevent changing own role
    if (userId === user.id) {
      return NextResponse.json({ error: 'Cannot change your own role' }, { status: 400 });
    }

    // Update user role
    const { error: updateError } = await supabaseAdmin
      .from('user_profiles')
      .update({ role })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating user role:', updateError);
      return NextResponse.json({ error: 'Failed to update role' }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error in update role API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}