'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Copy, Eye, EyeOff, Key, Clock, Activity } from 'lucide-react';

export default function ApiSettingsPage() {
  const [apiKeys, setApiKeys] = useState([
    {
      id: '1',
      name: 'Production API Key',
      key: 'lj_live_1234567890abcdef1234567890abcdef',
      createdAt: '2024-01-15',
      lastUsed: '2024-09-14',
      requests: 1250
    },
    {
      id: '2', 
      name: 'Development API Key',
      key: 'lj_test_abcdef1234567890abcdef1234567890',
      createdAt: '2024-02-01',
      lastUsed: '2024-09-13',
      requests: 89
    }
  ]);

  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [newKeyName, setNewKeyName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // TODO: Show toast notification
  };

  const maskKey = (key: string) => {
    return key.substring(0, 12) + '•'.repeat(20) + key.substring(key.length - 8);
  };

  const handleCreateKey = async () => {
    if (!newKeyName) return;
    
    setIsCreating(true);
    // TODO: API call to create new key
    const newKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `lj_live_${Math.random().toString(36).substr(2, 32)}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      requests: 0
    };
    
    setApiKeys([newKey, ...apiKeys]);
    setNewKeyName('');
    setIsCreating(false);
  };

  const handleDeleteKey = (keyId: string) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) return;
    setApiKeys(apiKeys.filter(key => key.id !== keyId));
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">API Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your API keys and access tokens
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New API Key</CardTitle>
            <CardDescription>
              Generate a new API key to access LeakJar services programmatically
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="keyName">Key Name</Label>
                <Input
                  id="keyName"
                  placeholder="e.g., Production API Key"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleCreateKey} disabled={isCreating || !newKeyName}>
                  <Plus className="h-4 w-4 mr-2" />
                  {isCreating ? 'Creating...' : 'Create Key'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>
              Your active API keys and usage statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            {apiKeys.length === 0 ? (
              <div className="text-center py-12">
                <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No API keys found</p>
                <p className="text-gray-400 text-sm mt-2">
                  Create your first API key to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {apiKeys.map((apiKey) => (
                  <div
                    key={apiKey.id}
                    className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {apiKey.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Created {apiKey.createdAt}
                          </span>
                          <span className="flex items-center gap-1">
                            <Activity className="h-3 w-3" />
                            Last used {apiKey.lastUsed}
                          </span>
                          <span>{apiKey.requests.toLocaleString()} requests</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteKey(apiKey.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 p-3 rounded border">
                      <code className="flex-1 text-sm font-mono">
                        {showKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                        className="p-1 h-auto"
                      >
                        {showKeys[apiKey.id] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(apiKey.key)}
                        className="p-1 h-auto"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>API Usage Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <p>
              • Keep your API keys secure and never expose them in client-side code
            </p>
            <p>
              • Rate limits apply: 1000 requests per hour for free accounts, 10,000 for pro accounts
            </p>
            <p>
              • Use appropriate HTTP headers and follow our API documentation
            </p>
            <p>
              • Monitor your usage to avoid hitting rate limits
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}