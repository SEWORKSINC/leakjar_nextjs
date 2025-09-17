import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

// window 객체에 글로벌 싱글톤 저장
declare global {
  interface Window {
    __supabaseClient?: SupabaseClient;
  }
}

/**
 * 클라이언트 컴포넌트용 Supabase 싱글톤 인스턴스
 * 브라우저에서 여러 인스턴스 생성을 방지
 */
export function getSupabaseClient() {
  if (typeof window === 'undefined') {
    // 서버 사이드에서는 에러
    throw new Error('getSupabaseClient must be called in browser');
  }

  // 클라이언트 사이드에서는 window 객체에 싱글톤 저장
  if (!window.__supabaseClient) {
    window.__supabaseClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  return window.__supabaseClient;
}