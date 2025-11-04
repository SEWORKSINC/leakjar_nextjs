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
  Building2,
  Eye,
  TrendingUp,
  Zap,
  Brain,
  Database,
  Target,
  Activity,
  BarChart3,
  ShieldCheck
} from 'lucide-react';
import { SharedHeader } from '@/components/shared-header';
import { SharedFooter } from '@/components/shared-footer';

export const metadata: Metadata = {
  title: "NIST AI RMF Implementation - Beyond the Buzzword to Trustworthy AI",
  description: "Implement the NIST AI Risk Management Framework with continuous monitoring. Operationalize Govern, Map, Measure, and Manage functions with real-time AI threat detection and automated controls.",
  keywords: [
    "NIST AI RMF",
    "AI Risk Management Framework",
    "Trustworthy AI",
    "Responsible AI",
    "AI governance",
    "AI risk management",
    "AI threat detection",
    "adversarial AI testing",
    "data poisoning detection",
    "AI model security"
  ],
  openGraph: {
    title: "NIST AI RMF Implementation - Trustworthy AI in Practice",
    description: "Move from theory to practice with continuous AI monitoring that operationalizes the NIST AI Risk Management Framework.",
    url: "https://www.leakjar.com/nist-ai-rmf",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "NIST AI RMF - Trustworthy AI Implementation",
    description: "Implement NIST AI RMF with continuous monitoring and automated controls for AI systems.",
  },
};

