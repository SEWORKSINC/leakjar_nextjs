import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/organizations - Get user's organizations
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');

    // When using service role, we need to verify the JWT differently
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error('Auth error in GET organizations:', error);
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // Get user's organizations through membership
    const { data: memberships, error: membershipError } = await supabase
      .from('organization_members')
      .select(`
        *,
        organization:organizations(*)
      `)
      .eq('user_id', user.id)
      .eq('status', 'active');

    if (membershipError) {
      console.error('Error fetching memberships:', membershipError);
      return NextResponse.json({ error: 'Failed to fetch organizations' }, { status: 500 });
    }

    // Get current organization from user profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('current_organization_id')
      .eq('user_id', user.id)
      .single();

    const organizations = memberships?.map(m => m.organization).filter(Boolean) || [];
    const currentOrgId = profile?.current_organization_id;

    let currentOrganization = null;
    let currentMember = null;

    if (currentOrgId) {
      currentOrganization = organizations.find(org => org.id === currentOrgId);
      currentMember = memberships?.find(m => m.organization_id === currentOrgId);
    }

    return NextResponse.json({
      organizations,
      currentOrganization,
      currentMember
    });

  } catch (error) {
    console.error('Error in GET /api/organizations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/organizations - Create new organization
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
    const { name, slug, description, website } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    // Validate slug format (alphanumeric and hyphens only)
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(slug)) {
      return NextResponse.json({
        error: 'Slug must be lowercase alphanumeric with hyphens only'
      }, { status: 400 });
    }

    // Check if slug is already taken
    const { data: existing } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'This slug is already taken' }, { status: 400 });
    }

    // Create organization
    const { data: organization, error: createError } = await supabase
      .from('organizations')
      .insert({
        name,
        slug,
        description,
        website,
        created_by: user.id,
        subscription_plan: 'free',
        max_members: 5,
        max_domains: 10,
        max_monthly_searches: 1000
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating organization:', createError);
      return NextResponse.json({ error: 'Failed to create organization' }, { status: 500 });
    }

    // Add creator as owner
    const { error: memberError } = await supabase
      .from('organization_members')
      .insert({
        organization_id: organization.id,
        user_id: user.id,
        role: 'owner',
        status: 'active'
      });

    if (memberError) {
      console.error('Error adding member:', memberError);
      // Rollback organization creation
      await supabase.from('organizations').delete().eq('id', organization.id);
      return NextResponse.json({ error: 'Failed to create organization' }, { status: 500 });
    }

    // Update user's current organization
    await supabase
      .from('user_profiles')
      .update({ current_organization_id: organization.id })
      .eq('user_id', user.id);

    return NextResponse.json({ organization });

  } catch (error) {
    console.error('Error in POST /api/organizations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}