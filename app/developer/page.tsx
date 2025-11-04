'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Code, Key, Search, AlertCircle, CheckCircle, Copy, Check } from 'lucide-react';
import { SharedFooter } from '@/components/shared-footer';

export default function DeveloperPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const sampleRequest1 = `GET https://leakjar.com/api/search/api_fb132ee23e3b40d6b2cc57aaaaaaaaa/google.com/accounts`;

  const sampleRequest2 = `GET https://leakjar.com/api/search/api_fb132ee23e3b40d6b2cc57aaaaaaaaa/google.com/accounts/20240101/20241212`;

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
    // Additional records...
  ]
}`;

  const errorResponse = `{
  "error": "Invalid API key."
}`;

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
            onClick={() => copyToClipboard(code, id)}
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
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer">
            <Shield className="h-8 w-8 text-gray-700" />
            <h1 className="text-2xl font-bold text-gray-900">LeakJar</h1>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link href="/features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">About Us</Link>
            <Link href="/developer" className="text-gray-900 font-semibold">Developer</Link>
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</Link>
          </nav>
          <div className="flex space-x-3">
            <Link href="/auth/login">
              <Button variant="outline" className="border-gray-300">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-gray-700 hover:bg-gray-800">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              LeakJar API Documentation
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Access leaked credential data programmatically with our RESTful API
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-gray-700 hover:bg-gray-600">
                <Link href="/auth/signup">Get API Key</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-white border-white text-gray-900 hover:bg-gray-100">
                <a href="#quick-start">Quick Start</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <Code className="h-10 w-10 text-gray-600 mb-2" />
                <CardTitle>RESTful API</CardTitle>
                <CardDescription>
                  Simple HTTP endpoints with JSON responses
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Key className="h-10 w-10 text-gray-600 mb-2" />
                <CardTitle>API Key Auth</CardTitle>
                <CardDescription>
                  Secure authentication with API keys
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Search className="h-10 w-10 text-gray-600 mb-2" />
                <CardTitle>Real-time Data</CardTitle>
                <CardDescription>
                  Access up-to-date leaked credential information
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Card className="mb-12 bg-muted/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                The LeakJar API allows you to request and retrieve leaked data associated with domains you are subscribed to. 
                Use this API to access leaked accounts or customer information securely and efficiently.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Base URL Section */}
      <section className="container mx-auto px-4 py-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Base URL</h2>
          <CodeBlock
            code="https://leakjar.com/api"
            language="text"
            id="base-url"
          />
        </div>
      </section>

      {/* Authentication Section */}
      <section id="quick-start" className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Authentication</h2>
          <p className="text-lg text-gray-600 mb-6">
            All API requests require an API key. You can generate your API key from your account dashboard after subscribing to a plan.
          </p>
          
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Getting Your API Key
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Sign up for a LeakJar account</li>
                <li>Subscribe to a plan</li>
                <li>Navigate to your <Link href="/settings/api-keys" className="text-foreground underline hover:no-underline">API Keys settings</Link></li>
                <li>Generate a new API key</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* API Endpoint Section */}
      <section className="container mx-auto px-4 py-12 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Endpoint: Search Accounts</h2>
          <p className="text-lg text-gray-600 mb-8">
            Retrieve leaked results for domains you are subscribed to.
          </p>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">HTTP Request</h3>
            <CodeBlock
              code="GET https://leakjar.com/api/search/{API_KEY}/{DOMAIN}/{FINDINGS_TYPE}/{START_DATE}/{END_DATE}"
              language="http"
              id="endpoint"
            />
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Path Parameters</h3>
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
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Headers</h3>
            <CodeBlock
              code={`Content-Type: application/json`}
              language="http"
              id="headers"
            />
          </div>
        </div>
      </section>

      {/* Sample Requests Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Sample Requests</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Basic Request (All Dates)</h3>
              <CodeBlock
                code={sampleRequest1}
                language="http"
                id="sample-request-1"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Request with Date Range</h3>
              <CodeBlock
                code={sampleRequest2}
                language="http"
                id="sample-request-2"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Response Section */}
      <section className="container mx-auto px-4 py-12 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Response</h2>
          <p className="text-lg text-gray-600 mb-6">
            The response is a JSON object containing the count of leaked records and an array of the results.
          </p>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Response Parameters</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Field</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Type</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 font-mono text-sm">count</td>
                    <td className="border border-gray-300 px-4 py-3 text-sm">integer</td>
                    <td className="border border-gray-300 px-4 py-3">Total number of leaked records found</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-mono text-sm">results</td>
                    <td className="border border-gray-300 px-4 py-3 text-sm">array</td>
                    <td className="border border-gray-300 px-4 py-3">Array of leaked record objects</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 font-mono text-sm pl-8">└─ date</td>
                    <td className="border border-gray-300 px-4 py-3 text-sm">string</td>
                    <td className="border border-gray-300 px-4 py-3">Date and time when data was leaked (ISO 8601 format)</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-mono text-sm pl-8">└─ browser</td>
                    <td className="border border-gray-300 px-4 py-3 text-sm">string</td>
                    <td className="border border-gray-300 px-4 py-3">Browser from which data was obtained</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 font-mono text-sm pl-8">└─ status</td>
                    <td className="border border-gray-300 px-4 py-3 text-sm">string</td>
                    <td className="border border-gray-300 px-4 py-3">Status of the record (show or hide)</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-mono text-sm pl-8">└─ url</td>
                    <td className="border border-gray-300 px-4 py-3 text-sm">string</td>
                    <td className="border border-gray-300 px-4 py-3">URL associated with the leaked data</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 font-mono text-sm pl-8">└─ ip</td>
                    <td className="border border-gray-300 px-4 py-3 text-sm">string</td>
                    <td className="border border-gray-300 px-4 py-3">IP address from which data was accessed</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-mono text-sm pl-8">└─ country</td>
                    <td className="border border-gray-300 px-4 py-3 text-sm">string</td>
                    <td className="border border-gray-300 px-4 py-3">Country code of the IP address</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 font-mono text-sm pl-8">└─ username</td>
                    <td className="border border-gray-300 px-4 py-3 text-sm">string</td>
                    <td className="border border-gray-300 px-4 py-3">Leaked username or email</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-mono text-sm pl-8">└─ password</td>
                    <td className="border border-gray-300 px-4 py-3 text-sm">string</td>
                    <td className="border border-gray-300 px-4 py-3">Leaked password</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Sample Response</h3>
            <CodeBlock
              code={sampleResponse}
              language="json"
              id="sample-response"
            />
          </div>
        </div>
      </section>

      {/* Error Handling Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Error Handling</h2>
          <p className="text-lg text-gray-600 mb-6">
            The API uses standard HTTP status codes to indicate success or failure.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <Card>
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
                  <AlertCircle className="h-5 w-5 text-muted-foreground" />
                  400 Bad Request
                </CardTitle>
                <CardDescription>The request was invalid or cannot be processed</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-muted-foreground" />
                  401 Unauthorized
                </CardTitle>
                <CardDescription>Authentication failed due to an invalid API key</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-muted-foreground" />
                  403 Forbidden
                </CardTitle>
                <CardDescription>No permission to access this resource or unauthorized IP</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-muted-foreground" />
                  404 Not Found
                </CardTitle>
                <CardDescription>The requested resource does not exist</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-muted-foreground" />
                  500 Internal Server Error
                </CardTitle>
                <CardDescription>An error occurred on the server</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Sample Error Response</h3>
            <CodeBlock
              code={errorResponse}
              language="json"
              id="error-response"
            />
          </div>
        </div>
      </section>

      {/* Terms & Support Section */}
      <section className="container mx-auto px-4 py-12 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Terms of Use</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  By using this API, you agree to abide by the LeakJar Terms of Service and ensure that all data 
                  retrieved is handled securely and in compliance with applicable laws and regulations.
                </p>
                <Button variant="outline" asChild>
                  <a href="#terms">Read Terms of Service</a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  For assistance, please contact our support team through your account dashboard.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/dashboard">Contact Support</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-destructive/10 rounded-2xl p-8 md:p-12 text-center border-2 border-destructive/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Sign up now and get your API key to start accessing leaked credential data
            </p>
            <Button size="lg" asChild>
              <Link href="/auth/signup">Get Your API Key</Link>
            </Button>
          </div>
        </div>
      </section>

      <SharedFooter />
    </div>
  );
}

