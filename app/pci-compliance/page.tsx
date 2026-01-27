import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ShieldAlert, 
  AlertCircle, 
  XCircle, 
  DollarSign, 
  Clock, 
  Lock, 
  CheckCircle2,
  ArrowRight,
  FileText,
  TrendingUp,
  Zap,
  Shield
} from 'lucide-react';
import { SharedHeader } from '@/components/shared-header';
import { SharedFooter } from '@/components/shared-footer';

/**
 * PCI DSS 4.0 Compliance Page
 * 
 * SEO Target Keywords:
 * - PCI DSS 4.0 compliance
 * - PCI requirement 8.3.10
 * - compromised password blocking
 * - payment card security compliance
 * 
 * AEO Optimization:
 * - FAQ schema for featured snippets
 * - Direct answers to common questions
 * - Voice search optimized content
 * 
 * GEO Optimization:
 * - Comprehensive structured data
 * - Factual, citation-ready content
 */
export const metadata: Metadata = {
  title: "PCI DSS 4.0 Compliance - Meet Requirement 8.3.10 | Credential Monitoring",
  description: "Meet PCI DSS 4.0 Requirement 8.3.10 compliance with LeakJar's credential monitoring API. Block compromised passwords, pass QSA audits, and avoid $5K-$100K monthly fines. Implementation in under 1 hour.",
  keywords: [
    "PCI DSS 4.0 compliance",
    "PCI requirement 8.3.10",
    "compromised password blocking",
    "PCI DSS credential monitoring",
    "payment card security compliance",
    "PCI audit preparation",
    "breached password detection",
    "password breach database",
    "PCI DSS best practices",
    "cardholder data protection",
    "QSA audit requirements",
    "credential screening API",
  ],
  alternates: {
    canonical: "https://www.leakjar.com/pci-compliance",
  },
  openGraph: {
    title: "PCI DSS 4.0 Requirement 8.3.10 Compliance | LeakJar",
    description: "Block compromised passwords and meet PCI DSS 4.0 compliance. 60B+ credential database. Implementation in under 1 hour. Avoid $5K-$100K monthly fines.",
    url: "https://www.leakjar.com/pci-compliance",
    type: "article",
    images: [
      {
        url: "https://www.leakjar.com/og-pci-compliance.png",
        width: 1200,
        height: 630,
        alt: "PCI DSS 4.0 Compliance with LeakJar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PCI DSS 4.0 Requirement 8.3.10 Compliance",
    description: "Meet PCI DSS 4.0 compliance in under 1 hour. Block compromised passwords with 60B+ credential database.",
    images: ["https://www.leakjar.com/twitter-pci.png"],
  },
};

// FAQ Schema data for AEO (Answer Engine Optimization)
const pciFAQs = [
  {
    question: "What is PCI DSS 4.0 Requirement 8.3.10?",
    answer: "PCI DSS 4.0 Requirement 8.3.10 mandates that organizations block users from creating passwords that appear in known data breaches. This requires checking new or changed passwords against a database of compromised credentials at the time of password creation or change. This became mandatory on March 31, 2025."
  },
  {
    question: "What are the penalties for PCI DSS 4.0 non-compliance?",
    answer: "Payment card brands can levy penalties from $5,000 to $100,000 per month for PCI DSS non-compliance. Additional consequences include increased transaction fees, potential loss of payment processing capabilities, liability for fraud losses, and reputational damage from security breaches."
  },
  {
    question: "How quickly can I become PCI DSS 4.0 compliant with LeakJar?",
    answer: "You can integrate LeakJar's credential monitoring API and become compliant with Requirement 8.3.10 in under 1 hour. Our RESTful API includes comprehensive documentation and can be integrated into your password creation and change workflows immediately."
  },
  {
    question: "How does credential monitoring help with PCI compliance?",
    answer: "Credential monitoring checks passwords against a database of 60+ billion compromised credentials from data breaches and dark web sources. When a user tries to create or change a password, the system instantly verifies it hasn't been compromised, blocking breached passwords and satisfying Requirement 8.3.10."
  },
  {
    question: "Is password complexity still required under PCI DSS 4.0?",
    answer: "Password complexity rules alone are no longer sufficient under PCI DSS 4.0. While complexity requirements remain, organizations must also implement credential screening against compromised password databases. A complex password like 'P@ssword1!' would still fail compliance if it appears in breach databases."
  },
  {
    question: "What evidence do I need for a PCI DSS audit?",
    answer: "For Requirement 8.3.10, auditors require evidence of: 1) Integration with a compromised credential database, 2) Real-time password checking at creation/change, 3) Blocking of compromised passwords, and 4) Audit logs demonstrating the control is operational. LeakJar provides all necessary documentation for QSA audits."
  },
];

// Structured data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "PCI DSS 4.0 Requirement 8.3.10 Compliance Guide",
      "description": "Complete guide to meeting PCI DSS 4.0 Requirement 8.3.10 for compromised password blocking and credential monitoring.",
      "author": {
        "@type": "Organization",
        "name": "LeakJar Security Team"
      },
      "publisher": {
        "@type": "Organization",
        "name": "LeakJar",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.leakjar.com/logo.png"
        }
      },
      "datePublished": "2024-01-15",
      "dateModified": "2026-01-26"
    },
    {
      "@type": "FAQPage",
      "mainEntity": pciFAQs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    },
    {
      "@type": "Service",
      "name": "PCI DSS 4.0 Compliance Solution",
      "description": "Credential monitoring service for PCI DSS 4.0 Requirement 8.3.10 compliance",
      "provider": {
        "@type": "Organization",
        "name": "LeakJar"
      },
      "serviceType": "Compliance Monitoring",
      "areaServed": "Worldwide"
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.leakjar.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Solutions",
          "item": "https://www.leakjar.com/solutions"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "PCI DSS 4.0 Compliance",
          "item": "https://www.leakjar.com/pci-compliance"
        }
      ]
    }
  ]
};

