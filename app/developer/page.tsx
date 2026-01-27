'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Key, Search, AlertCircle, CheckCircle, Copy, Check, Book, Zap, Shield, Terminal } from 'lucide-react';
import { SharedHeader } from '@/components/shared-header';
import { SharedFooter } from '@/components/shared-footer';
import { trackDocSectionViewed, trackCodeSampleCopied } from '@/lib/vercel-analytics';

export default function DeveloperPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('introduction');
  
  // Refs for throttling and tracking
  const previousSectionRef = useRef<string>('introduction');
  const lastScrollTimeRef = useRef<number>(0);
  const THROTTLE_DELAY = 200; // milliseconds

  const copyToClipboard = (code: string, id: string, language?: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    // Track code sample copy event
    if (language) {
      trackCodeSampleCopied(language);
    }
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Throttled scroll handler to prevent excessive event firing
  const handleScroll = useCallback(() => {
    const now = Date.now();
    
    // Throttle: only process if enough time has passed
    if (now - lastScrollTimeRef.current < THROTTLE_DELAY) {
      return;
    }
    lastScrollTimeRef.current = now;
    
    const sections = [
      'introduction', 'quick-start', 'authentication', 'endpoints',
      'code-examples', 'error-handling', 'rate-limiting', 'support'
    ];
    
    const scrollPosition = window.scrollY + 100;
    
    for (const sectionId of sections) {
      const element = document.getElementById(sectionId);
      if (element) {
        const { offsetTop, offsetHeight } = element;
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          if (sectionId !== previousSectionRef.current) {
            setActiveSection(sectionId);
            // Track section viewed event (only when section actually changes)
            trackDocSectionViewed(sectionId);
            previousSectionRef.current = sectionId;
          }
          break;
        }
      }
    }
  }, []);

  // Set up scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Code samples in different languages
  const codeSamples = {
    curl: `curl -X GET "https://leakjar.com/api/search/YOUR_API_KEY/google.com/accounts" \\
  -H "Content-Type: application/json"

# With date range
curl -X GET "https://leakjar.com/api/search/YOUR_API_KEY/google.com/accounts/20240101/20241212" \\
  -H "Content-Type: application/json"`,
    
    python: `import requests

class LeakJarAPI:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = "https://leakjar.com/api/search"
    
    def search_domain(self, domain, findings_type="accounts", start_date=None, end_date=None):
        """Search for leaked data by domain"""
        if start_date and end_date:
            url = f"{self.base_url}/{self.api_key}/{domain}/{findings_type}/{start_date}/{end_date}"
        else:
            url = f"{self.base_url}/{self.api_key}/{domain}/{findings_type}"
        
        response = requests.get(url, headers={"Content-Type": "application/json"})
        response.raise_for_status()
        return response.json()

# Usage
api = LeakJarAPI("YOUR_API_KEY")
results = api.search_domain("google.com", "accounts")
print(f"Found {results['count']} leaked records")

for record in results['results']:
    print(f"Username: {record['username']}, Date: {record['date']}")`,
    
    javascript: `// Using fetch API
const API_KEY = 'YOUR_API_KEY';
const BASE_URL = 'https://leakjar.com/api/search';

async function searchDomain(domain, findingsType = 'accounts', startDate = null, endDate = null) {
  let url = \`\${BASE_URL}/\${API_KEY}/\${domain}/\${findingsType}\`;
  
  if (startDate && endDate) {
    url += \`/\${startDate}/\${endDate}\`;
  }
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }
  
  return await response.json();
}

// Usage
searchDomain('google.com', 'accounts')
  .then(data => {
    console.log(\`Found \${data.count} leaked records\`);
    data.results.forEach(record => {
      console.log(\`Username: \${record.username}, Date: \${record.date}\`);
    });
  })
  .catch(error => console.error('Error:', error));`,
    
    typescript: `import axios, { AxiosInstance } from 'axios';

interface LeakRecord {
  date: string;
  browser: string;
  status: string;
  url: string;
  ip: string;
  country: string;
  username: string;
  password: string;
}

interface SearchResponse {
  count: number;
  results: LeakRecord[];
}

class LeakJarAPI {
  private client: AxiosInstance;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: 'https://leakjar.com/api/search',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async searchDomain(
    domain: string,
    findingsType: 'accounts' | 'customers' = 'accounts',
    startDate?: string,
    endDate?: string
  ): Promise<SearchResponse> {
    let path = \`/\${this.apiKey}/\${domain}/\${findingsType}\`;
    
    if (startDate && endDate) {
      path += \`/\${startDate}/\${endDate}\`;
    }
    
    const response = await this.client.get<SearchResponse>(path);
    return response.data;
  }
}

// Usage
const api = new LeakJarAPI('YOUR_API_KEY');
const results = await api.searchDomain('google.com', 'accounts', '20240101', '20241212');
console.log(\`Found \${results.count} leaked records\`);`,
    
    php: `<?php

class LeakJarAPI {
    private $apiKey;
    private $baseUrl = 'https://leakjar.com/api/search';
    
    public function __construct($apiKey) {
        $this->apiKey = $apiKey;
    }
    
    public function searchDomain($domain, $findingsType = 'accounts', $startDate = null, $endDate = null) {
        $url = "{$this->baseUrl}/{$this->apiKey}/{$domain}/{$findingsType}";
        
        if ($startDate && $endDate) {
            $url .= "/{$startDate}/{$endDate}";
        }
        
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json'
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode !== 200) {
            throw new Exception("HTTP Error: {$httpCode}");
        }
        
        return json_decode($response, true);
    }
}

// Usage
$api = new LeakJarAPI('YOUR_API_KEY');
$results = $api->searchDomain('google.com', 'accounts');

echo "Found {$results['count']} leaked records\\n";
foreach ($results['results'] as $record) {
    echo "Username: {$record['username']}, Date: {$record['date']}\\n";
}
?>`,
    
    ruby: `require 'net/http'
require 'json'
require 'uri'

class LeakJarAPI
  def initialize(api_key)
    @api_key = api_key
    @base_url = 'https://leakjar.com/api/search'
  end
  
  def search_domain(domain, findings_type = 'accounts', start_date = nil, end_date = nil)
    path = "/#{@api_key}/#{domain}/#{findings_type}"
    path += "/#{start_date}/#{end_date}" if start_date && end_date
    
    url = URI.parse("#{@base_url}#{path}")
    
    request = Net::HTTP::Get.new(url)
    request['Content-Type'] = 'application/json'
    
    response = Net::HTTP.start(url.hostname, url.port, use_ssl: true) do |http|
      http.request(request)
    end
    
    raise "HTTP Error: #{response.code}" unless response.code == '200'
    
    JSON.parse(response.body)
  end
end

# Usage
api = LeakJarAPI.new('YOUR_API_KEY')
results = api.search_domain('google.com', 'accounts')

puts "Found #{results['count']} leaked records"
results['results'].each do |record|
  puts "Username: #{record['username']}, Date: #{record['date']}"
end`,
    
    go: `package main

import (
    "encoding/json"
    "fmt"
    "io/ioutil"
    "net/http"
    "time"
)

type LeakRecord struct {
    Date     time.Time \`json:"date"\`
    Browser  string    \`json:"browser"\`
    Status   string    \`json:"status"\`
    URL      string    \`json:"url"\`
    IP       string    \`json:"ip"\`
    Country  string    \`json:"country"\`
    Username string    \`json:"username"\`
    Password string    \`json:"password"\`
}

type SearchResponse struct {
    Count   int          \`json:"count"\`
    Results []LeakRecord \`json:"results"\`
}

type LeakJarAPI struct {
    apiKey  string
    baseURL string
}

func NewLeakJarAPI(apiKey string) *LeakJarAPI {
    return &LeakJarAPI{
        apiKey:  apiKey,
        baseURL: "https://leakjar.com/api/search",
    }
}

func (api *LeakJarAPI) SearchDomain(domain, findingsType, startDate, endDate string) (*SearchResponse, error) {
    url := fmt.Sprintf("%s/%s/%s/%s", api.baseURL, api.apiKey, domain, findingsType)
    
    if startDate != "" && endDate != "" {
        url = fmt.Sprintf("%s/%s/%s", url, startDate, endDate)
    }
    
    req, err := http.NewRequest("GET", url, nil)
    if err != nil {
        return nil, err
    }
    
    req.Header.Set("Content-Type", "application/json")
    
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()
    
    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        return nil, err
    }
    
    var result SearchResponse
    err = json.Unmarshal(body, &result)
    if err != nil {
        return nil, err
    }
    
    return &result, nil
}

func main() {
    api := NewLeakJarAPI("YOUR_API_KEY")
    results, err := api.SearchDomain("google.com", "accounts", "", "")
    
    if err != nil {
        fmt.Printf("Error: %v\\n", err)
        return
    }
    
    fmt.Printf("Found %d leaked records\\n", results.Count)
    for _, record := range results.Results {
        fmt.Printf("Username: %s, Date: %s\\n", record.Username, record.Date)
    }
}`
  };

  const sampleResponse = `{
  "count": 141,
  "results": [
    {
      "date": "2024-09-20T08:11:00.000Z",
      "browser": "Google Chrome",
      "status": "show",
      "url": "https://vdi.sampleurl.com/portal/webclient/",
      "ip": "68.0.2.248",
      "country": "US",
      "username": "sampleuser@sampleurl.com",
      "password": "Samplepassword000"
    }
  ]
}`;

  const errorResponse = `{
  "error": "Invalid API key."
}`;

  // Navigation items
  const navItems = [
    { id: 'introduction', label: 'Introduction', icon: Book },
    { id: 'quick-start', label: 'Quick Start', icon: Zap },
    { id: 'authentication', label: 'Authentication', icon: Key },
    { id: 'endpoints', label: 'API Endpoints', icon: Terminal },
    { id: 'code-examples', label: 'Code Examples', icon: Code },
    { id: 'error-handling', label: 'Error Handling', icon: AlertCircle },
    { id: 'rate-limiting', label: 'Rate Limiting', icon: Shield },
    { id: 'support', label: 'Support', icon: Search }
  ];

  const CodeBlock = ({ code, language, id }: { code: string; language: string; id: string }) => {
    const highlightCode = (code: string, lang: string) => {
      if (lang === 'json') {
        // JSON syntax highlighting
        return code
          .replace(/"([^"]+)":/g, '<span class="text-blue-400">"$1"</span>:') // property names
          .replace(/:\s*"([^"]+)"/g, ': <span class="text-green-400">"$1"</span>') // string values
          .replace(/:\s*(\d+)/g, ': <span class="text-orange-400">$1</span>') // numbers
          .replace(/:\s*(true|false|null)/g, ': <span class="text-purple-400">$1</span>') // keywords
          .replace(/(\/\/.*)/g, '<span class="text-gray-500">$1</span>'); // comments
      } else if (lang === 'http') {
        // HTTP syntax highlighting
        return code
          .replace(/(GET|POST|PUT|DELETE|PATCH)/g, '<span class="text-yellow-400">$1</span>') // methods
          .replace(/(https?:\/\/[^\s]+)/g, '<span class="text-blue-400">$1</span>') // URLs
          .replace(/\{([^}]+)\}/g, '<span class="text-green-400">{$1}</span>'); // path parameters
      } else if (lang === 'text') {
        // Plain text with URL highlighting
        return code.replace(/(https?:\/\/[^\s]+)/g, '<span class="text-blue-400">$1</span>');
      }
      return code;
    };

    return (
      <div className="relative">
        <div className="absolute top-3 right-3 z-10">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-2 text-gray-400 hover:text-gray-300 bg-gray-800/50 hover:bg-gray-800"
            onClick={() => copyToClipboard(code, id, language)}
          >
            {copiedCode === id ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </>
            )}
          </Button>
        </div>
        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto border border-gray-800">
          <code 
            className={`language-${language} text-sm`}
            dangerouslySetInnerHTML={{ __html: highlightCode(code, language) }}
          />
        </pre>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <SharedHeader />

      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              LeakJar API Documentation
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Access leaked credential data programmatically with our powerful RESTful API. 
              Build integrations in minutes with our comprehensive SDKs and code examples.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-white text-gray-900 hover:bg-gray-100">
                <Link href="/auth/signup">Get API Key →</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => scrollToSection('quick-start')}
                className="border-gray-600 text-gray-900 bg-white hover:bg-gray-100 hover:text-gray-900"
              >
                Quick Start Guide
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Documentation Content with Sidebar */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <nav className="space-y-1">
                <h3 className="font-semibold text-sm text-gray-900 mb-3 px-3">Documentation</h3>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all ${
                        activeSection === item.id
                          ? 'bg-gray-900 text-white font-medium'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 w-full max-w-4xl">
            {/* Introduction Section */}
            <section id="introduction" className="mb-16 scroll-mt-24">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card className="border-2 hover:border-gray-300 transition-colors">
                  <CardHeader>
                    <Code className="h-10 w-10 text-blue-600 mb-2" />
                    <CardTitle>RESTful API</CardTitle>
                    <CardDescription>
                      Simple HTTP endpoints with JSON responses
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-2 hover:border-gray-300 transition-colors">
                  <CardHeader>
                    <Key className="h-10 w-10 text-green-600 mb-2" />
                    <CardTitle>API Key Auth</CardTitle>
                    <CardDescription>
                      Secure authentication with API keys
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-2 hover:border-gray-300 transition-colors">
                  <CardHeader>
                    <Search className="h-10 w-10 text-purple-600 mb-2" />
                    <CardTitle>Real-time Data</CardTitle>
                    <CardDescription>
                      Access up-to-date leaked credential information
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Book className="h-5 w-5 text-blue-600" />
                    Welcome to LeakJar API
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    The LeakJar API allows you to request and retrieve leaked data associated with domains you are subscribed to. 
                    Use this API to access leaked accounts or customer information securely and efficiently.
                  </p>
                  <p className="text-gray-700">
                    This documentation will guide you through authentication, making your first request, 
                    and integrating our API into your applications using various programming languages.
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Quick Start Section */}
            <section id="quick-start" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
                <Zap className="h-8 w-8 text-yellow-500" />
                Quick Start Guide
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Get started with the LeakJar API in just a few steps.
              </p>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm">1</div>
                      <CardTitle>Base URL</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">All API requests are made to:</p>
                    <CodeBlock
                      code="https://leakjar.com/api/search"
                      language="text"
                      id="base-url"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm">2</div>
                      <CardTitle>Get Your API Key</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-4">
                      <li>Sign up for a <Link href="/auth/signup" className="text-blue-600 underline hover:no-underline">LeakJar account</Link></li>
                      <li>Subscribe to a plan</li>
                      <li>Navigate to your <Link href="/settings/api-keys" className="text-blue-600 underline hover:no-underline">API Keys settings</Link></li>
                      <li>Generate a new API key</li>
                    </ol>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        <strong>Important:</strong> Keep your API key secure and never share it publicly.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm">3</div>
                      <CardTitle>Make Your First Request</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">Try this simple cURL command:</p>
                    <CodeBlock
                      code={`curl -X GET "https://leakjar.com/api/search/YOUR_API_KEY/google.com/accounts" \\
  -H "Content-Type: application/json"`}
                      language="bash"
                      id="first-request"
                    />
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Authentication Section */}
            <section id="authentication" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
                <Key className="h-8 w-8 text-green-600" />
                Authentication
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                All API requests require an API key included in the URL path. The API key authenticates your requests and associates them with your account.
              </p>
              
              <Card className="bg-gray-50 border-gray-200">
                <CardHeader>
                  <CardTitle>Authentication Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Include your API key directly in the URL path:
                  </p>
                  <CodeBlock
                    code="GET https://leakjar.com/api/search/{YOUR_API_KEY}/{domain}/{findings_type}"
                    language="http"
                    id="auth-method"
                  />
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-600"><strong>✓ DO:</strong> Keep your API key secure</p>
                    <p className="text-sm text-gray-600"><strong>✓ DO:</strong> Use environment variables to store your key</p>
                    <p className="text-sm text-gray-600"><strong>✗ DON&apos;T:</strong> Commit API keys to version control</p>
                    <p className="text-sm text-gray-600"><strong>✗ DON&apos;T:</strong> Expose API keys in client-side code</p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* API Endpoints Section */}
            <section id="endpoints" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
                <Terminal className="h-8 w-8 text-indigo-600" />
                API Endpoints
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Retrieve leaked results for domains you are subscribed to.
              </p>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>HTTP Request</CardTitle>
                </CardHeader>
                <CardContent>
                  <CodeBlock
                    code="GET https://leakjar.com/api/search/{API_KEY}/{DOMAIN}/{FINDINGS_TYPE}/{START_DATE}/{END_DATE}"
                    language="http"
                    id="endpoint"
                  />
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Path Parameters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Parameter</th>
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Type</th>
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 px-4 py-3 font-mono text-sm">API_KEY</td>
                          <td className="border border-gray-300 px-4 py-3">
                            <Badge variant="outline">Required</Badge>
                          </td>
                          <td className="border border-gray-300 px-4 py-3">Your unique API key</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-300 px-4 py-3 font-mono text-sm">DOMAIN</td>
                          <td className="border border-gray-300 px-4 py-3">
                            <Badge variant="outline">Required</Badge>
                          </td>
                          <td className="border border-gray-300 px-4 py-3">The domain you are subscribed to (e.g., google.com)</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-3 font-mono text-sm">FINDINGS_TYPE</td>
                          <td className="border border-gray-300 px-4 py-3">
                            <Badge variant="outline">Required</Badge>
                          </td>
                          <td className="border border-gray-300 px-4 py-3">
                            Type of data: <code className="bg-gray-100 px-2 py-1 rounded">accounts</code> (or <code className="bg-gray-100 px-2 py-1 rounded">a</code>) or <code className="bg-gray-100 px-2 py-1 rounded">customers</code> (or <code className="bg-gray-100 px-2 py-1 rounded">c</code>)
                          </td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-300 px-4 py-3 font-mono text-sm">START_DATE</td>
                          <td className="border border-gray-300 px-4 py-3">
                            <Badge variant="secondary">Optional</Badge>
                          </td>
                          <td className="border border-gray-300 px-4 py-3">Start date (format: YYYYMMDD). Omit to search all dates</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-3 font-mono text-sm">END_DATE</td>
                          <td className="border border-gray-300 px-4 py-3">
                            <Badge variant="secondary">Optional</Badge>
                          </td>
                          <td className="border border-gray-300 px-4 py-3">End date (format: YYYYMMDD). Omit to search all dates</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Response Format</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">The response is a JSON object containing the count of leaked records and an array of the results.</p>
                  <CodeBlock
                    code={sampleResponse}
                    language="json"
                    id="sample-response"
                  />
                </CardContent>
              </Card>
            </section>

            {/* Code Examples Section */}
            <section id="code-examples" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
                <Code className="h-8 w-8 text-purple-600" />
                Code Examples
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Get started quickly with these code examples in your favorite programming language.
              </p>

              <Card>
                <CardContent className="pt-6">
                  <Tabs defaultValue="curl" className="w-full">
                    <TabsList className="grid w-full grid-cols-7 mb-6">
                      <TabsTrigger value="curl">cURL</TabsTrigger>
                      <TabsTrigger value="python">Python</TabsTrigger>
                      <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                      <TabsTrigger value="typescript">TypeScript</TabsTrigger>
                      <TabsTrigger value="php">PHP</TabsTrigger>
                      <TabsTrigger value="ruby">Ruby</TabsTrigger>
                      <TabsTrigger value="go">Go</TabsTrigger>
                    </TabsList>

                    <TabsContent value="curl">
                      <div className="mb-4">
                        <h3 className="font-semibold text-lg mb-2">cURL Example</h3>
                        <p className="text-sm text-gray-600 mb-4">Simple command-line HTTP requests</p>
                      </div>
                      <CodeBlock code={codeSamples.curl} language="bash" id="code-curl" />
                    </TabsContent>

                    <TabsContent value="python">
                      <div className="mb-4">
                        <h3 className="font-semibold text-lg mb-2">Python Example</h3>
                        <p className="text-sm text-gray-600 mb-4">Using the requests library</p>
                      </div>
                      <CodeBlock code={codeSamples.python} language="python" id="code-python" />
                    </TabsContent>

                    <TabsContent value="javascript">
                      <div className="mb-4">
                        <h3 className="font-semibold text-lg mb-2">JavaScript Example</h3>
                        <p className="text-sm text-gray-600 mb-4">Using modern fetch API</p>
                      </div>
                      <CodeBlock code={codeSamples.javascript} language="javascript" id="code-javascript" />
                    </TabsContent>

                    <TabsContent value="typescript">
                      <div className="mb-4">
                        <h3 className="font-semibold text-lg mb-2">TypeScript Example</h3>
                        <p className="text-sm text-gray-600 mb-4">Fully typed implementation with axios</p>
                      </div>
                      <CodeBlock code={codeSamples.typescript} language="typescript" id="code-typescript" />
                    </TabsContent>

                    <TabsContent value="php">
                      <div className="mb-4">
                        <h3 className="font-semibold text-lg mb-2">PHP Example</h3>
                        <p className="text-sm text-gray-600 mb-4">Using cURL extension</p>
                      </div>
                      <CodeBlock code={codeSamples.php} language="php" id="code-php" />
                    </TabsContent>

                    <TabsContent value="ruby">
                      <div className="mb-4">
                        <h3 className="font-semibold text-lg mb-2">Ruby Example</h3>
                        <p className="text-sm text-gray-600 mb-4">Using Net::HTTP library</p>
                      </div>
                      <CodeBlock code={codeSamples.ruby} language="ruby" id="code-ruby" />
                    </TabsContent>

                    <TabsContent value="go">
                      <div className="mb-4">
                        <h3 className="font-semibold text-lg mb-2">Go Example</h3>
                        <p className="text-sm text-gray-600 mb-4">Using standard net/http package</p>
                      </div>
                      <CodeBlock code={codeSamples.go} language="go" id="code-go" />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </section>

            {/* Error Handling Section */}
            <section id="error-handling" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="h-8 w-8 text-red-600" />
                Error Handling
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                The API uses standard HTTP status codes to indicate success or failure.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      200 OK
                    </CardTitle>
                    <CardDescription>The request was successful</CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-gray-600" />
                      400 Bad Request
                    </CardTitle>
                    <CardDescription>The request was invalid or cannot be processed</CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-gray-600" />
                      401 Unauthorized
                    </CardTitle>
                    <CardDescription>Authentication failed due to an invalid API key</CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-gray-600" />
                      403 Forbidden
                    </CardTitle>
                    <CardDescription>No permission to access this resource</CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-gray-600" />
                      404 Not Found
                    </CardTitle>
                    <CardDescription>The requested resource does not exist</CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-gray-600" />
                      500 Internal Server Error
                    </CardTitle>
                    <CardDescription>An error occurred on the server</CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Sample Error Response</CardTitle>
                </CardHeader>
                <CardContent>
                  <CodeBlock
                    code={errorResponse}
                    language="json"
                    id="error-response"
                  />
                </CardContent>
              </Card>
            </section>

            {/* Rate Limiting Section */}
            <section id="rate-limiting" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
                <Shield className="h-8 w-8 text-blue-600" />
                Rate Limiting
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                API requests are rate-limited to ensure fair usage and optimal performance for all users.
              </p>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Free Tier</CardTitle>
                    <CardDescription className="text-2xl font-bold text-gray-900">100/hour</CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Pro Tier</CardTitle>
                    <CardDescription className="text-2xl font-bold text-gray-900">1,000/hour</CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Enterprise</CardTitle>
                    <CardDescription className="text-2xl font-bold text-gray-900">10,000/hour</CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Rate Limit Headers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">All responses include rate limit information in headers:</p>
                  <CodeBlock
                    code={`X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200`}
                    language="http"
                    id="rate-limit-headers"
                  />
                </CardContent>
              </Card>
            </section>

            {/* SDKs Section - Hidden for now */}
            {/* <section id="sdks" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
                <Code className="h-8 w-8 text-indigo-600" />
                SDKs & Libraries
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Official and community-maintained SDKs to help you integrate faster.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Code className="h-6 w-6 text-blue-600" />
                      </div>
                      Python SDK
                    </CardTitle>
                    <CardDescription>Official Python library with full type hints</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">pip install leakjar</code>
                    <p className="text-sm text-gray-600 mt-3">Coming soon...</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Code className="h-6 w-6 text-yellow-600" />
                      </div>
                      JavaScript/TypeScript SDK
                    </CardTitle>
                    <CardDescription>NPM package for Node.js and browsers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">npm install @leakjar/sdk</code>
                    <p className="text-sm text-gray-600 mt-3">Coming soon...</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Code className="h-6 w-6 text-purple-600" />
                      </div>
                      PHP SDK
                    </CardTitle>
                    <CardDescription>Composer package for PHP applications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">composer require leakjar/sdk</code>
                    <p className="text-sm text-gray-600 mt-3">Coming soon...</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                        <Code className="h-6 w-6 text-cyan-600" />
                      </div>
                      Go SDK
                    </CardTitle>
                    <CardDescription>Go module for high-performance applications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">go get github.com/leakjar/sdk-go</code>
                    <p className="text-sm text-gray-600 mt-3">Coming soon...</p>
                  </CardContent>
                </Card>
              </div>
            </section> */}

            {/* Support Section */}
            <section id="support" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
                <Search className="h-8 w-8 text-teal-600" />
                Support & Resources
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Documentation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Comprehensive guides, API references, and best practices.
                    </p>
                    <Button variant="outline" asChild>
                      <Link href="/developer">View Documentation</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contact Support</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Need help? Our support team is here to assist you.
                    </p>
                    <Button variant="outline" asChild>
                      <Link href="/contact">Get in Touch</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>API Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Check the current status and uptime of our API services.
                    </p>
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-semibold">All Systems Operational</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Sign up now and get your API key to start accessing leaked credential data
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-white text-gray-900 hover:bg-gray-300">
                <Link href="/auth/signup">Get Your API Key →</Link>
              </Button>
              <Button size="lg" asChild className="bg-white text-gray-900 hover:bg-gray-300">
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SharedFooter />
    </div>
  );
}

