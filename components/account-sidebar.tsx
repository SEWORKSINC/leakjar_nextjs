'use client';

import { useState } from 'react';
import { User, Shield, Bell, CreditCard, Settings, LogOut, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
  description?: string;
}

interface AccountSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AccountSidebar({ activeTab, onTabChange }: AccountSidebarProps) {
  const router = useRouter();
  
  const menuItems: SidebarItem[] = [
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      description: 'Personal information'
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
      description: 'Password & authentication'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'Email & alerts'
    },
    {
      id: 'billing',
      label: 'Billing',
      icon: CreditCard,
      description: 'Subscription & payments'
    }
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-900 h-full border-r border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <div>
            <h2 className="text-lg font-semibold">Settings</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Return to your service view</p>
          </div>
        </Link>
      </div>
      
      <nav className="px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-3 mb-1 rounded-lg text-left transition-colors
                ${isActive 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }
              `}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-medium text-sm">{item.label}</div>
                {item.description && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {item.description}
                  </div>
                )}
              </div>
              {isActive && <ChevronRight className="h-4 w-4" />}
            </button>
          );
        })}
      </nav>
      
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-gray-700">
        <Button 
          variant="outline" 
          className="w-full justify-start text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </div>
    </div>
  );
}