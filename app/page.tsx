'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Database, Globe, Search, AlertTriangle, CheckCircle2, Lock, Zap, Activity, Eye, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { SharedHeader } from '@/components/shared-header';
import { SharedFooter } from '@/components/shared-footer';
import { PageHeaderSkeleton, CardSkeleton, StatsSkeleton } from '@/components/ui/skeleton';
import { ScrollReveal } from '@/components/scroll-reveal';

// Structured Data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.leakjar.com/#organization",
      "name": "LeakJar",
      "alternateName": "SEW Inc.",
      "url": "https://www.leakjar.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.leakjar.com/logo.png"
      },
      "sameAs": [
        "https://twitter.com/leakjar",
        "https://linkedin.com/company/leakjar"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Service",
        "email": "support@leakjar.com"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://www.leakjar.com/#website",
      "url": "https://www.leakjar.com",
      "name": "LeakJar",
      "publisher": {
        "@id": "https://www.leakjar.com/#organization"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.leakjar.com/open-search/{search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://www.leakjar.com/#webpage",
      "url": "https://www.leakjar.com",
      "name": "LeakJar - Proactive Credential Leak Monitoring & Breach Detection",
      "description": "Monitor 60B+ leaked credentials in real-time. Detect compromised accounts before attackers exploit them.",
      "isPartOf": {
        "@id": "https://www.leakjar.com/#website"
      }
    },
    {
      "@type": "SoftwareApplication",
      "name": "LeakJar",
      "applicationCategory": "SecurityApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "150"
      }
    }
  ]
};

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRecords: 0,
    dailyAdditions: 0,
  });
  const [searchEmail, setSearchEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    checkAuthAndRedirect();
    
    // Animate numbers
    const animateValue = (start: number, end: number, setter: (value: number) => void) => {
      const duration = 2000;
      const increment = end / (duration / 16);
      let current = start;

      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          setter(end);
          clearInterval(timer);
        } else {
          setter(Math.floor(current));
        }
      }, 16);
    };

    animateValue(0, 60000000000, (v) => setStats(s => ({ ...s, totalRecords: v })));
    animateValue(0, 11000000, (v) => setStats(s => ({ ...s, dailyAdditions: v })));
  }, []);

  async function checkAuthAndRedirect() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        router.push('/dashboard');
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setIsLoading(false);
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(0)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(0)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const handleSearch = async () => {
    setEmailError('');
    
    if (!searchEmail || !searchEmail.includes('@')) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setIsSearching(true);
    const domain = searchEmail.split('@')[1];
    router.push(`/open-search/${encodeURIComponent(domain)}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (isLoading) {
    return (
      <>
        <div className="min-h-screen bg-white">
          <SharedHeader />
          <main id="main-content">
            <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
              <div className="container mx-auto px-4 py-20 lg:py-28">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="max-w-2xl">
                    <PageHeaderSkeleton />
                  </div>
                  <div className="relative hidden lg:block">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-100 h-96"></div>
                  </div>
                </div>
              </div>
            </section>

            <section className="container mx-auto px-4 py-20">
              <div className="max-w-4xl mx-auto">
                <CardSkeleton />
              </div>
            </section>

            <section className="bg-gray-900 text-white py-16">
              <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map((i) => (
                      <StatsSkeleton key={i} />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </main>
          <SharedFooter />
        </div>
      </>
    );
  }

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-white">
        {/* Header */}
        <SharedHeader />

      {/* Hero Section */}
      <main id="main-content">
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="max-w-2xl">
              <Badge className="mb-6 px-4 py-1.5" variant="secondary">
                <Activity className="h-3.5 w-3.5 mr-2 inline" />
                60B+ Credential Records Monitored
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Proactively Monitor for Leaked Credentials
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Instantly identify compromised accounts and stay ahead of cyber threats. 
                LeakJar continuously scans for leaked credentials linked to your employees 
                and customers, alerting you the moment they appear.
              </p>

              {/* Key Points */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">24/7 real-time monitoring across underground sources</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Instant alerts for compromised credentials</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Dashboard + API for seamless integration</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/freetier">
                  <Button size="lg" className="bg-gray-900 hover:bg-gray-800 w-full sm:w-auto">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/features">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column - Video/Visual */}
            <div className="relative hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <video 
                  className="w-full h-auto" 
                  muted 
                  autoPlay 
                  loop 
                  playsInline
                  loading="lazy"
                  preload="metadata"
                  aria-label="LeakJar credential monitoring visualization"
                >
                  <source src="/world_c.webm" type="video/webm" />
                  <source src="/world_c.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Email Search - Critical Hook Feature */}
      <section className="container mx-auto px-4 py-20">
        <ScrollReveal className="max-w-4xl mx-auto">
          <Card className="border-2 border-gray-200 shadow-xl bg-white">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4 h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center">
                <Search className="h-7 w-7 text-blue-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900 mb-3">
                Check Your Company's Exposure — Free
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Enter your company email to instantly see if your domain appears in our 60 billion+ leaked credential database. 
                No registration required.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-2xl mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <Input
                      type="email"
                      placeholder="yourname@company.com"
                      value={searchEmail}
                      onChange={(e) => {
                        setSearchEmail(e.target.value);
                        setEmailError('');
                      }}
                      onKeyPress={handleKeyPress}
                      className={`text-lg py-6 ${emailError ? 'border-red-500' : ''}`}
                      disabled={isSearching}
                    />
                    {emailError && (
                      <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4" />
                        {emailError}
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={handleSearch}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 px-8 py-6 text-lg"
                    disabled={isSearching}
                  >
                    {isSearching ? (
                      <>
                        <Search className="h-5 w-5 mr-2 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="h-5 w-5 mr-2" />
                        Search Now
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-center text-sm text-gray-500 mt-4">
                  ✓ Instant results • ✓ No credit card required • ✓ View latest 5 breach records
                </p>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </section>

      {/* Impressive Stats */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">
              LeakJar has over <span className="text-blue-400">{formatNumber(stats.totalRecords)}</span> pieces of data,
              <br className="hidden md:block" />
              with an average of <span className="text-blue-400">{formatNumber(stats.dailyAdditions)}</span> new additions <span className="text-blue-400">every day</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-4xl font-bold text-blue-400 mb-2">{formatNumber(stats.totalRecords)}</div>
                <p className="text-gray-300">Total Records</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-400 mb-2">{formatNumber(stats.dailyAdditions)}</div>
                <p className="text-gray-300">Daily Additions</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-400 mb-2">24/7</div>
                <p className="text-gray-300">Monitoring</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-400 mb-2">&lt;1hr</div>
                <p className="text-gray-300">Alert Time</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Social Proof - Trusted by Market Leaders */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Trusted by Market Leaders
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-6xl mx-auto">
            {[
              '#1 Global Chat API',
              '#1 Global Live commerce',
              '#1 AI-powered Translate',
              'Leading e-commerce',
              'Leading collaboration tool',
              'Leading B2B SaaS'
            ].map((company, idx) => (
              <div key={idx} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-semibold text-gray-700">{company}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dig Deeper - Intelligence Gathering */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Dig Deeper to Uncover Real-World Data
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              LeakJar offers unmatched leaked data intelligence beyond the public internet and dark web, 
              delivering actionable insights through our proprietary collection process that harnesses a 
              <strong> global Human Intelligence (HUMINT) network</strong> and <strong>in-house data analysis expertise</strong>. 
              Our fully automated, 24/7 sensitive data gathering and analysis service empowers you to thwart 
              account takeovers and fortify your digital security posture.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="border-blue-200 bg-white">
              <CardHeader>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Comprehensive Data Collection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Continuous collection from unique sources, leveraging human intelligence and underground channels 
                  to process real-world data from the cyber underground.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-white">
              <CardHeader>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <AlertTriangle className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Early Breach Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Identify compromised credentials from the first attempt of an attack, with plaintext format 
                  enabling quick identification and immediate password resets.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-white">
              <CardHeader>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Proactive Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Instant notifications via dashboard, email, or RESTful API with detailed information and 
                  actionable recommendations for immediate response.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Data Processing Power */}
      <section className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Unmatched Data Processing,
              <br />
              <span className="text-blue-400">Hundreds of Gigabytes Daily</span>
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              LeakJar is a data processing powerhouse, analyzing hundreds of gigabytes of sensitive information 
              daily, including compromised accounts, passwords, IP addresses, and associated services. Our advanced 
              systems identify potential breaches <strong>before the data is widely shared on the dark web or public internet</strong>, 
              enabling you to take swift action against both known and unknown attacks.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/10 rounded-lg p-6">
                <Database className="h-10 w-10 text-blue-400 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Multi-Source Intelligence</h3>
                <p className="text-gray-300 text-sm">Underground forums, HUMINT networks, and proprietary data channels</p>
              </div>
              <div className="bg-white/10 rounded-lg p-6">
                <Lock className="h-10 w-10 text-blue-400 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Encrypted Storage</h3>
                <p className="text-gray-300 text-sm">All data securely encrypted and accessible only to authenticated customers</p>
              </div>
              <div className="bg-white/10 rounded-lg p-6">
                <Activity className="h-10 w-10 text-blue-400 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Continuous Monitoring</h3>
                <p className="text-gray-300 text-sm">24/7 automated analysis ensuring your defense stays ahead of threats</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How LeakJar Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A seamless four-step intelligence pipeline that keeps you protected 24/7
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="relative mb-16">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-14 w-14 bg-gray-900 text-white rounded-xl flex items-center justify-center font-bold text-xl">
                      1
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Collect Intelligence</h3>
                      <p className="text-sm text-gray-600">Continuous Monitoring</p>
                    </div>
                  </div>
                  <p className="text-lg text-gray-600 leading-relaxed mb-4">
                    Our global network gathers leaked credential data from underground forums, HUMINT operatives, 
                    and exclusive threat intelligence sources—data you won't find through traditional channels.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">Underground Forums</Badge>
                    <Badge variant="outline" className="text-xs">HUMINT Networks</Badge>
                    <Badge variant="outline" className="text-xs">Dark Web</Badge>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                        <Globe className="h-5 w-5 text-gray-700" />
                        <span className="text-sm font-medium text-gray-700">Global data sources</span>
                      </div>
                      <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                        <Eye className="h-5 w-5 text-gray-700" />
                        <span className="text-sm font-medium text-gray-700">Real-time collection</span>
                      </div>
                      <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                        <Lock className="h-5 w-5 text-gray-700" />
                        <span className="text-sm font-medium text-gray-700">Encrypted transfer</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Connecting line */}
              <div className="hidden md:block absolute left-1/2 -bottom-8 transform -translate-x-1/2">
                <div className="h-8 w-px bg-gradient-to-b from-gray-300 to-transparent"></div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative mb-16">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2">
                  <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                        <Zap className="h-5 w-5 text-gray-700" />
                        <span className="text-sm font-medium text-gray-700">Hybrid (AI + Human Experts) Analysis</span>
                      </div>
                      <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                        <Database className="h-5 w-5 text-gray-700" />
                        <span className="text-sm font-medium text-gray-700">Deduplication engine</span>
                      </div>
                      <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                        <Activity className="h-5 w-5 text-gray-700" />
                        <span className="text-sm font-medium text-gray-700">Data enrichment</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="order-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-14 w-14 bg-gray-900 text-white rounded-xl flex items-center justify-center font-bold text-xl">
                      2
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Process & Analyze</h3>
                      <p className="text-sm text-gray-600">Intelligent Processing</p>
                    </div>
                  </div>
                  <p className="text-lg text-gray-600 leading-relaxed mb-4">
                    Advanced algorithms process hundreds of gigabytes daily, extracting and enriching critical 
                    data points including credentials, IPs, timestamps, and breach context.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">100GB+ Daily</Badge>
                    <Badge variant="outline" className="text-xs">12+ Data Points</Badge>
                  </div>
                </div>
              </div>
              {/* Connecting line */}
              <div className="hidden md:block absolute left-1/2 -bottom-8 transform -translate-x-1/2">
                <div className="h-8 w-px bg-gradient-to-b from-gray-300 to-transparent"></div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative mb-16">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-14 w-14 bg-gray-900 text-white rounded-xl flex items-center justify-center font-bold text-xl">
                      3
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Match & Identify</h3>
                      <p className="text-sm text-gray-600">Precision Targeting</p>
                    </div>
                  </div>
                  <p className="text-lg text-gray-600 leading-relaxed mb-4">
                    Intelligent matching compares credentials against your organization's domains and email addresses, 
                    instantly flagging potential security threats requiring immediate attention.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">Domain Matching</Badge>
                    <Badge variant="outline" className="text-xs">Email Filtering</Badge>
                    <Badge variant="outline" className="text-xs">Risk Scoring</Badge>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                        <CheckCircle2 className="h-5 w-5 text-gray-700" />
                        <span className="text-sm font-medium text-gray-700">Automated matching</span>
                      </div>
                      <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                        <Shield className="h-5 w-5 text-gray-700" />
                        <span className="text-sm font-medium text-gray-700">Threat prioritization</span>
                      </div>
                      <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                        <AlertTriangle className="h-5 w-5 text-gray-700" />
                        <span className="text-sm font-medium text-gray-700">Risk assessment</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Connecting line */}
              <div className="hidden md:block absolute left-1/2 -bottom-8 transform -translate-x-1/2">
                <div className="h-8 w-px bg-gradient-to-b from-gray-300 to-transparent"></div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2">
                  <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                        <Activity className="h-5 w-5 text-gray-700" />
                        <span className="text-sm font-medium text-gray-700">Real-time alerts</span>
                      </div>
                      <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                        <Database className="h-5 w-5 text-gray-700" />
                        <span className="text-sm font-medium text-gray-700">Dashboard access</span>
                      </div>
                      <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                        <Zap className="h-5 w-5 text-gray-700" />
                        <span className="text-sm font-medium text-gray-700">API integration</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="order-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-14 w-14 bg-gray-900 text-white rounded-xl flex items-center justify-center font-bold text-xl">
                      4
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Alert & Respond</h3>
                      <p className="text-sm text-gray-600">Immediate Action</p>
                    </div>
                  </div>
                  <p className="text-lg text-gray-600 leading-relaxed mb-4">
                    Instant notifications through your preferred channel—dashboard, email, or RESTful API—with 
                    detailed breach information and actionable security recommendations.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">&lt;1hr Response</Badge>
                    <Badge variant="outline" className="text-xs">Multi-Channel</Badge>
                    <Badge variant="outline" className="text-xs">Actionable Intel</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Protect Your Organization's
              <br />
              Most Vulnerable Asset
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
              Join security teams at leading companies who rely on LeakJar to detect and respond 
              to compromised credentials before they become breaches.
            </p>
            
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                    <Link href="/auth/freetier">
                      <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 text-lg w-full sm:w-auto">
                        Get Started Free
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
            
            <div className="inline-flex items-center gap-2 text-sm text-gray-400 bg-white/5 px-4 py-2 rounded-full">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </section>
      </main>

      <SharedFooter />
      </div>
    </>
  );
}