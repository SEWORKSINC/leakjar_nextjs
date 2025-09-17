'use client';

import { useState, useEffect } from 'react';
import { ResizableDataGrid } from '@/components/resizable-data-grid';
import { DomainFilteredGrid } from '@/components/domain-filtered-grid';
import { DynamicSidebarLayout } from '@/components/dynamic-sidebar-layout';
import { mainSidebarConfig } from '@/lib/sidebar-configs';
import { DomainChart } from '@/components/domain-chart';
import { BrowserChart } from '@/components/browser-chart';
// import { WorldHeatmap } from '@/components/world-heatmap';
import { CountryFlag, countryNameMap } from '@/components/country-flag';
import { getSession, refreshSession } from '@/lib/session';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [domains, setDomains] = useState<any[]>([]);
  const [domainStats, setDomainStats] = useState<any>({});
  const [loadingStats, setLoadingStats] = useState(false);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [urlBreaches, setUrlBreaches] = useState<number>(0);
  const [emailBreaches, setEmailBreaches] = useState<number>(0);
  const [monthlyIncrease, setMonthlyIncrease] = useState<number>(0);
  const [browserStats, setBrowserStats] = useState<any[]>([]);
  const [loadingBrowserStats, setLoadingBrowserStats] = useState(false);
  const [countryStats, setCountryStats] = useState<any[]>([]);
  const [loadingCountryStats, setLoadingCountryStats] = useState(false);
  const [domainsLoaded, setDomainsLoaded] = useState(false);

  // Check and refresh session on mount
  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (!session) {
        // 세션이 없으면 조용히 리프레시 시도
        await refreshSession();
      }
    };
    checkSession();
  }, []);

  // Fetch stats for all domains when domains change
  useEffect(() => {
    if (selectedMenu === 'dashboard') {
      if (domains.length > 0) {
        fetchAllDomainStats();
        fetchBrowserStats();
        fetchCountryStats();
      }
    }
  }, [domains, selectedMenu]);

  // Calculate Total Breaches when domain stats update
  useEffect(() => {
    if (selectedMenu === 'dashboard' && Object.keys(domainStats).length > 0) {
      fetchTotalRecords();
    }
  }, [domainStats, selectedMenu]);

  const fetchCountryStats = async () => {
    setLoadingCountryStats(true);
    try {
      let session = await getSession();
      if (!session) {
        session = await refreshSession();
        if (!session) {
          // 로그인하지 않은 상태 - 정상적인 상황
          return;
        }
      }

      const response = await fetch('/api/country-stats', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Country stats:', data);
        setCountryStats(data.countryStats || []);
      }
    } catch (error) {
      console.error('Error fetching country stats:', error);
    } finally {
      setLoadingCountryStats(false);
    }
  };

  const fetchBrowserStats = async () => {
    setLoadingBrowserStats(true);
    try {
      let session = await getSession();
      if (!session) {
        session = await refreshSession();
        if (!session) {
          // 로그인하지 않은 상태 - 정상적인 상황
          return;
        }
      }

      const response = await fetch('/api/browser-stats', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Browser stats:', data);
        setBrowserStats(data.browserStats || []);
      }
    } catch (error) {
      console.error('Error fetching browser stats:', error);
    } finally {
      setLoadingBrowserStats(false);
    }
  };

  const fetchTotalRecords = async () => {
    // Calculate total from user's registered domains
    let userDomainsTotal = 0;
    let urlDomainsTotal = 0;
    let emailDomainsTotal = 0;
    let currentMonthTotal = 0;

    // 현재 연월 (YYYYMM 형식)
    const now = new Date();
    const currentYearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;

    // domains 배열에서 URL과 EMAIL 도메인 분리
    const urlDomains = domains.filter(d => d.type === 'URL').map(d => d.domain);
    const emailDomains = domains.filter(d => d.type === 'EMAIL').map(d => d.domain);

    Object.entries(domainStats).forEach(([key, stats]: [string, any]) => {
      if (stats?.total) {
        const total = parseInt(stats.total) || 0;
        userDomainsTotal += total;

        // URL/EMAIL 구분
        const [domain, type] = key.split('-');
        if (type === 'URL') {
          urlDomainsTotal += total;
        } else if (type === 'EMAIL') {
          emailDomainsTotal += total;
        }
      }

      // 현재 월의 데이터 찾기
      if (stats?.monthlyData && stats.monthlyData.length > 0) {
        const currentMonthData = stats.monthlyData.find((m: any) => {
          // yearMonth 필드가 있으면 사용
          if (m.yearMonth) {
            return m.yearMonth === currentYearMonth;
          }
          return false;
        });

        if (currentMonthData) {
          currentMonthTotal += parseInt(currentMonthData.breaches) || 0;
        }
      }
    });

    setTotalRecords(userDomainsTotal);
    setUrlBreaches(urlDomainsTotal);
    setEmailBreaches(emailDomainsTotal);
    setMonthlyIncrease(currentMonthTotal);
  };

  const fetchAllDomainStats = async () => {
    setLoadingStats(true);
    setDomainStats({}); // Clear old stats first

    // 도메인이 없는 경우 즉시 0으로 설정
    if (!domains || domains.length === 0) {
      setTotalRecords(0);
      setUrlBreaches(0);
      setEmailBreaches(0);
      setMonthlyIncrease(0);
      setLoadingStats(false);
      return;
    }

    const stats: any = {};

    // MV API 사용 여부 확인 (환경변수나 설정으로 전환 가능)
    const useMaterializedView = true; // MV 사용 활성화
    const apiEndpoint = useMaterializedView ? '/api/domain-stats-mv' : '/api/domain-stats';

    // 병렬로 모든 도메인 통계 가져오기
    const promises = domains.map(async (domain) => {
      try {
        const response = await fetch(`${apiEndpoint}?domain=${encodeURIComponent(domain.domain)}&type=${domain.type}&t=${Date.now()}`);
        if (response.ok) {
          const data = await response.json();
          console.log(`Stats for ${domain.domain} (${domain.type}):`, data.total, '- Using MV:', useMaterializedView);
          return { key: `${domain.domain}-${domain.type}`, data };
        }
      } catch (error) {
        console.error(`Error fetching stats for ${domain.domain}:`, error);
      }
      return null;
    });

    const results = await Promise.all(promises);

    results.forEach(result => {
      if (result) {
        stats[result.key] = result.data;
      }
    });

    console.log('All stats (from MV):', stats);
    setDomainStats(stats);
    setLoadingStats(false);
  };

  const renderContent = () => {
    // Check if it's a domain-specific menu
    if (selectedMenu.startsWith('domain-')) {
      const domainName = selectedMenu.replace('domain-', '');
      // Find the domain type from the stored domains
      const selectedDomain = domains.find(d => d.domain === domainName);
      const domainType = selectedDomain?.type;

      return (
        <>
          <h1 className="text-2xl font-bold mb-6">Leaked Data for {domainName}</h1>
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 ">
            <p className="text-sm text-blue-800">
              📊 Showing leaked data filtered for {domainType?.toLowerCase()} domain: <strong>{domainName}</strong>
            </p>
          </div>
          <ResizableDataGrid domain={domainName} domainType={domainType} isDebugMode={false} />
        </>
      );
    }

    switch (selectedMenu) {
      case 'dashboard':
        return (
          <>
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Security Dashboard</h1>
                <p className="text-gray-500 mt-1">Monitor your organization's data breach exposure in real-time</p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-gray-500 to-gray-600 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-100 text-sm font-medium">Monitored Domains</p>
                      <p className="text-3xl font-bold mt-1">{domains.length || 0}</p>
                      <p className="text-gray-100 text-xs mt-2">{domains.filter(d => d.type === 'URL').length} URL • {domains.filter(d => d.type === 'EMAIL').length} Email</p>
                    </div>
                    <div className="bg-white/20 p-3 ">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-600 to-gray-700 p-6  text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-100 text-sm font-medium">Total Breaches</p>
                      <p className="text-3xl font-bold mt-1">
                        {loadingStats ? (
                          <span className="animate-pulse">Loading...</span>
                        ) : (
                          totalRecords.toLocaleString()
                        )}
                      </p>
                      <p className="text-gray-100 text-xs mt-2">
                        {monthlyIncrease > 0 ? (
                          <>↑ {monthlyIncrease.toLocaleString()} this month</>
                        ) : (
                          <span className="opacity-70">No new records this month</span>
                        )}
                      </p>
                    </div>
                    <div className="bg-white/20 p-3 ">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-6  text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-100 text-sm font-medium">URL Breaches</p>
                      <p className="text-3xl font-bold mt-1">
                        {loadingStats ? (
                          <span className="animate-pulse">Loading...</span>
                        ) : (
                          urlBreaches.toLocaleString()
                        )}
                      </p>
                      <p className="text-gray-100 text-xs mt-2">
                        {domains.filter(d => d.type === 'URL').length} domains monitored
                      </p>
                    </div>
                    <div className="bg-white/20 p-3 ">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-400 to-gray-500 p-6  text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-100 text-sm font-medium">Email Breaches</p>
                      <p className="text-3xl font-bold mt-1">
                        {loadingStats ? (
                          <span className="animate-pulse">Loading...</span>
                        ) : (
                          emailBreaches.toLocaleString()
                        )}
                      </p>
                      <p className="text-gray-100 text-xs mt-2">
                        {domains.filter(d => d.type === 'EMAIL').length} domains monitored
                      </p>
                    </div>
                    <div className="bg-white/20 p-3 ">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Domain Breach Charts - One per domain */}
              {domains.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {domains.map((domain, domainIdx) => {
                    const color = '#6B7280'; // 통일된 그레이 색상

                    const statsKey = `${domain.domain}-${domain.type}`;
                    const stats = domainStats[statsKey];
                    const isLoading = loadingStats && !stats;

                    // Use real data if available, otherwise show loading or sample data
                    const chartData = stats?.monthlyData || [
                      { month: 'Jan', breaches: 0 },
                      { month: 'Feb', breaches: 0 },
                      { month: 'Mar', breaches: 0 },
                      { month: 'Apr', breaches: 0 },
                      { month: 'May', breaches: 0 },
                      { month: 'Jun', breaches: 0 },
                      { month: 'Jul', breaches: 0 },
                      { month: 'Aug', breaches: 0 },
                      { month: 'Sep', breaches: 0 },
                      { month: 'Oct', breaches: 0 },
                      { month: 'Nov', breaches: 0 },
                      { month: 'Dec', breaches: 0 },
                    ];

                    const totalBreaches = stats?.total || (chartData.length > 0 ? chartData.reduce((sum: number, item: any) => sum + item.breaches, 0) : 0);
                    const maxMonth = chartData.length > 0 ? chartData.reduce((max: any, item: any) => item.breaches > max.breaches ? item : max) : { month: 'N/A', breaches: 0 };

                    // Use protocol distribution from stats
                    const protocolStats = stats?.protocolStats || {};

                    // 상위 5개 프로토콜 선택 (문자열을 숫자로 변환)
                    const sortedProtocols = Object.entries(protocolStats)
                      .filter(([_, count]: [string, any]) => parseInt(count) > 0)
                      .map(([protocol, count]: [string, any]) => [protocol, parseInt(count) || 0])
                      .sort(([_a, countA]: [string, any], [_b, countB]: [string, any]) => countB - countA)
                      .slice(0, 5);

                    const topProtocolsTotal = sortedProtocols.reduce((sum, [_, count]: [string, any]) => sum + count, 0);

                    // 색상 매핑 - 그레이 계열로 통일 (밝은 톤)
                    const protocolColors: { [key: string]: string } = {
                      https: 'bg-gray-600',
                      http: 'bg-gray-500',
                      android: 'bg-gray-400',
                      ios: 'bg-gray-500',
                      ftp: 'bg-gray-400',
                      mailbox: 'bg-gray-300',
                      chrome: 'bg-gray-400',
                      ssh: 'bg-gray-500',
                      rdp: 'bg-gray-400',
                      default: 'bg-gray-300'
                    };

                    return (
                      <div key={`breach-chart-${domain.domain}-${domainIdx}`}>
                        {isLoading ? (
                          <div className="bg-white border">
                            <div className="h-64 flex items-center justify-center">
                              <div className="text-center">
                                <div className="animate-spin h-8 w-8 border-b-2 border-gray-500 mx-auto mb-2"></div>
                                <p className="text-sm text-gray-500">Loading monitoring data for {domain.domain}...</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <>
                            <DomainChart
                              domain={domain.domain}
                              type={domain.type}
                              data={chartData}
                              color={color}
                              total={totalBreaches}
                            />

                            {/* Protocol Distribution Bar */}
                            <div className="bg-white p-4 border border-t-0">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-medium text-gray-700">Protocol Distribution</h4>
                                <span className="text-xs text-gray-500">{domain.domain}</span>
                              </div>

                          {/* Stacked Bar */}
                          <div className="relative h-8 bg-gray-100 overflow-hidden flex">
                            {sortedProtocols.map(([protocol, count]: [string, any], idx) => {
                              const percent = topProtocolsTotal > 0 ? Math.round((count / topProtocolsTotal) * 100) : 0;
                              const colorClass = protocolColors[protocol] || protocolColors.default;

                              return (
                                <div
                                  key={protocol}
                                  className={`${colorClass} hover:opacity-90 transition-opacity relative group`}
                                  style={{ width: `${percent}%` }}
                                >
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    {percent > 10 && (
                                      <span className="text-xs font-medium text-white opacity-90">
                                        {percent}%
                                      </span>
                                    )}
                                  </div>
                                  {/* Tooltip */}
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
                                    {protocol}: {count.toLocaleString()} ({percent}%)
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Legend */}
                          <div className="flex flex-wrap items-center gap-3 mt-3">
                            {sortedProtocols.map(([protocol, count]: [string, any]) => {
                              const colorClass = protocolColors[protocol] || protocolColors.default;
                              const percent = topProtocolsTotal > 0 ? ((count / topProtocolsTotal) * 100).toFixed(1) : 0;
                              return (
                                <div key={protocol} className="flex items-center gap-1.5">
                                  <div className={`w-3 h-3 ${colorClass}`}></div>
                                  <span className="text-xs text-gray-600">{protocol}</span>
                                  <span className="text-xs font-medium text-gray-700">
                                    {count.toLocaleString()} ({percent}%)
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"></div>
              )}

              {/* Browser Statistics */}
              {domains.length > 0 && (
                <div className="bg-white p-6 border">
                  <h3 className="text-lg font-semibold mb-4">Browser Distribution</h3>
                  {loadingBrowserStats ? (
                    <div className="h-64 bg-gray-50  flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin  h-8 w-8 border-b-2 border-gray-500 mx-auto mb-2"></div>
                        <p className="text-sm text-gray-500">Loading browser statistics...</p>
                      </div>
                    </div>
                  ) : browserStats.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <BrowserChart
                          data={browserStats}
                          colors={['#6B7280', '#9CA3AF', '#4B5563', '#374151', '#111827', '#D1D5DB', '#6B7280', '#9CA3AF']}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-x-12 gap-y-2 w-96 mx-auto">
                        {(() => {
                          const halfLength = Math.ceil(browserStats.length / 2);
                          const leftColumn = browserStats.slice(0, halfLength);
                          const rightColumn = browserStats.slice(halfLength);
                          const colors = ['#6B7280', '#9CA3AF', '#4B5563', '#374151', '#111827', '#D1D5DB', '#6B7280', '#9CA3AF'];

                          const items = [];
                          for (let i = 0; i < halfLength; i++) {
                            // Left column item
                            if (leftColumn[i]) {
                              items.push(
                                <div key={leftColumn[i].browser} className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400 w-3 text-right">{i + 1}</span>
                                    <div className="w-3 h-3  flex-shrink-0" style={{ backgroundColor: colors[i % colors.length] }}></div>
                                    <span className="font-medium text-xs">{leftColumn[i].browser}</span>
                                  </div>
                                  <span className="text-xs text-gray-600 tabular-nums">{leftColumn[i].count.toLocaleString()}</span>
                                </div>
                              );
                            }
                            // Right column item
                            if (rightColumn[i]) {
                              const rightIndex = halfLength + i;
                              items.push(
                                <div key={rightColumn[i].browser} className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400 w-3 text-right">{rightIndex + 1}</span>
                                    <div className="w-3 h-3  flex-shrink-0" style={{ backgroundColor: colors[rightIndex % colors.length] }}></div>
                                    <span className="font-medium text-xs">{rightColumn[i].browser}</span>
                                  </div>
                                  <span className="text-xs text-gray-600 tabular-nums">{rightColumn[i].count.toLocaleString()}</span>
                                </div>
                              );
                            }
                          }
                          return items;
                        })()}
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 bg-gray-50  flex items-center justify-center">
                      <p className="text-gray-500">No browser data available</p>
                    </div>
                  )}
                </div>
              )}

              {/* Country Heatmap */}
              {domains.length > 0 && (
                <div className="bg-white p-6 border">
                  <h3 className="text-lg font-semibold mb-4">Geographic Distribution</h3>
                  {loadingCountryStats ? (
                    <div className="h-64 bg-gray-50  flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin  h-8 w-8 border-b-2 border-gray-500 mx-auto mb-2"></div>
                        <p className="text-sm text-gray-500">Loading country statistics...</p>
                      </div>
                    </div>
                  ) : countryStats.length > 0 ? (
                    // <WorldHeatmap countryStats={countryStats} />
                    <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-14 xl:grid-cols-16 gap-1">
                      {countryStats.map((stat) => (
                        <div
                          key={stat.code}
                          className="relative group"
                        >
                          <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200  p-2 hover:from-gray-100 hover:to-gray-200 transition-all cursor-pointer">
                            <div className="h-full flex flex-col items-center justify-center">
                              <div className="mb-1">
                                <CountryFlag countryCode={stat.code} />
                              </div>
                              <span className="text-[10px] font-semibold text-gray-700 text-center line-clamp-1">
                                {countryNameMap[stat.code] || stat.country}
                              </span>
                              <span className="text-xs text-gray-600">{stat.percentage}%</span>
                            </div>
                          </div>
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs  opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
                            {stat.country}: {stat.count.toLocaleString()} ({stat.percentage}%)
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-64 bg-gray-50  flex items-center justify-center">
                      <p className="text-gray-500">No country data available</p>
                    </div>
                  )}
                </div>
              )}


            </div>
          </>
        );
      case 'overview':
        return (
          <>
            <h1 className="text-2xl font-bold mb-6">Statistics Overview</h1>
            <div className="p-8 text-gray-500">Statistics dashboard coming soon...</div>
          </>
        );
      case 'email-search':
        return (
          <>
            <h1 className="text-2xl font-bold mb-6">Email Search</h1>
            <div className="p-8 text-gray-500">Email search interface coming soon...</div>
          </>
        );
      case 'alerts':
        return (
          <>
            <h1 className="text-2xl font-bold mb-6">Security Alerts</h1>
            <div className="p-8 text-gray-500">Alert configuration coming soon...</div>
          </>
        );
      case 'clickhouse':
        return (
          <>
            <h1 className="text-2xl font-bold mb-6">ClickHouse Status</h1>
            <div className="p-8 text-gray-500">Database monitoring coming soon...</div>
          </>
        );
      case 'settings':
        return (
          <>
            <h1 className="text-2xl font-bold mb-6">Settings</h1>
            <div className="p-8 text-gray-500">Application settings coming soon...</div>
          </>
        );
      default:
        // Show loading or redirect to dashboard
        setSelectedMenu('dashboard');
        return (
          <>
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin  h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading dashboard...</p>
              </div>
            </div>
          </>
        );
    }
  };

  const handleDomainsLoaded = (loadedDomains: any[]) => {
    setDomains(loadedDomains);
    setDomainsLoaded(true);

    // 도메인이 없으면 환영 페이지로 리다이렉트
    if (loadedDomains.length === 0) {
      router.push('/welcome');
    }
  };

  return (
    <DynamicSidebarLayout
      activeItem={selectedMenu}
      onMenuSelect={setSelectedMenu}
      onDomainsLoaded={handleDomainsLoaded}
    >
      <div className="p-6">
        {renderContent()}
      </div>

    </DynamicSidebarLayout>
  );
}