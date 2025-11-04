import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle2,
  ArrowRight,
  FileText,
  Lock,
  Eye,
  DollarSign,
  Scale,
  XCircle,
  Bell,
  ShieldCheck,
  TrendingUp,
  FileCheck,
  Users
} from 'lucide-react';
import { SharedHeader } from '@/components/shared-header';
import { SharedFooter } from '@/components/shared-footer';

export const metadata: Metadata = {
  title: "CCPA/CPRA Compliance - Leaked Credentials & The Right to Sue",
  description: "Protect your business from CCPA/CPRA class-action lawsuits. Implement reasonable security procedures with leaked credential monitoring and avoid statutory damages of $100-$750 per consumer.",
  keywords: [
    "CCPA compliance",
    "CPRA compliance",
    "California privacy law",
    "private right of action",
    "reasonable security",
    "credential stuffing prevention",
    "CCPA data breach",
    "California Privacy Protection Agency",
    "statutory damages California",
    "consumer privacy protection"
  ],
  openGraph: {
    title: "CCPA/CPRA Compliance - Are You Maintaining Reasonable Security?",
    description: "Avoid multi-million dollar CCPA lawsuits. Implement reasonable security with leaked credential monitoring and protect California consumer data.",
    url: "https://www.leakjar.com/ccpa-compliance",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "CCPA/CPRA Compliance - Reasonable Security",
    description: "Protect your business from CCPA class-action lawsuits with comprehensive credential monitoring.",
  },
};

