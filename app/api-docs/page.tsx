'use client';

import { useState, useEffect } from 'react';

// 유틸리티 함수: 동적 URL 생성
const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    // 클라이언트 사이드에서는 현재 호스트 사용
    const protocol = window.location.protocol;
    const host = window.location.host;
    return `${protocol}//${host}/api/v1`;
  } else {
    // 서버 사이드에서는 환경변수 사용
    if (process.env.NODE_ENV === 'production') {
      return process.env.NEXT_PUBLIC_API_URL || 'https://leakjar.vercel.app/api/v1';
    } else {
      return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
    }
  }
};

// 샘플 도메인
const sampleDomains = [
  'gmail.com',
  'yahoo.com',
  'outlook.com',
  'roblox.com',
  'facebook.com',
  'twitter.com',
  'instagram.com',
  'linkedin.com'
];

// 언어 옵션
const languageOptions = [
  { value: 'javascript', label: 'JavaScript/Node.js', icon: '🟨' },
  { value: 'python', label: 'Python', icon: '🐍' },
  { value: 'java', label: 'Java', icon: '☕' },
  { value: 'go', label: 'Go', icon: '🔷' },
  { value: 'ruby', label: 'Ruby', icon: '💎' },
  { value: 'php', label: 'PHP', icon: '🔰' },
  { value: 'csharp', label: 'C#/.NET', icon: '🔷' },
  { value: 'powershell', label: 'PowerShell', icon: '🔷' },
  { value: 'curl', label: 'cURL', icon: '🔧' }
];

