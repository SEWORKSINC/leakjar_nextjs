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
  Zap,
  TrendingUp,
  Building2,
  Users,
  Bell,
  ShieldCheck
} from 'lucide-react';
import { SharedHeader } from '@/components/shared-header';
import { SharedFooter } from '@/components/shared-footer';

export const metadata: Metadata = {
  title: "NIST SP 800-63B Compliance - Are You Following NIST's Mandate for Credential Security?",
  description: "Meet NIST Special Publication 800-63B requirements for password security. Implement mandatory credential monitoring controls and align with NIST Cybersecurity Framework 2.0 functions.",
  keywords: [
    "NIST SP 800-63B",
    "NIST compliance",
    "NIST Cybersecurity Framework",
    "NIST CSF 2.0",
    "digital identity guidelines",
    "password security standard",
    "credential monitoring",
    "compromised password detection",
    "NIST authentication requirements",
    "federal security standards"
  ],
  openGraph: {
    title: "NIST SP 800-63B Compliance - Credential Security Mandate",
    description: "Implement NIST-mandated credential monitoring controls. Check passwords against known breaches and align with CSF 2.0.",
    url: "https://www.leakjar.com/nist-compliance",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "NIST SP 800-63B Compliance - Credential Security",
    description: "Meet NIST's mandatory requirements for password security and credential monitoring.",
  },
};

