import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 모든 도메인 가져오기
    const { data: allDomains, error: domainError } = await supabaseAdmin
      .from('domains')
      .select('*');

    // 모든 사용자 프로필 가져오기
    const { data: allProfiles, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('*');

    return NextResponse.json({
      domains: {
        count: allDomains?.length || 0,
        data: allDomains || [],
        error: domainError
      },
      profiles: {
        count: allProfiles?.length || 0,
        data: allProfiles || [],
        error: profileError
      }
    });

  } catch (error) {
    console.error('Test domains error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
}