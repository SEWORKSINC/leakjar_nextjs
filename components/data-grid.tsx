'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';

interface LeakData {
  date_collected: string;
  ip: string;
  country: string;
  pc_name: string;
  user_name: string;
  url: string;
  id: string;
  pw: string;
  browser: string;
  main_domain: string;
  main_email: string;
  type: string;
}

interface DataGridProps {
  domain?: string;
}

export function DataGrid({ domain: initialDomain }: DataGridProps = {}) {
  const [data, setData] = useState<LeakData[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [domain, setDomain] = useState(initialDomain || '');
  const [sortBy, setSortBy] = useState('date_collected');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const limit = 50;

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
      });
      
      if (domain) {
        params.append('domain', domain);
      }
      
      const response = await fetch(`/api/leaks?${params}`);
      const result = await response.json();
      
      if (result.data) {
        setData(result.data);
        setTotalPages(result.pagination.totalPages);
        setTotal(result.pagination.total);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, sortBy, sortOrder]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(column);
      setSortOrder('DESC');
    }
    setPage(1);
  };

  const handleDomainSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return dateStr;
    }
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <form onSubmit={handleDomainSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Filter by domain (e.g., google.com)"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="w-64"
          />
          <Button type="submit">Search</Button>
        </form>
        
        <div className="text-sm text-muted-foreground">
          Total: {total.toLocaleString()} records
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('date_collected')}
                  className="h-8 p-0"
                >
                  Date Collected
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>IP</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>PC Name</TableHead>
              <TableHead>User Name</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Password</TableHead>
              <TableHead>Browser</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('main_domain')}
                  className="h-8 p-0"
                >
                  Main Domain
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Main Email</TableHead>
              <TableHead>Protocol</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={12} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} className="text-center py-8">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono text-xs">
                    {formatDate(row.date_collected)}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{row.ip}</TableCell>
                  <TableCell>{row.country}</TableCell>
                  <TableCell className="max-w-[150px]" title={row.pc_name}>
                    {truncateText(row.pc_name, 20)}
                  </TableCell>
                  <TableCell className="max-w-[150px]" title={row.user_name}>
                    {truncateText(row.user_name, 20)}
                  </TableCell>
                  <TableCell className="max-w-[200px]" title={row.url}>
                    {truncateText(row.url, 30)}
                  </TableCell>
                  <TableCell className="max-w-[200px]" title={row.id}>
                    {truncateText(row.id, 30)}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {row.pw ? '••••••••' : ''}
                  </TableCell>
                  <TableCell className="max-w-[150px]" title={row.browser}>
                    {truncateText(row.browser, 20)}
                  </TableCell>
                  <TableCell>{row.main_domain}</TableCell>
                  <TableCell>{row.main_email}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      row.protocol === 'android' ? 'bg-gray-100 text-gray-700' :
                      row.protocol === 'ios' ? 'bg-gray-200 text-gray-700' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {row.protocol}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}