'use client';

import { useState } from 'react';
import { SidebarLayout } from '@/components/sidebar-layout';
import { settingsSidebarConfig } from '@/lib/sidebar-configs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Mail, MessageSquare, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface NotificationSettings {
  email: {
    enabled: boolean;
    address: string;
    frequency: 'instant' | 'daily' | 'weekly';
  };
  slack: {
    enabled: boolean;
    webhook: string;
    channel: string;
  };
  discord: {
    enabled: boolean;
    webhook: string;
  };
  alerts: {
    newLeaks: boolean;
    criticalLeaks: boolean;
    domainVerification: boolean;
    weeklyReports: boolean;
  };
}

export default function NotificationsPage() {
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      enabled: true,
      address: 'user@example.com',
      frequency: 'instant'
    },
    slack: {
      enabled: false,
      webhook: '',
      channel: '#security'
    },
    discord: {
      enabled: false,
      webhook: ''
    },
    alerts: {
      newLeaks: true,
      criticalLeaks: true,
      domainVerification: true,
      weeklyReports: false
    }
  });

  const handleSaveSettings = () => {
    console.log('Saving notification settings:', settings);
  };

  // Update sidebar config to mark current page as active
  const sidebarConfig = {
    ...settingsSidebarConfig,
    menuItems: settingsSidebarConfig.menuItems.map(item => ({
      ...item,
      active: item.path === '/settings/notifications'
    }))
  };

  return (
    <SidebarLayout config={sidebarConfig}>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Notification Settings</h1>
          <p className="text-muted-foreground">
            Configure how and when you receive alerts about data leaks
          </p>
        </div>

        <Card className="rounded-none">
          <CardHeader>
            <CardTitle>Alert Types</CardTitle>
            <CardDescription>
              Choose which types of alerts you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <div>
                  <Label htmlFor="new-leaks">New Data Leaks</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when new leaks are detected for your domains
                  </p>
                </div>
              </div>
              <Switch
                id="new-leaks"
                checked={settings.alerts.newLeaks}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({
                    ...prev,
                    alerts: { ...prev.alerts, newLeaks: checked }
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-red-500" />
                <div>
                  <Label htmlFor="critical-leaks">Critical Security Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Immediate alerts for high-severity security breaches
                  </p>
                </div>
              </div>
              <Switch
                id="critical-leaks"
                checked={settings.alerts.criticalLeaks}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({
                    ...prev,
                    alerts: { ...prev.alerts, criticalLeaks: checked }
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <Label htmlFor="domain-verification">Domain Verification</Label>
                  <p className="text-sm text-muted-foreground">
                    Updates about domain verification status
                  </p>
                </div>
              </div>
              <Switch
                id="domain-verification"
                checked={settings.alerts.domainVerification}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({
                    ...prev,
                    alerts: { ...prev.alerts, domainVerification: checked }
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-blue-500" />
                <div>
                  <Label htmlFor="weekly-reports">Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Summary of leak monitoring activity every week
                  </p>
                </div>
              </div>
              <Switch
                id="weekly-reports"
                checked={settings.alerts.weeklyReports}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({
                    ...prev,
                    alerts: { ...prev.alerts, weeklyReports: checked }
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-none">
          <CardHeader>
            <CardTitle>Notification Channels</CardTitle>
            <CardDescription>
              Configure where to send your notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5" />
                  <Label htmlFor="email-enabled">Email Notifications</Label>
                </div>
                <Switch
                  id="email-enabled"
                  checked={settings.email.enabled}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({
                      ...prev,
                      email: { ...prev.email, enabled: checked }
                    }))
                  }
                />
              </div>
              {settings.email.enabled && (
                <div className="ml-8 space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="email-address">Email Address</Label>
                    <Input
                      id="email-address"
                      type="email"
                      value={settings.email.address}
                      onChange={(e) =>
                        setSettings(prev => ({
                          ...prev,
                          email: { ...prev.email, address: e.target.value }
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-frequency">Frequency</Label>
                    <Select
                      value={settings.email.frequency}
                      onValueChange={(value: 'instant' | 'daily' | 'weekly') =>
                        setSettings(prev => ({
                          ...prev,
                          email: { ...prev.email, frequency: value }
                        }))
                      }
                    >
                      <SelectTrigger id="email-frequency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instant">Instant</SelectItem>
                        <SelectItem value="daily">Daily Digest</SelectItem>
                        <SelectItem value="weekly">Weekly Summary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-5 w-5" />
                  <Label htmlFor="slack-enabled">Slack Notifications</Label>
                </div>
                <Switch
                  id="slack-enabled"
                  checked={settings.slack.enabled}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({
                      ...prev,
                      slack: { ...prev.slack, enabled: checked }
                    }))
                  }
                />
              </div>
              {settings.slack.enabled && (
                <div className="ml-8 space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="slack-webhook">Webhook URL</Label>
                    <Input
                      id="slack-webhook"
                      type="url"
                      placeholder="https://hooks.slack.com/services/..."
                      value={settings.slack.webhook}
                      onChange={(e) =>
                        setSettings(prev => ({
                          ...prev,
                          slack: { ...prev.slack, webhook: e.target.value }
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slack-channel">Channel</Label>
                    <Input
                      id="slack-channel"
                      placeholder="#security"
                      value={settings.slack.channel}
                      onChange={(e) =>
                        setSettings(prev => ({
                          ...prev,
                          slack: { ...prev.slack, channel: e.target.value }
                        }))
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-5 w-5" />
                  <Label htmlFor="discord-enabled">Discord Notifications</Label>
                </div>
                <Switch
                  id="discord-enabled"
                  checked={settings.discord.enabled}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({
                      ...prev,
                      discord: { ...prev.discord, enabled: checked }
                    }))
                  }
                />
              </div>
              {settings.discord.enabled && (
                <div className="ml-8 space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="discord-webhook">Webhook URL</Label>
                    <Input
                      id="discord-webhook"
                      type="url"
                      placeholder="https://discord.com/api/webhooks/..."
                      value={settings.discord.webhook}
                      onChange={(e) =>
                        setSettings(prev => ({
                          ...prev,
                          discord: { ...prev.discord, webhook: e.target.value }
                        }))
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSaveSettings}>
            Save Notification Settings
          </Button>
        </div>
      </div>
    </SidebarLayout>
  );
}