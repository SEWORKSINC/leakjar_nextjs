'use client';

import { useState, useEffect } from 'react';
import { DynamicSidebarLayout } from '@/components/dynamic-sidebar-layout';
import { useOrganization } from '@/components/providers/organization-provider';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Settings,
  Building2,
  CreditCard,
  Users,
  Shield,
  Trash2,
  Save,
  AlertCircle,
  Check,
  Loader2,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';

export default function OrganizationSettingsPage() {
  const router = useRouter();
  const { currentOrganization, currentMember, refreshOrganizations } = useOrganization();
  const { session } = useAuth();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form states
  const [orgName, setOrgName] = useState('');
  const [orgSlug, setOrgSlug] = useState('');
  const [orgWebsite, setOrgWebsite] = useState('');
  const [orgDescription, setOrgDescription] = useState('');
  const [billingEmail, setBillingEmail] = useState('');

  // Check permissions
  const canEditOrganization = currentMember?.role === 'owner' || currentMember?.role === 'admin';
  const canDeleteOrganization = currentMember?.role === 'owner';
  const canManageBilling = currentMember?.role === 'owner';

  useEffect(() => {
    if (currentOrganization) {
      setOrgName(currentOrganization.name || '');
      setOrgSlug(currentOrganization.slug || '');
      setOrgWebsite(currentOrganization.website || '');
      setOrgDescription(currentOrganization.description || '');
      setBillingEmail(currentOrganization.billingEmail || '');
    }
  }, [currentOrganization]);

  const handleSave = async () => {
    if (!session || !currentOrganization || !canEditOrganization) return;

    setSaving(true);
    setSuccessMessage('');

    try {
      const response = await fetch(`/api/organizations/${currentOrganization.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          name: orgName,
          website: orgWebsite,
          description: orgDescription,
          billingEmail: canManageBilling ? billingEmail : undefined,
        }),
      });

      if (response.ok) {
        setSuccessMessage('Settings saved successfully!');
        await refreshOrganizations();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!session || !currentOrganization || !canDeleteOrganization) return;
    if (deleteConfirmation !== currentOrganization.name) return;

    try {
      const response = await fetch(`/api/organizations/${currentOrganization.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        setDeleteDialogOpen(false);
        await refreshOrganizations();
        router.push('/dashboard');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to delete organization');
      }
    } catch (error) {
      console.error('Error deleting organization:', error);
      alert('Failed to delete organization');
    }
  };

  const getSubscriptionBadge = () => {
    const plan = currentOrganization?.subscriptionPlan || 'free';
    const colors = {
      free: 'bg-gray-100 text-gray-800',
      starter: 'bg-blue-100 text-blue-800',
      pro: 'bg-purple-100 text-purple-800',
      enterprise: 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-900',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[plan as keyof typeof colors]}`}>
        {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
      </span>
    );
  };

  return (
    <DynamicSidebarLayout
      activeItem="settings"
      onMenuSelect={() => {}}
    >
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-gray-600" />
            <h1 className="text-2xl font-bold text-gray-900">Organization Settings</h1>
          </div>
          <p className="text-gray-500 mt-1">
            Manage your organization settings and preferences
          </p>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600" />
            <span className="text-green-800">{successMessage}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>
                Basic information about your organization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Organization Name</label>
                <Input
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  disabled={!canEditOrganization}
                  placeholder="Acme Corporation"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">URL Slug</label>
                <Input
                  value={orgSlug}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">URL slug cannot be changed</p>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Website</label>
                <Input
                  value={orgWebsite}
                  onChange={(e) => setOrgWebsite(e.target.value)}
                  disabled={!canEditOrganization}
                  placeholder="https://example.com"
                  type="url"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <textarea
                  value={orgDescription}
                  onChange={(e) => setOrgDescription(e.target.value)}
                  disabled={!canEditOrganization}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Brief description of your organization..."
                />
              </div>

              {canEditOrganization && (
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Subscription & Billing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Subscription & Billing
              </CardTitle>
              <CardDescription>
                Manage your subscription and billing settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Current Plan</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {currentOrganization?.maxMembers} members • {currentOrganization?.maxDomains} domains • {currentOrganization?.maxMonthlySearches} searches/month
                  </p>
                </div>
                {getSubscriptionBadge()}
              </div>

              {canManageBilling && (
                <>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Billing Email</label>
                    <Input
                      value={billingEmail}
                      onChange={(e) => setBillingEmail(e.target.value)}
                      type="email"
                      placeholder="billing@example.com"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline">
                      Manage Subscription
                    </Button>
                    <Button variant="outline">
                      View Invoices
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Organization Limits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Usage & Limits
              </CardTitle>
              <CardDescription>
                Current usage and plan limits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    {/* TODO: Get actual member count */}
                    1 / {currentOrganization?.maxMembers}
                  </p>
                  <p className="text-sm text-gray-500">Members</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    {/* TODO: Get actual domain count */}
                    0 / {currentOrganization?.maxDomains}
                  </p>
                  <p className="text-sm text-gray-500">Domains</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    {/* TODO: Get actual search count */}
                    0 / {currentOrganization?.maxMonthlySearches}
                  </p>
                  <p className="text-sm text-gray-500">Searches/Month</p>
                </div>
              </div>

              {currentOrganization?.subscriptionPlan === 'free' && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-600" />
                    <p className="text-sm text-blue-800">
                      Upgrade to Pro to get more members, domains, and searches.
                    </p>
                  </div>
                  <Button className="mt-3" size="sm">
                    Upgrade Now
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Danger Zone */}
          {canDeleteOrganization && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Shield className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Irreversible actions that affect your organization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-medium text-red-900 mb-2">Delete Organization</h4>
                  <p className="text-sm text-red-700 mb-4">
                    Once you delete an organization, there is no going back. All data will be permanently removed.
                  </p>
                  <Button
                    variant="destructive"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Organization
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Organization</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              organization and remove all associated data.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm mb-2">
              Type <strong>{currentOrganization?.name}</strong> to confirm:
            </p>
            <Input
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="Type organization name"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteConfirmation !== currentOrganization?.name}
            >
              Delete Organization
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DynamicSidebarLayout>
  );
}