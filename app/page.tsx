'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Database, Globe, Search, AlertTriangle, CheckCircle2, Lock, Zap, Activity, Eye, ArrowRight, Scale, Brain, MessageCircle, Languages, ShoppingCart, Users, Building2, Dices } from 'lucide-react';
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
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Gradient orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[128px]"></div>
        
        <div className="container relative mx-auto px-4 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
                Stop Breaches,<br />
                Save $4.45M
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                The only threat intelligence platform with <strong className="text-white">exclusive underground intelligence sources</strong>. 
                Detect compromised credentials <strong className="text-white">287 days faster</strong> than industry average.
              </p>

              {/* Key Points */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  </div>
                  <span className="text-gray-200">24/7 real-time monitoring across underground sources</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  </div>
                  <span className="text-gray-200">Instant alerts for compromised credentials</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  </div>
                  <span className="text-gray-200">Dashboard + API for seamless integration</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  </div>
                  <span className="text-gray-200">Meet PCI DSS, NIST, HIPAA compliance requirements</span>
                </div>
              </div>

              {/* Compliance Badges with Glassmorphism */}
              <div className="mb-10 p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                <p className="text-sm font-semibold text-gray-300 mb-3">Compliance Frameworks Supported:</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs bg-white/10 border-white/20 text-gray-200 hover:bg-white/20 transition-colors">PCI DSS 4.0</Badge>
                  <Badge variant="outline" className="text-xs bg-white/10 border-white/20 text-gray-200 hover:bg-white/20 transition-colors">NIST 800-63B</Badge>
                  <Badge variant="outline" className="text-xs bg-white/10 border-white/20 text-gray-200 hover:bg-white/20 transition-colors">HIPAA</Badge>
                  <Badge variant="outline" className="text-xs bg-white/10 border-white/20 text-gray-200 hover:bg-white/20 transition-colors">GDPR</Badge>
                  <Badge variant="outline" className="text-xs bg-white/10 border-white/20 text-gray-200 hover:bg-white/20 transition-colors">CCPA/CPRA</Badge>
                  <Badge variant="outline" className="text-xs bg-white/10 border-white/20 text-gray-200 hover:bg-white/20 transition-colors">EU AI Act</Badge>
                  <Badge variant="outline" className="text-xs bg-white/10 border-white/20 text-gray-200 hover:bg-white/20 transition-colors">NIST AI RMF</Badge>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/freetier" className="group">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg w-full sm:w-auto transition-all hover:scale-105">
                    See Your Exposure Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column - Video/Visual with Glassmorphism */}
            <div className="relative hidden lg:block">
              {/* Glow effect behind video */}
              {/* <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 blur-3xl"></div> */}
              
              {/* <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl shadow-cyan-500/20 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900"> */}
              <div className="relative rounded-full overflow-hidden mix-blend-plus-lighter">
                <video 
                  className="w-full h-auto invert hue-rotate-180 contrast-[1.1] brightness-[1]" 
                  muted 
                  autoPlay 
                  loop 
                  playsInline
                  loading="lazy"
                  preload="metadata"
                  aria-label="LeakJar credential monitoring visualization"
                  style={{ 
                    // filter: 'brightness(1.2) contrast(1.1)'
                  }}
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
      <section className="bg-gray-900 text-white py-20 border-y border-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-16 leading-tight text-white">
              LeakJar has over <span className="text-blue-400">{formatNumber(stats.totalRecords)}</span> pieces of data,
              <br className="hidden md:block" />
              with an average of <span className="text-blue-400">{formatNumber(stats.dailyAdditions)}</span> new additions every day
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="p-6 rounded-lg bg-gray-800 border border-gray-700">
                <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-3">
                  {formatNumber(stats.totalRecords)}
                </div>
                <p className="text-gray-300 font-medium">Total Records</p>
              </div>
              <div className="p-6 rounded-lg bg-gray-800 border border-gray-700">
                <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-3">
                  {formatNumber(stats.dailyAdditions)}
                </div>
                <p className="text-gray-300 font-medium">Daily Additions</p>
              </div>
              <div className="p-6 rounded-lg bg-gray-800 border border-gray-700">
                <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-3">
                  24/7
                </div>
                <p className="text-gray-300 font-medium">Monitoring</p>
              </div>
              <div className="p-6 rounded-lg bg-gray-800 border border-gray-700">
                <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-3">
                  &lt;1hr
                </div>
                <p className="text-gray-300 font-medium">Alert Time</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Social Proof - Trusted by Market Leaders */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Trusted by Market Leaders
            </h2>
          </div>
          
          {/* Horizontal Scrollable Container */}
          <div className="relative">
            <div className="overflow-x-auto pb-4 scrollbar-hide">
              <div className="flex gap-4 min-w-max px-4">
                {/* #1 Global Chat API */}
                <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow w-44 flex-shrink-0">
                  <CardContent className="p-5 text-center">
                    <div className="h-14 w-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="h-7 w-7 text-gray-700" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">#1 Global</h3>
                    <p className="text-xs text-gray-600">Chat API</p>
                  </CardContent>
                </Card>

                {/* #1 Global Live commerce */}
                <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow w-44 flex-shrink-0">
                  <CardContent className="p-5 text-center">
                    <div className="h-14 w-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Globe className="h-7 w-7 text-gray-700" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">#1 Global Live</h3>
                    <p className="text-xs text-gray-600">commerce platform</p>
                  </CardContent>
                </Card>

                {/* #1 AI-powered Translate */}
                <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow w-44 flex-shrink-0">
                  <CardContent className="p-5 text-center">
                    <div className="h-14 w-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Languages className="h-7 w-7 text-gray-700" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">#1 AI-powered</h3>
                    <p className="text-xs text-gray-600">Translate Service</p>
                  </CardContent>
                </Card>

                {/* Leading e-commerce */}
                <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow w-44 flex-shrink-0">
                  <CardContent className="p-5 text-center">
                    <div className="h-14 w-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <ShoppingCart className="h-7 w-7 text-gray-700" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">Leading e-commerce</h3>
                    <p className="text-xs text-gray-600">companies</p>
                  </CardContent>
                </Card>

                {/* Leading collaboration tool */}
                <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow w-44 flex-shrink-0">
                  <CardContent className="p-5 text-center">
                    <div className="h-14 w-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Users className="h-7 w-7 text-gray-700" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">Leading business</h3>
                    <p className="text-xs text-gray-600">collaboration tool</p>
                  </CardContent>
                </Card>

                {/* Leading B2B SaaS */}
                <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow w-44 flex-shrink-0">
                  <CardContent className="p-5 text-center">
                    <div className="h-14 w-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Building2 className="h-7 w-7 text-gray-700" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">Leading B2B SaaS</h3>
                    <p className="text-xs text-gray-600">companies</p>
                  </CardContent>
                </Card>

                {/* eGaming */}
                <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow w-44 flex-shrink-0">
                  <CardContent className="p-5 text-center">
                    <div className="h-14 w-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Dices className="h-7 w-7 text-gray-700" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">eGaming</h3>
                    <p className="text-xs text-gray-600">Online casinos</p>
                  </CardContent>
                </Card>

                {/* Leading AI startups */}
                <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow w-44 flex-shrink-0">
                  <CardContent className="p-5 text-center">
                    <div className="h-14 w-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Brain className="h-7 w-7 text-gray-700" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">Leading AI</h3>
                    <p className="text-xs text-gray-600">startups</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Value Proposition */}
      <section className="bg-white py-20 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Measurable Security Outcomes
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Security teams using LeakJar detect and neutralize credential threats faster, 
                reducing mean time to respond (MTTR) and preventing costly breaches before they escalate.
              </p>
            </div>

            {/* Primary Value Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <Card className="border-2 border-gray-200 shadow-sm">
                <CardHeader>
                  <div className="h-12 w-12 bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-3">Accelerate Incident Response</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    Real-time alerts enable security teams to reset compromised credentials and contain threats 
                    within minutes instead of days or weeks—dramatically reducing your attack surface window.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">&lt;1hr</span>
                    <span className="text-sm text-gray-600">average alert time</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200 shadow-sm">
                <CardHeader>
                  <div className="h-12 w-12 bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-3">Stop Breaches Before They Start</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    Identify vulnerabilities before attackers exploit them. Prevent account takeovers, 
                    data exfiltration, and ransomware deployment by detecting compromised credentials at the source.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">80%</span>
                    <span className="text-sm text-gray-600">of breaches start with credentials</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200 shadow-sm">
                <CardHeader>
                  <div className="h-12 w-12 bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-3">Intelligence Others Miss</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    Access threat data from targeted attacks, stealer malware, and underground sources that 
                    traditional breach databases never see—giving you visibility into emerging threats first.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">60B+</span>
                    <span className="text-sm text-gray-600">credential records monitored</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200 shadow-sm">
                <CardHeader>
                  <div className="h-12 w-12 bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-3">Meet Compliance Requirements</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    Satisfy PCI DSS 8.3.10, NIST SP 800-63B, and other mandatory credential monitoring controls. 
                    Demonstrate audit readiness with comprehensive logging and reporting capabilities.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">PCI DSS</Badge>
                    <Badge variant="outline" className="text-xs">NIST</Badge>
                    <Badge variant="outline" className="text-xs">HIPAA</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200 shadow-sm">
                <CardHeader>
                  <div className="h-12 w-12 bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-3">Reduce Security Costs</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    Avoid the $4.45M average cost of a data breach. Prevent expensive incident response, 
                    legal fees, regulatory fines, and brand damage by stopping attacks at the credential level.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">$4.45M</span>
                    <span className="text-sm text-gray-600">avg breach cost avoided</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200 shadow-sm">
                <CardHeader>
                  <div className="h-12 w-12 bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                    <Database className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-3">Seamless Integration</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    Deploy in minutes with our RESTful API, dashboard, and webhook integrations. 
                    Connect with your existing SIEM, ticketing systems, and security workflows instantly.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">&lt;5min</span>
                    <span className="text-sm text-gray-600">integration time</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ROI Highlight */}
            <Card className="bg-gray-900 text-white border-0">
              <CardContent className="p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-3xl font-bold mb-4">
                      Protect Your Organization's Most Valuable Assets
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      A single compromised credential can cascade into ransomware deployment, data exfiltration, 
                      supply chain attacks, and business email compromise. LeakJar stops the attack chain before 
                      it starts—protecting your employees, customers, and bottom line.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-blue-400 flex-shrink-0" />
                        <span className="text-gray-300">Prevent account takeover and lateral movement</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-blue-400 flex-shrink-0" />
                        <span className="text-gray-300">Avoid regulatory fines and compliance violations</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-blue-400 flex-shrink-0" />
                        <span className="text-gray-300">Protect brand reputation and customer trust</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-lg p-6 text-center">
                      <div className="text-4xl font-bold text-blue-400 mb-2">287</div>
                      <p className="text-sm text-gray-300">Days avg to detect breach</p>
                      <p className="text-xs text-gray-400 mt-1">Industry Standard</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-6 text-center">
                      <div className="text-4xl font-bold text-green-400 mb-2">&lt;1</div>
                      <p className="text-sm text-gray-300">Hour with LeakJar</p>
                      <p className="text-xs text-gray-400 mt-1">Real-time Alerts</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-6 text-center col-span-2">
                      <div className="text-4xl font-bold text-blue-400 mb-2">99.6%</div>
                      <p className="text-sm text-gray-300">Reduction in detection time</p>
                      <p className="text-xs text-gray-400 mt-1">Faster Response = Lower Impact</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Compliance Requirements Section */}
      <section className="bg-gray-50 py-20 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 px-4 py-1.5" variant="secondary">
                <Shield className="h-3.5 w-3.5 mr-2 inline" />
                Compliance & Regulatory Standards
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Meet Mandatory Compliance Requirements
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Satisfy credential monitoring mandates across major regulatory frameworks. 
                One platform delivers comprehensive coverage for PCI DSS, NIST, HIPAA, GDPR, CCPA, and emerging AI regulations.
              </p>
            </div>

            {/* Compliance Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {/* PCI DSS */}
              <Card className="border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <CardHeader className="flex-grow">
                  <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="h-8 flex items-start mb-3">
                    <Badge variant="outline" className="w-fit text-xs">
                      Payment Card Industry
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mb-2">PCI DSS 4.0</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed mb-4">
                    Meet Requirement 8.3.10 for blocking compromised credentials. 
                    Mandatory as of March 31, 2025—avoid heavy fines and pass your QSA audit.
                  </CardDescription>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Requirement 8.3.10 compliance</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Audit-ready documentation</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link href="/pci-compliance">
                    <Button variant="outline" size="sm" className="w-full">
                      Learn More
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* NIST */}
              <Card className="border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <CardHeader className="flex-grow">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Lock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="h-8 flex items-start mb-3">
                    <Badge variant="outline" className="w-fit text-xs">
                      Federal Standard
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mb-2">NIST SP 800-63B</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed mb-4">
                    Implement mandatory credential monitoring controls. 
                    Align with NIST Cybersecurity Framework 2.0 and federal security standards.
                  </CardDescription>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Section 5.1.1.2 compliance</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">CSF 2.0 alignment</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link href="/nist-compliance">
                    <Button variant="outline" size="sm" className="w-full">
                      Learn More
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* HIPAA */}
              <Card className="border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <CardHeader className="flex-grow">
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Activity className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="h-8 flex items-start mb-3">
                    <Badge variant="outline" className="w-fit text-xs">
                      Healthcare
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mb-2">HIPAA Security Rule</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed mb-4">
                    Protect ePHI and complete your Security Risk Analysis. 
                    Demonstrate "reasonable and appropriate" safeguards to avoid willful neglect penalties.
                  </CardDescription>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">164.308(a)(1)(ii)(A) addressable</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Risk analysis documentation</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link href="/hipaa-compliance">
                    <Button variant="outline" size="sm" className="w-full">
                      Learn More
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* GDPR */}
              <Card className="border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <CardHeader className="flex-grow">
                  <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                    <Globe className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="h-8 flex items-start mb-3">
                    <Badge variant="outline" className="w-fit text-xs">
                      EU Data Protection
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mb-2">GDPR Article 32</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed mb-4">
                    Meet "state of the art" security requirements for protecting personal data. 
                    Avoid fines up to 4% of annual revenue from EU regulators.
                  </CardDescription>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Article 32 technical measures</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Breach notification support</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link href="/gdpr-compliance">
                    <Button variant="outline" size="sm" className="w-full">
                      Learn More
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* CCPA */}
              <Card className="border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <CardHeader className="flex-grow">
                  <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <Scale className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="h-8 flex items-start mb-3">
                    <Badge variant="outline" className="w-fit text-xs">
                      California Privacy Law
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mb-2">CCPA/CPRA</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed mb-4">
                    Demonstrate "reasonable security" measures and protect against class-action lawsuits. 
                    California consumers have a private right of action for data breaches.
                  </CardDescription>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Reasonable security standard</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Consumer protection measures</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link href="/ccpa-compliance">
                    <Button variant="outline" size="sm" className="w-full">
                      Learn More
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* EU AI Act */}
              <Card className="border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <CardHeader className="flex-grow">
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Brain className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="h-8 flex items-start mb-3">
                    <Badge variant="outline" className="w-fit text-xs">
                      AI Regulation
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mb-2">EU AI Act</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed mb-4">
                    Prevent data poisoning attacks and meet Article 15 robustness requirements. 
                    Protect high-risk AI systems from compromised training data.
                  </CardDescription>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Article 15 data governance</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Data poisoning prevention</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link href="/ai-act-compliance">
                    <Button variant="outline" size="sm" className="w-full">
                      Learn More
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* NIST AI RMF */}
              <Card className="border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <CardHeader className="flex-grow">
                  <div className="h-12 w-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-teal-600" />
                  </div>
                  <div className="h-8 flex items-start mb-3">
                    <Badge variant="outline" className="w-fit text-xs">
                      AI Framework
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mb-2">NIST AI RMF</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed mb-4">
                    Operationalize the NIST AI Risk Management Framework with continuous monitoring. 
                    Govern, Map, Measure, and Manage AI risks with trustworthy AI practices.
                  </CardDescription>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">AI risk governance</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Trustworthy AI framework</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link href="/nist-ai-rmf">
                    <Button variant="outline" size="sm" className="w-full">
                      Learn More
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Compliance Value Proposition */}
            <Card className="bg-gray-900 text-white border-0">
              <CardContent className="p-8 md:p-10">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-3xl font-bold mb-4">
                      One Platform, Complete Compliance Coverage
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      Stop managing multiple vendors and solutions. LeakJar provides comprehensive credential 
                      monitoring that satisfies requirements across all major regulatory frameworks—from payment 
                      card security to healthcare privacy to emerging AI governance.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-blue-400 flex-shrink-0" />
                        <span className="text-gray-300">Single integration for multiple frameworks</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-blue-400 flex-shrink-0" />
                        <span className="text-gray-300">Audit-ready documentation and logging</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-blue-400 flex-shrink-0" />
                        <span className="text-gray-300">Stay current with evolving regulations</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="bg-white/10 rounded-lg p-6 mb-4">
                      <div className="text-center mb-4">
                        <div className="text-5xl font-bold text-blue-400 mb-2">$4.45M</div>
                        <p className="text-sm text-gray-300">Average cost of a compliance breach</p>
                      </div>
                      <div className="pt-4 border-t border-white/20">
                        <p className="text-xs text-gray-400 text-center">
                          IBM Cost of a Data Breach Report 2023
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/10 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-blue-400 mb-1">€35M</div>
                        <p className="text-xs text-gray-300">Max EU AI Act fine</p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-blue-400 mb-1">4%</div>
                        <p className="text-xs text-gray-300">Max GDPR revenue fine</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* View All Solutions CTA */}
            <div className="text-center mt-12">
              <Link href="/solutions">
                <Button size="lg" variant="outline" className="bg-white hover:bg-gray-50">
                  View All Compliance Solutions
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dig Deeper - Intelligence Gathering */}
      <section className="bg-white py-20">
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
      <section className="bg-gray-900 text-white py-24 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
              Protect Your Organization's<br />
              Most Vulnerable Asset
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
              Join security teams at <strong className="text-white">leading companies</strong> who rely on LeakJar to detect and respond 
              to compromised credentials <strong className="text-white">before they become breaches</strong>.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Link href="/auth/freetier" className="group">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 text-lg transition-all">
                  See Your Exposure Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-400" />
                <span>14-day free trial</span>
              </div>
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