export default function NISTCompliancePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <SharedHeader />

      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 tracking-tight leading-tight">
              Are You Following NIST's Mandate for Credential Security?
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-6 leading-relaxed max-w-3xl mx-auto">
              If your organization uses the <strong>NIST Cybersecurity Framework (CSF)</strong> to guide its security program, 
              you are already committed to a gold standard of risk management.
            </p>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto">
              But are you aware of the specific, mandatory requirements for password security detailed in NIST's digital identity guidelines?
            </p>
            <div className="bg-white border-l-4 border-gray-300 p-6 rounded-r-lg shadow-sm max-w-3xl mx-auto">
              <p className="text-lg text-gray-800 leading-relaxed">
                The NIST framework is not just a high-level guide; it's supported by specific publications that outline how to 
                implement its controls. For credential security, the most important one is <strong>NIST 
                Special Publication 800-63B</strong>. This document moves credential monitoring from a "nice-to-have" security 
                feature to a <strong>foundational, mandated control</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The NIST Mandate Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-3 py-1 bg-gray-100 text-gray-900 border border-gray-300">
              <FileText className="h-4 w-4 mr-2 inline text-gray-700" />
              Official Standard
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              The NIST Mandate: What SP 800-63B Requires
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              NIST SP 800-63B, "Digital Identity Guidelines," is the U.S. government's official standard for authentication. 
              Its rules are clear and direct.
            </p>
          </div>

          {/* Main Requirement Card */}
          <Card className="border-2 border-gray-200 shadow-lg mb-8">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="text-2xl flex items-center gap-3">
                <ShieldCheck className="h-7 w-7 text-gray-700" />
                Section 5.1.1.2: Mandatory Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="bg-gray-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                  <p className="text-gray-800 italic leading-relaxed mb-4">
                    "When processing requests to establish and change memorized secrets, verifiers <strong>SHALL</strong> compare 
                    the prospective secrets against a list that contains values known to be commonly-used, expected, or compromised."
                  </p>
                  <p className="text-gray-800 italic leading-relaxed">
                    "...For example, the list <strong>MAY</strong> include, but is not limited to: Passwords obtained from 
                    previous breach corpuses."
                  </p>
                  <p className="text-sm text-gray-600 mt-4">
                    — NIST SP 800-63B, Section 5.1.1.2
                  </p>
                </div>

                <div className="flex items-start gap-4 pt-4">
                  <div className="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">What "SHALL" Means</h3>
                    <p className="text-gray-700 leading-relaxed">
                      In NIST terminology, <strong>"SHALL"</strong> indicates a mandatory requirement, not a recommendation. 
                      This is a <strong>required control</strong>, not an optional best practice.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">At Password Creation/Change</h4>
                      <p className="text-sm text-gray-700">
                        Your organization is <strong>not compliant</strong> with the NIST standard if you are not actively 
                        checking new passwords against a database of known-leaked credentials.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Continuous Monitoring</h4>
                      <p className="text-sm text-gray-700">
                        Recent guidance emphasizes it's no longer enough to just check when passwords are created. You must 
                        detect when existing passwords show up in new breaches.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* NIST CSF 2.0 Mapping Section */}
      <section className="bg-gray-50 py-16 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
            <Badge className="mb-4 px-3 py-1 bg-gray-100 text-gray-900 border border-gray-300">
              <Shield className="h-4 w-4 mr-2 inline text-gray-700" />
              Framework Alignment
            </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                How Leaked Credential Monitoring Connects to the NIST CSF 2.0 Functions
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our service is the tool that allows organizations to implement these NIST-mandated controls. It is not just a 
                single-point solution; it is a critical technology that supports the entire lifecycle of the Cybersecurity Framework.
              </p>
            </div>

            <div className="space-y-6">
              {/* 1. GOVERN */}
              <Card className="border-l-4 border-l-gray-300 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-7 w-7 text-gray-700" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl mb-2">
                        1. GOVERN (GV)
                      </CardTitle>
                      <p className="text-gray-600 text-base">
                        The new "Govern" function is about integrating cybersecurity with your core business risk strategy.
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 border-l-4 border-gray-300 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      How We Help
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      Stolen credentials are not just an "IT problem." They are a <strong>primary business risk</strong> that can 
                      lead to ransomware, financial fraud, and catastrophic data breaches. By monitoring for them, you are providing 
                      your leadership (the "Govern" function) with clear data on your organization's real-time risk exposure.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* 2. PROTECT */}
              <Card className="border-l-4 border-l-green-500 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="h-7 w-7 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl mb-2">
                        2. PROTECT (PR)
                      </CardTitle>
                      <p className="text-gray-600 text-base">
                        The "Protect" function is focused on "safeguards to prevent or reduce cybersecurity risk." This is our primary function.
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      How We Help (PR.AA - Identity Management, Authentication, and Access Control)
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Lock className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">Proactive Blocking (API)</p>
                          <p className="text-gray-700 text-sm">
                            Our API allows you to instantly check new passwords against our database of billions, directly 
                            satisfying the NIST SP 800-63B mandate.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <ShieldCheck className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">Passwordless Security</p>
                          <p className="text-gray-700 text-sm">
                            We help you identify which accounts are most at-risk, allowing you to prioritize them for stronger 
                            protections like MFA or passwordless solutions.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 3. DETECT */}
              <Card className="border-l-4 border-l-gray-300 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Eye className="h-7 w-7 text-gray-700" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl mb-2">
                        3. DETECT (DE)
                      </CardTitle>
                      <p className="text-gray-600 text-base">
                        The "Detect" function is about finding "possible cybersecurity attacks and compromises." A leaked credential is the very first indicator of a potential compromise.
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 border-l-4 border-gray-300 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      How We Help (DE.CM - Continuous Monitoring)
                    </h4>
                    <div className="flex items-start gap-3">
                      <Bell className="h-5 w-5 text-gray-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm mb-1">Real-Time Alerts</p>
                        <p className="text-gray-700 leading-relaxed">
                          Our service acts as your "smoke detector" across <strong>multiple intelligence sources</strong>—underground 
                          forums, threat actor networks, the deep and dark web, and HUMINT operatives. The instant one of your employee's 
                          or executive's credentials appears in a new breach, we detect it and alert you. This is the 
                          <strong> earliest possible warning</strong> that an account is at high risk of takeover.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 4. RESPOND */}
              <Card className="border-l-4 border-l-gray-300 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="h-7 w-7 text-gray-700" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl mb-2">
                        4. RESPOND (RS)
                      </CardTitle>
                      <p className="text-gray-600 text-base">
                        The "Respond" function is about "actions regarding a detected cybersecurity incident." Knowing a credential is leaked is useless if you don't act.
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 border-l-4 border-gray-300 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      How We Help (RS.MI - Mitigation)
                    </h4>
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-gray-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm mb-1">Actionable Intelligence</p>
                        <p className="text-gray-700 leading-relaxed">
                          We don't just give you a list of 10,000 leaked passwords. We tell you <strong>which employee is 
                          compromised, what the password is, and where it was found</strong>. This allows you to "Respond" instantly 
                          by forcing a password reset for that specific, high-risk account.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Key Differentiators */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Go Beyond "Best Practice." Achieve True NIST Compliance.
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Following the NIST framework means building a mature, resilient security program. You can no longer do that 
              while ignoring the industry's #1 attack vector.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="border-l-4 border-l-red-600 shadow-sm">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg mb-2">Outdated Control</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Using a "complexity" policy (like <code className="bg-gray-100 px-2 py-1 rounded text-sm">P@ssword1!</code>) 
                  is an <strong>outdated control that NIST no longer recommends</strong>. Complexity rules create passwords 
                  that are hard for humans to remember but easy for computers to crack.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500 shadow-sm">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg mb-2">Modern NIST-Compliant Security</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  True, modern security—and true NIST compliance—requires <strong>actively blocking and monitoring for credentials 
                  that are already in the hands of attackers</strong>. This is the only way to prevent credential-based breaches.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 border-gray-200 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-7 w-7 text-gray-700" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">
                    The Most Effective Way to Meet NIST Requirements
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Our service is the most <strong>effective, scalable, and immediate</strong> way to meet the mandates of 
                    NIST SP 800-63B and enhance every function of your Cybersecurity Framework 2.0 program.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">60B+ Credentials</h4>
                    <p className="text-sm text-gray-600">Comprehensive breach database continuously updated</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Real-Time API</h4>
                    <p className="text-sm text-gray-600">Instant password validation at creation/change</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">24/7 Monitoring</h4>
                    <p className="text-sm text-gray-600">Continuous detection of new credential leaks</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 px-4 py-2 bg-gray-800 hover:bg-black text-white border-0">
              <Shield className="h-4 w-4 mr-2 inline" />
              Achieve NIST Compliance
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Implement NIST-Mandated Controls Today
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Meet the requirements of NIST SP 800-63B and strengthen every function of your Cybersecurity Framework 2.0 
              program with comprehensive credential monitoring.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100" asChild>
                <Link href="/developer">
                  <FileText className="mr-2 h-5 w-5" />
                  See Our API Documentation
                </Link>
              </Button>
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white" asChild>
                <Link href="/auth/signup">
                  Get a Demo of Our Monitoring Platform
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-gray-700">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">60B+</div>
                <div className="text-sm text-gray-400">Breach Records</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">&lt;1hr</div>
                <div className="text-sm text-gray-400">Integration Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">4 of 5</div>
                <div className="text-sm text-gray-400">CSF 2.0 Functions</div>
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
              About NIST SP 800-63B Digital Identity Guidelines
            </h3>
            <div className="space-y-4 text-gray-700">
              <p className="leading-relaxed">
                <strong>NIST Special Publication 800-63B</strong> is part of a suite of documents that provide technical 
                requirements for federal agencies implementing digital identity services. While initially created for federal 
                use, these guidelines have become the de facto standard for commercial organizations seeking to implement 
                strong authentication controls.
              </p>
              <p className="leading-relaxed">
                <strong>Why it matters:</strong> Organizations that follow the NIST Cybersecurity Framework are expected to 
                implement the specific technical controls outlined in publications like SP 800-63B. This includes the mandatory 
                requirement to check passwords against lists of compromised credentials.
              </p>
              <p className="leading-relaxed">
                <strong>Recent updates:</strong> The latest guidance emphasizes continuous monitoring and proactive detection 
                of credential compromise, not just one-time validation. Organizations must have systems in place to detect when 
                existing passwords appear in new breaches.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SharedFooter />
    </div>
  );
}

