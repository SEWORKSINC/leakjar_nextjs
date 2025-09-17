'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Globe, Mail, AlertCircle, Calendar, Lock, ArrowLeft, TrendingUp } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { CountryFlag } from '@/components/country-flag';

interface PageProps {
  params: Promise<{
    domain: string;
  }>;
}

export default function OpenSearchPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const domain = decodeURIComponent(resolvedParams.domain);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    urlBreaches: [],
    emailBreaches: [],
    totalUrlBreaches: 0,
    totalEmailBreaches: 0,
    lastBreachDate: null
  });

  useEffect(() => {
    if (domain) {
      fetchBreachData();
    }
  }, [domain]);

  const fetchBreachData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/open-search/${encodeURIComponent(domain)}`);

      if (response.ok) {
        const result = await response.json();

        console.log('API Response:', result); // Debug log

        // Transform RESTful response to component format
        setData({
          urlBreaches: result.data?.urlMonitoring?.recent || [],
          emailBreaches: result.data?.emailMonitoring?.recent || [],
          totalUrlBreaches: parseInt(result.data?.urlMonitoring?.total) || 0,
          totalEmailBreaches: parseInt(result.data?.emailMonitoring?.total) || 0,
          lastBreachDate: result.summary?.lastBreachDate || null
        });

        // Log sample data to check country field
        if (result.data?.urlMonitoring?.recent?.[0]) {
          console.log('Sample URL breach data:', result.data.urlMonitoring.recent[0]);
        }
      } else {
        console.error('Failed to fetch data:', response.status);
        setData({
          urlBreaches: [],
          emailBreaches: [],
          totalUrlBreaches: 0,
          totalEmailBreaches: 0,
          lastBreachDate: null
        });
      }
    } catch (error) {
      console.error('Error fetching breach data:', error);
      setData({
        urlBreaches: [],
        emailBreaches: [],
        totalUrlBreaches: 0,
        totalEmailBreaches: 0,
        lastBreachDate: null
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const maskPassword = (password: string) => {
    if (!password || password === '[NOT_SAVED]') return 'N/A';
    if (password.length <= 3) {
      return `${password}***`;
    }
    return `${password.substring(0, 3)}***`;
  };


  if (!domain) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Domain Specified</CardTitle>
            <CardDescription>Please provide a domain to search</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/landing">
              <Button className="w-full">Go Back to Search</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/landing">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-gray-700" />
              <h1 className="text-2xl font-bold text-gray-900">LeakJar</h1>
            </div>
          </div>
          <div className="flex space-x-3">
            <Link href="/auth/login">
              <Button variant="outline" className="border-gray-300">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-gray-700 hover:bg-gray-800">Get Full Access</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Results Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Domain Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Breach Report for {domain}
            </h2>
            <p className="text-xl text-gray-600">
              Free preview showing latest 5 records with passwords from each category
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
            </div>
          ) : (
            <>
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <Card className="border-gray-200">
                  <CardContent className="p-6">
                    <Calendar className="h-8 w-8 text-gray-600 mb-2" />
                    <div className="text-2xl font-bold text-gray-900">
                      {formatDate(data.lastBreachDate)}
                    </div>
                    <p className="text-sm text-gray-600">Last Breach</p>
                  </CardContent>
                </Card>
                <Card className="border-gray-200">
                  <CardContent className="p-6">
                    <TrendingUp className="h-8 w-8 text-gray-600 mb-2" />
                    <div className="text-2xl font-bold text-gray-900">
                      {(data.totalUrlBreaches + data.totalEmailBreaches).toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-600">Total Breaches</p>
                  </CardContent>
                </Card>
                <Card className="border-gray-200">
                  <CardContent className="p-6">
                    <Globe className="h-8 w-8 text-gray-600 mb-2" />
                    <div className="text-2xl font-bold text-gray-900">
                      {data.totalUrlBreaches.toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-600">URL Breaches</p>
                  </CardContent>
                </Card>
                <Card className="border-gray-200">
                  <CardContent className="p-6">
                    <Mail className="h-8 w-8 text-gray-600 mb-2" />
                    <div className="text-2xl font-bold text-gray-900">
                      {data.totalEmailBreaches.toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-600">Email Breaches</p>
                  </CardContent>
                </Card>
              </div>

              {/* URL Monitoring Results */}
              <Card className="mb-8 border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    URL Monitoring - Latest 5 Records
                  </CardTitle>
                  <CardDescription>
                    Most recent credential breaches for {domain} URLs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {data.urlBreaches.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b text-left">
                            <th className="pb-3 font-medium text-gray-700">Date</th>
                            <th className="pb-3 font-medium text-gray-700">URL</th>
                            <th className="pb-3 font-medium text-gray-700">Username</th>
                            <th className="pb-3 font-medium text-gray-700">ID</th>
                            <th className="pb-3 font-medium text-gray-700">Password</th>
                            <th className="pb-3 font-medium text-gray-700">Country</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.urlBreaches.map((breach: any, index: number) => (
                            <tr key={index} className="border-b">
                              <td className="py-3 text-gray-600 text-sm">
                                {formatDate(breach.date_collected)}
                              </td>
                              <td className="py-3 text-gray-900 font-mono text-sm">
                                {breach.url || 'N/A'}
                              </td>
                              <td className="py-3 text-gray-700 font-mono text-sm">
                                {breach.user_name || 'N/A'}
                              </td>
                              <td className="py-3 text-gray-900 font-mono text-sm font-medium">
                                {breach.id || 'N/A'}
                              </td>
                              <td className="py-3 text-gray-600 font-mono text-sm">
                                {maskPassword(breach.pw)}
                              </td>
                              <td className="py-3">
                                <CountryFlag countryCode={breach.country || ''} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Globe className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>No URL breaches found for this domain</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Email Monitoring Results */}
              <Card className="mb-8 border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email Monitoring - Latest 5 Records
                  </CardTitle>
                  <CardDescription>
                    Most recent credential breaches for @{domain} email addresses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {data.emailBreaches.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b text-left">
                            <th className="pb-3 font-medium text-gray-700">Date</th>
                            <th className="pb-3 font-medium text-gray-700">URL</th>
                            <th className="pb-3 font-medium text-gray-700">Username</th>
                            <th className="pb-3 font-medium text-gray-700">Email</th>
                            <th className="pb-3 font-medium text-gray-700">Password</th>
                            <th className="pb-3 font-medium text-gray-700">Country</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.emailBreaches.map((breach: any, index: number) => (
                            <tr key={index} className="border-b">
                              <td className="py-3 text-gray-600 text-sm">
                                {formatDate(breach.date_collected)}
                              </td>
                              <td className="py-3 text-gray-600 font-mono text-sm">
                                {breach.url || 'N/A'}
                              </td>
                              <td className="py-3 text-gray-700 font-mono text-sm">
                                {breach.user_name || 'N/A'}
                              </td>
                              <td className="py-3 text-gray-900 font-mono text-sm font-medium">
                                {breach.id || 'N/A'}
                              </td>
                              <td className="py-3 text-gray-600 font-mono text-sm">
                                {maskPassword(breach.pw)}
                              </td>
                              <td className="py-3">
                                <CountryFlag countryCode={breach.country || ''} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Mail className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>No email breaches found for this domain</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* CTA Section */}
              <Card className="bg-gradient-to-r from-gray-700 to-gray-900 text-white border-0">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Lock className="h-6 w-6" />
                    Get Complete Access
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    This is just a preview. Sign up to see all {(data.totalUrlBreaches + data.totalEmailBreaches).toLocaleString()} breach records and get real-time alerts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold mb-3">With Full Access:</h4>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li>✓ View all {data.totalUrlBreaches.toLocaleString()} URL breach records</li>
                        <li>✓ View all {data.totalEmailBreaches.toLocaleString()} email breach records</li>
                        <li>✓ See complete unmasked data</li>
                        <li>✓ Download breach reports</li>
                        <li>✓ Real-time breach alerts</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Advanced Features:</h4>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li>✓ Monitor multiple domains</li>
                        <li>✓ Advanced search filters</li>
                        <li>✓ API access</li>
                        <li>✓ Team collaboration</li>
                        <li>✓ Custom alerts</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Link href="/auth/signup">
                      <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                        Start Free Trial
                      </Button>
                    </Link>
                    <Link href="/auth/login">
                      <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                        Sign In
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </section>
    </div>
  );
}