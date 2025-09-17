import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role key for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/domains - Get user's domains
export async function GET(request: NextRequest) {
  try {
    // REQUIRED authentication - no bypass allowed for security
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    // Fetch ONLY the authenticated user's domains from Supabase database
    const { data: domains, error: fetchError } = await supabase
      .from('domains')
      .select('*')
      .eq('user_id', user.id) // CRITICAL: Only user's own domains
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching domains:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch domains' },
        { status: 500 }
      );
    }

    // Transform snake_case to camelCase for frontend
    const transformedDomains = domains?.map(d => ({
      id: d.id,
      domain: d.domain,
      type: d.type,
      description: d.description,
      companyName: d.company_name,
      isVerified: d.is_verified || false,
      verifiedAt: d.verified_at,
      createdAt: d.created_at,
    })) || [];

    return NextResponse.json({ domains: transformedDomains });
  } catch (error) {
    console.error('Get domains error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/domains - Add a new domain
export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    const { domain, type, description, companyName } = await request.json();

    if (!domain) {
      return NextResponse.json(
        { error: 'Domain is required' },
        { status: 400 }
      );
    }

    if (!type || !['URL', 'EMAIL'].includes(type)) {
      return NextResponse.json(
        { error: 'Valid domain type (URL or EMAIL) is required' },
        { status: 400 }
      );
    }

    // Clean domain input
    const cleanDomain = domain.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/$/, '');

    // Check if domain already exists for this user and type
    const { data: existingDomain } = await supabase
      .from('domains')
      .select('id')
      .eq('user_id', user.id)
      .eq('domain', cleanDomain)
      .eq('type', type)
      .single();

    if (existingDomain) {
      return NextResponse.json(
        { error: 'Domain already exists for this type' },
        { status: 400 }
      );
    }

    // Add domain to Supabase database
    const { data: newDomain, error: insertError } = await supabase
      .from('domains')
      .insert({
        user_id: user.id,
        domain: cleanDomain,
        type,
        description,
        company_name: companyName,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting domain:', insertError);
      return NextResponse.json(
        { error: 'Failed to add domain' },
        { status: 500 }
      );
    }

    // Transform snake_case to camelCase for frontend
    const transformedDomain = {
      id: newDomain.id,
      domain: newDomain.domain,
      type: newDomain.type,
      description: newDomain.description,
      companyName: newDomain.company_name,
      isVerified: newDomain.is_verified || false,
      verifiedAt: newDomain.verified_at,
      createdAt: newDomain.created_at,
    };

    return NextResponse.json({ domain: transformedDomain });
  } catch (error) {
    console.error('Add domain error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/domains - Delete a domain
export async function DELETE(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const domainId = searchParams.get('id');

    if (!domainId) {
      return NextResponse.json(
        { error: 'Domain ID is required' },
        { status: 400 }
      );
    }

    // Delete domain from Supabase database (RLS policy ensures user owns the domain)
    const { error: deleteError } = await supabase
      .from('domains')
      .delete()
      .eq('id', domainId)
      .eq('user_id', user.id); // Extra safety check

    if (deleteError) {
      console.error('Error deleting domain:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete domain' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete domain error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}