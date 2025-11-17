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
  Users,
  Bell,
  ShieldAlert,
  ClipboardCheck,
  Database,
  Activity
} from 'lucide-react';
import { SharedHeader } from '@/components/shared-header';
import { SharedFooter } from '@/components/shared-footer';

export const metadata: Metadata = {
  title: "HIPAA Compliance - Protecting ePHI with Leaked Credential Monitoring",
  description: "Complete your HIPAA Risk Analysis with leaked credential monitoring. Meet Security Rule requirements, protect ePHI, and avoid willful neglect penalties with continuous credential monitoring.",
  keywords: [
    "HIPAA compliance",
    "ePHI protection",
    "HIPAA Security Rule",
    "HIPAA Risk Analysis",
    "healthcare data breach",
    "Business Associate risk",
    "credential monitoring HIPAA",
    "OCR audit compliance",
    "willful neglect penalties",
    "healthcare cybersecurity"
  ],
  openGraph: {
    title: "HIPAA Compliance - Protecting ePHI with Credential Monitoring",
    description: "Meet HIPAA Security Rule requirements and protect patient data with comprehensive leaked credential monitoring for healthcare organizations.",
    url: "https://www.leakjar.com/hipaa-compliance",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "HIPAA Compliance - ePHI Protection",
    description: "Complete your HIPAA Risk Analysis with leaked credential monitoring and avoid willful neglect penalties.",
  },
};

