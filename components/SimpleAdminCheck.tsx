'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase-client';

export function SimpleAdminCheck({ children }: { children: React.ReactNode }) {
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const router = useRouter();
  const supabase = getSupabaseClient();

  useEffect(() => {
    async function checkAdmin() {
      try {
        // Get session
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          router.push('/auth/login');
          return;
        }

        // Check user role
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        if (profile?.role === 'ADMIN' || profile?.role === 'SUPER_ADMIN') {
          setHasAccess(true);
        } else {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Admin check error:', error);
        router.push('/dashboard');
      } finally {
        setIsChecking(false);
      }
    }

    checkAdmin();
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
}