'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Shield, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

function AuthRequiredContent() {
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get('from') || '/dashboard';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 shadow-md p-8 text-center">
          {/* 아이콘 */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gray-700 dark:bg-gray-600 flex items-center justify-center">
                <Shield className="h-10 w-10 text-gray-300" />
              </div>
              <Lock className="h-6 w-6 text-gray-500 dark:text-gray-400 absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-1 shadow-sm" />
            </div>
          </div>

          {/* 제목 */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Authentication Required
          </h1>

          {/* 설명 */}
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to sign in to access this page.
            <br />
            Please sign in with your account to continue.
          </p>

          {/* 접근하려던 페이지 정보 */}
          <Alert className="mb-6">
            <AlertDescription className="text-left">
              <span className="text-sm text-gray-500 dark:text-gray-400">Requested page:</span>
              <br />
              <span className="text-sm font-mono text-gray-700 dark:text-gray-300">{redirectedFrom}</span>
            </AlertDescription>
          </Alert>

          {/* 버튼들 */}
          <div className="space-y-3">
            <Link href={`/auth/login?redirectedFrom=${encodeURIComponent(redirectedFrom)}`} className="block">
              <Button className="w-full">
                Go to Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <Link href="/auth/signup" className="block">
              <Button variant="outline" className="w-full">
                Create Account
              </Button>
            </Link>
          </div>

          {/* 홈으로 돌아가기 */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthRequiredPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    }>
      <AuthRequiredContent />
    </Suspense>
  );
}