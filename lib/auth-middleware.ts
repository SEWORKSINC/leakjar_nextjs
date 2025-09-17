import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// User role types
export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

interface UserProfile {
  role: UserRole;
}

/**
 * Check if a user has a specific role
 */
export async function checkUserRole(supabase: any, userId: string): Promise<UserRole> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      console.error('Error fetching user role:', error);
      return 'USER'; // Default to USER if error
    }

    return (data.role as UserRole) || 'USER';
  } catch (error) {
    console.error('Error in checkUserRole:', error);
    return 'USER';
  }
}

/**
 * Check if user is an admin (ADMIN or SUPER_ADMIN)
 */
export async function isAdmin(supabase: any, userId: string): Promise<boolean> {
  const role = await checkUserRole(supabase, userId);
  return role === 'ADMIN' || role === 'SUPER_ADMIN';
}

/**
 * Check if user is a super admin
 */
export async function isSuperAdmin(supabase: any, userId: string): Promise<boolean> {
  const role = await checkUserRole(supabase, userId);
  return role === 'SUPER_ADMIN';
}

/**
 * Middleware to protect admin routes
 * Use this in API routes that require admin access
 */
export async function requireAdmin(
  request: NextRequest,
  supabase: any,
  userId: string
): Promise<NextResponse | null> {
  const hasAdminAccess = await isAdmin(supabase, userId);

  if (!hasAdminAccess) {
    return NextResponse.json(
      { error: 'Forbidden: Admin access required' },
      { status: 403 }
    );
  }

  return null; // Access granted
}

/**
 * Middleware to protect super admin routes
 * Use this in API routes that require super admin access
 */
export async function requireSuperAdmin(
  request: NextRequest,
  supabase: any,
  userId: string
): Promise<NextResponse | null> {
  const hasSuperAdminAccess = await isSuperAdmin(supabase, userId);

  if (!hasSuperAdminAccess) {
    return NextResponse.json(
      { error: 'Forbidden: Super Admin access required' },
      { status: 403 }
    );
  }

  return null; // Access granted
}

/**
 * Get user's role and permissions
 */
export async function getUserPermissions(supabase: any, userId: string) {
  const role = await checkUserRole(supabase, userId);

  return {
    role,
    isUser: role === 'USER',
    isAdmin: role === 'ADMIN' || role === 'SUPER_ADMIN',
    isSuperAdmin: role === 'SUPER_ADMIN',

    // Feature permissions
    canViewAllData: role === 'ADMIN' || role === 'SUPER_ADMIN',
    canManageUsers: role === 'SUPER_ADMIN',
    canViewSystemSettings: role === 'SUPER_ADMIN',
    canAccessAdminDashboard: role === 'ADMIN' || role === 'SUPER_ADMIN',
    canExportAllData: role === 'ADMIN' || role === 'SUPER_ADMIN',
    canViewAuditLogs: role === 'SUPER_ADMIN',
    canModifyRoles: role === 'SUPER_ADMIN',
  };
}