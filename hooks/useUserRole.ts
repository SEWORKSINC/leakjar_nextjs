import { useState, useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabase-client';

export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

interface UserPermissions {
  role: UserRole;
  isUser: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  canViewAllData: boolean;
  canManageUsers: boolean;
  canViewSystemSettings: boolean;
  canAccessAdminDashboard: boolean;
  canExportAllData: boolean;
  canViewAuditLogs: boolean;
  canModifyRoles: boolean;
}

export function useUserRole() {
  const [permissions, setPermissions] = useState<UserPermissions>({
    role: 'USER',
    isUser: true,
    isAdmin: false,
    isSuperAdmin: false,
    canViewAllData: false,
    canManageUsers: false,
    canViewSystemSettings: false,
    canAccessAdminDashboard: false,
    canExportAllData: false,
    canViewAuditLogs: false,
    canModifyRoles: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserRole() {
      try {
        setLoading(true);
        setError(null);

        const supabase = getSupabaseClient();

        // Get current session first
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
          // 에러가 있을 때만 로그 출력
          if (sessionError) {
            console.error('Error fetching session:', sessionError);
          }
          // Try to refresh session
          const { data: { session: refreshedSession } } = await supabase.auth.refreshSession();
          if (!refreshedSession) {
            setError('Not authenticated');
            return;
          }
        }

        const user = session?.user;
        if (!user) {
          console.error('No user in session');
          setError('Not authenticated');
          return;
        }

        // Fetch user profile with role
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);

          // If profile doesn't exist, try to create it
          if (profileError.code === 'PGRST116') {
            try {
              const response = await fetch('/api/user-profile', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
              });

              if (response.ok) {
                // Profile created successfully, set USER role
                setPermissions(getPermissionsForRole('USER'));
                return;
              }
            } catch (createError) {
              console.error('Failed to create profile:', createError);
            }
          }

          // Default to USER role if all else fails
          setPermissions(getPermissionsForRole('USER'));
          return;
        }

        const role = (profile?.role as UserRole) || 'USER';
        setPermissions(getPermissionsForRole(role));

      } catch (err) {
        console.error('Error in fetchUserRole:', err);
        setError('Failed to fetch user role');
      } finally {
        setLoading(false);
      }
    }

    fetchUserRole();

    // Subscribe to auth changes
    const supabase = getSupabaseClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchUserRole();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    ...permissions,
    loading,
    error,
    refetch: () => {
      setLoading(true);
      setError(null);
      // Re-run the effect by changing a dependency
    }
  };
}

function getPermissionsForRole(role: UserRole): UserPermissions {
  const basePermissions = {
    role,
    isUser: role === 'USER',
    isAdmin: role === 'ADMIN' || role === 'SUPER_ADMIN',
    isSuperAdmin: role === 'SUPER_ADMIN',
  };

  switch (role) {
    case 'SUPER_ADMIN':
      return {
        ...basePermissions,
        canViewAllData: true,
        canManageUsers: true,
        canViewSystemSettings: true,
        canAccessAdminDashboard: true,
        canExportAllData: true,
        canViewAuditLogs: true,
        canModifyRoles: true,
      };
    case 'ADMIN':
      return {
        ...basePermissions,
        canViewAllData: true,
        canManageUsers: false,
        canViewSystemSettings: false,
        canAccessAdminDashboard: true,
        canExportAllData: true,
        canViewAuditLogs: false,
        canModifyRoles: false,
      };
    case 'USER':
    default:
      return {
        ...basePermissions,
        canViewAllData: false,
        canManageUsers: false,
        canViewSystemSettings: false,
        canAccessAdminDashboard: false,
        canExportAllData: false,
        canViewAuditLogs: false,
        canModifyRoles: false,
      };
  }
}