export default function CCPACompliancePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <SharedHeader />

      {/* Hero Section */}
      <section className="bg-orange-50 border-b border-orange-100">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 tracking-tight leading-tight">
              Leaked Credentials & The CCPA 'Right to Sue': Are You Maintaining 'Reasonable Security'?
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-6 leading-relaxed max-w-3xl mx-auto">
              For companies doing business in California, a data breach is more than a security headache—it's an 
              <strong> existential legal threat</strong>.
            </p>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto">
              The <strong>California Privacy Rights Act (CPRA)</strong> gives consumers the power to sue your business 
              directly in a class-action lawsuit if their personal information (PI) is breached.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-6">
              <div className="bg-white border-l-4 border-red-600 p-6 rounded-r-lg shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <Scale className="h-6 w-6 text-red-600" />
                  <h3 className="font-bold text-lg text-gray-900">The Penalty</h3>
                </div>
                <p className="text-gray-800 leading-relaxed">
                  Statutory damages of <strong className="text-red-600">$100 to $750</strong> per consumer, per incident.
                </p>
              </div>
              
              <div className="bg-white border-l-4 border-red-600 p-6 rounded-r-lg shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="h-6 w-6 text-red-600" />
                  <h3 className="font-bold text-lg text-gray-900">The Math</h3>
                </div>
                <p className="text-gray-800 leading-relaxed">
                  If just 10,000 California users are in a breach, you face a minimum lawsuit of 
                  <strong className="text-red-600"> $1M to $7.5M</strong>—even with no actual financial harm.
                </p>
              </div>
            </div>

            <div className="bg-white border-l-4 border-orange-600 p-6 rounded-r-lg shadow-sm max-w-3xl mx-auto">
              <p className="text-lg text-gray-800 leading-relaxed mb-4">
                This private right of action is triggered if your company failed <strong>"to implement and maintain 
                reasonable security procedures and practices."</strong>
              </p>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-xl font-bold text-gray-900 mb-2">
                  The Critical Question for Your Business:
                </p>
                <p className="text-lg text-gray-800">
                  In 2025, is failing to monitor for your users' leaked credentials considered "reasonable security?"
                </p>
                <p className="text-lg font-bold text-orange-600 mt-3">
                  For any court or regulator, the answer is a clear <strong>NO</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Reasonable Security Mandate Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-3 py-1 bg-gray-100 text-gray-900 border border-gray-300">
              <ShieldCheck className="h-4 w-4 mr-2 inline text-blue-600" />
              Legal Standard
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              The "Reasonable Security" Mandate
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The CPRA doesn't list every required security tool, but it relies on a legal standard. 
              <strong> "Reasonable security"</strong> means protecting against known, foreseeable threats.
            </p>
          </div>

          <Card className="border-2 border-blue-200 shadow-lg mb-8">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-gray-900 mb-3">
                      Today's Most Common & Foreseeable Threat
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      The most common and foreseeable threat is <strong>credential stuffing</strong>—the automated use 
                      of leaked passwords to take over user accounts. The California Attorney General has explicitly 
                      called this out as a major threat.
                    </p>
                    <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg mt-4">
                      <p className="text-gray-800 font-semibold leading-relaxed">
                        If your organization is breached using this method, and you have <strong>no system in place</strong> to 
                        detect or block compromised passwords, you will be unable to prove you took "reasonable" steps to 
                        protect your users.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Myth Section */}
      <section className="bg-gray-50 py-16 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 px-3 py-1 bg-red-50 text-red-700 border border-red-200">
                <XCircle className="h-4 w-4 mr-2 inline" />
                Common Misconception
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                Myth: "But Our Data is Encrypted."
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
                The CCPA's private right of action applies to <strong>"non-encrypted and non-redacted personal information."</strong> Many 
                companies believe this is a "safe harbor."
              </p>
              <p className="text-2xl font-bold text-red-600 mb-8">
                They are wrong.
              </p>
            </div>

            <Card className="border-l-4 border-l-red-500 shadow-lg">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lock className="h-8 w-8 text-red-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-3">
                      A Stolen Password Unlocks Your Encryption
                    </CardTitle>
                    <p className="text-gray-600 text-base leading-relaxed">
                      A stolen password is the <strong>key that unlocks the encryption</strong>. When an attacker uses a 
                      valid, leaked credential to log in, they are authenticated as a legitimate user.
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                    <p className="text-gray-700 leading-relaxed">
                      All the data they see—<strong>names, addresses, purchase history</strong>—is un-encrypted and un-redacted.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                    <p className="text-gray-700 leading-relaxed">
                      A leaked credential <strong>bypasses your encryption safe harbor</strong>, making you fully liable 
                      for the breach and the fines that follow.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                    <p className="text-gray-700 leading-relaxed">
                      The attacker appears as an <strong>authorized user</strong>, making traditional security controls 
                      ineffective against this attack vector.
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="bg-red-50 p-6 rounded-lg">
                    <p className="text-gray-900 font-bold text-lg text-center">
                      Encryption alone is NOT a defense against credential-based breaches under CCPA/CPRA.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Service Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-3 py-1 bg-green-50 text-green-700 border border-green-200">
              <Shield className="h-4 w-4 mr-2 inline" />
              Legal Defense
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Our Service: Your "Reasonable Security" Defense
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our Leaked Credential Monitoring platform is your single most powerful defense for proving CCPA/CPRA due diligence.
            </p>
          </div>

          <Card className="border-2 border-green-200 shadow-lg mb-8">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <p className="text-xl text-gray-700 leading-relaxed">
                  It provides a clear, documented, and proactive <strong className="text-green-600">"reasonable security procedure"</strong> that 
                  directly mitigates the #1 attack vector.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {/* 1. Prevent Account Takeover */}
            <Card className="border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Eye className="h-7 w-7 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-2">
                      Prevent Account Takeover
                    </CardTitle>
                    <p className="text-gray-600 text-base">
                      <Badge variant="outline" className="mb-2">Proactive Monitoring</Badge>
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    How It Works
                  </h4>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    We monitor the dark web <strong>24/7</strong>. The instant a credential for one of your users or employees 
                    appears in a breach, we alert you.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    This allows you to <strong>force a password reset and lock the account</strong> before an attacker can use it, 
                    preventing the breach entirely.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 2. Satisfy Reasonable Security */}
            <Card className="border-l-4 border-l-green-500 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="h-7 w-7 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-2">
                      Satisfy "Reasonable Security"
                    </CardTitle>
                    <p className="text-gray-600 text-base">
                      <Badge variant="outline" className="mb-2">Password Blacklisting</Badge>
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    How It Works
                  </h4>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Our API integrates with your <strong>sign-up and password reset pages</strong>. We block your users from 
                    choosing a password that is already on a known-compromised list.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    This <strong>directly satisfies the industry-standard "reasonable security" expectation</strong> and demonstrates 
                    proactive protection measures.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 3. Provide Legal Defense */}
            <Card className="border-l-4 border-l-purple-500 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileCheck className="h-7 w-7 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-2">
                      Provide Your Legal Defense
                    </CardTitle>
                    <p className="text-gray-600 text-base">
                      <Badge variant="outline" className="mb-2">Audit Trail</Badge>
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-purple-600" />
                    How It Works
                  </h4>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    In the event of a lawsuit or a regulatory investigation by the <strong>California Privacy Protection 
                    Agency (CPPA)</strong>, you will have an auditable, time-stamped record.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    You can prove that you were <strong>proactively monitoring for this threat</strong>, helping to shield your 
                    company from fines and liability.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Risk Section */}
      <section className="bg-gray-50 py-16 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 px-3 py-1 bg-gray-100 text-gray-900 border border-gray-300">
                <Scale className="h-4 w-4 mr-2 inline text-red-600" />
                Legal Liability
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                Don't Risk a Multi-Million Dollar Lawsuit
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="border-l-4 border-l-orange-500 shadow-sm">
                <CardHeader>
                  <div className="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center mb-4">
                    <DollarSign className="h-7 w-7 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg">Minimum Exposure</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600 mb-2">$100</div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Per California consumer affected, even with no actual damages proven.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500 shadow-sm">
                <CardHeader>
                  <div className="h-12 w-12 bg-red-50 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="h-7 w-7 text-red-600" />
                  </div>
                  <CardTitle className="text-lg">Maximum Exposure</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600 mb-2">$750</div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Per California consumer affected. Class actions can reach tens of millions.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500 shadow-sm">
                <CardHeader>
                  <div className="h-12 w-12 bg-red-50 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-7 w-7 text-red-600" />
                  </div>
                  <CardTitle className="text-lg">Class Action Risk</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600 mb-2">High</div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Private right of action enables class-action lawsuits from affected consumers.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2 border-orange-200 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="h-7 w-7 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-900">
                      A "Known Gap" Is All a Lawyer Needs
                    </h3>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                      Failing to monitor for leaked credentials is a <strong>known gap in security</strong>. Under the CPRA, 
                      that "known gap" is all a lawyer needs to argue you failed your duty of care.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      Don't let a <strong>"willful neglect"</strong> violation open your company to devastating, class-action 
                      lawsuits. Our service is the most effective and affordable way to demonstrate "reasonable security" and 
                      protect your customer's personal information.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">60B+ Records</h4>
                      <p className="text-sm text-gray-600">Comprehensive monitoring</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Real-Time Alerts</h4>
                      <p className="text-sm text-gray-600">Immediate breach detection</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Audit Trail</h4>
                      <p className="text-sm text-gray-600">Legal defense documentation</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white border-0">
              <Scale className="h-4 w-4 mr-2 inline" />
              Protect Your Business
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Demonstrate "Reasonable Security" Today
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Protect your business from CCPA/CPRA class-action lawsuits. Implement proactive credential monitoring 
              and build your legal defense before a breach occurs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100" asChild>
                <Link href="/auth/signup">
                  <Bell className="mr-2 h-5 w-5" />
                  Get a CCPA/CPRA Risk Demo
                </Link>
              </Button>
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white" asChild>
                <Link href="/developer">
                  <FileText className="mr-2 h-5 w-5" />
                  See Our API Documentation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-gray-700">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">$100-$750</div>
                <div className="text-sm text-gray-400">Per Consumer Damages</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">60B+</div>
                <div className="text-sm text-gray-400">Monitored Credentials</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-sm text-gray-400">Dark Web Monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supporting Information Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-8 rounded-r-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <FileText className="h-6 w-6 text-blue-600" />
              Understanding CCPA/CPRA Private Right of Action
            </h3>
            <div className="space-y-4 text-gray-700">
              <p className="leading-relaxed">
                <strong>California Civil Code Section 1798.150:</strong> The CCPA's private right of action allows California 
                consumers to sue businesses directly in the event of a data breach involving their personal information. The 
                CPRA (effective January 2023) expanded these protections and increased enforcement.
              </p>
              <p className="leading-relaxed">
                <strong>What "Reasonable Security" Means:</strong> Courts interpret "reasonable security" based on industry 
                standards, the sensitivity of the data, and the known threat landscape. In 2025, credential stuffing is a 
                well-documented, prevalent threat that businesses are expected to defend against.
              </p>
              <p className="leading-relaxed">
                <strong>Credential Stuffing Statistics:</strong> According to industry reports, credential stuffing attacks 
                account for billions of login attempts annually. The California Attorney General has specifically warned 
                businesses about this threat in official guidance documents.
              </p>
              <p className="leading-relaxed">
                <strong>The California Privacy Protection Agency (CPPA):</strong> The CPRA established the CPPA as the dedicated 
                enforcement agency for California privacy law. The agency has rulemaking authority and can investigate businesses 
                for non-compliance, in addition to private lawsuits from consumers.
              </p>
              <p className="leading-relaxed">
                <strong>Class Action Risk:</strong> Because CCPA allows for statutory damages without proof of actual harm, 
                class-action lawsuits can aggregate damages across thousands or millions of affected consumers, creating 
                existential financial risk for businesses.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SharedFooter />
    </div>
  );
}

