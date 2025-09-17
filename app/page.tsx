'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    checkAuthAndRedirect();
  }, []);

  async function checkAuthAndRedirect() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // 로그인한 사용자는 대시보드로
        router.push('/dashboard');
      } else {
        // 로그인하지 않은 사용자는 랜딩 페이지로
        router.push('/landing');
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      // 에러 발생 시 랜딩 페이지로
      router.push('/landing');
    }
  }

  // 리다이렉트 중 표시할 로딩 화면
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-500">Loading...</p>
      </div>
    </div>
  );
}