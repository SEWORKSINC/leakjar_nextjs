'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarLayout } from '@/components/sidebar-layout';
import { accountSidebarConfig } from '@/lib/sidebar-configs';
import { Switch } from '@/components/ui/switch';

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    displayName: '',
    timezone: 'UTC',
    language: 'en',
  });

  const [notifications, setNotifications] = useState({
    notifyEmail: true,
    notifyBreach: true,
    notifyProduct: false,
  });

  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    darkMode: false,
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      setUser(data.user);
      setProfile({
        name: data.user.name || '',
        email: data.user.email,
        displayName: data.user.profile?.displayName || '',
        timezone: data.user.profile?.timezone || 'UTC',
        language: data.user.profile?.language || 'en',
      });
      setNotifications({
        notifyEmail: data.user.profile?.notifyEmail ?? true,
        notifyBreach: data.user.profile?.notifyBreach ?? true,
        notifyProduct: data.user.profile?.notifyProduct ?? false,
      });
      setSecurity({
        twoFactorEnabled: data.user.profile?.twoFactorEnabled ?? false,
        darkMode: data.user.profile?.darkMode ?? false,
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      router.push('/auth/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ profile, notifications, security }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const renderContent = () => {
    return (
      <div className="p-8">
        <div className="max-w-4xl">
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your account profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={profile.displayName}
                      onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="mt-1 bg-gray-100 dark:bg-gray-800"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <select
                      id="timezone"
                      value={profile.timezone}
                      onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="Europe/London">London</option>
                      <option value="Asia/Tokyo">Tokyo</option>
                      <option value="Asia/Seoul">Seoul</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <select
                      id="language"
                      value={profile.language}
                      onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600"
                    >
                      <option value="en">English</option>
                      <option value="ko">한국어</option>
                      <option value="ja">日本語</option>
                      <option value="zh">中文</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="2fa">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    id="2fa"
                    checked={security.twoFactorEnabled}
                    onCheckedChange={(checked) => setSecurity({ ...security, twoFactorEnabled: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="darkMode">Dark Mode</Label>
                    <p className="text-sm text-gray-500">Use dark theme across the application</p>
                  </div>
                  <Switch
                    id="darkMode"
                    checked={security.darkMode}
                    onCheckedChange={(checked) => setSecurity({ ...security, darkMode: checked })}
                  />
                </div>
                <div className="pt-4 border-t">
                  <Button variant="outline" className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what notifications you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotif">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="emailNotif"
                    checked={notifications.notifyEmail}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, notifyEmail: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="breachNotif">Breach Alerts</Label>
                    <p className="text-sm text-gray-500">Get notified when your data appears in new breaches</p>
                  </div>
                  <Switch
                    id="breachNotif"
                    checked={notifications.notifyBreach}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, notifyBreach: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="productNotif">Product Updates</Label>
                    <p className="text-sm text-gray-500">Receive updates about new features and improvements</p>
                  </div>
                  <Switch
                    id="productNotif"
                    checked={notifications.notifyProduct}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, notifyProduct: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'billing' && (
            <Card>
              <CardHeader>
                <CardTitle>Billing & Subscription</CardTitle>
                <CardDescription>Manage your subscription and billing information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Current Plan</span>
                    <span className="text-sm text-gray-500">Free</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>• 100 searches per month</p>
                    <p>• Basic email alerts</p>
                    <p>• Standard support</p>
                  </div>
                </div>
                <Button className="w-full">Upgrade to Pro</Button>
              </CardContent>
            </Card>
          )}

          <div className="mt-8">
            <Button onClick={handleSaveProfile} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <SidebarLayout 
      config={accountSidebarConfig} 
      activeItem={activeTab}
      onMenuSelect={setActiveTab}
    >
      {renderContent()}
    </SidebarLayout>
  );
}