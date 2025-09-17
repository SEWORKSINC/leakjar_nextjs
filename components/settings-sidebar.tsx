'use client';

import { useState } from 'react';
import { Globe, Key, Download, Settings, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
  description?: string;
}

interface SettingsSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function SettingsSidebar({ activeTab, onTabChange }: SettingsSidebarProps) {
  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    // Update URL without page refresh
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tabId);
    window.history.pushState({}, '', url);
  };
  const router = useRouter();
  
  const menuItems: SidebarItem[] = [
    {
      id: 'domains',
      label: 'Domain Settings',
      icon: Globe,
      description: 'Manage your domains'
    },
    {
      id: 'api',
      label: 'API Settings',
      icon: Key,
      description: 'API keys & access'
    },
    {
      id: 'export',
      label: 'Export Settings',
      icon: Download,
      description: 'Data export preferences'
    }
  ];

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
      
      <nav className="px-3 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
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
    </div>
  );
}