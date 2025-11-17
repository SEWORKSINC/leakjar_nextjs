// Organization Types

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
  website?: string;
  settings?: Record<string, any>;
  subscriptionPlan: 'free' | 'starter' | 'pro' | 'enterprise';
  subscriptionStatus: 'active' | 'past_due' | 'canceled';
  billingEmail?: string;
  maxMembers: number;
  maxDomains: number;
  maxMonthlySearches: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  permissions?: Record<string, any>;
  status: 'active' | 'suspended' | 'pending';
  invitedBy?: string;
  invitedAt?: string;
  joinedAt: string;
  updatedAt: string;
  // Joined data
  user?: {
    id: string;
    email: string;
    name?: string;
    avatarUrl?: string;
  };
}

export interface OrganizationInvitation {
  id: string;
  organizationId: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  invitationToken: string;
  status: 'pending' | 'accepted' | 'expired' | 'canceled';
  invitedBy: string;
  invitedAt: string;
  acceptedAt?: string;
  expiresAt: string;
  // Joined data
  organization?: Organization;
  inviter?: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface OrganizationActivityLog {
  id: string;
  organizationId: string;
  userId: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  // Joined data
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

// Permission definitions
export const ORGANIZATION_PERMISSIONS = {
  // Organization management
  'organization:view': 'View organization details',
  'organization:update': 'Update organization settings',
  'organization:delete': 'Delete organization',

  // Member management
  'members:view': 'View organization members',
  'members:invite': 'Invite new members',
  'members:remove': 'Remove members',
  'members:update_role': 'Update member roles',

  // Domain management
  'domains:view': 'View organization domains',
  'domains:add': 'Add new domains',
  'domains:remove': 'Remove domains',
  'domains:verify': 'Verify domains',

  // Data access
  'data:view_limited': 'View limited data (1 page)',
  'data:view_full': 'View full data',
  'data:export': 'Export data',
  'data:search': 'Search data',

  // Billing
  'billing:view': 'View billing information',
  'billing:manage': 'Manage subscription and payment',

  // Activity logs
  'logs:view': 'View activity logs',
} as const;

// Role permission mappings
export const ROLE_PERMISSIONS: Record<string, Array<keyof typeof ORGANIZATION_PERMISSIONS>> = {
  owner: Object.keys(ORGANIZATION_PERMISSIONS) as Array<keyof typeof ORGANIZATION_PERMISSIONS>,

  admin: [
    'organization:view',
    'organization:update',
    'members:view',
    'members:invite',
    'members:remove',
    'members:update_role',
    'domains:view',
    'domains:add',
    'domains:remove',
    'domains:verify',
    'data:view_full',
    'data:export',
    'data:search',
    'logs:view',
  ],

  member: [
    'organization:view',
    'members:view',
    'domains:view',
    'data:view_full',
    'data:export',
    'data:search',
  ],

  viewer: [
    'organization:view',
    'members:view',
    'domains:view',
    'data:view_limited',
  ],
};

// Helper functions
export function hasPermission(
  role: keyof typeof ROLE_PERMISSIONS,
  permission: keyof typeof ORGANIZATION_PERMISSIONS
): boolean {
  const rolePermissions = ROLE_PERMISSIONS[role] || [];
  return rolePermissions.includes(permission);
}

export function canManageMembers(role: string): boolean {
  return role === 'owner' || role === 'admin';
}

export function canManageDomains(role: string): boolean {
  return role === 'owner' || role === 'admin';
}

export function canViewFullData(role: string): boolean {
  return role === 'owner' || role === 'admin' || role === 'member';
}