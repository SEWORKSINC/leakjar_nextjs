'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { SidebarLayout } from '@/components/sidebar-layout';
import { settingsSidebarConfig } from '@/lib/sidebar-configs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, Trash2, CheckCircle, XCircle, Globe, Mail, Building, Link } from 'lucide-react';
import { pageStyles } from '@/lib/styles';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Domain {
  id: string;
  domain: string;
  type: 'URL' | 'EMAIL';
  description?: string;
  companyName?: string;
  isVerified: boolean;
  verifiedAt?: string;
  createdAt: string;
}

export default function DomainSettingsPage() {
  const [urlDomains, setUrlDomains] = useState<Domain[]>([]);
  const [emailDomains, setEmailDomains] = useState<Domain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDomain, setNewDomain] = useState({
    domain: '',
    type: 'URL' as 'URL' | 'EMAIL',
    description: '',
    companyName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/domains', {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        const allDomains = data.domains || [];
        setUrlDomains(allDomains.filter((d: Domain) => d.type === 'URL'));
        setEmailDomains(allDomains.filter((d: Domain) => d.type === 'EMAIL'));
      }
    } catch (error) {
      console.error('Error fetching domains:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDomain = async () => {
    if (!newDomain.domain) return;

    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/domains', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify(newDomain),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.domain.type === 'URL') {
          setUrlDomains([data.domain, ...urlDomains]);
        } else {
          setEmailDomains([data.domain, ...emailDomains]);
        }
        setNewDomain({ domain: '', type: 'URL', description: '', companyName: '' });
        setIsDialogOpen(false);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to add domain');
      }
    } catch (error) {
      console.error('Error adding domain:', error);
      alert('Failed to add domain');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDomain = async (domainId: string, type: 'URL' | 'EMAIL') => {
    if (!confirm('Are you sure you want to delete this domain?')) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`/api/domains?id=${domainId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });

      if (response.ok) {
        if (type === 'URL') {
          setUrlDomains(urlDomains.filter(d => d.id !== domainId));
        } else {
          setEmailDomains(emailDomains.filter(d => d.id !== domainId));
        }
      } else {
        alert('Failed to delete domain');
      }
    } catch (error) {
      console.error('Error deleting domain:', error);
      alert('Failed to delete domain');
    }
  };

  const renderDomainList = (domains: Domain[], type: 'URL' | 'EMAIL') => {
    const Icon = type === 'URL' ? Link : Mail;
    
    if (domains.length === 0) {
      return (
        <div className="text-center py-8">
          <Icon className="h-10 w-10 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No {type === 'URL' ? 'URL' : 'email'} domains registered yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Add domains to monitor {type === 'URL' ? 'website URLs' : 'email addresses'}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {domains.map((domain) => (
          <div
            key={domain.id}
            className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-4">
              <Icon className="h-5 w-5 text-gray-400" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {domain.domain}
                  </span>
                  <div className="flex items-center gap-1">
                    {domain.isVerified ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-xs text-green-600">Verified</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-yellow-500" />
                        <span className="text-xs text-yellow-600">Pending</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {domain.companyName && (
                    <span className="flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      {domain.companyName}
                    </span>
                  )}
                  {domain.description && (
                    <span>{domain.description}</span>
                  )}
                  <span>
                    Added {new Date(domain.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteDomain(domain.id, type)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    );
  };

  // Update sidebar config to mark current page as active
  const sidebarConfig = {
    ...settingsSidebarConfig,
    menuItems: settingsSidebarConfig.menuItems.map(item => ({
      ...item,
      active: item.path === '/settings/domains'
    }))
  };

  if (isLoading) {
    return (
      <SidebarLayout config={sidebarConfig}>
        <div className="flex h-screen items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout config={sidebarConfig}>
      <div className="max-w-6xl p-6">
        <div className={pageStyles.header.container}>
          <h1 className={pageStyles.header.title}>Domain Settings</h1>
          <p className={pageStyles.header.description}>
            Manage your domains to monitor URLs and email addresses for data breaches
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* URL Domains Card */}
          <Card className="rounded-none">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Link className="h-5 w-5" />
                    URL Domains
                  </CardTitle>
                  <CardDescription>
                    Monitor domains that appear in website URLs
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {renderDomainList(urlDomains, 'URL')}
            </CardContent>
          </Card>

          {/* Email Domains Card */}
          <Card className="rounded-none">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email Domains
                  </CardTitle>
                  <CardDescription>
                    Monitor domains that appear in email addresses
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {renderDomainList(emailDomains, 'EMAIL')}
            </CardContent>
          </Card>
        </div>

        {/* Add Domain Button */}
        <div className="mt-6 flex justify-center">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Add Domain
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add New Domain</DialogTitle>
                <DialogDescription>
                  Choose the type of domain monitoring and enter domain details
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label>Domain Type</Label>
                  <RadioGroup 
                    value={newDomain.type} 
                    onValueChange={(value) => setNewDomain({ ...newDomain, type: value as 'URL' | 'EMAIL' })}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="URL" id="url" />
                      <Label htmlFor="url" className="flex items-center gap-2 cursor-pointer">
                        <Link className="h-4 w-4" />
                        URL Domain (e.g., example.com in https://example.com)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="EMAIL" id="email" />
                      <Label htmlFor="email" className="flex items-center gap-2 cursor-pointer">
                        <Mail className="h-4 w-4" />
                        Email Domain (e.g., example.com in user@example.com)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <Label htmlFor="domain">Domain</Label>
                  <Input
                    id="domain"
                    placeholder={newDomain.type === 'URL' ? 'example.com' : 'company.com'}
                    value={newDomain.domain}
                    onChange={(e) => setNewDomain({ ...newDomain, domain: e.target.value })}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {newDomain.type === 'URL' 
                      ? 'Enter the domain to monitor in website URLs'
                      : 'Enter the domain to monitor in email addresses'}
                  </p>
                </div>
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="Example Inc."
                    value={newDomain.companyName}
                    onChange={(e) => setNewDomain({ ...newDomain, companyName: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder={newDomain.type === 'URL' ? 'Main website domain' : 'Corporate email domain'}
                    value={newDomain.description}
                    onChange={(e) => setNewDomain({ ...newDomain, description: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddDomain} disabled={isSubmitting}>
                  {isSubmitting ? 'Adding...' : 'Add Domain'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="mt-6 rounded-none">
          <CardHeader>
            <CardTitle>About Domain Monitoring</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <p>
              <strong>URL Domains:</strong> Monitor when your domain appears in website URLs in leaked credentials
            </p>
            <p>
              <strong>Email Domains:</strong> Monitor when your domain appears in email addresses in leaked data
            </p>
            <p>
              • Domains require admin verification before they become active
            </p>
            <p>
              • Contact an administrator to verify your domain ownership
            </p>
            <p>
              • You will receive alerts when your monitored domains appear in new data breaches
            </p>
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
}