export default function NISTAIRMFPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <SharedHeader />

      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 tracking-tight leading-tight">
              Beyond the Buzzword: How to Actually Implement the NIST AI Risk Management Framework
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-6 leading-relaxed max-w-3xl mx-auto">
              In 2025, every serious AI organization claims to be building <strong>"Trustworthy and Responsible AI."</strong> The 
              NIST AI Risk Management Framework (RMF) is the playbook that separates talk from action.
            </p>
            
            <div className="bg-white border-l-4 border-blue-600 p-6 rounded-r-lg shadow-sm max-w-3xl mx-auto mb-6">
              <p className="text-lg text-gray-800 leading-relaxed">
                The RMF is not a simple checklist you "pass." It is a <strong>continuous, lifecycle-based framework</strong> designed 
                to Govern, Map, Measure, and Manage the unique risks of AI.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div className="bg-white border-l-4 border-red-600 p-6 rounded-r-lg shadow-sm text-left">
                <div className="flex items-start gap-3 mb-2">
                  <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Voluntary, But Essential</h3>
                    <p className="text-gray-700 leading-relaxed text-base">
                      While the framework is voluntary, it is the <strong>new standard of care</strong>. In the event of an AI-driven 
                      incident, your RMF alignment will be the first thing auditors and courts ask for.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border-l-4 border-gray-300 p-6 rounded-r-lg shadow-sm text-left">
                <div className="flex items-start gap-3 mb-2">
                  <Eye className="h-6 w-6 text-gray-700 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Continuous Monitoring Required</h3>
                    <p className="text-gray-700 leading-relaxed text-base">
                      You cannot manually Map, Measure, and Manage the complex, high-speed risks of modern AI. You need a 
                      <strong> dedicated, continuous monitoring solution</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Overview Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-3 py-1 bg-gray-100 text-gray-900 border border-gray-300">
              <Brain className="h-4 w-4 mr-2 inline text-gray-700" />
              Implementation Platform
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Your AI Monitoring Platform: The Engine for the NIST AI RMF
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform is purpose-built to operationalize the NIST AI RMF. We provide the technical evidence, real-time 
              metrics, and automated controls you need to move from theory to practice.
            </p>
          </div>

          <Card className="border-2 border-blue-200 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-center text-gray-900">
                How Our Service Directly Implements the Framework's Core Functions:
              </h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-100 rounded-lg">
                  <Building2 className="h-10 w-10 text-gray-700 mx-auto mb-3" />
                  <h4 className="font-bold text-gray-900">GOVERN</h4>
                  <p className="text-sm text-gray-600 mt-2">Ground Truth for Oversight</p>
                </div>
                <div className="text-center p-4 bg-gray-100 rounded-lg">
                  <Target className="h-10 w-10 text-gray-700 mx-auto mb-3" />
                  <h4 className="font-bold text-gray-900">MAP</h4>
                  <p className="text-sm text-gray-600 mt-2">True Risk Context</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <BarChart3 className="h-10 w-10 text-green-600 mx-auto mb-3" />
                  <h4 className="font-bold text-gray-900">MEASURE</h4>
                  <p className="text-sm text-gray-600 mt-2">Quantification Engine</p>
                </div>
                <div className="text-center p-4 bg-gray-100 rounded-lg">
                  <Shield className="h-10 w-10 text-gray-700 mx-auto mb-3" />
                  <h4 className="font-bold text-gray-900">MANAGE</h4>
                  <p className="text-sm text-gray-600 mt-2">Real-Time Response</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Four Functions Section */}
      <section className="bg-gray-50 py-16 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
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
                        1. GOVERN: Providing the "Ground Truth" for Oversight
                      </CardTitle>
                      <p className="text-gray-600 text-base">
                        The Govern function is the foundation. It requires you to establish a risk-aware culture and accountability.
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex items-start gap-3 mb-4">
                      <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">The RMF Challenge</h4>
                        <p className="text-gray-700 leading-relaxed">
                          Your leadership (C-suite, board) cannot govern what it cannot see. They need a clear, non-technical 
                          view of the organization's AI risk posture.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 border-l-4 border-gray-300 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      Our Solution
                    </h4>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      Our platform provides a <strong>centralized, executive-level dashboard</strong> that translates complex model 
                      vulnerabilities into clear business risks.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      We provide the "ground truth" on model integrity and security, giving your leadership the data they need to 
                      make informed risk management decisions and establish effective governance.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* 2. MAP */}
              <Card className="border-l-4 border-l-gray-300 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="h-7 w-7 text-gray-700" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl mb-2">
                        2. MAP: Identifying Your True AI Risk Context
                      </CardTitle>
                      <p className="text-gray-600 text-base">
                        The Map function requires you to identify your risks and understand your AI's context.
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex items-start gap-3 mb-4">
                      <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">The RMF Challenge</h4>
                        <p className="text-gray-700 leading-relaxed">
                          Your "context" includes a rapidly evolving, invisible threat landscape. You must "map" not just your own 
                          systems but the novel, external attacks being developed against them, such as data poisoning and model evasion.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 border-l-4 border-gray-300 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      Our Solution
                    </h4>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      We act as your <strong>external intelligence service</strong>. Our platform continuously maps the threat landscape, 
                      identifying new adversarial techniques and data poisoning methods.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      We help you categorize your AI systems based on their actual vulnerabilities to these known, real-world attack vectors.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* 3. MEASURE */}
              <Card className="border-l-4 border-l-green-500 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="h-7 w-7 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl mb-2">
                        3. MEASURE: Moving from Guesswork to Quantification
                      </CardTitle>
                      <p className="text-gray-600 text-base">
                        The Measure function is where you "evaluate, assess, and benchmark" AI risks. This is the most difficult 
                        part of the RMF to do internally.
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex items-start gap-3 mb-4">
                      <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">The RMF Challenge</h4>
                        <p className="text-gray-700 leading-relaxed">
                          How do you "measure" your model's robustness against an unknown, adversarial attack? How do you "test" your 
                          training data for subtle, malicious poisoning?
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      Our Solution: This is Our Core. Our Platform is the "Measure" Engine.
                    </h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Database className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900 text-sm mb-1">Data Integrity</p>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            We scan and validate your training, testing, and validation datasets to quantify their integrity and 
                            detect signs of data poisoning.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <ShieldCheck className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900 text-sm mb-1">Model Robustness</p>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            We run continuous, automated adversarial testing (a form of "red-teaming") against your models to measure 
                            their resilience to prompt injection, evasion attacks, and other manipulations.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <TrendingUp className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900 text-sm mb-1">Trust Benchmarking</p>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            We provide consistent metrics on your model's security and robustness over time, creating the audit trail 
                            you need to prove your AI is trustworthy.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 4. MANAGE */}
              <Card className="border-l-4 border-l-gray-300 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="h-7 w-7 text-gray-700" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl mb-2">
                        4. MANAGE: Enabling Real-Time Incident Response
                      </CardTitle>
                      <p className="text-gray-600 text-base">
                        The Manage function is about acting on the risks you've measured.
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex items-start gap-3 mb-4">
                      <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">The RMF Challenge</h4>
                        <p className="text-gray-700 leading-relaxed">
                          An AI attack can happen in milliseconds. You cannot rely on a quarterly manual audit. You must detect and 
                          respond to AI-specific incidents in real-time.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 border-l-4 border-gray-300 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      Our Solution: Your AI's "Security Operations Center" (SOC)
                    </h4>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      When our "Measure" function detects a live threat—like a real-time prompt injection attack or a malicious query 
                      pattern indicating model theft—we <strong>trigger an immediate alert</strong>.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      This moves "Manage" from a passive, after-the-fact process to an <strong>active, real-time defense</strong>, enabling 
                      your team to respond before a catastrophic failure or data breach occurs.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Lifecycle vs Project Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-3 py-1 bg-gray-100 text-gray-900 border border-gray-300">
              <Activity className="h-4 w-4 mr-2 inline text-gray-700" />
              Continuous Framework
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              The NIST RMF is a Lifecycle, Not a Project
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              You cannot "achieve" RMF compliance and be done. The framework demands continuous, ongoing risk management.
            </p>
          </div>

          <Card className="border-2 border-purple-200 shadow-lg mb-8">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="h-12 w-12 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-7 w-7 text-red-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">
                    Manual Testing is a Compliance Gap
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    Manually testing your models is like manually checking your network firewall for vulnerabilities once a quarter. 
                    It's a <strong className="text-red-600">compliance gap that attackers will exploit</strong>.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Our platform provides the <strong>automated, continuous monitoring</strong> required to make the NIST AI RMF a 
                    living, effective part of your organization—transforming <strong>"Trustworthy AI"</strong> from 
                    a marketing promise into a provable, technical reality.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                <div className="bg-red-50 p-6 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    Without Continuous Monitoring
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-red-600 font-bold">×</span>
                      <span>Quarterly manual audits miss real-time threats</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-red-600 font-bold">×</span>
                      <span>No visibility into emerging attack vectors</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-red-600 font-bold">×</span>
                      <span>Reactive incident response after damage is done</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-red-600 font-bold">×</span>
                      <span>Cannot prove trustworthiness to auditors</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    With Our Platform
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>24/7 automated threat detection</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Continuous threat landscape mapping</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Real-time incident response alerts</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Immutable audit trail for compliance proof</span>
                    </li>
                  </ul>
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
              <Brain className="h-4 w-4 mr-2 inline" />
              NIST AI RMF Implementation
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Transform Trustworthy AI from Promise to Reality
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Operationalize the NIST AI Risk Management Framework with continuous monitoring, automated controls, and 
              real-time threat detection. Move from buzzwords to provable, technical excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100" asChild>
                <Link href="/auth/signup">
                  <Zap className="mr-2 h-5 w-5" />
                  Get Your NIST AI RMF Implementation Demo
                </Link>
              </Button>
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white" asChild>
                <Link href="/dashboard">
                  <Activity className="mr-2 h-5 w-5" />
                  See Our Continuous Monitoring Platform
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-gray-700">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">4</div>
                <div className="text-sm text-gray-400">Core Functions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-sm text-gray-400">Continuous Monitoring</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">Real-Time</div>
                <div className="text-sm text-gray-400">Threat Response</div>
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
              Understanding the NIST AI Risk Management Framework
            </h3>
            <div className="space-y-4 text-gray-700">
              <p className="leading-relaxed">
                <strong>NIST AI RMF Overview:</strong> Released in January 2023, the NIST AI Risk Management Framework provides a 
                voluntary, flexible framework for managing risks to individuals, organizations, and society associated with AI. It's 
                organized around four core functions: Govern, Map, Measure, and Manage.
              </p>
              <p className="leading-relaxed">
                <strong>GOVERN Function:</strong> Establishes and nurtures a culture of AI risk management. This includes leadership 
                commitment, clear policies, stakeholder engagement, and accountability structures. It's the foundation that enables 
                the other three functions to work effectively.
              </p>
              <p className="leading-relaxed">
                <strong>MAP Function:</strong> Identifies and documents AI risks in context. This includes understanding your AI 
                systems, their intended use, potential impacts, and the broader threat landscape. Mapping is about situational 
                awareness—you can't manage risks you haven't identified.
              </p>
              <p className="leading-relaxed">
                <strong>MEASURE Function:</strong> Quantifies and evaluates identified AI risks. This includes testing, validation, 
                benchmarking, and monitoring. The Measure function transforms abstract risks into concrete data that can guide decisions.
              </p>
              <p className="leading-relaxed">
                <strong>MANAGE Function:</strong> Takes action based on measured risks. This includes implementing controls, responding 
                to incidents, and continuously improving. The Manage function is where risk management becomes operational.
              </p>
              <p className="leading-relaxed">
                <strong>Why Continuous Monitoring Matters:</strong> AI systems operate in dynamic environments with evolving threats. 
                The RMF explicitly recognizes that AI risk management is a continuous lifecycle, not a one-time assessment. Manual, 
                periodic reviews cannot keep pace with the speed of AI deployment and the sophistication of AI-specific attacks.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SharedFooter />
    </div>
  );
}

