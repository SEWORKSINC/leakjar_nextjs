'use client';

import { useState, useEffect } from 'react';
import { SidebarLayout } from '@/components/sidebar-layout';
import { settingsSidebarConfig } from '@/lib/sidebar-configs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Copy, Eye, EyeOff, Trash2, Plus, Loader2 } from 'lucide-react';
import { trackApiKeyCreated, trackApiKeyDeleted, trackApiKeyCopied } from '@/lib/vercel-analytics';

interface ApiKey {
  id: string;
  name: string;
  last_used: string | null;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface CreateKeyResponse {
  id: string;
  name: string;
  key: string; // Raw key (only returned once)
  expires_at: string | null;
  created_at: string;
}

interface UsageStats {
  daily: {
    requests: number;
    limit: number;
    percentage: number;
  };
  monthly: {
    requests: number;
    limit: number;
    percentage: number;
  };
  rate_limit: {
    per_minute: number;
  };
}

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [showKey, setShowKey] = useState<{ [key: string]: boolean }>({});
  const [storedKeys, setStoredKeys] = useState<{ [keyId: string]: string }>({});
  const [loadingKeys, setLoadingKeys] = useState<{ [key: string]: boolean }>({});
  const [newKeyName, setNewKeyName] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<CreateKeyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load API keys and usage stats on mount
  useEffect(() => {
    loadApiKeys();
    loadUsageStats();
  }, []);

  const loadApiKeys = async () => {
    try {
      const response = await fetch('/api/v1/keys');
      if (!response.ok) {
        throw new Error('Failed to load API keys');
      }
      const data = await response.json();
      setApiKeys(data.keys || []);
    } catch (error) {
      console.error('Load API keys error:', error);
      setError('Failed to load API keys');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsageStats = async () => {
    try {
      // Generate mock usage stats for the web UI
      // In a real implementation, this would come from a usage tracking database
      const mockUsageStats: UsageStats = {
        daily: {
          requests: Math.floor(Math.random() * 100) + 20,
          limit: 500,
          percentage: 0
        },
        monthly: {
          requests: Math.floor(Math.random() * 2000) + 1000,
          limit: 10000,
          percentage: 0
        },
        rate_limit: {
          per_minute: 100
        }
      };

      // Calculate percentages
      mockUsageStats.daily.percentage = Math.round((mockUsageStats.daily.requests / mockUsageStats.daily.limit) * 100);
      mockUsageStats.monthly.percentage = Math.round((mockUsageStats.monthly.requests / mockUsageStats.monthly.limit) * 100);

      setUsageStats(mockUsageStats);
    } catch (error) {
      console.error('Load usage stats error:', error);
    }
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return;

    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newKeyName.trim()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create API key');
      }

      const data: CreateKeyResponse = await response.json();
      setNewlyCreatedKey(data.key);

      // Track API key creation event
      trackApiKeyCreated();

      // Store the actual key for future display
      setStoredKeys(prev => ({
        ...prev,
        [data.key.id]: data.key.key
      }));

      // Show success dialog instead of the create dialog
      setIsCreateDialogOpen(false);
      setNewKeyName('');

      // Reload API keys
      await loadApiKeys();

    } catch (error) {
      console.error('Create API key error:', error);
      setError(error instanceof Error ? error.message : 'Failed to create API key');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteKey = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch('/api/v1/keys', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyId: id })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete API key');
      }

      // Track API key deletion event
      trackApiKeyDeleted();

