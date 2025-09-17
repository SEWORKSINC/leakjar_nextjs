'use client';

import { useState, useEffect } from 'react';
import { ResizableDataGrid } from './resizable-data-grid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Globe, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Domain {
  id: string;
  domain: string;
  type: string;
  description?: string;
  companyName?: string;
  createdAt: string;
}

interface DomainFilteredGridProps {
  domain?: string;
  domainType?: string;
}

export function DomainFilteredGrid({ domain, domainType }: DomainFilteredGridProps) {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>(domain || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserDomains();
  }, []);

  const fetchUserDomains = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        // For development, fetch without authentication
        const response = await fetch('/api/domains');
        if (response.ok) {
          const data = await response.json();
          setDomains(data.domains || []);
          if (data.domains && data.domains.length > 0) {
            setSelectedDomain(data.domains[0].domain);
          }
        }
      } else {
        // Fetch with authentication
        const response = await fetch('/api/domains', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setDomains(data.domains || []);
          if (data.domains && data.domains.length > 0) {
            setSelectedDomain(data.domains[0].domain);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching domains:', err);
      setError('Failed to load domains');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            Error Loading Domains
          </CardTitle>
          <CardDescription className="text-red-600">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (domains.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Domains Registered</CardTitle>
          <CardDescription>
            You haven't registered any domains yet. Go to Settings → Domain Settings to add your domains.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Monitor Your Domains
          </CardTitle>
          <CardDescription>
            View leaked data for your registered domains
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <label className="text-sm font-medium">Select Domain:</label>
            <Select value={selectedDomain} onValueChange={setSelectedDomain}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Choose a domain" />
              </SelectTrigger>
              <SelectContent>
                {domains.map((domain) => (
                  <SelectItem key={domain.id} value={domain.domain}>
                    <div className="flex items-center gap-2">
                      <span>{domain.domain}</span>
                      <Badge variant={domain.type === 'URL' ? 'default' : 'secondary'} className="text-xs">
                        {domain.type}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedDomain && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="text-sm">
                <span className="font-medium">Currently viewing:</span> {selectedDomain}
                {domains.find(d => d.domain === selectedDomain)?.companyName && (
                  <span className="ml-2 text-gray-600">
                    ({domains.find(d => d.domain === selectedDomain)?.companyName})
                  </span>
                )}
              </div>
              {domains.find(d => d.domain === selectedDomain)?.description && (
                <div className="text-xs text-gray-600 mt-1">
                  {domains.find(d => d.domain === selectedDomain)?.description}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedDomain && (
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Leaked Data for {selectedDomain}
          </h2>
          <ResizableDataGrid domain={selectedDomain} />
        </div>
      )}
    </div>
  );
}