export default function PCICompliancePage() {
  return (
    <>
      {/* Structured Data for SEO, AEO, and GEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <SharedHeader />

      {/* Hero Section - Urgent Alert */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 tracking-tight leading-tight">
              The PCI DSS 4.0 Deadline Has Passed. Are You Non-Compliant?
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto">
              The <strong>March 31, 2025</strong> deadline for PCI DSS 4.0 is history. Full enforcement is now in effect, 
              and auditors are actively testing for compliance with all new requirements.
            </p>
            <div className="bg-white border-l-4 border-red-600 p-6 rounded-r-lg shadow-sm max-w-3xl mx-auto">
              <p className="text-lg text-gray-800 leading-relaxed">
                If your organization hasn't addressed the new, mandatory authentication standards, you are no longer 
                just "getting ready"—<strong className="text-red-600">you are non-compliant</strong>. This exposes your 
                organization to severe monthly fines, increased transaction fees, and the immediate risk of a data breach.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Critical Requirement Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-3 py-1 bg-gray-100 text-gray-900 border border-gray-300">
              <ShieldAlert className="h-4 w-4 mr-2 inline text-red-600" />
              Mandatory Requirement
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              The Requirement You Can't Ignore: PCI 8.3.10
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              One of the most critical new controls is <strong>Requirement 8.3.10</strong>, which mandates that you 
              check all user passwords against a list of known compromised credentials.
            </p>
          </div>

          <Card className="border-2 border-gray-200 shadow-lg mb-8">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="text-2xl flex items-center gap-3">
                <Lock className="h-7 w-7 text-gray-700" />
                What This Means for You, Right Now
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <XCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">Block Breached Passwords</h3>
                    <p className="text-gray-700">
                      You <strong>must block users</strong> from creating passwords that have appeared in data breaches.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Clock className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">Real-Time Validation Required</h3>
                    <p className="text-gray-700">
                      You must have a system in place to do this <strong>at the time of password creation or change</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">Complexity Rules Are Not Enough</h3>
                    <p className="text-gray-700">
                      Simply enforcing complexity (like <code className="bg-gray-100 px-2 py-1 rounded text-sm">P@ssword1!</code>) 
                      is <strong>no longer enough</strong> and will result in a failed audit.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <FileText className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">Mandatory, Testable Requirement</h3>
                    <p className="text-gray-700">
                      Auditors are no longer treating this as a "best practice"; it is a <strong>mandatory, testable requirement</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* High Cost of Non-Compliance Section */}
      <section className="bg-gray-50 py-16 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 px-3 py-1 bg-gray-100 text-gray-900 border border-gray-300">
                <DollarSign className="h-4 w-4 mr-2 inline text-gray-700" />
                Financial Impact
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                The High Cost of Non-Compliance
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
                Failing a PCI audit is not a minor issue. The consequences are immediate and severe.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-l-4 border-l-red-600 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="h-14 w-14 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <DollarSign className="h-8 w-8 text-red-600" />
                  </div>
                  <CardTitle className="text-xl mb-3">Heavy Fines</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Payment card brands can levy penalties from <strong>$5,000 to $100,000 per month</strong> until you fix the non-compliance.
                  </p>
                  <p className="text-sm text-gray-600 italic">
                    Ongoing monthly penalties add up quickly, making delays extremely costly.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-gray-300 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="h-14 w-14 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <ShieldAlert className="h-8 w-8 text-gray-700" />
                  </div>
                  <CardTitle className="text-xl mb-3">Increased Breach Risk</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    The requirement exists because <strong>stolen credentials are the #1 attack vector</strong>. 
                    If you aren't blocking compromised passwords, you are a prime target for account takeover and a data breach.
                  </p>
                  <p className="text-sm text-gray-600 italic">
                    A single breach can cost millions in remediation and legal fees.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-gray-300 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="h-14 w-14 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="h-8 w-8 text-gray-700" />
                  </div>
                  <CardTitle className="text-xl mb-3">Reputational Damage</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    A failed audit or a resulting breach <strong>destroys customer trust</strong> and can lead to 
                    you losing your ability to process payments altogether.
                  </p>
                  <p className="text-sm text-gray-600 italic">
                    Loss of payment processing capabilities means loss of revenue.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Warning Box */}
            <div className="mt-10 bg-white border-l-4 border-red-600 p-6 rounded-r-lg shadow-sm">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Every Day of Non-Compliance is a Risk</h3>
                  <p className="text-gray-700">
                    The grace period is over. Your organization is now subject to full enforcement of all PCI DSS 4.0 requirements. 
                    Auditors will test for Requirement 8.3.10 compliance, and failure will have immediate financial and operational consequences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-3 py-1 bg-gray-100 text-gray-900 border border-gray-300">
              <CheckCircle2 className="h-4 w-4 mr-2 inline text-green-600" />
              Immediate Solution
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Your Immediate Solution: Get Compliant in Minutes
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our Leaked Credential Monitoring service is the fastest, most effective way to close this compliance gap 
              and protect your organization.
            </p>
          </div>

          {/* Main Value Proposition */}
          <Card className="border-2 border-gray-200 shadow-lg mb-8">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="h-7 w-7 text-gray-700" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">Billions of Compromised Credentials, Real-Time Access</h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    We maintain a <strong>massive, real-time database of billions of compromised credentials</strong> sourced 
                    continuously from the deep and dark web, data breaches, and threat intelligence feeds.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">60B+ Credential Records</h4>
                    <p className="text-sm text-gray-600">Continuously updated from multiple intelligence sources</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Real-Time API Access</h4>
                    <p className="text-sm text-gray-600">Instant password validation at creation time</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Simple Integration</h4>
                    <p className="text-sm text-gray-600">RESTful API with comprehensive documentation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Secure & Encrypted</h4>
                    <p className="text-sm text-gray-600">All data encrypted and securely stored</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Two-Part Solution */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Part 1: Fix Compliance */}
            <Card className="border-l-4 border-l-green-500 shadow-md">
              <CardHeader className="pb-4">
                <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-7 w-7 text-green-600" />
                </div>
                <CardTitle className="text-xl mb-2">
                  Meet Requirement 8.3.10<br />
                  <span className="text-sm font-normal text-gray-600">(Fix Compliance Now)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our API integrates directly into your password reset and creation pages. It <strong>instantly checks any new password</strong> against 
                  our database and allows you to block compromised ones before they are ever set, ensuring you pass your audit.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Real-time password validation</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Blocks breached passwords instantly</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Audit-ready implementation</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Integration in under 1 hour</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Part 2: Exceed Compliance */}
            <Card className="border-l-4 border-l-gray-300 shadow-md">
              <CardHeader className="pb-4">
                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-7 w-7 text-gray-700" />
                </div>
                <CardTitle className="text-xl mb-2">
                  Exceed Compliance<br />
                  <span className="text-sm font-normal text-gray-600">(Continuous Monitoring)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Don't just wait for a user to change their password. Our service <strong>continuously monitors</strong> for your company's 
                  email domains (e.g., your-company.com) in new breaches. The moment an employee's password is leaked anywhere, 
                  we alert you so you can force a password reset immediately—before it can be used against you.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>24/7 domain monitoring</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Instant breach alerts</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Proactive threat detection</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Prevents account takeovers</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us / Differentiators */}
      <section className="bg-gray-50 py-16 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                Why Organizations Choose LeakJar for PCI Compliance
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-gray-700" />
                  </div>
                  <CardTitle className="text-lg">Fast Implementation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    This is <strong>not a complex, months-long project</strong>. You can integrate our API and be 
                    fully compliant with Requirement 8.3.10 in a single afternoon.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-gray-700" />
                  </div>
                  <CardTitle className="text-lg">Comprehensive Coverage</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Access to <strong>60B+ compromised credentials</strong> from multiple intelligence sources—far beyond 
                    what public breach databases offer.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-gray-700" />
                  </div>
                  <CardTitle className="text-lg">Audit-Ready Documentation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Complete API documentation and implementation guides designed to help you demonstrate compliance 
                    during your PCI audit.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 px-4 py-2 bg-red-600 hover:bg-red-700 text-white border-0">
              <AlertCircle className="h-4 w-4 mr-2 inline" />
              Take Action Now
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Don't Risk Another Day of Non-Compliance
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              The grace period is over. Every day you operate without this control is a risk to your business. 
              Our solution is not a complex, months-long project. <strong>You can integrate our API and be fully 
              compliant with Requirement 8.3.10 in a single afternoon.</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white" asChild>
                <Link href="/auth/signup">
                  Fix My PCI Compliance Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100" asChild>
                <Link href="/developer">
                  <FileText className="mr-2 h-5 w-5" />
                  See API Documentation
                </Link>
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-gray-700">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">60B+</div>
                <div className="text-sm text-gray-400">Credentials Monitored</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">&lt;1hr</div>
                <div className="text-sm text-gray-400">Implementation Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-sm text-gray-400">Real-Time Monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supporting Information Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-50 border-l-4 border-gray-300 p-8 rounded-r-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <FileText className="h-6 w-6 text-gray-700" />
              Understanding PCI DSS 4.0 Requirement 8.3.10
            </h3>
            <div className="space-y-4 text-gray-700">
              <p className="leading-relaxed">
                PCI DSS 4.0 Requirement 8.3.10 specifically states: <em>"If passwords/passphrases are used as authentication 
                factors to meet Requirement 8.3.1, they are not used as the only authentication factor for high-risk transactions, 
                and new or changed passwords/passphrases are compared against a source to verify they are not currently listed 
                as commonly used, compromised, or weak."</em>
              </p>
              <p className="leading-relaxed">
                <strong>What this means in practice:</strong> Organizations must implement a system that checks passwords 
                against a database of known compromised credentials during the password creation or change process. This is 
                a technical control that must be demonstratable during a PCI audit.
              </p>
              <p className="leading-relaxed">
                <strong>Why it matters:</strong> Compromised credentials are the leading cause of data breaches. By preventing 
                users from setting passwords that are already known to be compromised, organizations significantly reduce 
                their attack surface and protect cardholder data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - AEO Optimized */}
      <section className="bg-gray-50 py-16 border-t border-gray-200" id="faq">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Frequently Asked Questions About PCI DSS 4.0
            </h2>
            
            <div className="space-y-6">
              {pciFAQs.map((faq, index) => (
                <Card key={index} className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SharedFooter />
    </div>
    </>
  )
  );
}

