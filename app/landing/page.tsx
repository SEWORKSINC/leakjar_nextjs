'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Database, Globe, Search, AlertTriangle, TrendingUp, Lock, Users, BarChart3, Activity, Eye, Server, Mail } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalRecords: 0,
    uniqueDomains: 0,
    dataPoints: 0,
    protocols: 0
  });
  const [searchEmail, setSearchEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
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

    animateValue(0, 50000000000, (v) => setStats(s => ({ ...s, totalRecords: v })));
    animateValue(0, 1500000, (v) => setStats(s => ({ ...s, uniqueDomains: v })));
    animateValue(0, 12, (v) => setStats(s => ({ ...s, dataPoints: v })));
    animateValue(0, 45, (v) => setStats(s => ({ ...s, protocols: v })));
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const handleSearch = async () => {
    if (!searchEmail || !searchEmail.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    setIsSearching(true);
    const domain = searchEmail.split('@')[1];
    router.push(`/open-search/${encodeURIComponent(domain)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-gray-700" />
            <h1 className="text-2xl font-bold text-gray-900">LeakJar</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900">How It Works</a>
            <a href="#stats" className="text-gray-600 hover:text-gray-900">Statistics</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
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

      <section id="cover">
        <div className="container mx-auto">
          <div className="flex flex-row-reverse">
            <div className="relative -z-1 aspect-square">
              {/* <picture className="hidden lg:hidden w-460 ml-10">
                <source srcset="https://www.leakjar.com/static/img/world_c.webp" type="image/webp">
                <img src="https://www.leakjar.com/static/img/world_c.png" alt="leakjar.com cover image">
              </picture> */}
              <video className="hidden lg:block w-460 ml-10" muted autoPlay loop playsInline>
                <source src="/world_c.webm" type="video/webm">
                <source src="/world_c.mp4" type="video/mp4">
              </video>
            </div>
            <div className="flex-auto flex flex-col justify-center">
              <div className="pt-16 lg:pt-12 xl:pt-0">
                <h1 className="text-4xl font-bold lg:-mr-24 mb-3">Proactively Monitor for Leaked Credentials Instantly Identify Compromised Accounts Stay ahead of cyber threats.</h1>
              </div>
              <p>LeakJar continuously scans for leaked credentials linked to your employees and customers, alerting you the moment they appear. Our advanced post-breach detection empowers you to respond swiftly, minimizing risks and preventing secondary attacks.</p>
              <h4 className="text-2xl mt-5">Dashboard + API: Easy access and seamless integration</h4>
              <div className="w-100 h-24 mt-10 bg-cyan-500 hidden"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Monitor Your Digital Footprint in Leaked Data
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Track and analyze over 50 billion leaked credentials to protect your organization from data breaches
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-gray-700 hover:bg-gray-800">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="border-gray-300">
                View Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Open Search Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <Card className="border-gray-300 shadow-lg">
            <CardHeader className="text-center">
              <Mail className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <CardTitle className="text-2xl text-gray-900">Check Your Company's Exposure</CardTitle>
              <CardDescription className="text-gray-600 text-lg">
                Enter your company email to instantly see if your domain appears in our 50 billion+ leaked credential database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 max-w-xl mx-auto">
                <Input
                  type="email"
                  placeholder="your.email@company.com"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="text-lg py-6"
                  disabled={isSearching}
                />
                <Button
                  onClick={handleSearch}
                  size="lg"
                  className="bg-gray-700 hover:bg-gray-800 px-8"
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
                Free search • No registration required • See latest 5 breach records
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-20">
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <Database className="h-10 w-10 text-gray-600 mb-3" />
              <div className="text-3xl font-bold text-gray-900">{formatNumber(stats.totalRecords)}</div>
              <p className="text-gray-600 mt-1">Total Breaches</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <Globe className="h-10 w-10 text-gray-600 mb-3" />
              <div className="text-3xl font-bold text-gray-900">{formatNumber(stats.uniqueDomains)}</div>
              <p className="text-gray-600 mt-1">Unique Domains</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <Activity className="h-10 w-10 text-gray-600 mb-3" />
              <div className="text-3xl font-bold text-gray-900">{stats.dataPoints}</div>
              <p className="text-gray-600 mt-1">Data Points</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <Server className="h-10 w-10 text-gray-600 mb-3" />
              <div className="text-3xl font-bold text-gray-900">{stats.protocols}+</div>
              <p className="text-gray-600 mt-1">Protocols Tracked</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Comprehensive Breach Monitoring
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-gray-200">
              <CardHeader>
                <Search className="h-12 w-12 text-gray-600 mb-3" />
                <CardTitle className="text-gray-900">Advanced Search</CardTitle>
                <CardDescription className="text-gray-600">
                  Search across billions of records by domain, email, IP, or username with powerful filtering
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-gray-200">
              <CardHeader>
                <AlertTriangle className="h-12 w-12 text-gray-600 mb-3" />
                <CardTitle className="text-gray-900">Real-time Alerts</CardTitle>
                <CardDescription className="text-gray-600">
                  Get instant notifications when your monitored domains appear in new data breaches
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-gray-200">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-gray-600 mb-3" />
                <CardTitle className="text-gray-900">Analytics Dashboard</CardTitle>
                <CardDescription className="text-gray-600">
                  Visualize breach trends, geographic distribution, and protocol analysis over time
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-gray-200">
              <CardHeader>
                <Eye className="h-12 w-12 text-gray-600 mb-3" />
                <CardTitle className="text-gray-900">Domain Monitoring</CardTitle>
                <CardDescription className="text-gray-600">
                  Track specific domains and receive detailed reports on exposed credentials
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-gray-200">
              <CardHeader>
                <Lock className="h-12 w-12 text-gray-600 mb-3" />
                <CardTitle className="text-gray-900">Secure Platform</CardTitle>
                <CardDescription className="text-gray-600">
                  Enterprise-grade security with encrypted data storage and secure API access
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-gray-200">
              <CardHeader>
                <Users className="h-12 w-12 text-gray-600 mb-3" />
                <CardTitle className="text-gray-900">Team Collaboration</CardTitle>
                <CardDescription className="text-gray-600">
                  Share insights and manage access with role-based permissions for your team
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How LeakJar Works
          </h3>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-gray-200 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center font-bold">1</div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Data Collection</h4>
                  <p className="text-gray-600">We continuously collect and process leaked credential data from various sources, including data breaches, paste sites, and dark web forums</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-gray-200 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center font-bold">2</div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Processing & Deduplication</h4>
                  <p className="text-gray-600">Our advanced algorithms process and deduplicate billions of records, extracting 12+ data points including URLs, emails, IPs, and timestamps</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-gray-200 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center font-bold">3</div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Domain Analysis</h4>
                  <p className="text-gray-600">We analyze and categorize data by domain, protocol, and geographic location, providing comprehensive breach intelligence</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-gray-200 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center font-bold">4</div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Alert & Monitor</h4>
                  <p className="text-gray-600">You receive real-time alerts and detailed reports when your monitored domains appear in new breaches, enabling rapid response</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Protocol Coverage */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Comprehensive Protocol Coverage
          </h3>
          <div className="max-w-4xl mx-auto">
            <p className="text-center text-gray-600 mb-8">
              Monitor credentials across 45+ protocols and platforms
            </p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {['HTTPS', 'HTTP', 'FTP', 'SSH', 'Android', 'iOS', 'SMTP', 'POP3', 'IMAP', 'Telnet', 'RDP', 'VNC', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'LDAP', 'SMB'].map((protocol) => (
                <div key={protocol} className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                  <span className="text-sm font-medium text-gray-700">{protocol}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-700 to-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-white mb-6">
            Start Protecting Your Organization Today
          </h3>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of companies using LeakJar to monitor their digital footprint
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
              Start 14-Day Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-6 w-6 text-gray-500" />
                <h4 className="text-lg font-semibold text-white">LeakJar</h4>
              </div>
              <p className="text-sm">Enterprise breach monitoring and credential intelligence platform</p>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-3">Product</h5>
              <ul className="space-y-2 text-sm">
                <li><Link href="/features" className="hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/api" className="hover:text-white">API</Link></li>
                <li><Link href="/integrations" className="hover:text-white">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-3">Company</h5>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-3">Legal</h5>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/security" className="hover:text-white">Security</Link></li>
                <li><Link href="/compliance" className="hover:text-white">Compliance</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 LeakJar. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}