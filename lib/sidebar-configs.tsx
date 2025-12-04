import {
  Home, Database, Search, Shield, Activity, Settings, Users, FileText,
  BarChart, Lock, Globe, Terminal, Cloud, Server, HardDrive, Cpu,
  User, Bell, CreditCard, Key, Download, Book
} from 'lucide-react';
import { MenuItem } from '@/components/sidebar-layout';

// Main application sidebar configuration
export const mainSidebarConfig = {
  title: 'LeakJar',
  subtitle: 'stats',
  showHeader: true,
  showFooter: true,
  menuItems: [
    {
      id: 'home',
      label: 'Dashboard',
      icon: Home,
      path: '/'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      children: [
        { id: 'domain-settings', label: 'Domain Settings', path: '/settings/domains' },
        { id: 'api-settings', label: 'API Keys', path: '/settings/api-keys' },
        { id: 'notifications-settings', label: 'Notifications', path: '/settings/notifications' },
      ]
    }
  ] as MenuItem[]
};

// Account/Profile sidebar configuration
export const accountSidebarConfig = {
  title: 'Settings',
  backTo: '/',
  backLabel: 'Return to your service view',
  showHeader: true,
  showFooter: false,
  menuItems: [
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
  ] as MenuItem[]
};

// Settings sidebar configuration
export const settingsSidebarConfig = {
  title: 'Settings',
  backTo: '/',
  backLabel: 'Return to your service view',
  showHeader: true,
  showFooter: false,
  menuItems: [
    {
      id: 'domains',
      label: 'Domain Settings',
      icon: Globe,
      description: 'Manage your domains',
      path: '/settings/domains'
    },
    {
      id: 'api-keys',
      label: 'API Keys',
      icon: Key,
      description: 'API keys & access',
      path: '/settings/api-keys'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'Alert preferences',
      path: '/settings/notifications'
    }
  ] as MenuItem[]
};