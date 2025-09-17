'use client';

import { useUserRole } from '@/hooks/useUserRole';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Shield, ShieldAlert, ShieldX } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
  requireSuperAdmin?: boolean;
  fallbackUrl?: string;
}

export function AdminRoute({
  children,
  requireSuperAdmin = false,
  fallbackUrl = '/dashboard'
}: AdminRouteProps) {
  const { isAdmin, isSuperAdmin, loading, error } = useUserRole();
  const router = useRouter();

  const hasAccess = requireSuperAdmin ? isSuperAdmin : isAdmin;

  useEffect(() => {
    // Once loading is complete and we know user doesn't have access, redirect
    if (!loading && !hasAccess) {
      router.push(fallbackUrl);
    }
  }, [loading, hasAccess, router, fallbackUrl]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Shield className="h-12 w-12 text-gray-400 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full">
          <div className="bg-white shadow-lg rounded-xl p-8 text-center border border-red-200">
            <ShieldAlert className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/auth/login')}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show access denied if user doesn't have required permissions
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-lg w-full">
          <div className="bg-white shadow-xl rounded-xl p-10 text-center border border-gray-200">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto">
                <ShieldX className="w-10 h-10 text-white" />
              </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">Access Denied</h1>

            <p className="text-gray-600 mb-10 leading-relaxed text-lg">
              {requireSuperAdmin
                ? "This page requires Super Admin privileges."
                : "This page requires Admin privileges."}
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.history.back()}
                className="px-8 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium border-2 border-gray-300"
              >
                ← Go Back
              </button>
              <button
                onClick={() => router.push(fallbackUrl)}
                className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium"
              >
                Go to Dashboard
              </button>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                If you believe you should have access, please contact your administrator.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User has access, render children
  return <>{children}</>;
}