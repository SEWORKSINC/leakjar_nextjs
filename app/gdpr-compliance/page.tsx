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
  Clock,
  XCircle,
  Bell,
  ShieldCheck,
  Scale,
  TrendingUp,
  Zap,
  Globe
} from 'lucide-react';
import { SharedHeader } from '@/components/shared-header';
import { SharedFooter } from '@/components/shared-footer';

export const metadata: Metadata = {
  title: "GDPR Compliance - Leaked Credentials & State of the Art Protection",
  description: "Meet GDPR Article 32 'state of the art' requirements with leaked credential monitoring. Avoid 4% revenue fines, satisfy DPA mandates, and prevent credential stuffing attacks under EU data protection law.",
  keywords: [
    "GDPR compliance",
    "Article 32 GDPR",
    "state of the art security",
    "GDPR data breach",
    "credential stuffing GDPR",
    "Article 33 notification",
    "Data Protection Authority",
    "ICO compliance",
    "GDPR fines",
    "personal data protection"
  ],
  openGraph: {
    title: "GDPR Compliance - State of the Art Credential Protection",
    description: "Meet GDPR Article 32 requirements and avoid 4% revenue fines with comprehensive leaked credential monitoring.",
    url: "https://www.leakjar.com/gdpr-compliance",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "GDPR Compliance - State of the Art Protection",
    description: "Satisfy GDPR Article 32 with leaked credential monitoring and prevent data breaches.",
  },
};

