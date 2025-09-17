'use client';

import { useState, useEffect } from 'react';
import { SidebarLayout } from '@/components/sidebar-layout';
import { mainSidebarConfig } from '@/lib/sidebar-configs';
import { MenuItem } from '@/components/sidebar-layout';
import { Shield, Globe, Mail, Link, Database } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase-client';
import { useUserRole } from '@/hooks/useUserRole';
import { useAuth } from '@/components/providers/auth-provider';

interface Domain {
  id: string;
  domain: string;
  type: string;
  description?: string;
  companyName?: string;
  createdAt: string;
}

interface DynamicSidebarLayoutProps {
  children: React.ReactNode;
  activeItem: string;
  onMenuSelect: (menuId: string) => void;
  onDomainsLoaded?: (domains: Domain[]) => void;
}

export function DynamicSidebarLayout({ children, activeItem, onMenuSelect, onDomainsLoaded }: DynamicSidebarLayoutProps) {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState(mainSidebarConfig);
  const { isAdmin, loading: roleLoading } = useUserRole();
  const { session, loading: authLoading } = useAuth();

  useEffect(() => {
    // AuthProvider의 세션 상태에 따라 도메인 가져오기
    if (!authLoading) {
      fetchUserDomains();
    }
  }, [session, authLoading, isAdmin, roleLoading]);

  const fetchUserDomains = async () => {
    try {
      setLoading(true);

      const supabase = getSupabaseClient();

      // Get current user session for authentication
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      let activeSession = session;

      // 세션 오류가 있거나 세션이 없는 경우에만 리프레시 시도
      if (!activeSession) {
        // Try to refresh session
        try {
          const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
          if (!refreshError && refreshedSession) {
            activeSession = refreshedSession;
          }
        } catch (refreshError) {
          // 세션 리프레시 실패는 정상적인 상황일 수 있음 (로그인하지 않은 경우)
          // 에러 무시
        }
      }

      // 세션이 없는 경우에만 Authentication Required 표시
      if (!activeSession) {
        // 로그인하지 않은 사용자를 위한 기본 메뉴 설정
        setConfig({
          ...mainSidebarConfig,
          menuItems: [
            {
              id: 'auth-required',
              label: 'Authentication Required',
              icon: Shield,
              children: [
                { id: 'login-required', label: 'Please log in to view your domains' }
              ]
            },
            ...mainSidebarConfig.menuItems.filter(item => item.id !== 'data')
          ]
        });
        setLoading(false);
        return;
      }

      // 세션이 확인되었으므로 도메인 가져오기
      // Fetch domains from API with authentication
      const response = await fetch('/api/domains', {
        headers: {
          'Authorization': `Bearer ${activeSession.access_token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const userDomains = data.domains || [];
        setDomains(userDomains);

        // Group domains by type
        const urlDomains = userDomains.filter((domain: Domain) => domain.type === 'URL');
        const emailDomains = userDomains.filter((domain: Domain) => domain.type === 'EMAIL');

        // Create domain menu items with proper URL paths
        const urlDomainMenuItems = urlDomains.map((domain: Domain) => {
          const menuItem = {
            id: `domain-${domain.domain}`,
            label: domain.domain,
            icon: Globe,
            description: domain.companyName || domain.description,
            path: `/monitoring/url/${encodeURIComponent(domain.domain)}`,
          };
          return menuItem;
        });

        const emailDomainMenuItems = emailDomains.map((domain: Domain) => ({
          id: `domain-${domain.domain}`,
          label: domain.domain,
          icon: Mail,
          description: domain.companyName || domain.description,
          path: `/monitoring/email/${encodeURIComponent(domain.domain)}`,
        }));

        // Build dynamic menu items
        const dynamicMenuItems: MenuItem[] = [
          // Dashboard first
          mainSidebarConfig.menuItems.find(item => item.id === 'home')!,
        ];

        // Add admin-only menu if user is admin
        // 디버깅: role 상태 확인
        console.log('Admin check - isAdmin:', isAdmin, 'roleLoading:', roleLoading);

        if (isAdmin) {
          dynamicMenuItems.push({
            id: 'all-leaked-data',
            label: 'Admin Only',
            icon: Database,
            children: [
              { id: 'leaked-data', label: 'All Leaked Data', path: '/monitoring/all' },
              { id: 'user-management', label: 'User Management', path: '/admin/users' }
            ]
          });
        }

        // Add URL and Email monitoring for all users
        dynamicMenuItems.push(
          {
            id: 'url-monitoring',
            label: 'URL Monitoring',
            icon: Globe,
            children: urlDomainMenuItems.length > 0 ? urlDomainMenuItems : [{ id: 'no-url-domains', label: 'No URL domains' }]
          },
          {
            id: 'email-monitoring',
            label: 'Email Monitoring',
            icon: Mail,
            children: emailDomainMenuItems.length > 0 ? emailDomainMenuItems : [{ id: 'no-email-domains', label: 'No email domains' }]
          }
        );

        // Settings at the end
        dynamicMenuItems.push(mainSidebarConfig.menuItems.find(item => item.id === 'settings')!);

        const updatedConfig = {
          ...mainSidebarConfig,
          menuItems: dynamicMenuItems
        };

        setConfig(updatedConfig);

        // Call the callback to pass domains to parent component
        if (onDomainsLoaded) {
          onDomainsLoaded(userDomains);
        }
      }
    } catch (error) {
      console.error('Error fetching domains:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarLayout
      config={config}
      activeItem={activeItem}
      onMenuSelect={onMenuSelect}
    >
      {children}
    </SidebarLayout>
  );
}