      // Remove stored key and reload API keys
      setStoredKeys(prev => {
        const newKeys = { ...prev };
        delete newKeys[id];
        return newKeys;
      });
      await loadApiKeys();

    } catch (error) {
      console.error('Delete API key error:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete API key');
    }
  };

  const toggleKeyVisibility = async (id: string) => {
    const newVisibility = !showKey[id];
    setShowKey(prev => ({ ...prev, [id]: newVisibility }));

    // If showing the key and we don't have it cached, set loading state
    if (newVisibility && !storedKeys[id]) {
      setLoadingKeys(prev => ({ ...prev, [id]: true }));
      try {
        const response = await fetch(`/api/v1/keys/${id}/decrypt`);
        if (response.ok) {
          const data = await response.json();
          setStoredKeys(prev => ({ ...prev, [id]: data.key }));
        }
      } catch (error) {
        console.error('Failed to decrypt API key:', error);
      } finally {
        setLoadingKeys(prev => ({ ...prev, [id]: false }));
      }
    }
  };

  const copyToClipboard = async (text: string, isApiKey: boolean = false) => {
    try {
      await navigator.clipboard.writeText(text);
      // Track API key copy event if it's an API key
      if (isApiKey) {
        trackApiKeyCopied();
      }
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const handleCopyKey = async (keyId: string) => {
    // If key is not visible, fetch it and copy the actual key
    if (!showKey[keyId] && !storedKeys[keyId] && !loadingKeys[keyId]) {
      try {
        setLoadingKeys(prev => ({ ...prev, [keyId]: true }));
        const response = await fetch(`/api/v1/keys/${keyId}/decrypt`);
        if (response.ok) {
          const data = await response.json();
          // Cache the key temporarily
          setStoredKeys(prev => ({ ...prev, [keyId]: data.key }));
          // Copy the actual key
          await copyToClipboard(data.key, true);
        } else {
          // Fallback to displaying current state
          await copyToClipboard(getDisplayedKey(keyId), true);
        }
      } catch (error) {
        console.error('Failed to decrypt API key for copy:', error);
        await copyToClipboard(getDisplayedKey(keyId), true);
      } finally {
        setLoadingKeys(prev => ({ ...prev, [keyId]: false }));
      }
    } else {
      // Key is already available or cached
      const actualKey = storedKeys[keyId] || getDisplayedKey(keyId);
      await copyToClipboard(actualKey, true);
    }
  };

  const maskApiKey = (key: string) => {
    return key.substring(0, 4) + '•'.repeat(key.length - 8) + key.substring(key.length - 4);
  };

  // Get displayed key text based on current state
  const getDisplayedKey = (keyId: string) => {
    if (loadingKeys[keyId]) {
      return 'Loading...';
    }

    if (showKey[keyId] && storedKeys[keyId]) {
      // Show the cached key when visible
      return storedKeys[keyId];
    }

    // Show minimal when hidden: first 4 and last 4
    return `lj_live_${'*'.repeat(32)}`;
  };

  const formatApiKey = () => {
    if (!newlyCreatedKey) return '';
    return newlyCreatedKey.key.substring(0, 12) + '•'.repeat(20) + newlyCreatedKey.key.substring(newlyCreatedKey.key.length - 4);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Update sidebar config to mark current page as active
  const sidebarConfig = {
    ...settingsSidebarConfig,
    menuItems: settingsSidebarConfig.menuItems.map(item => ({
      ...item,
      active: item.path === '/settings/api-keys'
    }))
  };

  return (
    <SidebarLayout config={sidebarConfig}>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">API Keys</h1>
          <p className="text-muted-foreground">
            Manage your API keys for accessing leak monitoring services
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Create API Key Success Dialog */}
        {newlyCreatedKey && (
          <Dialog open={true} onOpenChange={() => setNewlyCreatedKey(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>API Key Created Successfully!</DialogTitle>
                <DialogDescription>
                  Your new API key has been created. Copy it now as it won't be shown again.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <div className="p-3 bg-gray-50 rounded border font-mono text-sm break-all">
                    {newlyCreatedKey.key}
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={() => copyToClipboard(newlyCreatedKey.key, true)}
                      className="flex items-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy Key
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p><strong>Name:</strong> {newlyCreatedKey.name}</p>
                  <p><strong>Created:</strong> {formatDate(newlyCreatedKey.created_at)}</p>
                  {newlyCreatedKey.expires_at && (
                    <p><strong>Expires:</strong> {formatDate(newlyCreatedKey.expires_at)}</p>
                  )}
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => setNewlyCreatedKey(null)}>
                    I've saved the key
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        <Card className="rounded-none">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Your API Keys</CardTitle>
                <CardDescription>
                  Create and manage API keys to integrate with your applications
                </CardDescription>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Key
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New API Key</DialogTitle>
                    <DialogDescription>
                      Give your API key a name to identify it later
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="key-name">Key Name</Label>
                      <Input
                        id="key-name"
                        placeholder="e.g., Production API"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        disabled={isCreating}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsCreateDialogOpen(false);
                          setNewKeyName('');
                          setError(null);
                        }}
                        disabled={isCreating}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreateKey}
                        disabled={!newKeyName.trim() || isCreating}
                      >
                        {isCreating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        {isCreating ? 'Creating...' : 'Create Key'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : apiKeys.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Plus className="h-12 w-12 mx-auto" />
                </div>
                <p className="text-gray-500">No API keys found</p>
                <p className="text-gray-400 text-sm mt-2">
                  Create your first API key to get started
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>API Key</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((apiKey) => (
                    <TableRow key={apiKey.id}>
                      <TableCell className="font-medium">{apiKey.name}</TableCell>
                      <TableCell className="font-mono text-sm">
                        <div className="flex items-center gap-2">
                          <span className="break-all">
                            {getDisplayedKey(apiKey.id)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleKeyVisibility(apiKey.id)}
                            className="h-6 w-6 p-0"
                            title={
                              loadingKeys[apiKey.id]
                                ? "Loading API key..."
                                : (showKey[apiKey.id] ? "Hide API key" : "Show full API key")
                            }
                            disabled={loadingKeys[apiKey.id]}
                          >
                            {loadingKeys[apiKey.id] ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : showKey[apiKey.id] ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={apiKey.is_active ? 'default' : 'secondary'}>
                          {apiKey.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(apiKey.created_at)}</TableCell>
                      <TableCell>
                        {apiKey.last_used ? formatDate(apiKey.last_used) : 'Never'}
                      </TableCell>
                      <TableCell>
                        {apiKey.expires_at ? formatDate(apiKey.expires_at) : 'Never'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyKey(apiKey.id)}
                            className="h-6 w-6 p-0"
                            title="Copy API key (will decrypt if needed)"
                            disabled={loadingKeys[apiKey.id]}
                          >
                            {loadingKeys[apiKey.id] ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteKey(apiKey.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* TODO: Uncomment when usage tracking is implemented
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle>Usage & Limits</CardTitle>
            <CardDescription>
              Monitor your API usage and rate limits
            </CardDescription>
          </CardHeader>
          <CardContent>
            {usageStats ? (
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Requests Today</p>
                  <p className="text-2xl font-bold">{usageStats.daily.requests.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">of {usageStats.daily.limit.toLocaleString()}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(usageStats.daily.percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">{usageStats.monthly.requests.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">of {usageStats.monthly.limit.toLocaleString()}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(usageStats.monthly.percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Rate Limit</p>
                  <p className="text-2xl font-bold">{usageStats.rate_limit.per_minute}</p>
                  <p className="text-xs text-muted-foreground">requests/minute</p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
          </CardContent>
        </Card>
        */}
      </div>
    </SidebarLayout>
  );
}