export default function GDPRCompliancePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <SharedHeader />

      {/* Hero Section */}
      <section className="bg-blue-50 border-b border-blue-100">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 tracking-tight leading-tight">
              Leaked Credentials & GDPR: Why You Are No Longer Compliant Without "State of the Art" Protection
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-6 leading-relaxed max-w-3xl mx-auto">
              Under the <strong>General Data Protection Regulation (GDPR)</strong>, "I didn't know" is not a defense. 
              If your organization suffers a data breach from a credential stuffing attack, you are not just a victim—you 
              are <strong>non-compliant</strong>.
            </p>
            
            <div className="bg-white border-l-4 border-red-600 p-6 rounded-r-lg shadow-sm max-w-3xl mx-auto mb-6">
              <div className="flex items-start gap-4">
                <DollarSign className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <h3 className="font-bold text-xl text-gray-900 mb-2">The Fines Are Severe</h3>
                  <p className="text-lg text-gray-800 leading-relaxed">
                    Up to <strong className="text-red-600">4% of your total global annual revenue</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border-l-4 border-orange-600 p-6 rounded-r-lg shadow-sm max-w-3xl mx-auto">
              <p className="text-lg text-gray-800 leading-relaxed">
                Recent enforcement actions by <strong>Data Protection Authorities (DPAs)</strong> have made one thing clear: 
                failing to protect against known, foreseeable attack vectors like credential stuffing is a 
                <strong className="text-orange-600"> direct violation</strong> of your duty to secure personal data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Article 32 Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-3 py-1 bg-gray-100 text-gray-900 border border-gray-300">
              <Scale className="h-4 w-4 mr-2 inline text-blue-600" />
              Legal Requirement
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Article 32: The "State of the Art" Mandate
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              GDPR <strong>Article 32, "Security of processing,"</strong> is the core of your technical obligation. 
              It legally requires you to implement "appropriate technical and organisational measures" to ensure data security, 
              specifically <strong>"taking into account the state of the art."</strong>
            </p>
          </div>

          <Card className="border-2 border-blue-200 shadow-lg mb-8">
            <CardHeader className="bg-blue-50 border-b border-blue-100">
              <CardTitle className="text-2xl">
                In 2025, What Is the "State of the Art" for Password Security?
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-gray-900 mb-2">
                      It is NOT just password complexity rules
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Like <code className="bg-gray-100 px-2 py-1 rounded text-sm">P@ssword1!</code> — these are 
                      outdated and insufficient to meet modern security standards.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-gray-900 mb-2">
                      It IS actively defending against known, compromised passwords
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      This is the modern, "state of the art" approach that regulators are demanding.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    ICO & EU DPA Official Guidance
                  </h4>
                  <p className="text-gray-800 leading-relaxed mb-3">
                    Leading EU data protection authorities, including the UK's <strong>Information Commissioner's Office (ICO)</strong>, 
                    explicitly recommend that "state of the art" password systems must:
                  </p>
                  <div className="bg-white p-4 rounded-lg italic">
                    <p className="text-gray-800 leading-relaxed">
                      "Screen passwords against a password <strong>'deny list'</strong> of the most commonly used passwords, 
                      leaked passwords from website breaches, and common words or phrases..."
                    </p>
                  </div>
                  <p className="text-gray-800 font-semibold mt-4 leading-relaxed">
                    This is not a suggestion; it is their definition of the <strong className="text-blue-600">minimum technical 
                    safeguard</strong> required to protect personal data.
                  </p>
                </div>
              </div>

              <div className="mt-6 bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg">
                <p className="text-gray-900 font-bold text-lg">
                  If you are not checking passwords against a database of known-leaked credentials, you are failing to 
                  meet the "state of the art" and are <span className="text-orange-600">in breach of Article 32</span>.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 23andMe Precedent Section */}
      <section className="bg-gray-50 py-16 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 px-3 py-1 bg-gray-100 text-gray-900 border border-gray-300">
                <AlertTriangle className="h-4 w-4 mr-2 inline text-red-600" />
                Regulatory Precedent
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                The 23andMe Precedent: "You Should Have Known"
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                You are expected to know your risks. The joint investigation into the 23andMe breach by EU and UK 
                authorities was a landmark event.
              </p>
            </div>

            <Card className="border-l-4 border-l-red-500 shadow-lg">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="h-8 w-8 text-red-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-3">
                      What Regulators Said
                    </CardTitle>
                    <p className="text-gray-600 text-base leading-relaxed">
                      Regulators explicitly stated that the company:
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
                    <p className="text-gray-800 italic leading-relaxed mb-4">
                      "...<strong>should have specifically identified credential stuffing as a high risk</strong>..." and that 
                      "...multiple standards and guidelines... identified credential-based attacks, including credential stuffing, 
                      as a <strong>highly likely attack method</strong>."
                    </p>
                    <p className="text-sm text-gray-600">
                      — Joint EU/UK Data Protection Authority Investigation
                    </p>
                  </div>

                  <div className="bg-orange-50 p-6 rounded-lg mt-6">
                    <h4 className="font-bold text-xl text-gray-900 mb-3">
                      The Unmistakable Message from Regulators:
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
                        <p className="text-gray-800 leading-relaxed">
                          Credential stuffing is a <strong>known, foreseeable, and high-impact risk</strong>
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
                        <p className="text-gray-800 leading-relaxed">
                          You have a <strong>legal duty to defend against it</strong>
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
                        <p className="text-gray-800 leading-relaxed">
                          Failure to do so is <strong>non-compliance with Article 32</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How We Help Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-3 py-1 bg-green-50 text-green-700 border border-green-200">
              <ShieldCheck className="h-4 w-4 mr-2 inline" />
              Article 32 Compliance
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              How Our Service Ensures Your Article 32 Compliance
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our Leaked Credential Monitoring platform is the exact technical measure regulators are demanding. 
              We provide the "state of the art" defense you need to demonstrate compliance.
            </p>
          </div>

          <div className="space-y-6">
            {/* 1. Deny List Mandate */}
            <Card className="border-l-4 border-l-green-500 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lock className="h-7 w-7 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-2">
                      Meet the "Deny List" Mandate
                    </CardTitle>
                    <p className="text-gray-600 text-base">
                      <Badge variant="outline" className="mb-2">Proactive Check</Badge>
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
                    Our API integrates directly with your <strong>user sign-up and password reset forms</strong>. We instantly 
                    check any new password against our database of billions of known-leaked credentials.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    This allows you to <strong>block compromised passwords before they can ever be set</strong> in your system, 
                    satisfying the core "state of the art" requirement.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 2. Prevent a Breach */}
            <Card className="border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Eye className="h-7 w-7 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-2">
                      Prevent a Breach
                    </CardTitle>
                    <p className="text-gray-600 text-base">
                      <Badge variant="outline" className="mb-2">Continuous Monitoring</Badge>
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
                    A password that is secure today may be leaked tomorrow. Our platform monitors <strong>multiple intelligence 
                    sources 24/7</strong>—underground forums, threat actor networks, the deep and dark web, and HUMINT operatives.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    The moment an active password for one of your users or employees appears in a new breach, we alert you. 
                    This moves you from a <strong>passive to a proactive defense</strong>.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 3. Avoid Article 33 Notifications */}
            <Card className="border-l-4 border-l-purple-500 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="h-7 w-7 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-2">
                      Avoid Article 33 Breach Notifications
                    </CardTitle>
                    <p className="text-gray-600 text-base">
                      <Badge variant="outline" className="mb-2">The 72-Hour Clock</Badge>
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
                    A single unauthorized login to an account containing personal data is a <strong>"personal data breach."</strong> This 
                    triggers the 72-hour notification clock under Article 33, requiring you to report to your DPA.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    By detecting the leaked credential first, you can <strong>force a password reset and neutralize the threat</strong> before 
                    an attacker logs in. You prevent the breach, stop the 72-hour clock, and avoid the fines and reputational damage that follow.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Risk & Fines Section */}
      <section className="bg-gray-50 py-16 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 px-3 py-1 bg-gray-100 text-gray-900 border border-gray-300">
                <DollarSign className="h-4 w-4 mr-2 inline text-red-600" />
                Financial Impact
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                Don't Let a Known Risk Become a 4% Fine
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="border-l-4 border-l-red-500 shadow-sm">
                <CardHeader>
                  <div className="h-12 w-12 bg-red-50 rounded-lg flex items-center justify-center mb-4">
                    <DollarSign className="h-7 w-7 text-red-600" />
                  </div>
                  <CardTitle className="text-lg">Maximum Fine</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600 mb-2">4%</div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Of total global annual revenue or €20 million, whichever is higher.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500 shadow-sm">
                <CardHeader>
                  <div className="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center mb-4">
                    <Clock className="h-7 w-7 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg">Article 33 Deadline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600 mb-2">72hrs</div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    To notify your DPA of a personal data breach from discovery.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500 shadow-sm">
                <CardHeader>
                  <div className="h-12 w-12 bg-red-50 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="h-7 w-7 text-red-600" />
                  </div>
                  <CardTitle className="text-lg">Enforcement Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600 mb-2">Rising</div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    DPAs are actively enforcing Article 32 technical measures.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2 border-red-200 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="h-12 w-12 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="h-7 w-7 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-900">
                      A Documented Failure
                    </h3>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                      Failing to defend against credential stuffing is no longer an option. It is a <strong>documented failure 
                      to implement "appropriate technical and organisational measures."</strong>
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      Our service provides the critical, <strong className="text-green-600">"state of the art"</strong> defense you 
                      need to protect your users' data, satisfy auditors, and fulfill your fundamental obligations under GDPR.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">60B+ Records</h4>
                      <p className="text-sm text-gray-600">Comprehensive deny list</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Real-Time API</h4>
                      <p className="text-sm text-gray-600">Instant password validation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">24/7 Monitoring</h4>
                      <p className="text-sm text-gray-600">Proactive breach prevention</p>
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
            <Badge className="mb-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white border-0">
              <Shield className="h-4 w-4 mr-2 inline" />
              GDPR Article 32 Compliance
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Implement "State of the Art" Protection Today
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Meet GDPR requirements, satisfy DPA expectations, and protect your users with comprehensive leaked 
              credential monitoring. Demonstrate your commitment to data protection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100" asChild>
                <Link href="/auth/signup">
                  <Zap className="mr-2 h-5 w-5" />
                  Get a Demo
                </Link>
              </Button>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
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
                <div className="text-3xl font-bold text-white mb-1">€20M</div>
                <div className="text-sm text-gray-400">Or 4% Revenue Fine</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">72hrs</div>
                <div className="text-sm text-gray-400">Breach Notification</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-sm text-gray-400">Threat Monitoring</div>
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
              Understanding GDPR Article 32 Requirements
            </h3>
            <div className="space-y-4 text-gray-700">
              <p className="leading-relaxed">
                <strong>Article 32 - Security of Processing:</strong> GDPR Article 32 requires controllers and processors to 
                implement appropriate technical and organisational measures to ensure a level of security appropriate to the risk, 
                taking into account "the state of the art, the costs of implementation and the nature, scope, context and purposes 
                of processing."
              </p>
              <p className="leading-relaxed">
                <strong>What "State of the Art" Means:</strong> This is a dynamic standard that evolves with technology and the 
                threat landscape. In 2025, credential stuffing is a well-documented, prevalent threat. Regulators expect organizations 
                to defend against known attack vectors using available technology—including password deny lists and breach monitoring.
              </p>
              <p className="leading-relaxed">
                <strong>ICO Guidance:</strong> The UK Information Commissioner's Office (which enforces GDPR in the UK) explicitly 
                recommends screening passwords against deny lists of commonly used and leaked passwords. This is considered best 
                practice and part of "state of the art" security.
              </p>
              <p className="leading-relaxed">
                <strong>Article 33 - Breach Notification:</strong> If a personal data breach occurs, you must notify your supervisory 
                authority (DPA) within 72 hours of becoming aware of it. Unauthorized access via a stolen credential constitutes a 
                breach, triggering this obligation and potential fines if not properly managed.
              </p>
              <p className="leading-relaxed">
                <strong>Enforcement Precedents:</strong> The 23andMe case demonstrated that regulators will investigate whether 
                organizations adequately identified and mitigated foreseeable risks like credential stuffing. Failure to do so is 
                considered non-compliance with Article 32.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SharedFooter />
    </div>
  );
}

