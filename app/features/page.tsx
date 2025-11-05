import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Zap, TrendingDown, Lock, Activity, Eye, AlertTriangle, CheckCircle2, ArrowRight, FileText, Heart, Scale, Globe, Brain } from 'lucide-react';
import { SharedHeader } from '@/components/shared-header';
import { SharedFooter } from '@/components/shared-footer';

export const metadata: Metadata = {
  title: "Features - Advanced Threat Intelligence & Breach Detection",
  description: "Stop credential-based attacks with LeakJar. HUMINT networks, 24/7 monitoring, real-time alerts, and actionable intelligence from 60B+ breach records. Detect compromised accounts before exploitation.",
  keywords: [
    "credential breach detection",
    "HUMINT security intelligence",
    "real-time threat monitoring",
    "account takeover prevention",
    "credential stuffing defense",
    "dark web monitoring",
    "breach intelligence platform",
    "password leak alerts"
  ],
  openGraph: {
    title: "LeakJar Features - Stop Credential Attacks Before They Start",
    description: "HUMINT intelligence, 24/7 monitoring, and real-time alerts. Detect breaches before they become headlines.",
    url: "https://www.leakjar.com/features",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LeakJar Features - Advanced Breach Detection",
    description: "HUMINT intelligence, 24/7 monitoring, real-time alerts from 60B+ credential records.",
  },
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <SharedHeader />

      {/* Hero Section with Modern Design */}
      <section className="relative overflow-hidden bg-slate-950">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="container relative mx-auto px-4 py-20 md:py-28">
          <div className="text-center max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight leading-[1.1] text-white">
              Stop Credential-Based Attacks<br />
              Before They Start
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto">
              LeakJar detects <strong className="text-white">compromised employee and customer credentials</strong> in real-time, 
              protecting your organization from account takeovers, data breaches, and ransomware attacks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/auth/signup" className="group">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all px-8">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-12 pt-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                <div className="text-center p-6 rounded-lg bg-gray-800 border border-gray-700">
                  <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">60B+</div>
                  <div className="text-sm text-gray-300 font-medium">Credential Records</div>
                </div>
                <div className="text-center p-6 rounded-lg bg-gray-800 border border-gray-700">
                  <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">24/7</div>
                  <div className="text-sm text-gray-300 font-medium">Real-Time Monitoring</div>
                </div>
                <div className="text-center p-6 rounded-lg bg-gray-800 border border-gray-700">
                  <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">&lt;1hr</div>
                  <div className="text-sm text-gray-300 font-medium">Alert Time</div>
                </div>
                <div className="text-center p-6 rounded-lg bg-gray-800 border border-gray-700">
                  <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">80%</div>
                  <div className="text-sm text-gray-300 font-medium">Breaches Prevented</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <Badge className="mb-4" variant="outline">
              <AlertTriangle className="h-3.5 w-3.5 mr-1.5 inline text-orange-600" />
              The Threat Landscape
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              80% of Data Breaches Start with Compromised Credentials
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Traditional security measures can't detect stolen credentials circulating on the dark web, 
              paste sites, and threat actor networks—leaving your organization vulnerable to silent attacks.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader>
                <TrendingDown className="h-10 w-10 text-orange-600 mb-3" />
                <CardTitle className="text-lg">Hours to Exploitation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Stolen credentials are weaponized within hours of a breach, giving security teams little time to respond
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader>
                <Lock className="h-10 w-10 text-orange-600 mb-3" />
                <CardTitle className="text-lg">Hidden Threat Vectors</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Credentials from phishing, malware, and unknown attacks remain invisible to standard security tools
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader>
                <Activity className="h-10 w-10 text-orange-600 mb-3" />
                <CardTitle className="text-lg">Cascading Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  A single compromised credential can lead to account takeover, lateral movement, and full network breach
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* The Solution Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="outline">
              <Shield className="h-3.5 w-3.5 mr-1.5 inline text-blue-600" />
              The LeakJar Advantage
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Intelligence You Won't Find Anywhere Else
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We collect leaked credential data from multiple intelligence sources—underground forums, threat actor networks, 
              HUMINT operatives, and our in-house security experts. All data is encrypted and securely stored in our database, 
              accessible only to our authenticated customers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
              <CardHeader>
                <Eye className="h-10 w-10 text-blue-600 mb-3" />
                <CardTitle className="text-lg">Human Intelligence (HUMINT)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Field operatives gather real-world intelligence from threat actor networks and underground forums
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
              <CardHeader>
                <Activity className="h-10 w-10 text-blue-600 mb-3" />
                <CardTitle className="text-lg">24/7 Threat Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Dedicated security team continuously monitors emerging threats across 45+ protocols and platforms
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
              <CardHeader>
                <Lock className="h-10 w-10 text-blue-600 mb-3" />
                <CardTitle className="text-lg">Private Threat Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Exclusive access to credential data from targeted attacks and malicious actor networks
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-900 text-white border border-gray-800">
            <CardContent className="p-8">
              <div className="flex items-start gap-3 mb-6">
                <div className="h-10 w-10 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Secure Collection & Storage Process</h3>
                  <p className="text-gray-300 leading-relaxed">
                    We process hundreds of gigabytes of leaked data daily from our intelligence network—including underground sources, 
                    HUMINT operatives, and in-house security researchers. All collected data is immediately encrypted and stored 
                    securely in our database, accessible only to authenticated customers through our platform.
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-6 pt-6 border-t border-gray-800">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300">Multiple intelligence sources</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300">Encrypted storage</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300">Customer-only access</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Actionable Intelligence Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Complete Visibility into Every Breach
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Get the forensic details you need to quickly assess impact, contain threats, and prevent future incidents
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-t-4 border-t-blue-500 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <Activity className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Attack Source IP</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Identify the exact IP address where credentials were compromised to isolate affected systems and block malicious traffic
                  </p>
                </CardContent>
              </Card>

              <Card className="border-t-4 border-t-blue-500 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <Eye className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Geolocation Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Pinpoint attack origins with country and region intelligence to understand threat actor patterns and enforce geo-blocking
                  </p>
                </CardContent>
              </Card>

              <Card className="border-t-4 border-t-blue-500 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <Lock className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Compromised URLs</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    See which specific services and applications were accessed, enabling targeted security response and user notifications
                  </p>
                </CardContent>
              </Card>

              <Card className="border-t-4 border-t-blue-500 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Plaintext Credentials</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Access exposed usernames and passwords in plaintext to assess password strength patterns and force immediate resets
                  </p>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </section>

      {/* Business Outcomes Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Reduce Risk, Accelerate Response, Protect Revenue
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Security teams using LeakJar detect and neutralize credential threats faster, 
              reducing mean time to respond (MTTR) and preventing costly breaches.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg mb-2">Faster Incident Response</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Real-time alerts enable security teams to reset compromised credentials and block threats 
                      within minutes instead of days or weeks.
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg mb-2">Proactive Threat Prevention</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Identify vulnerabilities before attackers exploit them, preventing account takeovers, 
                      data exfiltration, and ransomware deployment.
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Eye className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg mb-2">Enhanced Threat Intelligence</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Access intelligence from targeted attacks and underground sources that traditional 
                      breach databases miss completely.
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Activity className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg mb-2">Strengthened Security Posture</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Demonstrate compliance readiness and risk mitigation to stakeholders, auditors, 
                      and cyber insurance providers.
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Competitive Advantage */}
          <Card className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 border-2 border-green-200">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Why LeakJar Outperforms Traditional Solutions</h3>
                  <p className="text-muted-foreground">
                    Most breach monitoring services only track publicly disclosed incidents. LeakJar goes deeper—detecting 
                    credentials from stealer malware, infostealer campaigns, and targeted attacks that never make headlines.
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 pt-6 border-t border-green-200">
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600 mb-1">Multiple Sources</div>
                  <p className="text-sm text-muted-foreground">Underground intelligence, HUMINT operatives, and in-house security experts</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600 mb-1">&lt;1hr</div>
                  <p className="text-sm text-muted-foreground">Average time from data collection to customer alert delivery</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-green-200">
                <p className="text-sm text-gray-600 leading-relaxed">
                  <strong>Our Intelligence Collection Process:</strong> We continuously gather leaked credential data from diverse intelligence sources—including underground forums, dark web marketplaces, HUMINT field operatives, and our in-house threat research team. All collected data is securely encrypted and stored in our database, then delivered exclusively to our authenticated customers through our platform.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Real-World Impact Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                The Cost of Undetected Credential Compromise
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                A single stolen password can cascade into organization-wide security incidents. 
                Here's what happens when credentials fall into the wrong hands.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <Card className="border-t-4 border-t-red-500 hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Lock className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-2">Ransomware Deployment</CardTitle>
                      <CardDescription className="text-base">
                        Attackers use compromised credentials to gain initial access, escalate privileges, and deploy 
                        ransomware—encrypting critical systems and demanding millions in ransom.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="border-t-4 border-t-red-500 hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-2">Data Exfiltration</CardTitle>
                      <CardDescription className="text-base">
                        Stolen admin credentials enable threat actors to access databases, download customer records, 
                        and sell sensitive data on underground markets—triggering compliance violations.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="border-t-4 border-t-red-500 hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Activity className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-2">Supply Chain Attacks</CardTitle>
                      <CardDescription className="text-base">
                        Compromised developer credentials on GitHub or GitLab allow attackers to inject malicious code 
                        into software, affecting thousands of downstream customers.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="border-t-4 border-t-red-500 hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingDown className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-2">Business Email Compromise (BEC)</CardTitle>
                      <CardDescription className="text-base">
                        Hijacked executive email accounts enable wire fraud, invoice manipulation, and social engineering 
                        attacks that result in direct financial theft.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* Impact Statistics */}
            <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-6 text-center">The Financial Impact of Credential Breaches</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600 mb-2">$4.45M</div>
                    <p className="text-sm text-muted-foreground">Average cost of a data breach in 2023</p>
                    <p className="text-xs text-muted-foreground mt-1">(IBM Security Report)</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600 mb-2">287 Days</div>
                    <p className="text-sm text-muted-foreground">Average time to identify and contain a breach</p>
                    <p className="text-xs text-muted-foreground mt-1">(IBM Security Report)</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600 mb-2">80%</div>
                    <p className="text-sm text-muted-foreground">Of breaches involve stolen or weak credentials</p>
                    <p className="text-xs text-muted-foreground mt-1">(Verizon DBIR)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof / Use Cases Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Trusted by Security Teams Worldwide
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              From Fortune 500 enterprises to fast-growing SaaS companies, security professionals rely on LeakJar 
              to protect their organizations from credential-based attacks.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-gray-50 to-white">
              <CardHeader>
                <Shield className="h-10 w-10 text-blue-600 mb-3" />
                <CardTitle className="text-lg">Enterprise Security Teams</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  SOC analysts and threat intelligence teams use LeakJar to detect and respond to credential exposures 
                  across thousands of employees.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-50 to-white">
              <CardHeader>
                <Lock className="h-10 w-10 text-blue-600 mb-3" />
                <CardTitle className="text-lg">SaaS & Technology Companies</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Protect customer accounts and internal systems from account takeover attacks with continuous 
                  credential monitoring.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-50 to-white">
              <CardHeader>
                <Activity className="h-10 w-10 text-blue-600 mb-3" />
                <CardTitle className="text-lg">Financial Services & Healthcare</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Meet compliance requirements and protect sensitive data with real-time breach detection and 
                  audit-ready reporting.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 shadow-sm hover:shadow-lg transition-all hover:border-gray-300">
              <CardHeader>
                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-gray-700" />
                </div>
                <Badge variant="outline" className="mb-3 w-fit">
                  Payment Card Industry
                </Badge>
                <CardTitle className="text-lg">PCI DSS 4.0 Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Meet Requirement 8.3.10 and avoid heavy fines. Block compromised passwords and pass your audit.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 shadow-sm hover:shadow-lg transition-all hover:border-gray-300">
              <CardHeader>
                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-gray-700" />
                </div>
                <Badge variant="outline" className="mb-3 w-fit">
                  Federal Standard
                </Badge>
                <CardTitle className="text-lg">NIST SP 800-63B Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Implement mandatory credential monitoring controls and align with NIST Cybersecurity Framework 2.0.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 shadow-sm hover:shadow-lg transition-all hover:border-gray-300">
              <CardHeader>
                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-gray-700" />
                </div>
                <Badge variant="outline" className="mb-3 w-fit">
                  Healthcare
                </Badge>
                <CardTitle className="text-lg">HIPAA Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Protect ePHI and complete your Risk Analysis. Avoid willful neglect penalties and secure patient data.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 shadow-sm hover:shadow-lg transition-all hover:border-gray-300">
              <CardHeader>
                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <Scale className="h-6 w-6 text-gray-700" />
                </div>
                <Badge variant="outline" className="mb-3 w-fit">
                  California Privacy Law
                </Badge>
                <CardTitle className="text-lg">CCPA/CPRA Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Demonstrate "reasonable security" and protect against class-action lawsuits from California consumers.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 shadow-sm hover:shadow-lg transition-all hover:border-gray-300">
              <CardHeader>
                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-gray-700" />
                </div>
                <Badge variant="outline" className="mb-3 w-fit">
                  EU Data Protection
                </Badge>
                <CardTitle className="text-lg">GDPR Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Meet Article 32 "state of the art" requirements and avoid up to 4% revenue fines from EU regulators.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 shadow-sm hover:shadow-lg transition-all hover:border-gray-300">
              <CardHeader>
                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-gray-700" />
                </div>
                <Badge variant="outline" className="mb-3 w-fit">
                  AI Regulation
                </Badge>
                <CardTitle className="text-lg">EU AI Act Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Prevent data poisoning attacks and meet Article 15 robustness requirements for high-risk AI systems.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 shadow-sm hover:shadow-lg transition-all hover:border-gray-300">
              <CardHeader>
                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-gray-700" />
                </div>
                <Badge variant="outline" className="mb-3 w-fit">
                  AI Framework
                </Badge>
                <CardTitle className="text-lg">NIST AI Risk Management Framework</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Operationalize the NIST AI RMF with continuous monitoring. Govern, Map, Measure, and Manage AI risks.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Don't Wait for a Breach to Take Action
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join security teams using LeakJar to detect compromised credentials before they're exploited. 
              Get started in minutes with our free trial—no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100" asChild>
                <Link href="/auth/signup">Start Free Trial</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SharedFooter />
    </div>
  );
}

