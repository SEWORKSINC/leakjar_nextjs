import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/domains - Get organization's domains
export async function GET(request: NextRequest) {
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

    // Get user's current organization
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('current_organization_id')
      .eq('user_id', user.id)
      .single();

    if (!profile?.current_organization_id) {
      return NextResponse.json({ domains: [] });
    }

    // Check if user is a member of the organization
    const { data: member } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', profile.current_organization_id)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (!member) {
      return NextResponse.json({ domains: [] });
    }

    // Fetch organization's domains
    const { data: domains, error: fetchError } = await supabase
      .from('domains')
      .select('*')
      .eq('organization_id', profile.current_organization_id)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching domains:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch domains' }, { status: 500 });
    }

    // Transform snake_case to camelCase
    const transformedDomains = domains?.map(domain => ({
      id: domain.id,
      organizationId: domain.organization_id,
      domain: domain.domain,
      type: domain.type,
      description: domain.description,
      companyName: domain.company_name,
      monitoringEnabled: domain.monitoring_enabled,
      isVerified: domain.is_verified || false,
      verifiedAt: domain.verified_at,
      visibility: domain.visibility,
      addedBy: domain.added_by,
      createdAt: domain.created_at,
      updatedAt: domain.updated_at,
    })) || [];

    return NextResponse.json({ domains: transformedDomains });

  } catch (error) {
    console.error('Error fetching domains:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/domains - Add domain to organization
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

    const { domain, type, description, companyName } = await request.json();

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    if (!type || !['URL', 'EMAIL'].includes(type)) {
      return NextResponse.json({ error: 'Valid domain type required' }, { status: 400 });
    }

    // Clean domain
    const cleanDomain = domain.toLowerCase().trim()
      .replace(/^https?:\/\//, '')
      .replace(/\/$/, '');

    // Get user's current organization
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('current_organization_id')
      .eq('user_id', user.id)
      .single();

    if (!profile?.current_organization_id) {
      return NextResponse.json({ error: 'No organization selected' }, { status: 400 });
    }

    // Check user has permission to add domains
    const { data: member } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', profile.current_organization_id)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (!member || member.role === 'viewer') {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    // Check if domain already exists in organization
    const { data: existingDomain } = await supabase
      .from('domains')
      .select('id')
      .eq('organization_id', profile.current_organization_id)
      .eq('domain', cleanDomain)
      .eq('type', type)
      .single();

    if (existingDomain) {
      return NextResponse.json({ error: 'Domain already exists' }, { status: 400 });
    }

    // Check organization domain limit
    const { count: domainCount } = await supabase
      .from('domains')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', profile.current_organization_id);

    const { data: org } = await supabase
      .from('organizations')
      .select('max_domains')
      .eq('id', profile.current_organization_id)
      .single();

    if (org && domainCount && domainCount >= org.max_domains) {
      return NextResponse.json({
        error: `Domain limit reached (${org.max_domains}). Please upgrade your plan.`
      }, { status: 403 });
    }

    // Add domain to organization
    const { data: newDomain, error: insertError } = await supabase
      .from('domains')
      .insert({
        organization_id: profile.current_organization_id,
        user_id: user.id, // Keep for backward compatibility
        added_by: user.id,
        domain: cleanDomain,
        type,
        description,
        company_name: companyName,
        monitoring_enabled: true,
        is_verified: false,
        visibility: 'organization'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting domain:', insertError);
      return NextResponse.json({ error: 'Failed to add domain' }, { status: 500 });
    }

    // Log activity
    await supabase
      .from('organization_activity_logs')
      .insert({
        organization_id: profile.current_organization_id,
        user_id: user.id,
        action: 'domain.added',
        resource_type: 'domain',
        resource_id: newDomain.id,
        details: { domain: cleanDomain, type }
      });

    // Transform response
    const transformedDomain = {
      id: newDomain.id,
      organizationId: newDomain.organization_id,
      domain: newDomain.domain,
      type: newDomain.type,
      description: newDomain.description,
      companyName: newDomain.company_name,
      isVerified: newDomain.is_verified || false,
      createdAt: newDomain.created_at,
    };

    return NextResponse.json({ domain: transformedDomain });

  } catch (error) {
    console.error('Error adding domain:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/domains - Delete domain from organization
export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const domainId = searchParams.get('id');

    if (!domainId) {
      return NextResponse.json({ error: 'Domain ID required' }, { status: 400 });
    }

    // Get domain details
    const { data: domain } = await supabase
      .from('domains')
      .select('organization_id, domain, type')
      .eq('id', domainId)
      .single();

    if (!domain) {
      return NextResponse.json({ error: 'Domain not found' }, { status: 404 });
    }

    // Check user has permission to delete domains
    const { data: member } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', domain.organization_id)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (!member || member.role === 'viewer') {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    // Delete domain
    const { error: deleteError } = await supabase
      .from('domains')
      .delete()
      .eq('id', domainId);

    if (deleteError) {
      console.error('Error deleting domain:', deleteError);
      return NextResponse.json({ error: 'Failed to delete domain' }, { status: 500 });
    }

    // Log activity
    await supabase
      .from('organization_activity_logs')
      .insert({
        organization_id: domain.organization_id,
        user_id: user.id,
        action: 'domain.removed',
        resource_type: 'domain',
        resource_id: domainId,
        details: { domain: domain.domain, type: domain.type }
      });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting domain:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}