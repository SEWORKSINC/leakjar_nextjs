'use client';

import { useState } from 'react';
import { SidebarLayout } from '@/components/sidebar-layout';
import { settingsSidebarConfig } from '@/lib/sidebar-configs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Copy, Eye, EyeOff, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
  status: 'active' | 'inactive';
}

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Production API',
      key: 'api_key_placeholder_xxxxxxxxxxxxxxxx',
      createdAt: '2024-01-15',
      lastUsed: '2024-01-20',
      status: 'active'
    }
  ]);
  const [showKey, setShowKey] = useState<{ [key: string]: boolean }>({});
  const [newKeyName, setNewKeyName] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const generateApiKey = () => {
    const prefix = 'sk_live_';
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let key = prefix;
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  };

  const handleCreateKey = () => {
    if (!newKeyName.trim()) return;

    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: generateApiKey(),
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    setApiKeys([...apiKeys, newKey]);
    setNewKeyName('');
    setIsCreateDialogOpen(false);
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
  };

  const toggleKeyVisibility = (id: string) => {
    setShowKey(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const maskApiKey = (key: string) => {
    return key.substring(0, 10) + '•'.repeat(20) + key.substring(key.length - 4);
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
                  <Button>Create New Key</Button>
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
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsCreateDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleCreateKey}>
                        Create Key
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>API Key</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((apiKey) => (
                  <TableRow key={apiKey.id}>
                    <TableCell className="font-medium">{apiKey.name}</TableCell>
                    <TableCell className="font-mono text-sm">
                      <div className="flex items-center space-x-2">
                        <span>
                          {showKey[apiKey.id] ? apiKey.key : maskApiKey(apiKey.key)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                        >
                          {showKey[apiKey.id] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(apiKey.key)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={apiKey.status === 'active' ? 'default' : 'secondary'}>
                        {apiKey.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{apiKey.createdAt}</TableCell>
                    <TableCell>{apiKey.lastUsed || 'Never'}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteKey(apiKey.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="rounded-none">
          <CardHeader>
            <CardTitle>Usage & Limits</CardTitle>
            <CardDescription>
              Monitor your API usage and rate limits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Requests Today</p>
                <p className="text-2xl font-bold">1,234</p>
                <p className="text-xs text-muted-foreground">of 10,000</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">45,678</p>
                <p className="text-xs text-muted-foreground">of 300,000</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Rate Limit</p>
                <p className="text-2xl font-bold">100</p>
                <p className="text-xs text-muted-foreground">requests/minute</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
}