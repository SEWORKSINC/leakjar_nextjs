'use client';

import { useState, useEffect } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
  ColumnResizeMode,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { CellInspector } from './cell-inspector';
import { BrowserIcon } from './browser-icon';
import { CountryFlag } from './country-flag';
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/session';

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
  protocol: string;
}

interface DataGridProps {
  domain?: string;
  domainType?: string;
  isDebugMode?: boolean; // Add flag to distinguish debug mode from domain-specific views
  showDebug?: boolean; // Control debug visibility
  onError?: (error: string | null) => void; // Callback to handle errors
  onRestrictedAccess?: (isRestricted: boolean) => void; // Callback when access is restricted
}

export function ResizableDataGrid({ domain: initialDomain, domainType: initialDomainType, isDebugMode = false, showDebug: externalShowDebug, onError, onRestrictedAccess }: DataGridProps = {}) {
  const [data, setData] = useState<LeakData[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  const [total, setTotal] = useState(0);
  const [domain, setDomain] = useState(initialDomain || '');
  const [sortBy, setSortBy] = useState('date_collected');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [columnResizeMode] = useState<ColumnResizeMode>('onChange');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState(isDebugMode ? 'domain' : 'user_name');
  // Input states for search (not triggering search)
  const [searchInput, setSearchInput] = useState('');
  const [searchFieldInput, setSearchFieldInput] = useState(isDebugMode ? 'domain' : 'user_name');
  // Multiple search filters
  const [searchFilters, setSearchFilters] = useState<Array<{field: string, query: string}>>([]);
  const [searchFilterInputs, setSearchFilterInputs] = useState<Array<{field: string, query: string}>>([]);
  const [selectedCell, setSelectedCell] = useState<{
    data: LeakData;
    columnKey: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRestricted, setIsRestricted] = useState(false);
  const limit = 30;

  const fetchData = async () => {
    setLoading(true);
    setHasSearched(true);
    setError(null); // Reset error state

    try {
      // Get current user session for authentication
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        console.error('No authentication session found');
        const errorMsg = 'Authentication required. Please log in.';
        setError(errorMsg);
        onError?.(errorMsg);
        setData([]);
        setTotal(0);
        setTotalPages(1);
        return;
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
      });

      if (domain) {
        params.append('domain', domain);
        console.log(`🎯 Adding domain filter: ${domain}`);
      } else {
        console.log(`🚫 No domain filter (domain prop is: ${domain})`);
      }

      // Add current search
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
        params.append('searchField', searchField);
        console.log(`🔍 Adding search filter: ${searchQuery.trim()} in field: ${searchField}`);
      }

      // Add additional search filters (only if they have actual query values)
      searchFilters.forEach((filter, index) => {
        if (filter.query && filter.query.trim()) {
          params.append(`search${index + 1}`, filter.query.trim());
          params.append(`searchField${index + 1}`, filter.field);
          console.log(`🔍 Adding additional filter ${index + 1}: ${filter.query.trim()} in field: ${filter.field}`);
        }
      });

      if (initialDomainType) {
        params.append('domainType', initialDomainType);
        console.log(`🎯 Adding domainType: ${initialDomainType}`);
      }

      const response = await fetch(`/api/leaks?${params}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) {
        const errorMsg = response.status === 403
          ? `Access denied: You don't have permission to view data for "${domain}". This domain is not registered under your account.`
          : response.status === 401
          ? 'Authentication failed. Please log in again.'
          : `HTTP ${response.status}: ${response.statusText}`;

        setError(errorMsg);
        onError?.(errorMsg);
        setData([]);
        setTotal(0);
        setTotalPages(1);
        return;
      }

      const result = await response.json();

      if (result.data) {
        setData(result.data);
        setTotalPages(result.pagination.totalPages);
        setTotal(result.pagination.total);
        // Clear any previous errors on success
        onError?.(null);

        // Handle restricted access
        if (result.restrictedAccess) {
          setIsRestricted(true);
          setPage(1); // Force to first page
          onRestrictedAccess?.(true);
        } else {
          setIsRestricted(false);
          onRestrictedAccess?.(false);
        }
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      const errorMsg = 'Failed to load data. Please try again.';
      setError(errorMsg);
      onError?.(errorMsg);
      setData([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, sortBy, sortOrder, domain, searchQuery, searchField, searchFilters]);

  // Update domain state when prop changes
  useEffect(() => {
    if (initialDomain !== domain) {
      setDomain(initialDomain || '');
      setPage(1); // Reset to first page when domain changes
    }
  }, [initialDomain]);

  // In non-debug mode, prevent domain changes via search
  useEffect(() => {
    if (!isDebugMode && initialDomain) {
      setDomain(initialDomain);
    }
  }, [initialDomain, isDebugMode]);

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

  const executeSearch = () => {
    // Update state - the useEffect will trigger fetchData automatically
    setSearchQuery(searchInput);
    setSearchField(searchFieldInput);
    setSearchFilters(searchFilterInputs);
    setPage(1);
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return `${date.getFullYear().toString().slice(-2)}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
    } catch {
      return dateStr;
    }
  };

  const baseColumns: ColumnDef<LeakData>[] = [
    {
      accessorKey: 'date_collected',
      header: () => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleSort('date_collected')}
          className="h-8 p-0 hover:bg-transparent"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-mono text-sm truncate" title={formatDate(row.getValue('date_collected'))}>
          {formatDate(row.getValue('date_collected'))}
        </div>
      ),
      size: 32,
      minSize: 28,
      maxSize: 40,
    },
    {
      accessorKey: 'ip',
      header: 'IP',
      cell: ({ row }) => (
        <div className="font-mono text-sm truncate" title={row.getValue('ip')}>
          {row.getValue('ip')}
        </div>
      ),
      size: 55,
      minSize: 45,
      maxSize: 70,
    },
    {
      accessorKey: 'country',
      header: 'Country',
      cell: ({ row }) => (
        <CountryFlag countryCode={row.getValue('country')} />
      ),
      size: 30,
      minSize: 24,
      maxSize: 42,
    },
    {
      accessorKey: 'pc_name',
      header: 'PC Name',
      cell: ({ row }) => (
        <div className="font-mono text-sm truncate" title={row.getValue('pc_name')}>
          {row.getValue('pc_name')}
        </div>
      ),
      size: 50,
      minSize: 35,
      maxSize: 70,
    },
    {
      accessorKey: 'url',
      header: 'URL',
      cell: ({ row }) => (
        <div className="font-mono text-sm truncate" title={row.getValue('url')}>
          {row.getValue('url')}
        </div>
      ),
      size: 200,
      minSize: 100,
      maxSize: 400,
    },
    {
      accessorKey: 'user_name',
      header: 'User Name',
      cell: ({ row }) => (
        <div className="font-mono text-sm truncate" title={row.getValue('user_name')}>
          {row.getValue('user_name')}
        </div>
      ),
      size: 36,
      minSize: 24,
      maxSize: 60,
    },
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => (
        <div className="font-mono text-sm truncate" title={row.getValue('id')}>
          {row.getValue('id')}
        </div>
      ),
      size: 80,
      minSize: 56,
      maxSize: 160,
    },
    {
      accessorKey: 'pw',
      header: 'Password',
      cell: ({ row }) => (
        <div className="font-mono text-sm">
          {row.getValue('pw') ? '••••••••' : ''}
        </div>
      ),
      size: 40,
      minSize: 30,
      maxSize: 50,
    },
    {
      accessorKey: 'browser',
      header: 'Browser',
      cell: ({ row }) => (
        <BrowserIcon browserName={row.getValue('browser')} />
      ),
      size: 25,
      minSize: 20,
      maxSize: 40,
    },
    {
      accessorKey: 'protocol',
      header: 'Protocol',
      cell: ({ row }) => {
        const protocol = row.getValue('protocol') as string;
        return (
          <span className={`px-2 py-1 rounded-full font-mono text-sm inline-block ${
            protocol === 'android' ? 'bg-gray-100 text-gray-700' :
            protocol === 'ios' ? 'bg-gray-200 text-gray-700' :
            'bg-gray-100 text-gray-800'
          }`}>
            {protocol}
          </span>
        );
      },
      size: 35,
      minSize: 30,
      maxSize: 50,
    },
  ];

  const debugColumns: ColumnDef<LeakData>[] = [
    {
      accessorKey: 'main_domain',
      header: () => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleSort('main_domain')}
          className="h-8 p-0 hover:bg-transparent"
        >
          Main Domain
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-mono text-sm truncate" title={row.getValue('main_domain')}>
          {row.getValue('main_domain')}
        </div>
      ),
      size: 60,
      minSize: 40,
      maxSize: 100,
    },
    {
      accessorKey: 'main_email',
      header: 'Main Email',
      cell: ({ row }) => (
        <div className="font-mono text-sm truncate" title={row.getValue('main_email')}>
          {row.getValue('main_email')}
        </div>
      ),
      size: 50,
      minSize: 33,
      maxSize: 83,
    },
  ];

  const columns = externalShowDebug ? [...baseColumns, ...debugColumns] : baseColumns;

  const table = useReactTable({
    data,
    columns,
    columnResizeMode,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        {/* Show domain info for non-debug mode */}
        {!isDebugMode && (
          <div className="text-sm text-muted-foreground">
            {initialDomain ? (
              <span>Showing data for: <strong>{initialDomain}</strong></span>
            ) : (
              <span>Domain-specific view</span>
            )}
          </div>
        )}

        <div className={`flex flex-col gap-2 ${isDebugMode ? 'w-full' : ''}`}>
          {/* Search Boxes Container - Horizontal Layout */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {/* Main Search Box */}
            <div className="flex items-center gap-2">
              <Select value={searchFieldInput} onValueChange={setSearchFieldInput}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {isDebugMode && <SelectItem value="domain">Domain</SelectItem>}
                  <SelectItem value="user_name">User Name</SelectItem>
                  <SelectItem value="id">ID</SelectItem>
                  <SelectItem value="url">URL</SelectItem>
                  <SelectItem value="ip">IP</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="text"
                placeholder={searchFieldInput === 'domain' ? "Search domain (e.g., google.com)" :
                            searchFieldInput === 'user_name' ? "Search user name" :
                            searchFieldInput === 'id' ? "Search ID" :
                            searchFieldInput === 'url' ? "Search URL" :
                            searchFieldInput === 'ip' ? "Search IP" : "Search"}
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    executeSearch();
                  }
                }}
                className="w-64"
              />
            </div>

            {/* Additional Search Filters - Horizontal */}
            {searchFilterInputs.map((filter, index) => (
              <div key={index} className="flex items-center gap-2">
                <Select
                  value={filter.field}
                  onValueChange={(value) => {
                    const newFilters = [...searchFilterInputs];
                    newFilters[index].field = value;
                    setSearchFilterInputs(newFilters);
                  }}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {isDebugMode && <SelectItem value="domain">Domain</SelectItem>}
                    <SelectItem value="user_name">User Name</SelectItem>
                    <SelectItem value="id">ID</SelectItem>
                    <SelectItem value="url">URL</SelectItem>
                    <SelectItem value="ip">IP</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="text"
                  placeholder={filter.field === 'domain' ? "Search domain (e.g., google.com)" :
                              filter.field === 'user_name' ? "Search user name" :
                              filter.field === 'id' ? "Search ID" :
                              filter.field === 'url' ? "Search URL" :
                              filter.field === 'ip' ? "Search IP" : "Search"}
                  value={filter.query}
                  onChange={(e) => {
                    const newFilters = [...searchFilterInputs];
                    newFilters[index].query = e.target.value;
                    setSearchFilterInputs(newFilters);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      executeSearch();
                    }
                  }}
                  className="w-64"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const newFilters = searchFilterInputs.filter((_, i) => i !== index);
                    setSearchFilterInputs(newFilters);
                  }}
                  className="px-2 text-red-500 hover:text-red-700 bg-gray-50 dark:bg-gray-900"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
            ))}

            {/* Plus Button and Search Button at the end */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSearchFilterInputs([...searchFilterInputs, { field: isDebugMode ? 'domain' : 'user_name', query: '' }]);
                }}
                className="px-2 bg-gray-50 dark:bg-gray-900"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </Button>
              <Button
                size="sm"
                variant="default"
                onClick={executeSearch}
                disabled={isRestricted}
              >
                {isRestricted ? "Search Disabled" : "Search"}
              </Button>
            </div>
          </div>

        </div>
      </div>

      <div className="relative flex">
        <div className={`border transition-all duration-300 ${
          selectedCell ? 'w-[calc(100%-24rem)]' : 'w-full'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ tableLayout: 'fixed' }}>
              <thead className="bg-muted/50">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        className="group relative px-2 py-1 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider border-r last:border-r-0"
                        style={{ width: header.getSize() }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {header.column.getCanResize() && (
                          <div
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                            className="absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none opacity-0 hover:opacity-100 hover:bg-blue-500 group-hover:opacity-100 group-hover:bg-gray-300"
                            style={{
                              transform: header.column.getIsResizing()
                                ? 'scaleX(2)'
                                : '',
                            }}
                          />
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin h-6 w-6 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
                        <span className="text-gray-600">Loading data...</span>
                      </div>
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-8">
                      {!hasSearched ? (
                        <span className="text-gray-500">Enter search criteria to view data</span>
                      ) : (
                        <span className="text-gray-600">No data found</span>
                      )}
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map(row => (
                    <tr key={row.id} className="hover:bg-muted/50">
                      {row.getVisibleCells().map(cell => (
                        <td
                          key={cell.id}
                          className="px-2 py-1 text-sm border-r last:border-r-0 cursor-pointer"
                          style={{ 
                            width: cell.column.getSize(),
                            maxWidth: cell.column.getSize(),
                          }}
                          onDoubleClick={() => {
                            setSelectedCell({
                              data: row.original,
                              columnKey: cell.column.id
                            });
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {selectedCell && (
          <CellInspector
            data={selectedCell.data}
            columnKey={selectedCell.columnKey}
            onClose={() => setSelectedCell(null)}
            showDebug={externalShowDebug}
          />
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Total: {total.toLocaleString()} records • Page {page} of {totalPages}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || loading || isRestricted}
            title={isRestricted ? "Pagination disabled for unverified domains" : ""}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading || isRestricted}
            title={isRestricted ? "Pagination disabled for unverified domains" : ""}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}