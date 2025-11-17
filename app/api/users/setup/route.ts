import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST /api/users/setup - Setup new user with personal organization
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

    // Check if user already has organizations
    const { data: existingMemberships } = await supabase
      .from('organization_members')
      .select('organization_id')
      .eq('user_id', user.id)
      .limit(1);

    if (existingMemberships && existingMemberships.length > 0) {
      // User already has organizations, no need to create personal one
      return NextResponse.json({
        message: 'User already has organizations',
        alreadySetup: true
      });
    }

    // Check if user profile exists
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Create user profile if it doesn't exist
    if (!profile) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: user.id,
          display_name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          avatar_url: user.user_metadata?.avatar_url || null,
          current_organization_id: null // Will be updated after org creation
        });

      if (profileError && profileError.code !== '23505') { // Ignore duplicate key error
        console.error('Error creating user profile:', profileError);
      }
    }

    // Create personal organization
    const organizationName = user.user_metadata?.name || user.email?.split('@')[0] || 'Personal';
    const organizationSlug = `personal-${user.id}`;

    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: `${organizationName}'s Organization`,
        slug: organizationSlug,
        created_by: user.id,
        billing_email: user.email,
        settings: {
          isPersonal: true
        }
      })
      .select()
      .single();

    if (orgError) {
      // Check if it's a duplicate error
      if (orgError.code === '23505') {
        // Organization already exists, try to get it
        const { data: existingOrg } = await supabase
          .from('organizations')
          .select('*')
          .eq('slug', organizationSlug)
          .single();

        if (existingOrg) {
          // Update user profile with organization
          await supabase
            .from('user_profiles')
            .update({ current_organization_id: existingOrg.id })
            .eq('user_id', user.id);

          return NextResponse.json({
            organization: existingOrg,
            alreadyExists: true
          });
        }
      }

      console.error('Error creating organization:', orgError);
      return NextResponse.json({ error: 'Failed to create organization' }, { status: 500 });
    }

    // Add user as owner of the organization
    const { error: memberError } = await supabase
      .from('organization_members')
      .insert({
        organization_id: organization.id,
        user_id: user.id,
        role: 'owner',
        status: 'active'
      });

    if (memberError && memberError.code !== '23505') { // Ignore duplicate key error
      console.error('Error adding member:', memberError);
    }

    // Update user profile with current organization
    await supabase
      .from('user_profiles')
      .update({ current_organization_id: organization.id })
      .eq('user_id', user.id);

    // Create default domain for organization (user's email domain)
    const emailDomain = user.email?.split('@')[1];
    if (emailDomain) {
      const { error: domainError } = await supabase
        .from('organization_domains')
        .insert({
          organization_id: organization.id,
          domain: emailDomain,
          type: 'email',
          status: 'active',
          added_by: user.id
        });

      if (domainError && domainError.code !== '23505') {
        console.error('Error adding domain:', domainError);
      }
    }

    return NextResponse.json({
      success: true,
      organization,
      message: 'Personal organization created successfully'
    });

  } catch (error) {
    console.error('Error in POST /api/users/setup:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}