// Code Example Selector 컴포넌트
function CodeExampleSelector({
  section,
  selectedLanguage,
  onLanguageChange
}: {
  section: string;
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">언어 선택:</span>
      <select
        value={selectedLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        aria-label={`프로그래밍 언어 선택 - ${section} 섹션`}
        title={`프로그래밍 언어 선택 - ${section} 섹션`}
      >
        {languageOptions.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.icon} {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function APIDocsPage() {
  const [apiKey, setApiKey] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [responseData, setResponseData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeExample, setActiveExample] = useState('');
  const [availableDomains, setAvailableDomains] = useState<string[]>([]);
  const [domainMapping, setDomainMapping] = useState<{[key: string]: string}>({});
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');

  // 동적 baseURL 설정
  const baseUrl = getApiUrl();

  // API 키가 변경되면 도메인 목록을 새로 가져옴
  const fetchDomains = async (key: string) => {
    try {
      const response = await fetch(`${baseUrl}/domains`, {
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          // Create domain options with type information to avoid confusion
          const domainOptions = data.data.map((domain: any) =>
            `${domain.domain} (${domain.type})`
          );
          // Store original domain names for API calls
          const domainMap = data.data.reduce((acc: any, domain: any) => {
            const key = `${domain.domain} (${domain.type})`;
            acc[key] = domain.domain;
            return acc;
          }, {});

          setAvailableDomains(domainOptions);
          setDomainMapping(domainMap);

          if (domainOptions.length > 0 && !selectedDomain) {
            setSelectedDomain(domainOptions[0]);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch domains:', error);
      setAvailableDomains([]);
    }
  };

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    if (value) {
      fetchDomains(value);
    } else {
      setAvailableDomains([]);
      setSelectedDomain('');
    }
  };

  const testApiCall = async (endpoint: string, description: string) => {
    if (!apiKey) {
      alert('API Key를 먼저 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setActiveExample(description);
    setResponseData('');

    try {
      const url = `${baseUrl}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setResponseData(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponseData(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: '', level: 0 },
    { id: 'quick-start', label: 'Quick Start', icon: '', level: 1 },
    { id: 'endpoints', label: 'API Endpoints', icon: '', level: 0 },
    { id: 'domains-endpoint', label: 'GET /domains', icon: '', level: 1 },
    { id: 'domains-all-endpoint', label: 'GET /domains/all', icon: '', level: 1 },
    { id: 'leaked-data-endpoint', label: 'GET /leaked-data', icon: '', level: 1 },
    { id: 'pagination', label: 'Pagination Guide', icon: '', level: 0 },
    { id: 'batch-processing', label: 'Batch Processing', icon: '', level: 1 },
    { id: 'examples', label: 'Code Examples', icon: '', level: 0 },
    { id: 'domain-examples', label: 'Domain APIs', icon: '', level: 1 },
    { id: 'data-examples', label: 'Data Retrieval', icon: '', level: 1 },
    { id: 'errors', label: 'Error Codes', icon: '', level: 0 },
    { id: 'performance', label: 'Performance Tips', icon: '', level: 0 },
  ];

  const renderAllSections = () => {
    return (
      <>
        <section id="overview">
          <OverviewSection
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
          />
        </section>

        <section id="endpoints">
          <EndpointsSection
            apiKey={apiKey}
            selectedDomain={selectedDomain}
            availableDomains={availableDomains}
            domainMapping={domainMapping}
            handleApiKeyChange={handleApiKeyChange}
            setSelectedDomain={setSelectedDomain}
            testApiCall={testApiCall}
            isLoading={isLoading}
            activeExample={activeExample}
            responseData={responseData}
            setResponseData={setResponseData}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
          />
        </section>

        <section id="pagination">
          <PaginationSection
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
          />
        </section>

        <section id="errors">
          <ErrorCodesSection />
        </section>

        <section id="performance">
          <PerformanceSection />
        </section>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="px-6 py-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">LeakJar API Documentation</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Complete API reference for LeakJar's threat intelligence and breach data platform
          </p>
        </div>
      </header>

  
      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="flex gap-6">
          {/* Sticky Sidebar */}
          <aside className="w-48 flex-shrink-0">
            <nav className="sticky top-8 space-y-1">
              {sidebarItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`block px-3 py-1.5 text-sm transition-colors rounded hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    item.level === 0
                      ? 'font-semibold text-gray-900 dark:text-white'
                      : 'ml-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1 space-y-12">
            {renderAllSections()}
          </div>
        </div>
      </main>
    </div>
  );
}

function OverviewSection({
  selectedLanguage,
  setSelectedLanguage
}: {
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
}) {
  // 동적 URL 생성
  const currentApiUrl = getApiUrl();

  return (
    <div className="space-y-8">
      <section id="overview-section">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Overview</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Get started with the LeakJar API for threat intelligence and breach data access
          </p>
        </div>
      </section>

      <section id="quick-start-section">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4">🚀 Quick Start</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">1. Get Your API Key</h4>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Visit your dashboard settings to generate a new API key for your application.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">2. Make Your First Request</h4>
              <div className="bg-gray-900 rounded p-3">
                <pre className="text-green-400 text-xs font-mono">
{`curl -H "Authorization: Bearer YOUR_API_KEY" \\
     "${currentApiUrl}/domains"`}
                </pre>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">3. Explore the Data</h4>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Use our endpoints to access breach data, domain information, and detailed analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Base URLs</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Production:</p>
              <code className="block px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded text-sm font-mono">
                {currentApiUrl}
              </code>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Authentication</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            All API requests require Bearer Token authentication:
          </p>
          <code className="block px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded text-sm font-mono">
            Authorization: Bearer your_api_key_here
          </code>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            API keys are issued by administrators and require domain verification.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Start</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">1. List verified domains:</p>
            <div className="bg-gray-900 rounded p-3">
              <pre className="text-green-400 text-xs font-mono">
{`curl -H "Authorization: Bearer YOUR_API_KEY" \\
     "${currentApiUrl}/domains"`}
              </pre>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">2. Search leaked data:</p>
            <div className="bg-gray-900 rounded p-3">
              <pre className="text-green-400 text-xs font-mono">
{`curl -H "Authorization: Bearer YOUR_API_KEY" \\
     "${currentApiUrl}/leaked-data?domain=gmail.com&limit=10"`}
              </pre>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">3. Filter by date range:</p>
            <div className="bg-gray-900 rounded p-3">
              <pre className="text-green-400 text-xs font-mono">
{`curl -H "Authorization: Bearer YOUR_API_KEY" \\
     "${currentApiUrl}/leaked-data?domain=gmail.com&date_from=2024-01-01&date_to=2024-12-31"`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TestingSection({
  apiKey,
  selectedDomain,
  availableDomains,
  domainMapping,
  handleApiKeyChange,
  setSelectedDomain,
  testApiCall,
  isLoading,
  activeExample,
  responseData,
  setResponseData
}: any) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Interactive API Testing</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Test API endpoints directly from your browser with real data
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => handleApiKeyChange(e.target.value)}
              placeholder="your_api_key_here"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Test Domain
            </label>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              disabled={!apiKey || availableDomains.length === 0}
              aria-label="Test domain selection"
              title="Select a domain for API testing"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-500"
            >
              <option value="">Select domain</option>
              {availableDomains.length > 0 ? (
                availableDomains.map((domain: string) => (
                  <option key={domain} value={domain}>{domain}</option>
                ))
              ) : (
                <option value="" disabled>No domains available</option>
              )}
            </select>
          </div>
        </div>

        {availableDomains.length > 0 && (
          <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Found {availableDomains.length} verified domains
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-4 mb-6">
          <button
            type="button"
            onClick={() => testApiCall('/domains', 'Verified Domains')}
            disabled={isLoading}
            className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            {isLoading && activeExample === 'Verified Domains' ? 'Loading...' : 'Verified Domains'}
          </button>
          <button
            type="button"
            onClick={() => testApiCall('/domains/all', 'All Domains')}
            disabled={isLoading}
            className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            {isLoading && activeExample === 'All Domains' ? 'Loading...' : 'All Domains'}
          </button>
          <button
            type="button"
            onClick={() => {
                const actualDomain = domainMapping[selectedDomain] || selectedDomain;
                return selectedDomain && testApiCall(`/leaked-data?domain=${actualDomain}&limit=5`, `Data for ${selectedDomain}`);
              }}
            disabled={!selectedDomain || isLoading}
            className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            {isLoading && activeExample.includes('Data for') ? 'Loading...' : 'Test Domain Data'}
          </button>
        </div>

        {responseData && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                API Response: {activeExample}
              </h3>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(responseData)}
                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1 rounded text-sm font-medium transition-colors"
              >
                Copy JSON
              </button>
            </div>
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <pre className="text-green-400 p-4 text-sm font-mono overflow-x-auto max-h-96 overflow-y-auto">
                {responseData}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EndpointsSection({
  apiKey,
  selectedDomain,
  availableDomains,
  domainMapping,
  handleApiKeyChange,
  setSelectedDomain,
  testApiCall,
  isLoading,
  activeExample,
  responseData,
  setResponseData,
  selectedLanguage,
  setSelectedLanguage
}: {
  apiKey: string;
  selectedDomain: string;
  availableDomains: string[];
  domainMapping: {[key: string]: string};
  handleApiKeyChange: (value: string) => void;
  setSelectedDomain: (domain: string) => void;
  testApiCall: (endpoint: string, description: string) => void;
  isLoading: boolean;
  activeExample: string;
  responseData: string;
  setResponseData: (data: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
}) {
  return (
    <div className="space-y-8">
      <section id="endpoints-section">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">API Endpoints</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Complete reference with interactive testing for all API endpoints
          </p>
        </div>
      </section>

      {/* API Key Setup */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">API Configuration</h3>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => handleApiKeyChange(e.target.value)}
              placeholder="your_api_key_here"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Test Domain
            </label>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              disabled={!apiKey || availableDomains.length === 0}
              aria-label="Test domain selection"
              title="Select a domain for API testing"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-500"
            >
              <option value="">Select domain</option>
              {availableDomains.length > 0 ? (
                availableDomains.map((domain: string) => (
                  <option key={domain} value={domain}>{domain}</option>
                ))
              ) : (
                <option value="" disabled>No domains available</option>
              )}
            </select>
          </div>
        </div>
        {availableDomains.length > 0 && (
          <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-800/30 border border-blue-200 dark:border-blue-700 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Found {availableDomains.length} domain entries (including EMAIL/URL types)
            </p>
          </div>
        )}
      </div>

      <div className="space-y-8">
        {/* Domains List */}
        <section id="domains-endpoint">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-3 py-1 rounded text-sm font-semibold">GET</span>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white font-mono">
                /api/v1/domains
              </h3>
            </div>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Retrieve list of verified domains accessible via API
          </p>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Request Example:</h4>
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <pre className="text-green-400 p-4 text-sm font-mono overflow-x-auto">
{`curl -H "Authorization: Bearer your_api_key" \\
     "${getApiUrl()}/domains"}

# Development example will show actual URL`}
                </pre>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Response Example:</h4>
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <pre className="text-green-400 p-4 text-sm font-mono overflow-x-auto">
{`{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "domain": "gmail.com",
      "type": "EMAIL",
      "verified_at": "2025-09-16T15:13:39.262+00:00",
      "api_accessible": true,
      "verification_status": "verified"
    }
  ],
  "meta": {
    "total_domains": 1,
    "response_time_ms": 2037,
    "api_key_id": "c0ef44ee...",
    "user_id": "ff0425af..."
  }
}`}
                </pre>
              </div>
            </div>
          </div>

          {/* Interactive Test for Domains */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Interactive Test:</h4>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => testApiCall('/domains', 'Verified Domains')}
                disabled={!apiKey || isLoading}
                className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {isLoading && activeExample === 'Verified Domains' ? 'Loading...' : 'Test Verified Domains'}
              </button>
            </div>

            {responseData && activeExample === 'Verified Domains' && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-lg font-semibold text-gray-900 dark:text-white">
                    API Response: {activeExample}
                  </h5>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(responseData)}
                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1 rounded text-sm font-medium transition-colors"
                  >
                    Copy JSON
                  </button>
                </div>
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <pre className="text-green-400 p-4 text-sm font-mono overflow-x-auto max-h-96 overflow-y-auto">
                    {responseData}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Code Examples for /api/v1/domains */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Code Examples for GET /api/v1/domains</h3>
            <CodeExampleSelector
              section="domains"
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
          </div>

          <div className="max-w-4xl">
            {selectedLanguage === 'javascript' && (
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">JavaScript/Node.js</h4>
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <pre className="text-green-400 p-4 text-sm font-mono">
{`const response = await fetch(
  \`\${getApiUrl()}/domains\`,
  {
    headers: {
      'Authorization': 'Bearer your_api_key',
      'Content-Type': 'application/json'
    }
  }
);

const data = await response.json();
console.log(\`Found \${data.data.length} verified domains\`);`}
                  </pre>
                </div>
              </div>
            )}

            {selectedLanguage === 'python' && (
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Python</h4>
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <pre className="text-green-400 p-4 text-sm font-mono">
{`import requests

response = requests.get(
    f"\{getApiUrl()}/domains",
    headers={
        'Authorization': 'Bearer your_api_key',
        'Content-Type': 'application/json'
    }
)

data = response.json()
print(f"Found {len(data['data'])} verified domains")`}
                  </pre>
                </div>
              </div>
            )}

            {selectedLanguage === 'curl' && (
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">cURL</h4>
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <pre className="text-green-400 p-4 text-sm font-mono">
{`curl -X GET \\
  "\${getApiUrl()}/domains" \\
  -H "Authorization: Bearer your_api_key" \\
  -H "Content-Type: application/json"`}
                  </pre>
                </div>
              </div>
            )}

            {selectedLanguage === 'java' && (
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Java</h4>
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <pre className="text-green-400 p-4 text-sm font-mono">
{`import java.net.http.*;
import java.net.URI;

HttpClient client = HttpClient.newHttpClient();

HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("${getApiUrl()}/domains"))
    .header("Authorization", "Bearer your_api_key")
    .GET()
    .build();

HttpResponse<String> response = client.send(request,
    HttpResponse.BodyHandlers.ofString());

System.out.println(response.body());`}
                  </pre>
                </div>
              </div>
            )}

            {selectedLanguage === 'go' && (
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Go</h4>
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <pre className="text-green-400 p-4 text-sm font-mono">
{`package main

import (
    "net/http"
    "encoding/json"
)

func main() {
    req, _ := http.NewRequest("GET",
        "${getApiUrl()}/domains", nil)
    req.Header.Set("Authorization", "Bearer your_api_key")

    client := &http.Client{}
    resp, _ := client.Do(req)
    defer resp.Body.Close()

    var result map[string]interface{}
    json.NewDecoder(resp.Body).Decode(&result)
    fmt.Println(result)
}`}
                  </pre>
                </div>
              </div>
            )}

            {selectedLanguage === 'ruby' && (
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Ruby</h4>
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <pre className="text-green-400 p-4 text-sm font-mono">
{`require 'net/http'
require 'uri'
require 'json'

uri = URI('${getApiUrl()}/domains')

http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = uri.scheme == 'https'
request = Net::HTTP::Get.new(uri.request_uri)
request['Authorization'] = 'Bearer your_api_key'

response = http.request(request)
data = JSON.parse(response.body)
puts "Found #{data['data'].length} verified domains"`}
                  </pre>
                </div>
              </div>
            )}

            {selectedLanguage === 'php' && (
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">PHP</h4>
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <pre className="text-green-400 p-4 text-sm font-mono">
{`<?php
$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_URL => '${getApiUrl()}/domains',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer your_api_key',
        'Content-Type: application/json'
    ]
]);

$response = curl_exec($curl);
$data = json_decode($response, true);
echo "Found " . count($data['data']) . " verified domains";
curl_close($curl);
?>`}
                  </pre>
                </div>
              </div>
            )}

            {selectedLanguage === 'csharp' && (
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">C#/.NET</h4>
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <pre className="text-green-400 p-4 text-sm font-mono">
{`using System.Net.Http;

class Program
{
    static async Task Main()
    {
        using var client = new HttpClient();
        client.DefaultRequestHeaders.Add("Authorization", "Bearer your_api_key");

        var response = await client.GetAsync(
            "${getApiUrl()}/domains");

        var json = await response.Content.ReadAsStringAsync();
        Console.WriteLine(json);
    }
}`}
                  </pre>
                </div>
              </div>
            )}

            {selectedLanguage === 'powershell' && (
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">PowerShell</h4>
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <pre className="text-green-400 p-4 text-sm font-mono">
{`$headers = @{
    "Authorization" = "Bearer your_api_key"
}

$response = Invoke-RestMethod \\
    -Uri "${getApiUrl()}/domains" \\
    -Method Get \\
    -Headers $headers

Write-Host "Found $($response.data.Count) verified domains"`}
                  </pre>
                </div>
              </div>
            )}
          </div>
          </div>
        </section>

        {/* All Domains List */}
        <section id="domains-all-endpoint">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-3 py-1 rounded text-sm font-semibold">GET</span>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white font-mono">
                /api/v1/domains/all
              </h3>
            </div>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Retrieve list of all domains (both verified and unverified) accessible via API
          </p>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Request Example:</h4>
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <pre className="text-green-400 p-4 text-sm font-mono overflow-x-auto">
{`curl -H "Authorization: Bearer your_api_key" \\
     "${getApiUrl()}/domains/all"

# Development example will show actual URL`}
                </pre>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Response Example:</h4>
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <pre className="text-green-400 p-4 text-sm font-mono overflow-x-auto">
{`{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "domain": "gmail.com",
      "type": "EMAIL",
      "is_verified": true,
      "verified_at": "2025-09-16T15:13:39.262+00:00",
      "api_accessible": true,
      "visibility": "organization"
    },
    {
      "id": "456e7890-f12c-23d4-b567-537725285111",
      "domain": "example.com",
      "type": "URL",
      "is_verified": false,
      "verified_at": null,
      "api_accessible": false,
      "visibility": "private"
    }
  ],
  "meta": {
    "total_domains": 2,
    "response_time_ms": 2150,
    "api_key_id": "c0ef44ee...",
    "user_id": "ff0425af..."
  }
}`}
                </pre>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Note:</strong> Unlike <code>/api/v1/domains</code>, this endpoint returns all domains including those that are not yet verified. Unverified domains cannot be used for data queries.
            </p>
          </div>

          {/* Interactive Test for All Domains */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Interactive Test:</h4>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => testApiCall('/domains/all', 'All Domains')}
                disabled={!apiKey || isLoading}
                className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {isLoading && activeExample === 'All Domains' ? 'Loading...' : 'Test All Domains'}
              </button>
            </div>

            {responseData && activeExample === 'All Domains' && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-lg font-semibold text-gray-900 dark:text-white">
                    API Response: {activeExample}
                  </h5>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(responseData)}
                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1 rounded text-sm font-medium transition-colors"
                  >
                    Copy JSON
                  </button>
                </div>
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <pre className="text-green-400 p-4 text-sm font-mono overflow-x-auto max-h-96 overflow-y-auto">
                    {responseData}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Code Examples for /api/v1/domains/all */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Code Examples for GET /api/v1/domains/all</h3>
            <CodeExampleSelector
              section="domains_all"
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
          </div>

          <div className="max-w-4xl">
            {selectedLanguage === 'javascript' && (
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">JavaScript/Node.js</h4>
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <pre className="text-green-400 p-4 text-sm font-mono">
{`const response = await fetch(
  \`\${getApiUrl()}/domains/all\`,
  {
    headers: {
      'Authorization': 'Bearer your_jwt_token',
      'Content-Type': 'application/json'
    }
  }
);

const data = await response.json();
console.log('All domains:', data.domains);

// Filter verified domains only
const verifiedDomains = data.domains.filter(d => d.is_verified);
console.log('Verified domains:', verifiedDomains);

// Group by type
const urlDomains = data.domains.filter(d => d.type === 'URL');
const emailDomains = data.domains.filter(d => d.type === 'EMAIL');`}
                  </pre>
                </div>
              </div>
            )}

            {selectedLanguage === 'python' && (
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Python</h4>
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <pre className="text-green-400 p-4 text-sm font-mono">
{`import requests
import json

headers = {
    'Authorization': 'Bearer your_jwt_token',
    'Content-Type': 'application/json'
}

response = requests.get(
    f"\{getApiUrl()}/domains/all",
    headers=headers
)

if response.status_code == 200:
    data = response.json()
    print("All domains:", len(data['domains']))

    # Filter verified domains only
    verified_domains = [d for d in data['domains'] if d['is_verified']]
    print(f"Verified domains: {len(verified_domains)}")

    # Group by type
    url_domains = [d for d in data['domains'] if d['type'] == 'URL']
    email_domains = [d for d in data['domains'] if d['type'] == 'EMAIL']
    print(f"URL domains: {len(url_domains)}")
    print(f"Email domains: {len(email_domains)}")
else:
    print(f"Error: {response.status_code}")`}
                  </pre>
                </div>
              </div>
            )}

            {selectedLanguage === 'curl' && (
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">cURL</h4>
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <pre className="text-green-400 p-4 text-sm font-mono">
{`curl -X GET \\
  "\${getApiUrl()}/domains/all" \\
  -H "Authorization: Bearer your_jwt_token" \\
  -H "Content-Type: application/json"

# Count total domains
curl -s -X GET \\
  "\${getApiUrl()}/domains/all" \\
  -H "Authorization: Bearer your_jwt_token" \\
  | jq '.domains | length'

# Get only verified domains
curl -s -X GET \\
  "\${getApiUrl()}/domains/all" \\
  -H "Authorization: Bearer your_jwt_token" \\
  | jq '.domains[] | select(.is_verified == true)'`}
                  </pre>
                </div>
              </div>
            )}

            {selectedLanguage === 'java' && (
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Java</h4>
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <pre className="text-green-400 p-4 text-sm font-mono">
{`import java.net.http.*;
import java.net.URI;
import com.fasterxml.jackson.databind.ObjectMapper;

HttpClient client = HttpClient.newHttpClient();
ObjectMapper mapper = new ObjectMapper();

HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("${getApiUrl()}/domains/all"))
    .header("Authorization", "Bearer your_jwt_token")
    .GET()
    .build();

HttpResponse<String> response = client.send(request,
    HttpResponse.BodyHandlers.ofString());

JsonNode data = mapper.readTree(response.body);
System.out.println("All domains: " + data.get("domains").size());`}
                  </pre>
                </div>
              </div>
            )}

            {selectedLanguage === 'go' && (
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Go</h4>
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <pre className="text-green-400 p-4 text-sm font-mono">
{`package main

import (
    "net/http"
    "encoding/json"
    "fmt"
)

type Domain struct {
    Domain       string ` + "`" + `json:"domain"` + "`" + `
    Type         string ` + "`" + `json:"type"` + "`" + `
    IsVerified   bool   ` + "`" + `json:"is_verified"` + "`" + `
}

func main() {
    req, _ := http.NewRequest("GET",
        "${getApiUrl()}/domains/all", nil)
    req.Header.Set("Authorization", "Bearer your_jwt_token")

    client := &http.Client{}
    resp, _ := client.Do(req)
    defer resp.Body.Close()

    var result map[string]interface{}
    json.NewDecoder(resp.Body).Decode(&result)
    fmt.Println(result)
}`}
                  </pre>
                </div>
              </div>
            )}

            {selectedLanguage === 'ruby' && (
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Ruby</h4>
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <pre className="text-green-400 p-4 text-sm font-mono">
{`require 'net/http'
require 'uri'
require 'json'

uri = URI('${getApiUrl()}/domains/all')

http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = uri.scheme == 'https'
request = Net::HTTP::Get.new(uri.request_uri)
request['Authorization'] = 'Bearer your_jwt_token'

response = http.request(request)
data = JSON.parse(response.body)
puts "All domains: #{data['domains'].length}"

verified = data['domains'].select { |d| d['is_verified'] }
puts "Verified domains: #{verified.length}"`}
                  </pre>
                </div>
              </div>
            )}

            {selectedLanguage === 'php' && (
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">PHP</h4>
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <pre className="text-green-400 p-4 text-sm font-mono">
{`<?php
$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_URL => '${getApiUrl()}/domains/all',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer your_jwt_token',
        'Content-Type: application/json'
    ]
]);

$response = curl_exec($curl);
$data = json_decode($response, true);

echo "All domains: " . count($data['domains']) . PHP_EOL;

$verified = array_filter($data['domains'], function($d) {
    return $d['is_verified'];
});
echo "Verified domains: " . count($verified) . PHP_EOL;

curl_close($curl);
?>`}
                  </pre>
                </div>
              </div>
            )}

            {selectedLanguage === 'csharp' && (
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">C#/.NET</h4>
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <pre className="text-green-400 p-4 text-sm font-mono">
{`using System.Net.Http;
using System.Text.Json;
using System.Collections.Generic;

class Program
{
    static async Task Main()
    {
        using var client = new HttpClient();
        client.DefaultRequestHeaders.Add("Authorization", "Bearer your_jwt_token");

        var response = await client.GetAsync(
            "${getApiUrl()}/domains/all");

        var json = await response.Content.ReadAsStringAsync();
        var data = JsonSerializer.Deserialize<JsonElement>(json);

        var domains = data.GetProperty("domains").GetArrayLength();
        Console.WriteLine($"All domains: {domains}");
    }
}`}
                  </pre>
                </div>
              </div>
            )}

            {selectedLanguage === 'powershell' && (
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">PowerShell</h4>
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <pre className="text-green-400 p-4 text-sm font-mono">
{`$headers = @{
    "Authorization" = "Bearer your_jwt_token"
}

$response = Invoke-RestMethod \\
    -Uri "${getApiUrl()}/domains/all" \\
    -Method Get \\
    -Headers $headers

Write-Host "All domains: $($response.data.Count)"

$verified = $response.data | Where-Object { $_.is_verified }
Write-Host "Verified domains: $($verified.Count)"`}
                  </pre>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> Use this endpoint when you need a complete list of all domains in the system, regardless of ownership.
              This is useful for administrative purposes or for building comprehensive domain management interfaces.
            </p>
          </div>
        </div>
        </section>

        {/* Leaked Data */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6" id="leaked-data-endpoint">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-3 py-1 rounded text-sm font-semibold">GET</span>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white font-mono">
              /api/v1/leaked-data
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Search leaked data with advanced filtering (primary endpoint)
          </p>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Request Example:</h4>
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <pre className="text-green-400 p-4 text-sm font-mono overflow-x-auto">
{`curl -H "Authorization: Bearer your_api_key" \\
     "https://leakjar.vercel.app/api/v1/leaked-data?domain=gmail.com&limit=10"

# Development
curl -H "Authorization: Bearer your_api_key" \\
     "\${getApiUrl()}/leaked-data?domain=gmail.com&limit=10"`}
                </pre>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Response Example:</h4>
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <pre className="text-green-400 p-4 text-sm font-mono overflow-x-auto">
{`{
  "success": true,
  "data": [
    {
      "id": "user123@gmail.com",
      "user_name": "john_doe",
      "pw": "********",
      "main_domain": "gmail.com",
      "main_email": "gmail.com",
      "url": "https://gmail.com",
      "date_collected": "2024-01-15T10:30:00Z",
      "ip": "192.168.1.100",
      "protocol": "https"
    }
  ],
  "pagination": {
    "total": 1250,
    "limit": 10,
    "offset": 0,
    "has_more": true
  },
  "domain_info": {
    "domain": "gmail.com",
    "type": "EMAIL",
    "is_verified": true,
    "domain_id": "123e4567-e89b-12d3-a456-426614174000"
  },
  "meta": {
    "response_time_ms": 245,
    "api_key_id": "c0ef44ee...",
    "user_id": "ff0425af..."
  }
}`}
                </pre>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Query Parameters:</h4>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-4">
                <div className="border-l-4 border-gray-500 pl-3">
                  <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 px-2 py-1 rounded">domain</code>
                  <span className="text-red-500 ml-1 font-bold">*</span>
                  <p className="text-gray-600 dark:text-gray-400 ml-0 mt-1">Target domain to search (required)</p>
                </div>
                <div>
                  <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 px-2 py-1 rounded">limit</code>
                  <p className="text-gray-600 dark:text-gray-400 ml-0 mt-1">Records to return (default: 100, max: 1000)</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 px-2 py-1 rounded">date_from</code>
                  <p className="text-gray-600 dark:text-gray-400 ml-0 mt-1">Start date filter (YYYY-MM-DD format)</p>
                </div>
                <div>
                  <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 px-2 py-1 rounded">date_to</code>
                  <p className="text-gray-600 dark:text-gray-400 ml-0 mt-1">End date filter (YYYY-MM-DD format)</p>
                </div>
              </div>
            </div>
          </div>

          {/* How to Use */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">How to Use This Endpoint</h4>
            <div className="space-y-4 text-sm">
              <div className="border-l-4 border-blue-500 pl-4">
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">1. Start with a Domain</h5>
                <p className="text-gray-600 dark:text-gray-300">
                  The <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">domain</code> parameter is required.
                  Use your company's verified domain (e.g., "gmail.com", "yourcompany.com").
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">2. Add Optional Filters</h5>
                <p className="text-gray-600 dark:text-gray-300">
                  Enhance your query with optional parameters:
                </p>
                <ul className="mt-2 space-y-1 text-gray-600 dark:text-gray-300">
                  <li>• <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">date_from</code> and <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">date_to</code> for date ranges</li>
                  <li>• <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">type</code> to filter by data type (email, username, password)</li>
                  <li>• <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">limit</code> to control results (max: 1000)</li>
                  <li>• <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">offset</code> for pagination</li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">3. Make the Request</h5>
                <p className="text-gray-600 dark:text-gray-300">
                  Always include your API key in the Authorization header:
                </p>
                <div className="bg-gray-900 rounded-lg p-3 mt-2">
                  <pre className="text-green-400 text-xs font-mono">
{`Authorization: Bearer your_api_key`}
                  </pre>
                </div>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">4. Handle the Response</h5>
                <p className="text-gray-600 dark:text-gray-300">
                  The API returns structured JSON with:
                </p>
                <ul className="mt-2 space-y-1 text-gray-600 dark:text-gray-300">
                  <li>• <strong>data</strong>: Array of leaked data records</li>
                  <li>• <strong>pagination</strong>: Total count and pagination info</li>
                  <li>• <strong>domain_info</strong>: Domain verification details</li>
                  <li>• <strong>meta</strong>: Response timing and API info</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Common Request Patterns */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Common Request Patterns</h4>
            <div className="grid lg:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">Quick Start - First 10 Records</h5>
                <div className="bg-gray-900 rounded-lg p-3">
                  <pre className="text-green-400 text-xs font-mono">
{`GET /api/v1/leaked-data?domain=gmail.com&limit=10`}
                  </pre>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">Recent Breaches - Last 30 Days</h5>
                <div className="bg-gray-900 rounded-lg p-3">
                  <pre className="text-green-400 text-xs font-mono">
{`GET /api/v1/leaked-data?domain=gmail.com&date_from=2024-11-01`}
                  </pre>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">Password-Only Records</h5>
                <div className="bg-gray-900 rounded-lg p-3">
                  <pre className="text-green-400 text-xs font-mono">
{`GET /api/v1/leaked-data?domain=gmail.com&type=password&limit=50`}
                  </pre>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">Date Range - Specific Period</h5>
                <div className="bg-gray-900 rounded-lg p-3">
                  <pre className="text-green-400 text-xs font-mono">
{`GET /api/v1/leaked-data?domain=gmail.com&date_from=2024-01-01&date_to=2024-03-31`}
                  </pre>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">Pagination - Page 2 (100-199)</h5>
                <div className="bg-gray-900 rounded-lg p-3">
                  <pre className="text-green-400 text-xs font-mono">
{`GET /api/v1/leaked-data?domain=gmail.com&limit=100&offset=100`}
                  </pre>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">Full Search - All Options</h5>
                <div className="bg-gray-900 rounded-lg p-3">
                  <pre className="text-green-400 text-xs font-mono">
{`GET /api/v1/leaked-data?domain=gmail.com&date_from=2024-01-01&date_to=2024-12-31&type=password&limit=200`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Test for Leaked Data */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Interactive Test:</h4>
            <button
              type="button"
              onClick={() => {
                const actualDomain = domainMapping[selectedDomain] || selectedDomain;
                return selectedDomain && testApiCall(`/leaked-data?domain=${actualDomain}&limit=5`, `Data for ${selectedDomain}`);
              }}
              disabled={!selectedDomain || !apiKey || isLoading}
              className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {isLoading && activeExample.includes('Data for') ? 'Loading...' : 'Test Domain Data'}
            </button>

            {responseData && activeExample.includes('Data for') && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-lg font-semibold text-gray-900 dark:text-white">
                    API Response: {activeExample}
                  </h5>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(responseData)}
                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1 rounded text-sm font-medium transition-colors"
                  >
                    Copy JSON
                  </button>
                </div>
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <pre className="text-green-400 p-4 text-sm font-mono overflow-x-auto max-h-96 overflow-y-auto">
                    {responseData}
                  </pre>
                </div>
              </div>
            )}
          </div>

      </div>
      </div>
    </div>
  );
}

function PaginationSection({
  selectedLanguage,
  setSelectedLanguage
}: {
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
}) {
  // 동적 URL 생성
  const currentApiUrl = getApiUrl();

  return (
    <div className="space-y-8">
      <section id="pagination-section">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Pagination Guide</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Learn how to handle large datasets efficiently
          </p>
        </div>
      </section>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Why Pagination Matters</h4>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
          With billions of records in our database, pagination is essential for:
        </p>
        <ul className="text-gray-600 dark:text-gray-300 text-sm space-y-1 ml-4">
          <li>• Fast response times (avoiding large data transfers)</li>
          <li>• Memory efficiency on both client and server</li>
          <li>• Controlled bandwidth usage</li>
          <li>• Progressive data loading for better UX</li>
        </ul>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Pagination Parameters</h4>
        <div className="grid md:grid-cols-2 gap-6 mb-4">
          <div>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              <span className="font-mono bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-2 py-1 rounded text-sm">limit</span>
            </p>
            <ul className="text-gray-600 dark:text-gray-400 text-sm space-y-1 ml-4">
              <li>• Number of records to return</li>
              <li>• Default: 100, Maximum: 1000</li>
              <li>• Recommended: 100-500 for most use cases</li>
            </ul>
          </div>
          <div>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              <span className="font-mono bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-2 py-1 rounded text-sm">offset</span>
            </p>
            <ul className="text-gray-600 dark:text-gray-400 text-sm space-y-1 ml-4">
              <li>• Number of records to skip</li>
              <li>• Used for page navigation</li>
              <li>• Formula: (page_number - 1) × limit</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Complete Pagination Examples</h4>
        <div className="space-y-4">
          <div className="border-l-4 border-gray-500 pl-4">
            <p className="font-medium text-gray-900 dark:text-white mb-2">Basic Pagination (100 records per page):</p>
            <div className="grid md:grid-cols-3 gap-3">
              <div className="bg-gray-100 dark:bg-gray-800 rounded p-3">
                <p className="font-semibold text-xs text-gray-700 dark:text-gray-300 mb-1">Page 1:</p>
                <code className="text-xs text-gray-600 dark:text-gray-400">limit=100&offset=0</code>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded p-3">
                <p className="font-semibold text-xs text-gray-700 dark:text-gray-300 mb-1">Page 2:</p>
                <code className="text-xs text-gray-600 dark:text-gray-400">limit=100&offset=100</code>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded p-3">
                <p className="font-semibold text-xs text-gray-700 dark:text-gray-300 mb-1">Page 3:</p>
                <code className="text-xs text-gray-600 dark:text-gray-400">limit=100&offset=200</code>
              </div>
            </div>
          </div>

          <div className="border-l-4 border-gray-500 pl-4" id="batch-processing">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-gray-900 dark:text-white">Batch Processing Script Example:</p>
              <CodeExampleSelector
                section="batch_processing"
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
              />
            </div>

            <div className="max-w-4xl">
              {selectedLanguage === 'javascript' && (
                <div className="bg-gray-900 rounded p-3">
                  <pre className="text-green-400 text-xs font-mono">
{`const fs = require('fs');
const path = require('path');

const API_KEY = "your_api_key";
const DOMAIN = "gmail.com";
const LIMIT = 500;
const MAX_PAGES = 10;
const API_BASE = "${currentApiUrl}";

async function fetchBatchData() {
  const allData = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    const offset = (page - 1) * LIMIT;
    console.log(\`Fetching page \${page} (offset: \${offset})...\`);

    try {
      const response = await fetch(
        \`\${API_BASE}/leaked-data?domain=\${DOMAIN}&limit=\${LIMIT}&offset=\${offset}\`,
        {
          headers: {
            'Authorization': \`Bearer \${API_KEY}\`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        allData.push(...data.data);

        // Save individual page
        fs.writeFileSync(\`page_\${page}.json\`, JSON.stringify(data, null, 2));

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } else {
        console.error(\`Error fetching page \${page}: \${response.status}\`);
        break;
      }
    } catch (error) {
      console.error(\`Error on page \${page}:\`, error);
      break;
    }
  }

  // Save combined data
  fs.writeFileSync('combined_data.json', JSON.stringify(allData, null, 2));
  console.log(\`Total records fetched: \${allData.length}\`);
}

fetchBatchData();`}
                  </pre>
                </div>
              )}

              {selectedLanguage === 'python' && (
                <div className="bg-gray-900 rounded p-3">
                  <pre className="text-green-400 text-xs font-mono">
{`import requests
import json
import time

API_KEY = "your_api_key"
DOMAIN = "gmail.com"
LIMIT = 500
MAX_PAGES = 10
API_BASE = "${currentApiUrl}"

def fetch_batch_data():
    all_data = []

    for page in range(1, MAX_PAGES + 1):
        offset = (page - 1) * LIMIT
        print(f"Fetching page {page} (offset: {offset})...")

        try:
            response = requests.get(
                f"{API_BASE}/leaked-data",
                params={
                    'domain': DOMAIN,
                    'limit': LIMIT,
                    'offset': offset
                },
                headers={
                    'Authorization': f'Bearer {API_KEY}',
                    'Content-Type': 'application/json'
                }
            )

            if response.status_code == 200:
                data = response.json()
                all_data.extend(data['data'])

                # Save individual page
                with open(f"page_{page}.json", "w") as f:
                    json.dump(data, f, indent=2)

                # Rate limiting
                time.sleep(0.1)
            else:
                print(f"Error fetching page {page}: {response.status_code}")
                break

        except Exception as e:
            print(f"Error on page {page}: {e}")
            break

    # Save combined data
    with open("combined_data.json", "w") as f:
        json.dump(all_data, f, indent=2)

    print(f"Total records fetched: {len(all_data)}")

if __name__ == "__main__":
    fetch_batch_data()`}
                  </pre>
                </div>
              )}

              {selectedLanguage === 'bash' && (
                <div className="bg-gray-900 rounded p-3">
                  <pre className="text-green-400 text-xs font-mono">
{`#!/bin/bash
API_KEY="your_api_key"
DOMAIN="gmail.com"
LIMIT=500
MAX_PAGES=10
API_BASE="${currentApiUrl}"

for page in {1..10}; do
  offset=$(((page - 1) * LIMIT))
  echo "Fetching page $page (offset: $offset)..."

  curl -H "Authorization: Bearer $API_KEY" \\
       "$API_BASE/leaked-data?domain=$DOMAIN&limit=$LIMIT&offset=$offset" \\
       -o "page_$page.json"

  sleep 0.1  # Rate limiting
done

# Combine all JSON files
echo "Combining all pages..."
jq -s 'flatten' page_*.json > combined_data.json
echo "Batch processing complete!"`}
                  </pre>
                </div>
              )}

              {selectedLanguage === 'java' && (
                <div className="bg-gray-900 rounded p-3">
                  <pre className="text-green-400 text-xs font-mono">
{`import java.net.http.*;
import java.net.URI;
import java.nio.file.*;
import java.util.*;

public class BatchProcessor {
    private static final String API_KEY = "your_api_key";
    private static final String DOMAIN = "gmail.com";
    private static final int LIMIT = 500;
    private static final int MAX_PAGES = 10;
    private static final String API_BASE = "${currentApiUrl}";

    public static void main(String[] args) throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        List<String> allData = new ArrayList<>();

        for (int page = 1; page <= MAX_PAGES; page++) {
            int offset = (page - 1) * LIMIT;
            System.out.println("Fetching page " + page + " (offset: " + offset + ")...");

            try {
                String query = String.format("domain=%s&limit=%d&offset=%d", DOMAIN, LIMIT, offset);
                HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(API_BASE + "/leaked-data?" + query))
                    .header("Authorization", "Bearer " + API_KEY)
                    .GET()
                    .build();

                HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

                if (response.statusCode() == 200) {
                    // Save individual page
                    Files.write(Paths.get("page_" + page + ".json"), response.body().getBytes());

                    // Rate limiting
                    Thread.sleep(100);
                } else {
                    System.err.println("Error fetching page " + page + ": " + response.statusCode());
                    break;
                }
            } catch (Exception e) {
                System.err.println("Error on page " + page + ": " + e.getMessage());
                break;
            }
        }

        System.out.println("Batch processing complete!");
    }
}`}
                  </pre>
                </div>
              )}

              {selectedLanguage === 'powershell' && (
                <div className="bg-gray-900 rounded p-3">
                  <pre className="text-green-400 text-xs font-mono">
{`$API_KEY = "your_api_key"
$DOMAIN = "gmail.com"
$LIMIT = 500
$MAX_PAGES = 10
$API_BASE = "${currentApiUrl}"
$allData = @()

for ($page = 1; $page -le $MAX_PAGES; $page++) {
    $offset = ($page - 1) * $LIMIT
    Write-Host "Fetching page $page (offset: $offset)..."

    try {
        $params = @{
            domain = $DOMAIN
            limit = $LIMIT
            offset = $offset
        }

        $uri = "$API_BASE/leaked-data"
        $headers = @{ Authorization = "Bearer $API_KEY" }
        $response = Invoke-RestMethod -Uri $uri -Method Get -Headers $headers -Body $params

        # Save individual page
        $response | ConvertTo-Json | Out-File "page_$page.json" -Encoding UTF8

        # Add to combined data
        $allData += $response.data

        # Rate limiting
        Start-Sleep -Milliseconds 100

    } catch {
        Write-Error "Error on page $page: $($_.Exception.Message)"
        break
    }
}

# Save combined data
$allData | ConvertTo-Json | Out-File "combined_data.json" -Encoding UTF8
Write-Host "Total records fetched: $($allData.Count)"
Write-Host "Batch processing complete!"`}
                  </pre>
                </div>
              )}

              {selectedLanguage === 'csharp' && (
                <div className="bg-gray-900 rounded p-3">
                  <pre className="text-green-400 text-xs font-mono">
{`using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using System.IO;

class BatchProcessor
{
    private static readonly string API_KEY = "your_api_key";
    private static readonly string DOMAIN = "gmail.com";
    private static readonly int LIMIT = 500;
    private static readonly int MAX_PAGES = 10;
    private static readonly string API_BASE = "${currentApiUrl}";
    private static readonly HttpClient client = new HttpClient();

    static async Task Main()
    {
        var allData = new List<object>();

        for (int page = 1; page <= MAX_PAGES; page++)
        {
            int offset = (page - 1) * LIMIT;
            Console.WriteLine($"Fetching page {page} (offset: {offset})...");

            try
            {
                string query = $"domain={DOMAIN}&limit={LIMIT}&offset={offset}";
                var request = new HttpRequestMessage(HttpMethod.Get,
                    $"{API_BASE}/leaked-data?{query}");
                request.Headers.Add("Authorization", $"Bearer {API_KEY}");

                var response = await client.SendAsync(request);

                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    var data = JsonSerializer.Deserialize<JsonElement>(json);

                    // Save individual page
                    await File.WriteAllTextAsync($"page_{page}.json", json);

                    // Rate limiting
                    await Task.Delay(100);
                }
                else
                {
                    Console.WriteLine($"Error fetching page {page}: {response.StatusCode}");
                    break;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error on page {page}: {ex.Message}");
                break;
            }
        }

        Console.WriteLine("Batch processing complete!");
    }
}`}
                  </pre>
                </div>
              )}

              {selectedLanguage === 'ruby' && (
                <div className="bg-gray-900 rounded p-3">
                  <pre className="text-green-400 text-xs font-mono">
{`require 'net/http'
require 'uri'
require 'json'

API_KEY = "your_api_key"
DOMAIN = "gmail.com"
LIMIT = 500
MAX_PAGES = 10
API_BASE = "${currentApiUrl}"

def fetch_batch_data
  all_data = []

  (1..MAX_PAGES).each do |page|
    offset = (page - 1) * LIMIT
    puts "Fetching page #{page} (offset: #{offset})..."

    begin
      uri = URI("#{API_BASE}/leaked-data")
      params = {
        domain: DOMAIN,
        limit: LIMIT,
        offset: offset
      }
      uri.query = URI.encode_www_form(params)

      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = uri.scheme == 'https'
      request = Net::HTTP::Get.new(uri.request_uri)
      request['Authorization'] = "Bearer #{API_KEY}"

      response = http.request(request)

      if response.is_a?(Net::HTTPSuccess)
        data = JSON.parse(response.body)

        # Save individual page
        File.write("page_#{page}.json", JSON.pretty_generate(data))

        # Rate limiting
        sleep 0.1
      else
        puts "Error fetching page #{page}: #{response.code}"
        break
      end

    rescue => e
      puts "Error on page #{page}: #{e.message}"
      break
    end
  end

  puts "Batch processing complete!"
end

fetch_batch_data`}
                  </pre>
                </div>
              )}

              {selectedLanguage === 'php' && (
                <div className="bg-gray-900 rounded p-3">
                  <pre className="text-green-400 text-xs font-mono">
{`<?php
$API_KEY = "your_api_key";
$DOMAIN = "gmail.com";
$LIMIT = 500;
$MAX_PAGES = 10;
$API_BASE = "${currentApiUrl}";

function fetch_batch_data() {
    global $API_KEY, $DOMAIN, $LIMIT, $MAX_PAGES, $API_BASE;

    for ($page = 1; $page <= $MAX_PAGES; $page++) {
        $offset = ($page - 1) * $LIMIT;
        echo "Fetching page $page (offset: $offset)...\n";

        try {
            $params = http_build_query([
                'domain' => $DOMAIN,
                'limit' => $LIMIT,
                'offset' => $offset
            ]);

            $ch = curl_init();
            curl_setopt_array($ch, [
                CURLOPT_URL => "$API_BASE/leaked-data?$params",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_HTTPHEADER => [
                    'Authorization: Bearer ' . $API_KEY,
                    'Content-Type: application/json'
                ],
                CURLOPT_TIMEOUT => 30
            ]);

            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($httpCode === 200) {
                // Save individual page
                file_put_contents("page_$page.json", $response);

                // Rate limiting
                usleep(100000); // 100ms
            } else {
                echo "Error fetching page $page: HTTP $httpCode\n";
                break;
            }

        } catch (Exception $e) {
            echo "Error on page $page: " . $e->getMessage() . "\n";
            break;
        }
    }

    echo "Batch processing complete!\n";
}

fetch_batch_data();
?>`}
                  </pre>
                </div>
              )}

              {selectedLanguage === 'curl' && (
                <div className="bg-gray-900 rounded p-3">
                  <pre className="text-green-400 text-xs font-mono">
{`#!/bin/bash
API_KEY="your_api_key"
DOMAIN="gmail.com"
LIMIT=500
MAX_PAGES=10
API_BASE="${currentApiUrl}"

# Create directory for results
mkdir -p batch_results
cd batch_results

for page in {1..10}; do
  offset=$(((page - 1) * LIMIT))
  echo "Fetching page $page (offset: $offset)..."

  # API call with curl
  curl -s -H "Authorization: Bearer $API_KEY" \\
       "$API_BASE/leaked-data?domain=$DOMAIN&limit=$LIMIT&offset=$offset" \\
       -o "page_$page.json"

  # Check if request was successful
  if [ $? -eq 0 ]; then
    echo "  ✓ Page $page saved to page_$page.json"
  else
    echo "  ✗ Failed to fetch page $page"
  fi

  # Rate limiting
  sleep 0.1
done

# Combine all JSON files
echo "Combining all pages..."
echo '[' > combined_data.json

for page in {1..10}; do
  if [ -f "page_$page.json" ]; then
    # Extract data array from each page
    jq '.data[]' page_$page.json >> combined_data.json
    echo ',' >> combined_data.json
  fi
done

# Remove trailing comma and close array
sed '$ s/,$//' combined_data.json > temp.json
echo ']' >> temp.json
mv temp.json combined_data.json

# Count total records
total=$(jq length combined_data.json)
echo "Batch processing complete! Total records: $total"
echo "Combined data saved to combined_data.json"`}
                  </pre>
                </div>
              )}

              {selectedLanguage === 'go' && (
                <div className="bg-gray-900 rounded p-3">
                  <pre className="text-green-400 text-xs font-mono">
{`package main

import (
    "encoding/json"
    "fmt"
    "io/ioutil"
    "net/http"
    "net/url"
    "os"
    "strconv"
    "time"
)

const (
    API_KEY   = "your_api_key"
    DOMAIN    = "gmail.com"
    LIMIT     = 500
    MAX_PAGES = 10
    API_BASE  = "${currentApiUrl}"
)

type LeakedDataResponse struct {
    Success bool        ` + "`json:\"success\"`" + `
    Data    []interface{} ` + "`json:\"data\"`" + `
}

func main() {
    client := &http.Client{Timeout: 30 * time.Second}
    var allData []interface{}

    for page := 1; page <= MAX_PAGES; page++ {
        offset := (page - 1) * LIMIT
        fmt.Printf("Fetching page %d (offset: %d)...\n", page, offset)

        params := url.Values{}
        params.Set("domain", DOMAIN)
        params.Set("limit", strconv.Itoa(LIMIT))
        params.Set("offset", strconv.Itoa(offset))

        req, err := http.NewRequest("GET", API_BASE+"/leaked-data?"+params.Encode(), nil)
        if err != nil {
            fmt.Printf("Error creating request: %v\n", err)
            break
        }

        req.Header.Set("Authorization", "Bearer "+API_KEY)
        req.Header.Set("Content-Type", "application/json")

        resp, err := client.Do(req)
        if err != nil {
            fmt.Printf("Error on page %d: %v\n", page, err)
            break
        }
        defer resp.Body.Close()

        if resp.StatusCode == 200 {
            body, err := ioutil.ReadAll(resp.Body)
            if err != nil {
                fmt.Printf("Error reading response: %v\n", err)
                break
            }

            var data LeakedDataResponse
            if err := json.Unmarshal(body, &data); err != nil {
                fmt.Printf("Error parsing JSON: %v\n", err)
                break
            }

            // Save individual page
            ioutil.WriteFile(fmt.Sprintf("page_%d.json", page), body, 0644)
            allData = append(allData, data.Data...)

            // Rate limiting
            time.Sleep(100 * time.Millisecond)
        } else {
            fmt.Printf("Error fetching page %d: %d\n", page, resp.StatusCode)
            break
        }
    }

    // Save combined data
    combinedData, _ := json.Marshal(allData)
    ioutil.WriteFile("combined_data.json", combinedData, 0644)

    fmt.Printf("Total records fetched: %d\n", len(allData))
    fmt.Println("Batch processing complete!")
}`}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorCodesSection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">HTTP Response Codes</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Understanding API response codes and error handling
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <span className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-3 py-1 rounded font-bold font-mono">200</span>
          <span className="text-gray-800 dark:text-gray-300 font-medium">Success - Data retrieved</span>
        </div>
        <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <span className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-3 py-1 rounded font-bold font-mono">401</span>
          <span className="text-gray-800 dark:text-gray-300 font-medium">Unauthorized - Invalid API key</span>
        </div>
        <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <span className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-3 py-1 rounded font-bold font-mono">403</span>
          <span className="text-gray-800 dark:text-gray-300 font-medium">Forbidden - Domain not verified</span>
        </div>
        <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <span className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-3 py-1 rounded font-bold font-mono">400</span>
          <span className="text-gray-800 dark:text-gray-300 font-medium">Bad Request - Missing parameters</span>
        </div>
        <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <span className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-3 py-1 rounded font-bold font-mono">500</span>
          <span className="text-gray-800 dark:text-gray-300 font-medium">Server Error - Internal issue</span>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Error Response Format</h4>
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <pre className="text-red-400 p-4 text-sm font-mono">
{`{
  "error": "Domain not found or access denied",
  "details": "Domains must be verified by administrators before API access is granted."
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}

function PerformanceSection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Performance Tips</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Best practices for optimal API performance
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Best Practices:</h4>
            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <div>
                  <strong>Appropriate Limits:</strong> Avoid requesting too much data at once (recommended: 100-1000 records)
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <div>
                  <strong>Use Pagination:</strong> Split large datasets using offset and limit
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <div>
                  <strong>Date Filtering:</strong> Narrow query ranges with date_from/date_to for better performance
                </div>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Optimization:</h4>
            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <div>
                  <strong>Type Filtering:</strong> Use type parameter to select only necessary data
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <div>
                  <strong>Rate Limiting:</strong> Avoid too frequent requests (recommended: 100ms intervals)
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <div>
                  <strong>Caching:</strong> Cache frequently accessed data to reduce API calls
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Response Time Targets</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Simple queries:</span>
              <span className="text-gray-600 dark:text-gray-400 ml-2">&lt; 500ms</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Complex filtered queries:</span>
              <span className="text-gray-600 dark:text-gray-400 ml-2">&lt; 2s</span>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Large dataset queries:</span>
              <span className="text-gray-600 dark:text-gray-400 ml-2">&lt; 5s</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Domain verification:</span>
              <span className="text-gray-600 dark:text-gray-400 ml-2">&lt; 1s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}