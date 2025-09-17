import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { profile, notifications, security } = await request.json();

    // Update user basic info
    const { error: userUpdateError } = await supabase
      .from('users')
      .update({ 
        name: profile.name 
      })
      .eq('id', user.id);

    if (userUpdateError) {
      console.error('User update error:', userUpdateError);
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      );
    }

    // Update user profile
    const { error: profileUpdateError } = await supabase
      .from('user_profiles')
      .update({
        display_name: profile.displayName,
        timezone: profile.timezone,
        language: profile.language,
        notify_email: notifications.notifyEmail,
        notify_breach: notifications.notifyBreach,
        notify_product: notifications.notifyProduct,
        two_factor_enabled: security.twoFactorEnabled,
        dark_mode: security.darkMode,
      })
      .eq('user_id', user.id);

    if (profileUpdateError) {
      console.error('Profile update error:', profileUpdateError);
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    // Fetch updated user data
    const { data: userData, error: fetchUserError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    const { data: profileData, error: fetchProfileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (fetchUserError || fetchProfileError) {
      console.error('Fetch error:', fetchUserError || fetchProfileError);
      return NextResponse.json(
        { error: 'Failed to fetch updated data' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      user: {
        ...userData,
        profile: profileData
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}