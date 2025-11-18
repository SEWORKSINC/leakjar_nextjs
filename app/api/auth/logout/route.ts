import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Supabase에서 로그아웃
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout error:', error);
      // Even if there's an error, we still want to clear the session
      // and redirect the user to login page
    }

    // 성공 응답 반환
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout API error:', error);

    // 에러가 있어도 로그아웃 성공으로 처리
    // 클라이언트가 로그인 페이지로 이동할 수 있도록 함
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
  }
}