export default function HIPAACompliancePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <SharedHeader />

      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 tracking-tight leading-tight">
              Protecting ePHI: Why Your HIPAA Risk Analysis Is Incomplete Without Leaked Credential Monitoring
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto">
              A single stolen password—for a doctor, a nurse, an administrator, or a third-party billing vendor—is all 
              an attacker needs to access your EMR, exfiltrate thousands of patient records (ePHI), and trigger a 
              multi-million dollar HIPAA breach.
            </p>
            <div className="bg-white border-l-4 border-red-600 p-6 rounded-r-lg shadow-sm max-w-3xl mx-auto mb-6">
              <p className="text-lg text-gray-800 leading-relaxed">
                Under HIPAA, this isn't just a security incident. It is a <strong className="text-red-600">reportable breach</strong> that 
                can lead to massive fines, mandatory patient notification, and devastating reputational damage.
              </p>
            </div>
            <div className="bg-white border-l-4 border-red-600 p-6 rounded-r-lg shadow-sm max-w-3xl mx-auto">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <p className="text-lg text-gray-800 leading-relaxed text-left">
                  <strong>The worst part?</strong> If you weren't actively looking for that stolen password, the Office for 
                  Civil Rights (OCR) will likely classify the breach as a result of <strong className="text-red-600">"willful neglect,"</strong> triggering 
                  the highest tier of financial penalties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The HIPAA Mandate Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-3 py-1 bg-gray-100 text-gray-900 border border-gray-300">
              <ClipboardCheck className="h-4 w-4 mr-2 inline text-gray-700" />
              Legal Requirement
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              The HIPAA "Reasonable and Appropriate" Mandate
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              The HIPAA Security Rule is not a simple checklist; it requires you to protect ePHI against 
              "reasonably anticipated threats."
            </p>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              To do this, the law mandates that all <strong>Covered Entities and Business Associates</strong> conduct a 
              thorough and ongoing <strong>Risk Analysis</strong> (45 CFR § 164.308(a)(1)(ii)(A)).
            </p>
          </div>

          {/* The Simple Truth Card */}
          <Card className="border-2 border-gray-200 shadow-lg mb-8">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="text-2xl text-center">
                Here is the simple truth in 2025:
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <ShieldAlert className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">The Risk</h3>
                    <p className="text-gray-700 leading-relaxed">
                      The #1 "reasonably anticipated threat" to ePHI is an attacker using <strong>stolen or leaked credentials</strong>. 
                      Hacking and IT incidents are, by far, the leading cause of healthcare data breaches.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <ClipboardCheck className="h-5 w-5 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">The Mandate</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Your <strong>Risk Analysis must identify this threat</strong>. It's not optional—it's a fundamental 
                      requirement of HIPAA compliance.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">The Gap</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Once identified, you are required to implement <strong>"reasonable and appropriate" safeguards</strong> to 
                      mitigate that risk.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="bg-white border-l-4 border-red-600 p-6 rounded-r-lg shadow-sm">
                  <p className="text-gray-800 font-semibold leading-relaxed">
                    Failing to monitor for leaked credentials is a failure to manage the most common and high-impact risk to ePHI. 
                    This is what auditors see as <span className="text-red-600">"willful neglect."</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How We Help Section */}
      <section className="bg-gray-50 py-16 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
            <Badge className="mb-4 px-3 py-1 bg-gray-100 text-gray-900 border border-gray-300">
              <Shield className="h-4 w-4 mr-2 inline text-gray-700" />
              HIPAA Safeguards
            </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                How We Help You Meet HIPAA Safeguards
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our Leaked Credential Monitoring service is a critical "technical and administrative safeguard" that closes 
                this gap. It directly helps you fulfill your obligations under the HIPAA Security Rule.
              </p>
            </div>

            <div className="space-y-6">
              {/* 1. Risk Analysis */}
              <Card className="border-l-4 border-l-gray-300 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ClipboardCheck className="h-7 w-7 text-gray-700" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl mb-2">
                        1. Satisfy Your Risk Analysis
                      </CardTitle>
                      <p className="text-gray-600 text-base">
                        <Badge variant="outline" className="mb-2">Administrative Safeguard</Badge>
                        <br />
                        Your Risk Analysis is the foundation of your entire HIPAA security program.
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 border-l-4 border-gray-300 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      Our Solution
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      We provide you with <strong>concrete, actionable data on your actual credential exposure</strong>. You can 
                      move from a theoretical "this might happen" to a documented, managed control. Our reports prove to auditors 
                      that you have identified, analyzed, and are actively managing this critical threat vector.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* 2. Access Control */}
              <Card className="border-l-4 border-l-green-500 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Lock className="h-7 w-7 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl mb-2">
                        2. Enforce Access Control
                      </CardTitle>
                      <p className="text-gray-600 text-base">
                        <Badge variant="outline" className="mb-2">Technical Safeguard</Badge>
                        <br />
                        The law requires you to "implement technical policies and procedures for electronic information systems 
                        that maintain ePHI to allow access only to those persons...who have been granted access rights."
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      Our Solution
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      A leaked password is a <strong>"get in free" card for an attacker</strong>. Our monitoring service detects 
                      when an authorized user's credentials are compromised, allowing you to respond by forcing a password reset 
                      and terminating the unauthorized access path <strong>before ePHI is viewed or stolen</strong>.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* 3. Breach Detection */}
              <Card className="border-l-4 border-l-gray-300 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Eye className="h-7 w-7 text-gray-700" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl mb-2">
                        3. Enable Breach Detection & Response
                      </CardTitle>
                      <p className="text-gray-600 text-base">
                        <Badge variant="outline" className="mb-2">Administrative Safeguard</Badge>
                        <br />
                        The HIPAA Breach Notification Rule requires you to notify patients and the HHS "without unreasonable 
                        delay" and no later than 60 days after the discovery of a breach.
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 border-l-4 border-gray-300 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      Our Solution
                    </h4>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      <strong>"Discovery"</strong> is when you knew or should have known about a breach. Our service provides the 
                      <strong> earliest possible "discovery"</strong> of a compromised account—often months before an attacker even 
                      uses it.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      This gives you time to mitigate the breach <strong>before it becomes a reportable, public-filing event</strong>.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* 4. Business Associate Risk */}
              <Card className="border-l-4 border-l-gray-300 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="h-7 w-7 text-gray-700" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl mb-2">
                        4. Manage Your Business Associate (BA) Risk
                      </CardTitle>
                      <p className="text-gray-600 text-base">
                        You are liable for a breach caused by one of your vendors (Business Associates). If their employee's 
                        password is stolen and used to access your data, it is <strong>your HIPAA violation</strong>.
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 border-l-4 border-gray-300 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      Our Solution
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      Our platform monitors not just your own company domains but also <strong>the domains of your critical 
                      Business Associates</strong>. We alert you if your BAs have a credential leak, allowing you to enforce your 
                      Business Associate Agreements (BAAs) and protect your shared ePHI.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Cost Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-3 py-1 bg-gray-100 text-gray-900 border border-gray-300">
              <DollarSign className="h-4 w-4 mr-2 inline text-red-600" />
              Financial Impact
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Don't Let a $5 Password Cause a $5 Million Fine
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="border-l-4 border-l-red-500 shadow-md">
              <CardHeader>
                <div className="h-14 w-14 bg-red-50 rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-xl mb-3">Average Healthcare Breach Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-red-600 mb-3">$10M+</div>
                <p className="text-gray-700 leading-relaxed mb-3">
                  The average cost of a healthcare data breach is <strong>over $10 million</strong>—the highest of any industry.
                </p>
                <p className="text-sm text-gray-600 italic">
                  This includes investigation costs, patient notification, legal fees, regulatory fines, and reputation damage.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500 shadow-md">
              <CardHeader>
                <div className="h-14 w-14 bg-red-50 rounded-lg flex items-center justify-center mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-xl mb-3">Willful Neglect Penalties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-red-600 mb-3">$71K+</div>
                <p className="text-gray-700 leading-relaxed mb-3">
                  The penalties for non-compliance are severe, with <strong>"willful neglect" fines starting at over 
                  $71,000 per single violation</strong>.
                </p>
                <p className="text-sm text-gray-600 italic">
                  Maximum penalties can reach $1.9 million per violation category, per year.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 border-gray-200 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="h-7 w-7 text-gray-700" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">
                    You Cannot Claim a Threat is "Unforeseeable"
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    When stolen credentials are the <strong>most common threat in your industry</strong>, you cannot claim 
                    you didn't see it coming.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Our service is your <strong>most reasonable and appropriate safeguard</strong> against the #1 cause of 
                    ePHI breaches. Protect your patients, pass your audits, and prevent a devastating breach.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">60B+ Records</h4>
                    <p className="text-sm text-gray-600">Comprehensive breach database</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">24/7 Monitoring</h4>
                    <p className="text-sm text-gray-600">Continuous threat detection</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">BA Monitoring</h4>
                    <p className="text-sm text-gray-600">Track vendor credentials too</p>
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
              <Database className="h-4 w-4 mr-2 inline" />
              Protect ePHI
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Complete Your HIPAA Risk Analysis Today
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Implement the most reasonable and appropriate safeguard against credential-based breaches. Protect your 
              patients, satisfy OCR requirements, and avoid willful neglect penalties.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100" asChild>
                <Link href="/auth/signup">
                  <Activity className="mr-2 h-5 w-5" />
                  Get a HIPAA Compliance Demo
                </Link>
              </Button>
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white" asChild>
                <Link href="/dashboard">
                  See Our Monitoring Platform
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-gray-700">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">$10M</div>
                <div className="text-sm text-gray-400">Avg. Healthcare Breach</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">60 Days</div>
                <div className="text-sm text-gray-400">Breach Notification</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-sm text-gray-400">ePHI Monitoring</div>
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
              Understanding HIPAA Security Rule Requirements
            </h3>
            <div className="space-y-4 text-gray-700">
              <p className="leading-relaxed">
                <strong>45 CFR § 164.308(a)(1)(ii)(A) - Risk Analysis:</strong> This is a required implementation specification 
                that mandates Covered Entities and Business Associates to "conduct an accurate and thorough assessment of the 
                potential risks and vulnerabilities to the confidentiality, integrity, and availability of electronic protected 
                health information."
              </p>
              <p className="leading-relaxed">
                <strong>What "Reasonable and Appropriate" Means:</strong> The HIPAA Security Rule uses a scalable, flexible 
                framework. What's reasonable depends on your size, complexity, and the nature of your ePHI. However, ignoring 
                the #1 threat vector (stolen credentials) is never reasonable, regardless of organization size.
              </p>
              <p className="leading-relaxed">
                <strong>OCR Enforcement:</strong> The Office for Civil Rights actively investigates breaches and can impose 
                significant fines for organizations that fail to implement appropriate safeguards. "Willful neglect" 
                classifications result in the highest penalty tiers and cannot be waived.
              </p>
              <p className="leading-relaxed">
                <strong>Business Associate Liability:</strong> Under the HITECH Act, Business Associates are directly liable 
                for HIPAA violations. Both the Covered Entity and the BA can be penalized for the same breach, making vendor 
                risk management critical.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SharedFooter />
    </div>
  );
}

