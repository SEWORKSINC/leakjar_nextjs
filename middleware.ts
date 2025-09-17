import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 세션 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // 공개 경로 정의
  const publicPaths = ['/', '/landing', '/auth/login', '/auth/signup'];
  const isPublicPath = publicPaths.some(publicPath => path === publicPath) || path.startsWith('/auth/');

  // 로그인하지 않은 사용자가 보호된 경로에 접근하려고 할 때
  if (!user && !isPublicPath && !path.startsWith('/api/')) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/auth/required';
    redirectUrl.searchParams.set('from', path);
    return NextResponse.redirect(redirectUrl);
  }

  // 로그인한 사용자가 로그인/회원가입 페이지에 접근하려고 할 때
  if (user && (path === '/auth/login' || path === '/auth/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};