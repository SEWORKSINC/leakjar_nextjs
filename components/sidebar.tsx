'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Database, Search, Shield, Activity, Settings, Users, FileText, BarChart, Lock, Globe, Terminal, Cloud, Server, HardDrive, Cpu, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProfileDropdown } from '@/components/profile-dropdown';

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ElementType;
  children?: MenuItem[];
  active?: boolean;
}

interface SidebarProps {
  onMenuSelect?: (menuId: string) => void;
}

export function Sidebar({ onMenuSelect }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['data', 'data-leaks']));
  const [selectedItem, setSelectedItem] = useState<string>('leaked-data');

  const menuItems: MenuItem[] = [
    {
      id: 'home',
      label: 'Dashboard',
      icon: Home,
    },
    {
      id: 'data',
      label: 'Data Sources',
      icon: Database,
      children: [
        {
          id: 'data-leaks',
          label: 'Leak Database',
          icon: Shield,
          children: [
            { id: 'leaked-data', label: 'All Leaked Data', active: true },
            { id: 'by-domain', label: 'By Domain' },
            { id: 'by-country', label: 'By Country' },
            { id: 'by-date', label: 'By Date Range' },
          ]
        },
        {
          id: 'data-stats',
          label: 'Statistics',
          icon: BarChart,
          children: [
            { id: 'overview', label: 'Overview' },
            { id: 'trends', label: 'Trends' },
            { id: 'top-domains', label: 'Top Domains' },
          ]
        }
      ]
    },
    {
      id: 'search',
      label: 'Search',
      icon: Search,
      children: [
        { id: 'email-search', label: 'Email Search' },
        { id: 'domain-search', label: 'Domain Search' },
        { id: 'ip-search', label: 'IP Search' },
        { id: 'advanced', label: 'Advanced Search' },
      ]
    },
    {
      id: 'monitoring',
      label: 'Monitoring',
      icon: Activity,
      children: [
        { id: 'alerts', label: 'Alerts' },
        { id: 'watchlist', label: 'Watchlist' },
        { id: 'notifications', label: 'Notifications' },
      ]
    },
    {
      id: 'security',
      label: 'Security',
      icon: Lock,
      children: [
        { id: 'breach-analysis', label: 'Breach Analysis' },
        { id: 'vulnerability', label: 'Vulnerability Scanner' },
        { id: 'reports', label: 'Security Reports' },
      ]
    },
    {
      id: 'infrastructure',
      label: 'Infrastructure',
      icon: Server,
      children: [
        { id: 'clickhouse', label: 'ClickHouse', icon: Database },
        { id: 'processing', label: 'Data Processing', icon: Cpu },
        { id: 'storage', label: 'Storage', icon: HardDrive },
        { id: 'api', label: 'API Status', icon: Cloud },
      ]
    },
    {
      id: 'tools',
      label: 'Tools',
      icon: Terminal,
      children: [
        { id: 'query-builder', label: 'Query Builder' },
        { id: 'export', label: 'Data Export' },
        { id: 'import', label: 'Data Import' },
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      children: [
        { id: 'domain-settings', label: 'Domain Settings' },
        { id: 'api-settings', label: 'API Settings' },
        { id: 'export-settings', label: 'Export Settings' },
      ]
    }
  ];

  const toggleExpand = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const handleItemClick = (itemId: string) => {
    setSelectedItem(itemId);
    
    // Handle navigation for specific items
    if (itemId === 'domain-settings') {
      window.location.href = '/settings?tab=domains';
    } else if (itemId === 'api-settings') {
      window.location.href = '/settings?tab=api';
    } else if (itemId === 'export-settings') {
      window.location.href = '/settings?tab=export';
    }
    
    onMenuSelect?.(itemId);
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isSelected = selectedItem === item.id;
    const Icon = item.icon;

    return (
      <div key={item.id}>
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
              handleItemClick(item.id);
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
        {hasChildren && isExpanded && (
          <div>
            {item.children!.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header with Logo and Profile */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LJ</span>
            </div>
            <span className="font-bold text-lg">LeakJar</span>
          </div>
          <ProfileDropdown />
        </div>
        
        {/* Quick Stats */}
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
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-2">
        {menuItems.map(item => renderMenuItem(item))}
      </div>

      {/* Footer */}
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
    </div>
  );
}