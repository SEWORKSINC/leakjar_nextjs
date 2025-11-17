import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// PATCH /api/organizations/[organizationId] - Update organization
export async function PATCH(
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
    const updates = await request.json();

    // Check if user has permission to update organization
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

    // Prepare update object
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    // Only update allowed fields
    const allowedFields = ['name', 'description', 'website', 'logo_url'];
    const billingFields = ['billing_email']; // Owner only

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        updateData[field] = updates[field];
      }
    }

    // Billing fields require owner permission
    if (member.role === 'owner') {
      for (const field of billingFields) {
        if (updates[field] !== undefined) {
          updateData[field] = updates[field];
        }
      }
    }

    // Update organization
    const { data: organization, error: updateError } = await supabase
      .from('organizations')
      .update(updateData)
      .eq('id', organizationId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating organization:', updateError);
      return NextResponse.json({ error: 'Failed to update organization' }, { status: 500 });
    }

    // Log activity
    await supabase
      .from('organization_activity_logs')
      .insert({
        organization_id: organizationId,
        user_id: user.id,
        action: 'organization.updated',
        resource_type: 'organization',
        resource_id: organizationId,
        details: { updates: Object.keys(updateData) }
      });

    return NextResponse.json({ organization });

  } catch (error) {
    console.error('Error in PATCH /api/organizations/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/organizations/[organizationId] - Delete organization
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

    // Only owner can delete organization
    const { data: member } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', organizationId)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (!member || member.role !== 'owner') {
      return NextResponse.json({ error: 'Only owner can delete organization' }, { status: 403 });
    }

    // Check if this is personal organization
    const { data: org } = await supabase
      .from('organizations')
      .select('slug')
      .eq('id', organizationId)
      .single();

    if (org && org.slug.startsWith('personal-')) {
      return NextResponse.json({ error: 'Cannot delete personal organization' }, { status: 400 });
    }

    // Switch all users with this as current organization to their personal organization
    const { data: affectedUsers } = await supabase
      .from('user_profiles')
      .select('user_id')
      .eq('current_organization_id', organizationId);

    if (affectedUsers) {
      for (const affectedUser of affectedUsers) {
        // Find user's personal organization
        const { data: personalOrg } = await supabase
          .from('organizations')
          .select('id')
          .eq('slug', `personal-${affectedUser.user_id}`)
          .single();

        if (personalOrg) {
          // Update user's current organization to personal
          await supabase
            .from('user_profiles')
            .update({ current_organization_id: personalOrg.id })
            .eq('user_id', affectedUser.user_id);
        } else {
          // If no personal org exists, just set to null
          await supabase
            .from('user_profiles')
            .update({ current_organization_id: null })
            .eq('user_id', affectedUser.user_id);
        }
      }
    }

    // Delete organization (cascades to members, domains, etc.)
    const { error: deleteError } = await supabase
      .from('organizations')
      .delete()
      .eq('id', organizationId);

    if (deleteError) {
      console.error('Error deleting organization:', deleteError);
      return NextResponse.json({ error: 'Failed to delete organization' }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error in DELETE /api/organizations/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}