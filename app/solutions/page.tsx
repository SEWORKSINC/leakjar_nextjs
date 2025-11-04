import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  CheckCircle2,
  ArrowRight,
  FileText,
  Building2,
  Heart,
  Scale,
  Globe,
  Brain,
  Lock
} from 'lucide-react';
import { SharedHeader } from '@/components/shared-header';
import { SharedFooter } from '@/components/shared-footer';

export const metadata: Metadata = {
  title: "Compliance Solutions - Meet Industry Security & Privacy Standards",
  description: "Comprehensive leaked credential monitoring solutions for regulatory compliance. Meet PCI DSS, NIST, HIPAA, CCPA/CPRA, GDPR, and AI security requirements with one platform.",
  keywords: [
    "compliance solutions",
    "PCI DSS compliance",
    "NIST compliance",
    "HIPAA compliance",
    "CCPA compliance",
    "GDPR compliance",
    "EU AI Act",
    "regulatory compliance",
    "credential monitoring compliance",
    "security compliance platform"
  ],
  openGraph: {
    title: "Compliance Solutions - Regulatory Standards Made Simple",
    description: "Meet PCI DSS, NIST, HIPAA, CCPA, GDPR, and AI security requirements with comprehensive credential monitoring.",
    url: "https://www.leakjar.com/solutions",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compliance Solutions - Industry Standards",
    description: "Comprehensive solutions for meeting regulatory and industry security standards.",
  },
};

export default function SolutionsPage() {
  const credentialSolutions = [
    {
      title: 'PCI DSS 4.0 Compliance',
      description: 'Meet Requirement 8.3.10 and avoid heavy fines. Block compromised passwords and pass your audit.',
      href: '/pci-compliance',
      icon: Shield,
      badge: 'Payment Card Industry',
      deadline: 'Deadline Passed - Full Enforcement',
    },
    {
      title: 'NIST SP 800-63B Compliance',
      description: 'Implement mandatory credential monitoring controls and align with NIST Cybersecurity Framework 2.0.',
      href: '/nist-compliance',
      icon: FileText,
      badge: 'Federal Standard',
      deadline: 'Mandatory Requirement',
    },
    {
      title: 'HIPAA Compliance',
      description: 'Protect ePHI and complete your Risk Analysis. Avoid willful neglect penalties and secure patient data.',
      href: '/hipaa-compliance',
      icon: Heart,
      badge: 'Healthcare',
      deadline: 'Reasonable & Appropriate',
    },
    {
      title: 'CCPA/CPRA Compliance',
      description: 'Demonstrate "reasonable security" and protect against class-action lawsuits from California consumers.',
      href: '/ccpa-compliance',
      icon: Scale,
      badge: 'California Privacy Law',
      deadline: 'Private Right of Action',
    },
    {
      title: 'GDPR Compliance',
      description: 'Meet Article 32 "state of the art" requirements and avoid up to 4% revenue fines from EU regulators.',
      href: '/gdpr-compliance',
      icon: Globe,
      badge: 'EU Data Protection',
      deadline: 'Article 32 Mandate',
    },
  ];

  const aiSolutions = [
    {
      title: 'EU AI Act Compliance',
      description: 'Prevent data poisoning attacks and meet Article 15 robustness requirements for high-risk AI systems.',
      href: '/ai-act-compliance',
      icon: Brain,
      badge: 'AI Regulation',
      deadline: '€35M Maximum Fine',
    },
    {
      title: 'NIST AI Risk Management Framework',
      description: 'Operationalize the NIST AI RMF with continuous monitoring. Govern, Map, Measure, and Manage AI risks.',
      href: '/nist-ai-rmf',
      icon: Shield,
      badge: 'AI Framework',
      deadline: 'Trustworthy AI',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <SharedHeader />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 tracking-tight">
            Meet Every Major Compliance Standard
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            One platform to satisfy PCI DSS, NIST, HIPAA, CCPA, GDPR, and AI security requirements. 
            Comprehensive credential monitoring that keeps you compliant and secure.
          </p>
        </div>
      </section>

      {/* Credential Monitoring Solutions */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Credential Monitoring Solutions
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl">
              Protect your organization from credential-based breaches while meeting industry-specific regulatory requirements.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {credentialSolutions.map((solution) => {
              const Icon = solution.icon;
              return (
                <Card key={solution.href} className="border-2 border-gray-200 shadow-sm hover:shadow-lg transition-all hover:border-gray-300">
                  <CardHeader>
                    <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-gray-700" />
                    </div>
                    <Badge variant="outline" className="mb-3 w-fit">
                      {solution.badge}
                    </Badge>
                    <CardTitle className="text-xl mb-2">{solution.title}</CardTitle>
                    <CardDescription className="text-sm text-gray-600 mb-2">
                      {solution.description}
                    </CardDescription>
                    <div className="text-sm font-semibold text-red-600 mb-4">
                      {solution.deadline}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={solution.href}>
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Security Solutions */}
      <section className="bg-gray-50 py-16 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                AI Security & Compliance Solutions
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl">
                Protect your AI systems from data poisoning and adversarial attacks while demonstrating compliance with emerging AI regulations.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {aiSolutions.map((solution) => {
                const Icon = solution.icon;
                return (
                  <Card key={solution.href} className="border-2 border-gray-200 shadow-sm hover:shadow-lg transition-all hover:border-gray-300">
                    <CardHeader>
                      <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-gray-700" />
                      </div>
                      <Badge variant="outline" className="mb-3 w-fit">
                        {solution.badge}
                      </Badge>
                      <CardTitle className="text-xl mb-2">{solution.title}</CardTitle>
                      <CardDescription className="text-sm text-gray-600 mb-2">
                        {solution.description}
                      </CardDescription>
                      <div className="text-sm font-semibold text-gray-700 mb-4">
                        {solution.deadline}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={solution.href}>
                          Learn More
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Why One Platform Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Why Choose One Platform for All Compliance Needs?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Instead of managing multiple vendors and solutions, consolidate your compliance efforts with a single, comprehensive platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Single Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Implement once and satisfy multiple regulatory frameworks. One API, one dashboard, comprehensive coverage.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Unified Data Source</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Access 60B+ compromised credentials from multiple intelligence sources for all your compliance needs.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Audit-Ready Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Complete audit trails and documentation designed to demonstrate compliance across all frameworks.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Start Your Compliance Journey Today
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Get started with our platform and meet all your compliance requirements with a single, powerful solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white" asChild>
                <Link href="/auth/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100" asChild>
                <Link href="/developer">
                  <FileText className="mr-2 h-5 w-5" />
                  View API Documentation
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SharedFooter />
    </div>
  );
}

