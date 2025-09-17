'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProfileDropdown } from '@/components/profile-dropdown';
import Link from 'next/link';

export interface MenuItem {
  id: string;
  label: string;
  icon?: React.ElementType;
  children?: MenuItem[];
  active?: boolean;
  path?: string;
  description?: string;
}

interface SidebarConfig {
  title: string;
  subtitle?: string;
  backTo?: string;
  backLabel?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  menuItems: MenuItem[];
}

interface SidebarLayoutProps {
  config: SidebarConfig;
  children: React.ReactNode;
  activeItem?: string;
  onMenuSelect?: (menuId: string) => void;
}

export function SidebarLayout({ config, children, activeItem, onMenuSelect }: SidebarLayoutProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['data', 'data-leaks']));
  const [selectedItem, setSelectedItem] = useState<string>(activeItem || 'home');

  const toggleExpand = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const handleItemClick = (itemId: string, item: MenuItem) => {
    setSelectedItem(itemId);

    onMenuSelect?.(itemId);
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isSelected = selectedItem === item.id || activeItem === item.id;
    const Icon = item.icon;

    return (
      <div key={item.id}>
        {item.path && !hasChildren ? (
          <Link
            href={item.path}
            className={`
              w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors
              hover:bg-gray-100 dark:hover:bg-gray-800
              ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-l-2 border-blue-600' : 'text-gray-700 dark:text-gray-300'}
              ${level === 0 ? 'font-medium' : ''}
              ${level === 1 ? 'pl-8' : ''}
              ${level === 2 ? 'pl-14' : ''}
            `}
          >
            <span className="w-3" />
            {Icon && <Icon className="h-4 w-4" />}
            <span className="flex-1 text-left">{item.label}</span>
            {item.active && (
              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
            )}
          </Link>
        ) : (
          <button
            className={`
              w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors
              hover:bg-gray-100 dark:hover:bg-gray-800
              ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-l-2 border-blue-600' : 'text-gray-700 dark:text-gray-300'}
              ${level === 0 ? 'font-medium' : ''}
              ${level === 1 ? 'pl-8' : ''}
              ${level === 2 ? 'pl-14' : ''}
            `}
            onClick={() => {
              if (hasChildren) {
                toggleExpand(item.id);
              } else {
                handleItemClick(item.id, item);
              }
            }}
          >
            {hasChildren ? (
              isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />
            ) : (
              <span className="w-3" />
            )}
            {Icon && <Icon className="h-4 w-4" />}
            <span className="flex-1 text-left">{item.label}</span>
            {item.active && (
              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
            )}
          </button>
        )}
        {hasChildren && isExpanded && (
          <div>
            {item.children!.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderHeader = () => {
    if (config.showHeader === false) return null;

    if (config.backTo) {
      return (
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <Link 
            href={config.backTo} 
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <div>
              <h2 className="text-lg font-semibold">{config.title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {config.backLabel || config.subtitle}
              </p>
            </div>
          </Link>
        </div>
      );
    }

    return (
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LJ</span>
            </div>
            <span className="font-bold text-lg">{config.title}</span>
          </div>
          <ProfileDropdown />
        </div>
        
        {config.subtitle && (
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <div className="flex justify-between">
              <span>Total Breaches:</span>
              <span className="font-mono">50.2B</span>
            </div>
            <div className="flex justify-between">
              <span>Last Update:</span>
              <span className="font-mono">2m ago</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderFooter = () => {
    if (config.showFooter === false) return null;

    return (
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <div className="flex justify-between mb-1">
            <span>ClickHouse:</span>
            <span className="text-green-500">● Connected</span>
          </div>
          <div className="flex justify-between">
            <span>Version:</span>
            <span>v1.0.0</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <div className="sticky top-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {renderHeader()}

        <div className="flex-1 overflow-y-auto py-2">
          {config.menuItems.map(item => renderMenuItem(item))}
        </div>

        {renderFooter()}
      </div>

      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}