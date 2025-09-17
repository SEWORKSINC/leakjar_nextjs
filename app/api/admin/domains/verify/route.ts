import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin or super_admin
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile || !['ADMIN', 'SUPER_ADMIN'].includes(profile.role)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get domain ID and verification status from request body
    const { domainId, isVerified } = await request.json();

    if (!domainId) {
      return NextResponse.json(
        { error: 'Domain ID is required' },
        { status: 400 }
      );
    }

    // Update domain verification status
    const updateData: any = {
      is_verified: isVerified
    };

    // Only set verified_at if verifying (not when unverifying)
    if (isVerified) {
      updateData.verified_at = new Date().toISOString();
    } else {
      updateData.verified_at = null;
    }

    const { data: updatedDomain, error: updateError } = await supabase
      .from('domains')
      .update(updateData)
      .eq('id', domainId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating domain:', updateError);
      return NextResponse.json(
        { error: 'Failed to verify domain' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      domain: {
        id: updatedDomain.id,
        domain: updatedDomain.domain,
        type: updatedDomain.type,
        isVerified: updatedDomain.is_verified,
        verifiedAt: updatedDomain.verified_at
      }
    });

  } catch (error) {
    console.error('Error in domain verification API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}