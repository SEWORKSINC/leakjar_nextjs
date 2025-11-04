'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SharedFooter } from '@/components/shared-footer';
import { 
  Shield, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Mail,
  Globe,
  Bell,
  Star
} from 'lucide-react';

export default function MarketingLandingPage() {
  const router = useRouter();
  const [searchEmail, setSearchEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Schema markup for SEO
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "LeakJar",
    "applicationCategory": "SecurityApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "ratingCount": "3"
    },
    "description": "Real-time credential breach monitoring across 60+ billion leaked records"
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Skip to content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded"
      >
        Skip to main content
      </a>

      {/* Schema.org markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      {/* Top Banner */}
      <div className="bg-gray-900 text-white py-3 px-4 text-center" role="banner">
        <p className="text-sm font-medium">
          Join 1,000+ companies protecting their credentials • Start Free Today
        </p>
      </div>

      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50" role="navigation" aria-label="Main navigation">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-gray-900" aria-hidden="true" />
              <span className="text-2xl font-bold text-gray-900">LeakJar</span>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How it Works</a>
              <Link href="/auth/login">
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Get Started Free
                </Button>
              </Link>
            </div>
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-600 hover:text-gray-900 px-2" onClick={() => setMobileMenuOpen(false)}>Features</a>
                <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 px-2" onClick={() => setMobileMenuOpen(false)}>How it Works</a>
                <Link href="/auth/login" className="px-2">
                  <Button variant="outline" size="sm" className="w-full">Sign In</Button>
                </Link>
                <Link href="/auth/signup" className="px-2">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 w-full">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - Above the Fold */}
      <main id="main-content">
      <section className="relative bg-white pt-20 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Is Your Company Email
              <br />
              Already Compromised?
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Check instantly if your company appears in our database of <strong className="text-blue-600">60+ billion leaked credentials</strong>. 
              No signup required.
            </p>

            {/* Email Search CTA - PRIMARY CONVERSION POINT */}
            <div className="max-w-2xl mx-auto mb-8">
              <Card className="border-2 border-gray-200 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Mail className="h-6 w-6 text-gray-700" aria-hidden="true" />
                    <h2 className="text-xl font-bold text-gray-900">Free Instant Security Check</h2>
                  </div>
                  
                  <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} role="search">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <label htmlFor="email-search" className="sr-only">Enter your company email</label>
                        <Input
                          id="email-search"
                          type="email"
                          placeholder="yourname@company.com"
                          value={searchEmail}
                          onChange={(e) => {
                            setSearchEmail(e.target.value);
                            setEmailError('');
                          }}
                          onKeyPress={handleKeyPress}
                          className={`text-lg py-7 ${emailError ? 'border-red-500' : 'border-gray-300'}`}
                          disabled={isSearching}
                          aria-invalid={emailError ? 'true' : 'false'}
                          aria-describedby={emailError ? 'email-error' : undefined}
                          required
                        />
                        {emailError && (
                          <p id="email-error" className="text-red-500 text-sm mt-2 flex items-center gap-1" role="alert">
                            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                            {emailError}
                          </p>
                        )}
                      </div>
                      <Button
                        type="submit"
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700 px-10 py-7 text-lg font-semibold"
                        disabled={isSearching}
                        aria-label={isSearching ? 'Searching for breaches' : 'Check for breaches'}
                      >
                        {isSearching ? (
                          <>
                            <Search className="h-5 w-5 mr-2 animate-spin" aria-hidden="true" />
                            Searching...
                          </>
                        ) : (
                          <>
                            Check Now Free
                            <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                  
                  <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-600" role="list">
                    <div className="flex items-center gap-1" role="listitem">
                      <CheckCircle2 className="h-4 w-4 text-blue-600" aria-hidden="true" />
                      <span>Instant Results</span>
                    </div>
                    <div className="flex items-center gap-1" role="listitem">
                      <CheckCircle2 className="h-4 w-4 text-blue-600" aria-hidden="true" />
                      <span>No Credit Card</span>
                    </div>
                    <div className="flex items-center gap-1" role="listitem">
                      <CheckCircle2 className="h-4 w-4 text-blue-600" aria-hidden="true" />
                      <span>100% Free</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Social Proof Numbers */}
            <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto pt-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-1">60B+</div>
                <p className="text-sm text-gray-600">Leaked Records</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-1">1,000+</div>
                <p className="text-sm text-gray-600">Companies Protected</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-1">&lt;1hr</div>
                <p className="text-sm text-gray-600">Alert Response</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Every Day, Millions of Credentials Are Stolen
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Cybercriminals are actively trading your employees' and customers' credentials on the dark web. 
              By the time you discover a breach, it's often too late.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/10 rounded-lg p-6">
                <div className="text-4xl font-bold text-white mb-2">93%</div>
                <p className="text-gray-300">of data breaches use stolen credentials</p>
              </div>
              <div className="bg-white/10 rounded-lg p-6">
                <div className="text-4xl font-bold text-white mb-2">$4.45M</div>
                <p className="text-gray-300">average cost of a data breach</p>
              </div>
              <div className="bg-white/10 rounded-lg p-6">
                <div className="text-4xl font-bold text-white mb-2">287 days</div>
                <p className="text-gray-300">average time to identify breach</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Protect Your Organization in Real-Time
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              LeakJar monitors the underground for your credentials 24/7, so you can respond before attackers strike
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Feature 1 */}
            <Card className="border-gray-200">
              <CardHeader>
                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-gray-700" />
                </div>
                <CardTitle className="text-xl">Instant Search</CardTitle>
                <CardDescription className="text-base">
                  Search across 60+ billion leaked credentials by domain or email in seconds
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 2 */}
            <Card className="border-gray-200">
              <CardHeader>
                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <Bell className="h-6 w-6 text-gray-700" />
                </div>
                <CardTitle className="text-xl">Real-Time Alerts</CardTitle>
                <CardDescription className="text-base">
                  Get notified within 1 hour when your credentials appear in new breaches
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 3 */}
            <Card className="border-gray-200">
              <CardHeader>
                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-gray-700" />
                </div>
                <CardTitle className="text-xl">Global Coverage</CardTitle>
                <CardDescription className="text-base">
                  Monitor underground forums, dark web markets, and HUMINT networks worldwide
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How LeakJar Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A seamless intelligence pipeline that keeps you protected 24/7
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-16">
            {/* Step 1 */}
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-xl">
                  1
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Collect Intelligence</h3>
                <p className="text-sm text-gray-500 mb-3">Continuous Monitoring</p>
                <p className="text-gray-600 leading-relaxed">
                  Our global network gathers leaked credential data from underground forums, HUMINT operatives, 
                  and exclusive threat intelligence sources—data you won't find through traditional channels.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-xl">
                  2
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Process & Analyze</h3>
                <p className="text-sm text-gray-500 mb-3">Intelligent Processing</p>
                <p className="text-gray-600 leading-relaxed">
                  Advanced algorithms process hundreds of gigabytes daily, extracting and enriching critical 
                  data points including credentials, IPs, timestamps, and breach context.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-xl">
                  3
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Match & Identify</h3>
                <p className="text-sm text-gray-500 mb-3">Precision Targeting</p>
                <p className="text-gray-600 leading-relaxed">
                  Intelligent matching compares credentials against your organization's domains and email addresses, 
                  instantly flagging potential security threats requiring immediate attention.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-xl">
                  4
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Alert & Respond</h3>
                <p className="text-sm text-gray-500 mb-3">Immediate Action</p>
                <p className="text-gray-600 leading-relaxed">
                  Instant notifications through your preferred channel—dashboard, email, or RESTful API—with 
                  detailed breach information and actionable security recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Security Teams Worldwide
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-gray-200">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "LeakJar helped us discover a breach weeks before it became public. The early warning saved us from a potential disaster."
                </p>
                <div className="font-semibold text-gray-900">Security Director</div>
                <div className="text-sm text-gray-600">Fortune 500 Company</div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "The API integration was seamless. We now have real-time breach monitoring as part of our security stack."
                </p>
                <div className="font-semibold text-gray-900">CTO</div>
                <div className="text-sm text-gray-600">SaaS Startup</div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "Finally, a breach monitoring solution that actually works. The alerts are fast and accurate."
                </p>
                <div className="font-semibold text-gray-900">CISO</div>
                <div className="text-sm text-gray-600">Financial Services</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative bg-gray-900 text-white py-24">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Don't Wait for a Breach
              <br />
              to Take Action
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
              Join 1,000+ companies using LeakJar to protect their most valuable asset: their data.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700 px-12 py-6 text-lg font-semibold w-full sm:w-auto">
                  Start Free Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="border-white text-gray-900 bg-white hover:bg-gray-100 px-12 py-6 text-lg font-semibold w-full sm:w-auto">
                  Learn More
                </Button>
              </a>
            </div>
            
            <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-gray-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-gray-500" />
                <span>Free tier forever</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-gray-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      </main>

      <SharedFooter />
    </div>
  );
}

