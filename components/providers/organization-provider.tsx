'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Organization, OrganizationMember } from '@/lib/types/organization';
import { getSupabaseClient } from '@/lib/supabase-client';
import { useAuth } from './auth-provider';

interface OrganizationContextType {
  currentOrganization: Organization | null;
  organizations: Organization[];
  currentMember: OrganizationMember | null;
  loading: boolean;
  error: string | null;
  switchOrganization: (organizationId: string) => Promise<void>;
  refreshOrganizations: () => Promise<void>;
  createOrganization: (name: string, slug: string) => Promise<Organization | null>;
}

const OrganizationContext = createContext<OrganizationContextType>({
  currentOrganization: null,
  organizations: [],
  currentMember: null,
  loading: true,
  error: null,
  switchOrganization: async () => {},
  refreshOrganizations: async () => {},
  createOrganization: async () => null,
});

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganization must be used within OrganizationProvider');
  }
  return context;
}

interface OrganizationProviderProps {
  children: ReactNode;
}

export function OrganizationProvider({ children }: OrganizationProviderProps) {
  const { session } = useAuth();
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentMember, setCurrentMember] = useState<OrganizationMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load organizations when session changes
  useEffect(() => {
    if (session?.user) {
      loadOrganizations();
    } else {
      // Clear organization data when logged out
      setCurrentOrganization(null);
      setOrganizations([]);
      setCurrentMember(null);
      setLoading(false);
    }
  }, [session]);

  const loadOrganizations = async () => {
    if (!session?.access_token) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch user's organizations
      const response = await fetch('/api/organizations', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to load organizations:', errorText);
        throw new Error('Failed to load organizations');
      }

      const data = await response.json();

      // If user has no organizations, setup personal organization
      if (!data.organizations || data.organizations.length === 0) {
        const setupResponse = await fetch('/api/users/setup', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        });

        if (setupResponse.ok) {
          // Reload organizations after setup
          const reloadResponse = await fetch('/api/organizations', {
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
            },
          });

          if (reloadResponse.ok) {
            const reloadData = await reloadResponse.json();
            setOrganizations(reloadData.organizations || []);

            if (reloadData.currentOrganization) {
              setCurrentOrganization(reloadData.currentOrganization);
              if (reloadData.currentMember) {
                setCurrentMember(reloadData.currentMember);
              }
            }
            return;
          }
        }
      }

      setOrganizations(data.organizations || []);

      // Load current organization
      if (data.currentOrganization) {
        setCurrentOrganization(data.currentOrganization);

        // Load current member role
        if (data.currentMember) {
          setCurrentMember(data.currentMember);
        }
      } else if (data.organizations?.length > 0) {
        // If no current organization, select the first one
        await switchOrganization(data.organizations[0].id);
      }
    } catch (err) {
      console.error('Error loading organizations:', err);
      setError(err instanceof Error ? err.message : 'Failed to load organizations');
    } finally {
      setLoading(false);
    }
  };

  const switchOrganization = async (organizationId: string) => {
    if (!session?.access_token) return;

    try {
      setError(null);

      // Update current organization in backend
      const response = await fetch('/api/organizations/switch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ organizationId }),
      });

      if (!response.ok) {
        throw new Error('Failed to switch organization');
      }

      const data = await response.json();
      setCurrentOrganization(data.organization);
      setCurrentMember(data.member);

      // Reload the page to refresh all data with new organization context
      window.location.reload();
    } catch (err) {
      console.error('Error switching organization:', err);
      setError(err instanceof Error ? err.message : 'Failed to switch organization');
    }
  };

  const createOrganization = async (name: string, slug: string): Promise<Organization | null> => {
    if (!session?.access_token) return null;

    try {
      setError(null);

      const response = await fetch('/api/organizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ name, slug }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create organization');
      }

      const data = await response.json();

      // Refresh organizations list
      await loadOrganizations();

      // Switch to new organization
      if (data.organization?.id) {
        await switchOrganization(data.organization.id);
      }

      return data.organization;
    } catch (err) {
      console.error('Error creating organization:', err);
      setError(err instanceof Error ? err.message : 'Failed to create organization');
      return null;
    }
  };

  const refreshOrganizations = async () => {
    await loadOrganizations();
  };

  return (
    <OrganizationContext.Provider
      value={{
        currentOrganization,
        organizations,
        currentMember,
        loading,
        error,
        switchOrganization,
        refreshOrganizations,
        createOrganization,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}