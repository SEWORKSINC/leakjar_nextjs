'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Database, Globe, Search, AlertTriangle, CheckCircle2, Lock, Zap, Activity, Eye, ArrowRight, Scale, Brain, MessageCircle, Languages, ShoppingCart, Users, Building2, Dices } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { SharedHeader } from '@/components/shared-header';
import { SharedFooter } from '@/components/shared-footer';
import { PageHeaderSkeleton, CardSkeleton, StatsSkeleton } from '@/components/ui/skeleton';
import { ScrollReveal } from '@/components/scroll-reveal';

/**
 * Enhanced Structured Data for SEO, AEO, and GEO
 * 
 * This comprehensive schema includes:
 * - Organization schema with full contact info
 * - Website schema with search action
 * - SoftwareApplication schema with features
 * - FAQ schema for AEO (Answer Engine Optimization)
 * - HowTo schema for process explanation
 * - Speakable schema for voice search
 */
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    // Organization Schema
    {
      "@type": "Organization",
      "@id": "https://www.leakjar.com/#organization",
      "name": "LeakJar",
      "alternateName": ["SEW Inc.", "SEWORKS"],
      "url": "https://www.leakjar.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.leakjar.com/logo.png",
        "width": 512,
        "height": 512
      },
      "image": "https://www.leakjar.com/og-image.png",
      "description": "Enterprise credential leak monitoring and breach detection platform with 60B+ leaked credential records",
      "foundingDate": "2013",
      "founder": {
        "@type": "Person",
        "name": "Min Pyo Hong",
        "jobTitle": "Founder & CEO"
      },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "San Francisco",
        "addressRegion": "CA",
        "addressCountry": "USA"
      },
      "sameAs": [
        "https://twitter.com/leakjar",
        "https://linkedin.com/company/leakjar",
        "https://github.com/SEWORKSINC"
      ],
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "contactType": "Customer Support",
          "email": "support@leakjar.com",
          "availableLanguage": ["English"]
        },
        {
          "@type": "ContactPoint",
          "contactType": "Sales",
          "email": "sales@leakjar.com",
          "availableLanguage": ["English"]
        }
      ],
      "slogan": "Stop Breaches, Save $4.45M"
    },
    // Website Schema with Search Action
    {
      "@type": "WebSite",
      "@id": "https://www.leakjar.com/#website",
      "url": "https://www.leakjar.com",
      "name": "LeakJar",
      "description": "Proactive Credential Leak Monitoring & Breach Detection Platform",
      "publisher": {
        "@id": "https://www.leakjar.com/#organization"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://www.leakjar.com/open-search/{search_term_string}"
        },
        "query-input": "required name=search_term_string"
      },
      "inLanguage": "en-US"
    },
    // WebPage Schema
    {
      "@type": "WebPage",
      "@id": "https://www.leakjar.com/#webpage",
      "url": "https://www.leakjar.com",
      "name": "LeakJar - Proactive Credential Leak Monitoring & Breach Detection",
      "description": "Monitor 60B+ leaked credentials in real-time. Detect compromised accounts 287 days faster than industry average.",
      "isPartOf": {
        "@id": "https://www.leakjar.com/#website"
      },
      "about": {
        "@id": "https://www.leakjar.com/#organization"
      },
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": ["h1", ".hero-description", ".key-stats"]
      }
    },
    // Software Application Schema
    {
      "@type": "SoftwareApplication",
      "name": "LeakJar",
      "applicationCategory": "SecurityApplication",
      "applicationSubCategory": "Threat Intelligence",
      "operatingSystem": "Web",
      "description": "Enterprise credential monitoring platform that detects compromised credentials from 60B+ leaked records in real-time",
      "offers": {
        "@type": "AggregateOffer",
        "lowPrice": "0",
        "highPrice": "4990",
        "priceCurrency": "USD",
        "offerCount": "3",
        "offers": [
          {
            "@type": "Offer",
            "name": "Free Tier",
            "price": "0",
            "priceCurrency": "USD",
            "description": "1 monitored domain, limited to latest 5 breach records"
          },
          {
            "@type": "Offer",
            "name": "Pro Plan",
            "price": "499",
            "priceCurrency": "USD",
            "priceSpecification": {
              "@type": "UnitPriceSpecification",
              "price": "499",
              "priceCurrency": "USD",
              "billingDuration": "P1M"
            },
            "description": "Unlimited breach data, 10,000 API calls/month"
          }
        ]
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "150",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "60B+ credential records monitored",
        "Real-time breach alerts in under 1 hour",
        "Human Intelligence (HUMINT) network",
        "PCI DSS 4.0 compliance support",
        "NIST SP 800-63B compliance",
        "HIPAA compliance support",
        "GDPR Article 32 compliance",
        "RESTful API access",
        "24/7 continuous monitoring",
        "Webhook integrations"
      ]
    },
    // FAQ Schema for AEO (Answer Engine Optimization)
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is credential monitoring?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Credential monitoring is a cybersecurity service that continuously scans for leaked usernames and passwords associated with your organization. When compromised credentials are detected in data breaches, dark web marketplaces, or threat actor networks, security teams are alerted so they can force password resets before attackers exploit the exposure."
          }
        },
        {
          "@type": "Question",
          "name": "How many leaked credentials does LeakJar monitor?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "LeakJar monitors over 60 billion leaked credential records, with approximately 11 million new records added daily. Our database includes credentials from data breaches, stealer malware, phishing campaigns, and targeted attacks that never appear in public breach databases."
          }
        },
        {
          "@type": "Question",
          "name": "How fast does LeakJar detect breached credentials?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "LeakJar delivers alerts within 1 hour of detecting compromised credentials—287 days faster than the industry average breach detection time of 287 days according to the IBM Security Report. Real-time monitoring and immediate notifications enable rapid incident response."
          }
        },
        {
          "@type": "Question",
          "name": "What compliance frameworks does LeakJar support?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "LeakJar supports multiple compliance frameworks including PCI DSS 4.0 (Requirement 8.3.10), NIST SP 800-63B (Section 5.1.1.2), HIPAA Security Rule, GDPR Article 32, CCPA/CPRA reasonable security requirements, EU AI Act Article 15, and NIST AI Risk Management Framework."
          }
        },
        {
          "@type": "Question",
          "name": "Does LeakJar offer a free tier?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, LeakJar offers a free tier with 1 monitored domain and access to the latest 5 breach records. No credit card is required. The free tier includes full feature access, email search functionality, dashboard access, and email alerts—perfect for small organizations or evaluation purposes."
          }
        }
      ]
    },
    // HowTo Schema for Process Explanation
    {
      "@type": "HowTo",
      "name": "How LeakJar Credential Monitoring Works",
      "description": "A four-step intelligence pipeline that protects your organization from credential-based attacks 24/7",
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "Collect Intelligence",
          "text": "Our global HUMINT network gathers leaked credential data from underground forums, dark web marketplaces, and exclusive threat intelligence sources—data you won't find through traditional channels."
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Process & Analyze",
          "text": "Advanced algorithms process hundreds of gigabytes daily, extracting critical data points including credentials, IP addresses, timestamps, and breach context using hybrid AI and human expert analysis."
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "Match & Identify",
          "text": "Intelligent matching compares credentials against your organization's registered domains and email addresses, instantly flagging potential security threats requiring immediate attention."
        },
        {
          "@type": "HowToStep",
          "position": 4,
          "name": "Alert & Respond",
          "text": "Instant notifications via dashboard, email, or RESTful API with detailed forensic information and actionable security recommendations. Sub-1-hour average alert delivery."
        }
      ]
    }
  ]
};

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRecords: 0,
    dailyAdditions: 0,
  });
  const [searchEmail, setSearchEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    checkAuthAndRedirect();
    
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

    animateValue(0, 60000000000, (v) => setStats(s => ({ ...s, totalRecords: v })));
    animateValue(0, 11000000, (v) => setStats(s => ({ ...s, dailyAdditions: v })));
  }, []);

  async function checkAuthAndRedirect() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        router.push('/dashboard');
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setIsLoading(false);
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(0)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(0)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

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

  if (isLoading) {
    return (
      <>
        <div className="min-h-screen bg-white">
          <SharedHeader />
          <main id="main-content">
            <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
              <div className="container mx-auto px-4 py-20 lg:py-28">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="max-w-2xl">
                    <PageHeaderSkeleton />
                  </div>
                  <div className="relative hidden lg:block">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-100 h-96"></div>
                  </div>
                </div>
              </div>
            </section>

            <section className="container mx-auto px-4 py-20">
              <div className="max-w-4xl mx-auto">
                <CardSkeleton />
              </div>
            </section>

            <section className="bg-gray-900 text-white py-16">
              <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map((i) => (
                      <StatsSkeleton key={i} />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </main>
          <SharedFooter />
        </div>
      </>
    );
  }

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-white">
        {/* Header */}
        <SharedHeader />

      {/* Hero Section */}
      <main id="main-content">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Gradient orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[128px]"></div>
        
        <div className="container relative mx-auto px-4 py-16 2xl:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
                Stop Breaches,<br />
                Save $4.45M
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                The only threat intelligence platform with <strong className="text-white">exclusive underground intelligence sources</strong>. 
                Detect compromised credentials <strong className="text-white">287 days faster</strong> than industry average.
              </p>

              {/* Key Points */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  </div>
                  <span className="text-gray-200">24/7 real-time monitoring across underground sources</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  </div>
                  <span className="text-gray-200">Instant alerts for compromised credentials</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  </div>
                  <span className="text-gray-200">Dashboard + API for seamless integration</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  </div>
                  <span className="text-gray-200">Meet PCI DSS, NIST, HIPAA compliance requirements</span>
                </div>
              </div>

              {/* Compliance Badges with Glassmorphism */}
              <div className="mb-10 p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 xl:hidden 2xl:block hidden-tmp">
                <p className="text-sm font-semibold text-gray-300 mb-3">Compliance Frameworks Supported:</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs bg-white/10 border-white/20 text-gray-200 hover:bg-white/20 transition-colors">PCI DSS 4.0</Badge>
                  <Badge variant="outline" className="text-xs bg-white/10 border-white/20 text-gray-200 hover:bg-white/20 transition-colors">NIST 800-63B</Badge>
                  <Badge variant="outline" className="text-xs bg-white/10 border-white/20 text-gray-200 hover:bg-white/20 transition-colors">HIPAA</Badge>
                  <Badge variant="outline" className="text-xs bg-white/10 border-white/20 text-gray-200 hover:bg-white/20 transition-colors">GDPR</Badge>
                  <Badge variant="outline" className="text-xs bg-white/10 border-white/20 text-gray-200 hover:bg-white/20 transition-colors">CCPA/CPRA</Badge>
                  <Badge variant="outline" className="text-xs bg-white/10 border-white/20 text-gray-200 hover:bg-white/20 transition-colors">EU AI Act</Badge>
                  <Badge variant="outline" className="text-xs bg-white/10 border-white/20 text-gray-200 hover:bg-white/20 transition-colors">NIST AI RMF</Badge>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4 xl:hidden 2xl:block hidden-tmp">
                <Link href="/auth/freetier" className="group">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg w-full sm:w-auto transition-all hover:scale-105">
                    See Your Exposure Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column - Video/Visual with Glassmorphism */}
            <div className="relative hidden lg:block">
              {/* Glow effect behind video */}
              {/* <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 blur-3xl"></div> */}
              
              {/* <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl shadow-cyan-500/20 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900"> */}
              <div className="relative rounded-full overflow-hidden mix-blend-plus-lighter">
                <video 
                  className="w-full h-auto invert hue-rotate-180 contrast-[1.02]" 
                  muted 
                  autoPlay 
                  loop 
                  playsInline
                  loading="lazy"
                  preload="metadata"
                  aria-label="LeakJar credential monitoring visualization"
                >
                  <source src="/world_c.webm" type="video/webm" />
                  <source src="/world_c.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Email Search - Critical Hook Feature */}
      <section className="container mx-auto px-4 py-20">
        <ScrollReveal className="max-w-4xl mx-auto">
          <Card className="border-2 border-gray-200 shadow-xl bg-white xl:-mt-40 2xl:-mt-48">
            <CardHeader className="text-center pb-6">
              {/* <div className="mx-auto mb-4 h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center">
                <Search className="h-7 w-7 text-blue-600" />
              </div> */}
              <CardTitle className="text-3xl font-bold text-gray-900 mb-3">
                Check Your Company's Exposure — Free
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Enter your company email to instantly see if your domain appears in our 60 billion+ leaked credential database. 
                No registration required.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-2xl mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <Input
                      type="email"
                      placeholder="yourname@company.com"
                      value={searchEmail}
                      onChange={(e) => {
                        setSearchEmail(e.target.value);
                        setEmailError('');
                      }}
                      onKeyPress={handleKeyPress}
                      className={`text-lg py-6 ${emailError ? 'border-red-500' : ''}`}
                      disabled={isSearching}
                    />
                    {emailError && (
                      <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4" />
                        {emailError}
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={handleSearch}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 px-8 py-6 text-lg"
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
                  ✓ Instant results • ✓ No credit card required • ✓ View latest 5 breach records
                </p>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
        <div className="flex justify-center mt-20 hidden hidden-test">
          <svg xmlns="http://www.w3.org/2000/svg" className="hidden">
            <symbol id="amazon" viewBox="0 0 16 16">
              <path d="M10.813 11.968c.157.083.36.074.5-.05l.005.005a89.521 89.521 0 0 1 1.623-1.405c.173-.143.143-.372.006-.563l-.125-.17c-.345-.465-.673-.906-.673-1.791v-3.3l.001-.335c.008-1.265.014-2.421-.933-3.305C10.404.274 9.06 0 8.03 0 6.017 0 3.77.75 3.296 3.24c-.047.264.143.404.316.443l2.054.22c.19-.009.33-.196.366-.387.176-.857.896-1.271 1.703-1.271.435 0 .929.16 1.188.55.264.39.26.91.257 1.376v.432c-.199.022-.407.044-.621.065-1.113.114-2.397.246-3.36.67C3.873 5.91 2.94 7.08 2.94 8.798c0 2.2 1.387 3.298 3.168 3.298 1.506 0 2.328-.354 3.489-1.54l.167.246c.274.405.456.675 1.047 1.166ZM6.03 8.431C6.03 6.627 7.647 6.3 9.177 6.3v.57c.001.776.002 1.434-.396 2.133-.336.595-.87.961-1.465.961-.812 0-1.286-.619-1.286-1.533ZM.435 12.174c2.629 1.603 6.698 4.084 13.183.997.28-.116.475.078.199.431C13.538 13.96 11.312 16 7.57 16 3.832 16 .968 13.446.094 12.386c-.24-.275.036-.4.199-.299l.142.087Z"></path>
              <path d="M13.828 11.943c.567-.07 1.468-.027 1.645.204.135.176-.004.966-.233 1.533-.23.563-.572.961-.762 1.115-.191.154-.333.094-.23-.137.105-.23.684-1.663.455-1.963-.213-.278-1.177-.177-1.625-.13l-.09.009c-.095.008-.172.017-.233.024-.193.021-.245.027-.274-.032-.074-.209.779-.556 1.347-.623Z"></path>
            </symbol>
            <symbol id="nvidia" viewBox="0 0 635.19 279.51">
              <g id="NVIDIA_Inception_Program_Badge" data-name="NVIDIA Inception Program Badge">
                <path d="M328.82,133v-34h3.63v34Zm34.43,0-18.06-27.3V133h-3.64v-34H345l18.07,27.2V98.92h3.63v34Zm23.56.28a12.13,12.13,0,0,1-8.7-3.53c-3.2-3.21-3.2-6.55-3.2-13.77s0-10.56,3.2-13.77a12.13,12.13,0,0,1,8.7-3.53c6.12,0,10.66,3.73,11.8,10.13h-3.72c-.91-4.16-3.83-6.88-8.08-6.88a8.18,8.18,0,0,0-5.88,2.39c-2.15,2.2-2.39,4.54-2.39,11.66s.24,9.46,2.39,11.66a8.18,8.18,0,0,0,5.88,2.39c4.25,0,7.26-2.72,8.17-6.88h3.63C397.51,129.51,392.88,133.24,386.81,133.24Zm19.4-.28v-34h21.13v3.25h-17.5v12h14.92v3.25H409.84v12.29h17.5V133Zm41.13-14h-9v14h-3.63v-34h12.67c6.21,0,10.51,3.88,10.51,10S453.55,119,447.34,119ZM447,102.17h-8.7V115.7H447c4.25,0,7.22-2.29,7.22-6.79S451.25,102.17,447,102.17Zm28.78,0V133h-3.64V102.17H462.3V98.92h23.32v3.25ZM492.36,133v-34H496v34Zm32.4-3.25a12.49,12.49,0,0,1-17.4,0c-3.2-3.21-3.2-6.55-3.2-13.77s0-10.56,3.2-13.77a12.49,12.49,0,0,1,17.4,0c3.2,3.21,3.2,6.55,3.2,13.77S528,126.5,524.76,129.71Zm-2.82-25.38a8.3,8.3,0,0,0-11.76,0c-2.15,2.19-2.39,4.49-2.39,11.61s.24,9.42,2.39,11.61a8.3,8.3,0,0,0,11.76,0c2.15-2.19,2.39-4.49,2.39-11.61S524.09,106.52,521.94,104.33ZM557.87,133l-18.07-27.3V133h-3.63v-34h3.44l18.07,27.2V98.92h3.63v34ZM341.49,166.77h-9v14h-3.63v-34h12.67c6.21,0,10.51,3.87,10.51,10S347.7,166.77,341.49,166.77ZM341.15,150h-8.7v13.53h8.7c4.26,0,7.22-2.3,7.22-6.79S345.41,150,341.15,150Zm37.45,30.78-7.74-15.1h-8.17v15.1h-3.64v-34H372.1c5.93,0,10.09,3.59,10.09,9.47a8.81,8.81,0,0,1-7.41,9.12l8.08,15.44ZM371.77,150h-9.08v12.48h9.08c4,0,6.78-2.06,6.78-6.22S375.73,150,371.77,150Zm38,27.53a12.46,12.46,0,0,1-17.4,0c-3.2-3.2-3.2-6.55-3.2-13.76s0-10.57,3.2-13.77a12.46,12.46,0,0,1,17.4,0c3.2,3.2,3.2,6.55,3.2,13.77S413,174.32,409.77,177.52ZM407,152.14a8.3,8.3,0,0,0-11.76,0c-2.15,2.2-2.39,4.5-2.39,11.62s.24,9.41,2.39,11.61a8.3,8.3,0,0,0,11.76,0c2.15-2.2,2.39-4.49,2.39-11.61S409.1,154.34,407,152.14Zm34.22,25a12.47,12.47,0,0,1-17.78.38c-3.2-3.2-3.2-6.55-3.2-13.76s0-10.57,3.2-13.77a12.07,12.07,0,0,1,8.7-3.54c6.5,0,10.9,4.21,11.9,10.19h-3.63c-1-4.31-4-6.94-8.27-6.94a8.23,8.23,0,0,0-5.88,2.44c-2.15,2.2-2.39,4.5-2.39,11.62s.24,9.46,2.39,11.66a8.18,8.18,0,0,0,5.88,2.39,8.28,8.28,0,0,0,6.45-2.92,8.88,8.88,0,0,0,1.91-6.16v-2.58h-8.36v-3.21h12v5.4C444.09,172.27,443.27,174.89,441.17,177.14Zm30.5,3.63-7.74-15.1h-8.18v15.1h-3.63v-34h13.05c5.93,0,10.09,3.59,10.09,9.47a8.82,8.82,0,0,1-7.41,9.12l8.08,15.44ZM464.84,150h-9.09v12.48h9.09c4,0,6.78-2.06,6.78-6.22S468.8,150,464.84,150Zm40.47,30.78-2.73-7.69H487.72L485,180.77h-3.87l12.52-34h3.06l12.48,34ZM495.22,152l-6.4,18h12.71ZM541,180.77V154.91l-9.32,20.51h-3.11l-9.47-20.51v25.86h-3.63v-34h3.63l11.09,24.14L541,146.74h3.63v34Z"></path>
                <rect class="cls-2" x="285.3" y="56.18" width="2.49" height="167.43"></rect>
                <g id="NVIDIA_Logo" data-name="NVIDIA Logo">
                  <path id="NVIDIA" d="M144.75,173.7v31.79h9V173.7Zm-70.87,0v31.83H83V181.32h7c2.33,0,4,.58,5.12,1.77,1.42,1.52,2,4,2,8.42v14h8.8V187.9c0-12.55-8-14.24-15.88-14.24H73.88m85.37,0v31.79h14.61c7.78,0,10.33-1.29,13.07-4.19,1.95-2,3.2-6.49,3.2-11.36,0-4.47-1.06-8.45-2.91-10.93-3.34-4.44-8.15-5.31-15.33-5.31Zm8.94,6.92h3.87c5.62,0,9.25,2.52,9.25,9s-3.63,9-9.25,9h-3.87Zm-36.43-6.92-7.52,25.19L117,173.7h-9.73l10.29,31.79h13L141,173.7Zm62.56,31.79h9V173.7h-9Zm25.25-31.78L207,205.48h8.88l2-5.62h14.88l1.89,5.62h9.64l-12.67-31.77Zm29.33,32.75a2.81,2.81,0,1,1,2.82-2.81A2.81,2.81,0,0,1,248.9,206.46Zm0-5.07a2.27,2.27,0,1,0,2.23,2.26A2.2,2.2,0,0,0,248.9,201.39Zm.51,3.75-.55-1.15h-.32v1.15h-.66v-3h1.22a.94.94,0,0,1,1,.93.82.82,0,0,1-.55.79l.63,1.26Zm-.4-2.43h-.47v.77H249a.39.39,0,1,0,0-.77Zm-23.59-23.2,5.46,14.88H219.79Z"></path>
                  <path id="Eye_Mark" data-name="Eye Mark" class="cls-3" d="M132.84,99.24V91.6c.74,0,1.49-.09,2.26-.11,21-.66,34.7,17.94,34.7,17.94S155,130,139,130a19.31,19.31,0,0,1-6.19-1V105.84c8.16,1,9.8,4.58,14.7,12.73l10.91-9.17S150.49,99,137.06,99a38.44,38.44,0,0,0-4.22.25m0-25.23V85.42c.75-.06,1.5-.11,2.26-.14,29.14-1,48.13,23.83,48.13,23.83s-21.81,26.43-44.53,26.43a33.88,33.88,0,0,1-5.86-.52v7a38.34,38.34,0,0,0,4.88.32c21.14,0,36.43-10.76,51.24-23.5,2.45,2,12.5,6.72,14.57,8.81-14.08,11.75-46.89,21.21-65.49,21.21a51.68,51.68,0,0,1-5.2-.27v9.91H213.2V74Zm0,55v6c-19.56-3.47-25-23.73-25-23.73a42.32,42.32,0,0,1,25-12.05v6.6h0c-8.19-1-14.58,6.64-14.58,6.64s3.58,12.83,14.61,16.52M98.1,110.41A48.45,48.45,0,0,1,132.84,91.6V85.42C107.2,87.47,85,109.11,85,109.11s12.58,36.22,47.84,39.53v-6.57C107,138.83,98.1,110.41,98.1,110.41Z"></path>
                </g>
              </g>
            </symbol>
            <symbol id="drata" viewBox="0 0 502 658">
              <path d="M 252.91406,4.4401685e-5 C 251.15068,-0.00410559 249.38647,0.28277576 247.69531,0.86137256 L 10.818359,81.931685 C 4.3610932,84.14168 0,90.245458 0,97.070357 V 559.07817 c 0,6.82502 4.3613004,12.92693 10.818359,15.13671 l 236.876951,81.07227 c 3.38166,1.15653 7.05626,1.14928 10.4336,-0.0254 L 491.25195,574.24809 C 497.67295,572.01684 502,565.93233 502,559.13481 V 97.013716 c 0,-6.79759 -4.32726,-12.88184 -10.74805,-15.113281 L 258.12891,0.88481006 C 256.44069,0.29812696 254.67744,0.00419426 252.91406,4.4401685e-5 Z M 252.89456,7.9980913 c 0.88137,0.00207 1.76264,0.1497825 2.60742,0.4433594 L 488.625,89.457075 c 3.23122,1.122959 5.375,4.136032 5.375,7.556641 V 559.13481 c 0,3.42047 -2.14205,6.43389 -5.37305,7.55664 l -233.125,81.01367 -0.002,0.002 c -1.68866,0.58733 -3.5205,0.59119 -5.21484,0.0117 L 13.410156,566.64653 C 10.160235,565.53431 8,562.51314 8,559.07817 V 97.070357 c 0,-3.434701 2.160462,-6.456154 5.410156,-7.56836 L 250.28516,8.429732 c 0.84684,-0.2897333 1.728,-0.4337133 2.60937,-0.4316407 z"></path>
              <path d="M 91.4585,327.327 H 54 v 67.715 h 37.4585 c 23.8925,0 39.3255,-13.29 39.3255,-33.851 0,-20.562 -15.436,-33.864 -39.3255,-33.864 z M 90.634,381.622 H 70.4747 V 340.753 H 90.634 c 13.306,0 21.896,8.023 21.896,20.431 0,12.408 -8.59,20.431 -21.896,20.431 z"></path>
              <path d="m 199.848,373.125 c 8.843,-4.116 13.514,-11.396 13.514,-21.058 0,-15.258 -11.887,-24.74 -31.024,-24.74 h -40.53 v 67.715 h 17.209 v -18.633 h 22.516 l 13.18,18.633 h 18.977 l -15.153,-21.31 1.305,-0.604 h 0.009 z m -18.757,-9.63 H 159.02 v -22.941 h 22.071 c 9.031,0 14.014,4.087 14.014,11.516 0,7.43 -5.106,11.422 -14.014,11.422 z"></path>
              <path d="m 250.651,327.327 -29.226,67.715 h 18.208 l 3.607,-9.663 c 13.732,-4.077 23.272,-4.371 36.78,0.454 l 3.421,9.209 h 18.624 l -29.346,-67.715 h -22.074 0.009 z m -2.701,44.887 12.693,-30.446 h 1.785 l 12.81,30.74 c -9.304,-3.708 -17.978,-3.999 -27.288,-0.294 z"></path>
              <path d="m 372.935,327.327 h -81.39 l 5.191,13.328 h 26.525 v 54.387 h 18.059 v -54.387 h 26.418 l 5.191,-13.328 h 0.003 z"></path>
              <path d="m 392.14,327.327 -29.226,67.715 h 18.209 l 3.606,-9.663 c 13.732,-4.077 23.273,-4.371 36.78,0.454 l 3.422,9.209 h 18.624 l -29.35,-67.715 h -22.074 z m -2.704,44.887 12.693,-30.446 h 1.786 l 12.809,30.74 c -9.304,-3.708 -17.977,-3.999 -27.288,-0.294 z"></path>
              <path d="m 63.4722,461.042 v -37.288 h 5.6259 v 32.445 h 16.8957 v 4.843 z m 36.1282,0.619 c -1.7721,0 -3.3743,-0.328 -4.8065,-0.984 -1.4323,-0.667 -2.5672,-1.632 -3.4047,-2.894 -0.8254,-1.263 -1.238,-2.81 -1.238,-4.643 0,-1.578 0.3034,-2.877 0.9103,-3.896 0.6069,-1.02 1.4262,-1.827 2.4579,-2.422 1.0317,-0.595 2.1848,-1.044 3.4593,-1.347 1.2744,-0.304 2.5732,-0.534 3.8963,-0.692 1.675,-0.194 3.034,-0.352 4.078,-0.473 1.044,-0.134 1.803,-0.346 2.276,-0.638 0.473,-0.291 0.71,-0.764 0.71,-1.42 v -0.127 c 0,-1.59 -0.449,-2.822 -1.347,-3.696 -0.886,-0.874 -2.209,-1.311 -3.969,-1.311 -1.833,0 -3.2775,0.407 -4.3335,1.22 -1.0438,0.801 -1.766,1.693 -2.1666,2.676 l -5.116,-1.165 c 0.6069,-1.699 1.4929,-3.071 2.6581,-4.115 1.1774,-1.056 2.5308,-1.82 4.0601,-2.294 1.5294,-0.485 3.1379,-0.728 4.8249,-0.728 1.117,0 2.3,0.133 3.55,0.4 1.263,0.255 2.44,0.729 3.532,1.421 1.105,0.691 2.009,1.681 2.713,2.967 0.704,1.275 1.056,2.932 1.056,4.971 v 18.571 h -5.316 v -3.824 h -0.219 c -0.352,0.704 -0.88,1.396 -1.584,2.076 -0.704,0.679 -1.608,1.244 -2.713,1.693 -1.104,0.449 -2.427,0.674 -3.9686,0.674 z m 1.1836,-4.37 c 1.505,0 2.792,-0.297 3.86,-0.892 1.08,-0.595 1.899,-1.372 2.458,-2.331 0.57,-0.971 0.855,-2.008 0.855,-3.113 v -3.605 c -0.194,0.194 -0.57,0.376 -1.129,0.546 -0.546,0.158 -1.171,0.298 -1.875,0.419 -0.704,0.109 -1.39,0.212 -2.057,0.31 -0.668,0.085 -1.226,0.157 -1.675,0.218 -1.056,0.134 -2.0211,0.358 -2.895,0.674 -0.8618,0.315 -1.5537,0.77 -2.0756,1.365 -0.5098,0.583 -0.7647,1.36 -0.7647,2.331 0,1.347 0.4977,2.367 1.493,3.058 0.9953,0.68 2.2637,1.02 3.8053,1.02 z m 37.07,-7.847 v -16.368 h 5.462 v 27.966 h -5.352 v -4.843 h -0.292 c -0.643,1.492 -1.675,2.737 -3.095,3.732 -1.408,0.983 -3.162,1.475 -5.262,1.475 -1.796,0 -3.386,-0.395 -4.77,-1.184 -1.371,-0.801 -2.452,-1.984 -3.241,-3.55 -0.776,-1.566 -1.165,-3.502 -1.165,-5.808 v -17.788 h 5.444 v 17.133 c 0,1.905 0.528,3.422 1.584,4.551 1.056,1.129 2.428,1.693 4.115,1.693 1.019,0 2.033,-0.254 3.04,-0.764 1.02,-0.51 1.863,-1.281 2.531,-2.313 0.68,-1.031 1.013,-2.342 1.001,-3.932 z m 17.708,-5.007 v 16.605 h -5.444 v -27.966 h 5.225 v 4.552 h 0.346 c 0.644,-1.481 1.651,-2.671 3.023,-3.569 1.383,-0.898 3.125,-1.347 5.225,-1.347 1.906,0 3.575,0.4 5.007,1.202 1.432,0.789 2.543,1.966 3.332,3.532 0.789,1.565 1.183,3.501 1.183,5.808 v 17.788 h -5.444 v -17.133 c 0,-2.027 -0.528,-3.611 -1.584,-4.752 -1.056,-1.153 -2.506,-1.73 -4.351,-1.73 -1.262,0 -2.385,0.274 -3.368,0.82 -0.971,0.546 -1.742,1.347 -2.313,2.403 -0.558,1.044 -0.837,2.306 -0.837,3.787 z m 36.465,17.169 c -2.707,0 -5.037,-0.613 -6.991,-1.839 -1.942,-1.238 -3.435,-2.943 -4.479,-5.116 -1.044,-2.173 -1.566,-4.661 -1.566,-7.465 0,-2.84 0.534,-5.346 1.602,-7.519 1.068,-2.185 2.573,-3.89 4.515,-5.116 1.942,-1.226 4.23,-1.839 6.864,-1.839 2.124,0 4.018,0.394 5.681,1.183 1.663,0.777 3.004,1.87 4.024,3.278 1.031,1.408 1.644,3.052 1.838,4.934 h -5.298 c -0.291,-1.311 -0.959,-2.44 -2.002,-3.387 -1.032,-0.947 -2.416,-1.42 -4.152,-1.42 -1.517,0 -2.846,0.401 -3.987,1.202 -1.129,0.789 -2.009,1.917 -2.64,3.386 -0.631,1.457 -0.947,3.18 -0.947,5.171 0,2.039 0.31,3.799 0.929,5.28 0.619,1.481 1.493,2.628 2.622,3.441 1.141,0.813 2.482,1.22 4.023,1.22 1.032,0 1.967,-0.189 2.804,-0.565 0.85,-0.388 1.56,-0.94 2.13,-1.657 0.583,-0.716 0.99,-1.578 1.22,-2.585 h 5.298 c -0.194,1.809 -0.782,3.423 -1.766,4.843 -0.983,1.42 -2.3,2.537 -3.95,3.35 -1.639,0.813 -3.563,1.22 -5.772,1.22 z m 22.241,-17.169 v 16.605 h -5.444 v -37.288 h 5.371 v 13.874 h 0.346 c 0.656,-1.505 1.657,-2.701 3.004,-3.587 1.348,-0.886 3.108,-1.329 5.28,-1.329 1.918,0 3.593,0.394 5.025,1.183 1.445,0.789 2.561,1.967 3.35,3.532 0.801,1.554 1.202,3.496 1.202,5.827 v 17.788 h -5.444 v -17.133 c 0,-2.051 -0.528,-3.641 -1.584,-4.77 -1.056,-1.141 -2.525,-1.712 -4.406,-1.712 -1.286,0 -2.44,0.274 -3.459,0.82 -1.008,0.546 -1.803,1.347 -2.385,2.403 -0.571,1.044 -0.856,2.306 -0.856,3.787 z m 41.528,16.605 h -5.972 l 13.419,-37.288 h 6.5 l 13.418,37.288 h -5.972 l -10.542,-30.515 h -0.291 z m 1.002,-14.602 h 19.371 v 4.733 h -19.371 z m 36.242,-22.686 v 37.288 h -5.444 v -37.288 z m 12.254,0 v 37.288 h -5.443 v -37.288 z m 6.811,37.288 v -27.966 h 5.444 v 27.966 z m 2.75,-32.281 c -0.947,0 -1.76,-0.316 -2.44,-0.947 -0.668,-0.643 -1.002,-1.408 -1.002,-2.294 0,-0.898 0.334,-1.663 1.002,-2.294 0.68,-0.643 1.493,-0.965 2.44,-0.965 0.946,0 1.753,0.322 2.421,0.965 0.68,0.631 1.02,1.396 1.02,2.294 0,0.886 -0.34,1.651 -1.02,2.294 -0.668,0.631 -1.475,0.947 -2.421,0.947 z m 17.643,32.9 c -1.772,0 -3.374,-0.328 -4.806,-0.984 -1.432,-0.667 -2.567,-1.632 -3.405,-2.894 -0.825,-1.263 -1.238,-2.81 -1.238,-4.643 0,-1.578 0.304,-2.877 0.91,-3.896 0.607,-1.02 1.427,-1.827 2.458,-2.422 1.032,-0.595 2.185,-1.044 3.46,-1.347 1.274,-0.304 2.573,-0.534 3.896,-0.692 1.675,-0.194 3.034,-0.352 4.078,-0.473 1.044,-0.134 1.803,-0.346 2.276,-0.638 0.473,-0.291 0.71,-0.764 0.71,-1.42 v -0.127 c 0,-1.59 -0.449,-2.822 -1.347,-3.696 -0.886,-0.874 -2.209,-1.311 -3.969,-1.311 -1.833,0 -3.277,0.407 -4.333,1.22 -1.044,0.801 -1.767,1.693 -2.167,2.676 l -5.116,-1.165 c 0.607,-1.699 1.493,-3.071 2.658,-4.115 1.177,-1.056 2.531,-1.82 4.06,-2.294 1.529,-0.485 3.138,-0.728 4.825,-0.728 1.117,0 2.3,0.133 3.55,0.4 1.263,0.255 2.44,0.729 3.532,1.421 1.105,0.691 2.009,1.681 2.713,2.967 0.704,1.275 1.056,2.932 1.056,4.971 v 18.571 h -5.316 v -3.824 h -0.219 c -0.352,0.704 -0.88,1.396 -1.584,2.076 -0.704,0.679 -1.608,1.244 -2.713,1.693 -1.104,0.449 -2.427,0.674 -3.969,0.674 z m 1.184,-4.37 c 1.505,0 2.792,-0.297 3.86,-0.892 1.08,-0.595 1.899,-1.372 2.458,-2.331 0.57,-0.971 0.855,-2.008 0.855,-3.113 v -3.605 c -0.194,0.194 -0.57,0.376 -1.129,0.546 -0.546,0.158 -1.171,0.298 -1.875,0.419 -0.704,0.109 -1.39,0.212 -2.057,0.31 -0.668,0.085 -1.226,0.157 -1.675,0.218 -1.056,0.134 -2.021,0.358 -2.895,0.674 -0.862,0.315 -1.554,0.77 -2.076,1.365 -0.509,0.583 -0.764,1.36 -0.764,2.331 0,1.347 0.497,2.367 1.493,3.058 0.995,0.68 2.263,1.02 3.805,1.02 z m 24.799,-12.854 v 16.605 h -5.444 v -27.966 h 5.225 v 4.552 h 0.346 c 0.644,-1.481 1.651,-2.671 3.023,-3.569 1.383,-0.898 3.125,-1.347 5.225,-1.347 1.906,0 3.575,0.4 5.007,1.202 1.432,0.789 2.543,1.966 3.332,3.532 0.789,1.565 1.183,3.501 1.183,5.808 v 17.788 h -5.444 v -17.133 c 0,-2.027 -0.528,-3.611 -1.584,-4.752 -1.056,-1.153 -2.506,-1.73 -4.351,-1.73 -1.262,0 -2.385,0.274 -3.368,0.82 -0.971,0.546 -1.742,1.347 -2.313,2.403 -0.558,1.044 -0.837,2.306 -0.837,3.787 z m 36.465,17.169 c -2.707,0 -5.037,-0.613 -6.991,-1.839 -1.942,-1.238 -3.435,-2.943 -4.479,-5.116 -1.044,-2.173 -1.566,-4.661 -1.566,-7.465 0,-2.84 0.534,-5.346 1.602,-7.519 1.068,-2.185 2.573,-3.89 4.515,-5.116 1.943,-1.226 4.231,-1.839 6.864,-1.839 2.125,0 4.018,0.394 5.681,1.183 1.663,0.777 3.004,1.87 4.024,3.278 1.031,1.408 1.644,3.052 1.838,4.934 h -5.298 c -0.291,-1.311 -0.959,-2.44 -2.002,-3.387 -1.032,-0.947 -2.416,-1.42 -4.152,-1.42 -1.517,0 -2.846,0.401 -3.987,1.202 -1.129,0.789 -2.009,1.917 -2.64,3.386 -0.631,1.457 -0.947,3.18 -0.947,5.171 0,2.039 0.31,3.799 0.929,5.28 0.619,1.481 1.493,2.628 2.622,3.441 1.141,0.813 2.482,1.22 4.023,1.22 1.032,0 1.967,-0.189 2.804,-0.565 0.85,-0.388 1.56,-0.94 2.13,-1.657 0.583,-0.716 0.99,-1.578 1.22,-2.585 h 5.298 c -0.194,1.809 -0.782,3.423 -1.766,4.843 -0.983,1.42 -2.3,2.537 -3.95,3.35 -1.639,0.813 -3.563,1.22 -5.772,1.22 z m 28.85,0 c -2.755,0 -5.128,-0.589 -7.119,-1.766 -1.978,-1.19 -3.507,-2.859 -4.588,-5.007 -1.068,-2.16 -1.602,-4.691 -1.602,-7.592 0,-2.865 0.534,-5.389 1.602,-7.574 1.081,-2.185 2.586,-3.89 4.516,-5.116 1.942,-1.226 4.211,-1.839 6.809,-1.839 1.578,0 3.107,0.261 4.588,0.783 1.481,0.522 2.81,1.341 3.987,2.458 1.178,1.116 2.106,2.567 2.786,4.351 0.68,1.772 1.019,3.927 1.019,6.463 v 1.93 h -22.23 v -4.078 h 16.896 c 0,-1.432 -0.291,-2.701 -0.874,-3.805 -0.583,-1.117 -1.402,-1.997 -2.458,-2.64 -1.044,-0.643 -2.27,-0.965 -3.678,-0.965 -1.529,0 -2.864,0.376 -4.005,1.129 -1.129,0.74 -2.003,1.711 -2.622,2.913 -0.607,1.189 -0.91,2.482 -0.91,3.878 v 3.186 c 0,1.869 0.327,3.459 0.983,4.77 0.667,1.311 1.596,2.312 2.785,3.004 1.19,0.68 2.58,1.02 4.17,1.02 1.031,0 1.972,-0.146 2.822,-0.437 0.849,-0.304 1.584,-0.753 2.203,-1.347 0.619,-0.595 1.092,-1.329 1.42,-2.203 l 5.152,0.928 c -0.412,1.517 -1.153,2.846 -2.221,3.987 -1.056,1.129 -2.385,2.009 -3.987,2.64 -1.59,0.619 -3.405,0.929 -5.444,0.929 z"></path>
              <path d="m 106.125,528.501 v -27.636 h 10.58 c 1.997,0 3.657,0.315 4.979,0.945 1.332,0.62 2.326,1.471 2.982,2.55 0.666,1.08 0.999,2.303 0.999,3.671 0,1.124 -0.216,2.087 -0.648,2.887 -0.432,0.792 -1.012,1.435 -1.74,1.93 -0.729,0.495 -1.543,0.85 -2.443,1.066 v 0.27 c 0.981,0.054 1.921,0.355 2.82,0.904 0.909,0.54 1.651,1.305 2.227,2.294 0.576,0.99 0.864,2.186 0.864,3.59 0,1.43 -0.347,2.716 -1.039,3.859 -0.693,1.134 -1.737,2.029 -3.131,2.685 -1.395,0.657 -3.149,0.985 -5.263,0.985 z m 5.007,-4.183 h 5.384 c 1.817,0 3.126,-0.346 3.927,-1.039 0.809,-0.702 1.214,-1.601 1.214,-2.699 0,-0.818 -0.202,-1.556 -0.607,-2.213 -0.405,-0.665 -0.981,-1.187 -1.727,-1.565 -0.747,-0.387 -1.638,-0.58 -2.672,-0.58 h -5.519 z m 0,-11.699 h 4.952 c 0.864,0 1.642,-0.158 2.335,-0.473 0.692,-0.324 1.237,-0.778 1.632,-1.363 0.405,-0.593 0.608,-1.295 0.608,-2.105 0,-1.07 -0.378,-1.952 -1.134,-2.645 -0.747,-0.692 -1.858,-1.039 -3.333,-1.039 h -5.06 z m 19.752,15.882 v -20.727 h 4.736 v 3.455 h 0.216 c 0.378,-1.197 1.026,-2.119 1.944,-2.767 0.926,-0.656 1.983,-0.985 3.171,-0.985 0.27,0 0.571,0.014 0.904,0.041 0.342,0.018 0.625,0.049 0.85,0.094 v 4.494 c -0.207,-0.072 -0.535,-0.135 -0.985,-0.189 -0.441,-0.063 -0.868,-0.095 -1.282,-0.095 -0.891,0 -1.691,0.194 -2.402,0.581 -0.702,0.378 -1.255,0.904 -1.66,1.579 -0.405,0.674 -0.607,1.452 -0.607,2.334 v 12.185 z m 23.254,0.405 c -2.024,0 -3.778,-0.445 -5.263,-1.336 -1.484,-0.89 -2.636,-2.136 -3.454,-3.738 -0.81,-1.601 -1.215,-3.472 -1.215,-5.613 0,-2.141 0.405,-4.017 1.215,-5.627 0.818,-1.611 1.97,-2.861 3.454,-3.752 1.485,-0.89 3.239,-1.336 5.263,-1.336 2.024,0 3.778,0.446 5.263,1.336 1.484,0.891 2.631,2.141 3.441,3.752 0.819,1.61 1.228,3.486 1.228,5.627 0,2.141 -0.409,4.012 -1.228,5.613 -0.81,1.602 -1.957,2.848 -3.441,3.738 -1.485,0.891 -3.239,1.336 -5.263,1.336 z m 0.027,-3.913 c 1.098,0 2.015,-0.301 2.753,-0.904 0.738,-0.612 1.286,-1.431 1.646,-2.456 0.369,-1.026 0.553,-2.168 0.553,-3.428 0,-1.268 -0.184,-2.415 -0.553,-3.441 -0.36,-1.034 -0.908,-1.857 -1.646,-2.469 -0.738,-0.612 -1.655,-0.918 -2.753,-0.918 -1.124,0 -2.06,0.306 -2.807,0.918 -0.737,0.612 -1.291,1.435 -1.66,2.469 -0.359,1.026 -0.539,2.173 -0.539,3.441 0,1.26 0.18,2.402 0.539,3.428 0.369,1.025 0.923,1.844 1.66,2.456 0.747,0.603 1.683,0.904 2.807,0.904 z m 18.936,-8.636 v 12.144 h -4.885 v -20.727 h 4.669 v 3.522 h 0.243 c 0.477,-1.16 1.237,-2.082 2.28,-2.766 1.053,-0.684 2.353,-1.026 3.9,-1.026 1.431,0 2.677,0.306 3.738,0.918 1.071,0.612 1.898,1.498 2.483,2.658 0.594,1.161 0.886,2.569 0.877,4.224 v 13.197 h -4.885 V 516.06 c 0,-1.386 -0.359,-2.47 -1.079,-3.252 -0.711,-0.783 -1.696,-1.174 -2.955,-1.174 -0.855,0 -1.615,0.188 -2.281,0.566 -0.657,0.369 -1.174,0.904 -1.552,1.606 -0.369,0.702 -0.553,1.552 -0.553,2.551 z m 18.001,12.144 v -3.103 l 10.688,-13.4 v -0.176 h -10.337 v -4.048 h 16.315 v 3.333 l -10.175,13.171 v 0.175 h 10.526 v 4.048 z m 30.191,0.405 c -2.079,0 -3.873,-0.432 -5.385,-1.295 -1.502,-0.873 -2.658,-2.105 -3.468,-3.698 -0.809,-1.601 -1.214,-3.486 -1.214,-5.654 0,-2.132 0.405,-4.003 1.214,-5.613 0.819,-1.62 1.961,-2.879 3.428,-3.779 1.466,-0.908 3.189,-1.363 5.168,-1.363 1.278,0 2.483,0.207 3.617,0.621 1.142,0.405 2.15,1.035 3.022,1.889 0.882,0.855 1.575,1.943 2.078,3.266 0.504,1.313 0.756,2.879 0.756,4.696 v 1.498 H 213.52 v -3.293 h 12.307 c -0.009,-0.935 -0.212,-1.768 -0.608,-2.496 -0.395,-0.738 -0.949,-1.318 -1.659,-1.741 -0.702,-0.423 -1.521,-0.634 -2.456,-0.634 -0.999,0 -1.876,0.243 -2.632,0.728 -0.755,0.477 -1.345,1.107 -1.768,1.89 -0.413,0.773 -0.625,1.623 -0.634,2.55 v 2.874 c 0,1.206 0.221,2.24 0.661,3.104 0.441,0.855 1.058,1.511 1.849,1.97 0.792,0.45 1.718,0.675 2.78,0.675 0.711,0 1.354,-0.099 1.93,-0.297 0.575,-0.207 1.075,-0.508 1.498,-0.904 0.422,-0.396 0.742,-0.886 0.958,-1.471 l 4.561,0.513 c -0.288,1.205 -0.837,2.258 -1.647,3.157 -0.8,0.891 -1.826,1.584 -3.076,2.079 -1.251,0.485 -2.681,0.728 -4.291,0.728 z m 22.99,-28.041 h 6.127 l 8.204,20.026 h 0.324 l 8.205,-20.026 h 6.126 v 27.636 h -4.804 v -18.986 h -0.256 l -7.638,18.905 h -3.589 l -7.638,-18.946 h -0.257 v 19.027 h -4.804 z m 43.398,28.041 c -2.078,0 -3.873,-0.432 -5.384,-1.295 -1.502,-0.873 -2.658,-2.105 -3.468,-3.698 -0.81,-1.601 -1.215,-3.486 -1.215,-5.654 0,-2.132 0.405,-4.003 1.215,-5.613 0.819,-1.62 1.961,-2.879 3.427,-3.779 1.467,-0.908 3.19,-1.363 5.169,-1.363 1.277,0 2.483,0.207 3.616,0.621 1.143,0.405 2.15,1.035 3.023,1.889 0.882,0.855 1.574,1.943 2.078,3.266 0.504,1.313 0.756,2.879 0.756,4.696 v 1.498 h -16.99 v -3.293 h 12.307 c -0.009,-0.935 -0.211,-1.768 -0.607,-2.496 -0.396,-0.738 -0.949,-1.318 -1.66,-1.741 -0.701,-0.423 -1.52,-0.634 -2.456,-0.634 -0.998,0 -1.875,0.243 -2.631,0.728 -0.756,0.477 -1.345,1.107 -1.768,1.89 -0.414,0.773 -0.625,1.623 -0.634,2.55 v 2.874 c 0,1.206 0.22,2.24 0.661,3.104 0.441,0.855 1.057,1.511 1.849,1.97 0.792,0.45 1.718,0.675 2.78,0.675 0.71,0 1.354,-0.099 1.929,-0.297 0.576,-0.207 1.075,-0.508 1.498,-0.904 0.423,-0.396 0.742,-0.886 0.958,-1.471 l 4.561,0.513 c -0.287,1.205 -0.836,2.258 -1.646,3.157 -0.801,0.891 -1.826,1.584 -3.077,2.079 -1.25,0.485 -2.68,0.728 -4.291,0.728 z m 13.349,-0.405 v -20.727 h 4.669 v 3.522 h 0.243 c 0.432,-1.187 1.147,-2.114 2.146,-2.78 0.999,-0.674 2.191,-1.012 3.576,-1.012 1.403,0 2.586,0.342 3.549,1.026 0.972,0.675 1.655,1.597 2.051,2.766 h 0.216 c 0.459,-1.151 1.233,-2.069 2.321,-2.753 1.098,-0.692 2.398,-1.039 3.9,-1.039 1.907,0 3.463,0.603 4.669,1.809 1.205,1.205 1.808,2.964 1.808,5.276 v 13.912 h -4.898 v -13.156 c 0,-1.287 -0.342,-2.227 -1.026,-2.821 -0.684,-0.603 -1.52,-0.904 -2.51,-0.904 -1.178,0 -2.1,0.369 -2.766,1.107 -0.657,0.728 -0.985,1.677 -0.985,2.847 v 12.927 h -4.791 v -13.359 c 0,-1.07 -0.324,-1.925 -0.971,-2.564 -0.639,-0.639 -1.476,-0.958 -2.51,-0.958 -0.702,0 -1.341,0.18 -1.916,0.54 -0.576,0.351 -1.035,0.85 -1.377,1.498 -0.342,0.638 -0.513,1.385 -0.513,2.24 v 12.603 z m 34.32,0 v -27.636 h 4.885 v 10.337 h 0.202 c 0.252,-0.504 0.607,-1.039 1.066,-1.606 0.459,-0.576 1.08,-1.066 1.863,-1.471 0.782,-0.414 1.781,-0.621 2.995,-0.621 1.602,0 3.045,0.41 4.332,1.228 1.295,0.81 2.321,2.011 3.077,3.603 0.764,1.584 1.147,3.527 1.147,5.83 0,2.276 -0.374,4.21 -1.12,5.802 -0.747,1.593 -1.764,2.807 -3.05,3.644 -1.287,0.836 -2.744,1.255 -4.372,1.255 -1.188,0 -2.173,-0.198 -2.956,-0.594 -0.782,-0.396 -1.412,-0.873 -1.889,-1.43 -0.468,-0.567 -0.832,-1.102 -1.093,-1.606 h -0.283 v 3.265 z m 4.79,-10.363 c 0,1.34 0.189,2.514 0.567,3.522 0.387,1.007 0.94,1.795 1.66,2.361 0.729,0.558 1.61,0.837 2.645,0.837 1.079,0 1.983,-0.288 2.712,-0.864 0.729,-0.584 1.278,-1.381 1.646,-2.388 0.378,-1.017 0.567,-2.173 0.567,-3.468 0,-1.287 -0.184,-2.429 -0.553,-3.428 -0.369,-0.998 -0.918,-1.781 -1.646,-2.348 -0.729,-0.567 -1.638,-0.85 -2.726,-0.85 -1.044,0 -1.93,0.275 -2.659,0.823 -0.728,0.549 -1.282,1.318 -1.659,2.308 -0.369,0.989 -0.554,2.154 -0.554,3.495 z m 28.106,10.768 c -2.078,0 -3.873,-0.432 -5.385,-1.295 -1.502,-0.873 -2.658,-2.105 -3.468,-3.698 -0.809,-1.601 -1.214,-3.486 -1.214,-5.654 0,-2.132 0.405,-4.003 1.214,-5.613 0.819,-1.62 1.962,-2.879 3.428,-3.779 1.466,-0.908 3.189,-1.363 5.168,-1.363 1.278,0 2.483,0.207 3.617,0.621 1.142,0.405 2.15,1.035 3.022,1.889 0.882,0.855 1.575,1.943 2.079,3.266 0.503,1.313 0.755,2.879 0.755,4.696 v 1.498 h -16.989 v -3.293 h 12.307 c -0.009,-0.935 -0.212,-1.768 -0.608,-2.496 -0.395,-0.738 -0.949,-1.318 -1.659,-1.741 -0.702,-0.423 -1.521,-0.634 -2.456,-0.634 -0.999,0 -1.876,0.243 -2.632,0.728 -0.755,0.477 -1.345,1.107 -1.767,1.89 -0.414,0.773 -0.626,1.623 -0.635,2.55 v 2.874 c 0,1.206 0.221,2.24 0.662,3.104 0.44,0.855 1.057,1.511 1.848,1.97 0.792,0.45 1.719,0.675 2.78,0.675 0.711,0 1.354,-0.099 1.93,-0.297 0.576,-0.207 1.075,-0.508 1.498,-0.904 0.423,-0.396 0.742,-0.886 0.958,-1.471 l 4.561,0.513 c -0.288,1.205 -0.837,2.258 -1.646,3.157 -0.801,0.891 -1.827,1.584 -3.077,2.079 -1.251,0.485 -2.681,0.728 -4.291,0.728 z m 13.349,-0.405 v -20.727 h 4.736 v 3.455 h 0.216 c 0.378,-1.197 1.026,-2.119 1.944,-2.767 0.926,-0.656 1.983,-0.985 3.171,-0.985 0.27,0 0.571,0.014 0.904,0.041 0.342,0.018 0.625,0.049 0.85,0.094 v 4.494 c -0.207,-0.072 -0.535,-0.135 -0.985,-0.189 -0.441,-0.063 -0.868,-0.095 -1.282,-0.095 -0.891,0 -1.691,0.194 -2.402,0.581 -0.702,0.378 -1.255,0.904 -1.66,1.579 -0.405,0.674 -0.607,1.452 -0.607,2.334 v 12.185 z m -178.661,48 v -3.616 l 9.594,-9.406 c 0.918,-0.926 1.682,-1.749 2.294,-2.469 0.612,-0.72 1.071,-1.417 1.376,-2.092 0.306,-0.674 0.459,-1.394 0.459,-2.159 0,-0.872 -0.198,-1.619 -0.594,-2.24 -0.395,-0.63 -0.94,-1.115 -1.632,-1.457 -0.693,-0.342 -1.48,-0.513 -2.362,-0.513 -0.908,0 -1.705,0.189 -2.388,0.567 -0.684,0.369 -1.215,0.895 -1.593,1.579 -0.369,0.683 -0.553,1.498 -0.553,2.442 h -4.763 c 0,-1.754 0.4,-3.279 1.201,-4.574 0.8,-1.296 1.902,-2.299 3.306,-3.01 1.412,-0.71 3.031,-1.066 4.858,-1.066 1.853,0 3.481,0.347 4.885,1.039 1.403,0.693 2.492,1.642 3.265,2.848 0.783,1.205 1.174,2.582 1.174,4.129 0,1.034 -0.198,2.051 -0.594,3.05 -0.395,0.998 -1.093,2.105 -2.091,3.319 -0.99,1.215 -2.38,2.686 -4.17,4.413 l -4.763,4.844 v 0.189 h 12.037 v 4.183 z m 33.816,0.527 c -2.222,0 -4.129,-0.563 -5.721,-1.687 -1.584,-1.134 -2.803,-2.766 -3.657,-4.898 -0.846,-2.142 -1.269,-4.719 -1.269,-7.733 0.009,-3.013 0.437,-5.577 1.282,-7.691 0.855,-2.124 2.074,-3.743 3.657,-4.858 1.592,-1.116 3.495,-1.674 5.708,-1.674 2.213,0 4.116,0.558 5.708,1.674 1.593,1.115 2.812,2.734 3.657,4.858 0.855,2.123 1.282,4.687 1.282,7.691 0,3.023 -0.427,5.605 -1.282,7.746 -0.845,2.132 -2.064,3.76 -3.657,4.885 -1.583,1.124 -3.486,1.687 -5.708,1.687 z m 0,-4.224 c 1.728,0 3.09,-0.85 4.089,-2.55 1.008,-1.71 1.511,-4.224 1.511,-7.544 0,-2.195 -0.229,-4.039 -0.688,-5.532 -0.459,-1.494 -1.106,-2.618 -1.943,-3.374 -0.837,-0.765 -1.826,-1.147 -2.969,-1.147 -1.718,0 -3.076,0.855 -4.075,2.564 -0.999,1.7 -1.502,4.197 -1.511,7.489 -0.009,2.204 0.211,4.058 0.661,5.56 0.459,1.502 1.106,2.636 1.943,3.4 0.837,0.756 1.831,1.134 2.982,1.134 z m 15.131,3.697 v -3.616 l 9.594,-9.406 c 0.918,-0.926 1.683,-1.749 2.294,-2.469 0.612,-0.72 1.071,-1.417 1.377,-2.092 0.306,-0.674 0.458,-1.394 0.458,-2.159 0,-0.872 -0.197,-1.619 -0.593,-2.24 -0.396,-0.63 -0.94,-1.115 -1.633,-1.457 -0.693,-0.342 -1.48,-0.513 -2.362,-0.513 -0.908,0 -1.704,0.189 -2.388,0.567 -0.684,0.369 -1.215,0.895 -1.592,1.579 -0.369,0.683 -0.554,1.498 -0.554,2.442 h -4.763 c 0,-1.754 0.4,-3.279 1.201,-4.574 0.8,-1.296 1.903,-2.299 3.306,-3.01 1.412,-0.71 3.032,-1.066 4.858,-1.066 1.853,0 3.481,0.347 4.885,1.039 1.403,0.693 2.492,1.642 3.265,2.848 0.783,1.205 1.174,2.582 1.174,4.129 0,1.034 -0.197,2.051 -0.593,3.05 -0.396,0.998 -1.093,2.105 -2.092,3.319 -0.989,1.215 -2.379,2.686 -4.17,4.413 l -4.763,4.844 v 0.189 h 12.037 v 4.183 z m 33.209,0.378 c -1.799,0 -3.409,-0.337 -4.831,-1.012 -1.421,-0.683 -2.55,-1.619 -3.387,-2.807 -0.827,-1.187 -1.268,-2.546 -1.322,-4.075 h 4.858 c 0.09,1.134 0.58,2.06 1.471,2.78 0.89,0.711 1.961,1.066 3.211,1.066 0.981,0 1.854,-0.225 2.618,-0.675 0.765,-0.45 1.368,-1.075 1.808,-1.875 0.441,-0.801 0.657,-1.714 0.648,-2.74 0.009,-1.043 -0.211,-1.97 -0.661,-2.78 -0.45,-0.809 -1.066,-1.443 -1.849,-1.902 -0.782,-0.468 -1.682,-0.702 -2.699,-0.702 -0.827,-0.009 -1.641,0.144 -2.442,0.459 -0.801,0.315 -1.435,0.729 -1.903,1.241 l -4.52,-0.742 1.443,-14.25 h 16.032 v 4.183 h -11.889 l -0.796,7.328 h 0.162 c 0.513,-0.603 1.237,-1.102 2.173,-1.498 0.935,-0.405 1.961,-0.607 3.076,-0.607 1.674,0 3.167,0.395 4.48,1.187 1.314,0.783 2.348,1.862 3.104,3.239 0.756,1.376 1.134,2.951 1.134,4.723 0,1.826 -0.423,3.454 -1.269,4.885 -0.837,1.421 -2.002,2.541 -3.495,3.36 -1.484,0.809 -3.203,1.214 -5.155,1.214 z"></path>
              <path d="m 250.77539,71 c -7.55637,0 -15.11339,3.465334 -19.96289,10.396484 -5.875,8.3979 -16.37834,12.221054 -26.27734,9.564454 -16.339,-4.385301 -32.06499,8.809306 -30.58399,25.662112 0.898,10.209 -4.68947,19.88879 -13.98047,24.21679 -15.335,7.143 -18.90159,27.35841 -6.93359,39.31641 7.25,7.245 9.19147,18.25306 4.85547,27.53906 -7.156,15.329 3.10889,33.10722 19.96289,34.57422 10.21,0.889 18.77287,8.07261 21.42187,17.97461 4.372,16.343 23.66163,23.36525 37.51563,13.65625 8.393,-5.882 19.57184,-5.882 27.96484,0 13.855,9.709 33.14363,2.68675 37.51563,-13.65625 2.649,-9.902 11.21187,-17.08561 21.42187,-17.97461 16.853,-1.467 27.11694,-19.24522 19.96094,-34.57422 -4.336,-9.286 -2.39358,-20.29406 4.85742,-27.53906 11.967,-11.958 8.40141,-32.17341 -6.93359,-39.31641 -9.29,-4.328 -14.87942,-14.00779 -13.98242,-24.21679 1.481,-16.852806 -14.24304,-30.047413 -30.58204,-25.662112 -9.899,2.656599 -20.40429,-1.166554 -26.27929,-9.564454 C 265.88733,74.465334 258.33177,71 250.77539,71 Z m -32.72851,57.45117 h 38.19335 c 1.95425,0.001 3.87504,0.072 5.75782,0.21094 1.88278,0.13897 3.72669,0.3463 5.53125,0.61914 1.80455,0.27284 3.56949,0.61092 5.28906,1.01367 1.71957,0.40275 3.3956,0.86975 5.02344,1.39844 1.62783,0.52869 3.20698,1.11888 4.73632,1.76953 1.52935,0.65065 3.00755,1.36221 4.43165,2.13086 1.42409,0.76865 2.79338,1.59584 4.10546,2.47852 1.31209,0.88268 2.56645,1.81976 3.75977,2.8125 1.19332,0.99273 2.32673,2.03984 3.39453,3.13867 1.06781,1.09883 2.07033,2.25022 3.00586,3.45117 0.93553,1.20095 1.80311,2.45285 2.59961,3.75195 0.7965,1.2991 1.52312,2.64578 2.17383,4.03906 0.65071,1.39329 1.22644,2.83292 1.72461,4.31641 0.49816,1.48349 0.91894,3.01034 1.25781,4.58008 0.33887,1.56973 0.59477,3.18198 0.76758,4.83398 0.17281,1.65201 0.26172,3.34391 0.26172,5.07422 -10e-4,1.72925 -0.0898,3.41963 -0.26367,5.07031 -0.17392,1.65069 -0.43349,3.26191 -0.77344,4.83008 -0.33995,1.56817 -0.76055,3.09447 -1.25977,4.57618 -0.49922,1.4817 -1.07679,2.91926 -1.72851,4.31054 -0.65173,1.39128 -1.37832,2.7363 -2.17578,4.0332 -0.79747,1.29691 -1.66512,2.54557 -2.60157,3.74415 -0.93645,1.19857 -1.94109,2.34707 -3.00976,3.44335 -1.06867,1.09629 -2.20236,2.13886 -3.39649,3.12891 -1.19412,0.99005 -2.4489,1.92679 -3.76172,2.80664 -1.31281,0.87986 -2.68267,1.70304 -4.10742,2.46875 -1.42475,0.76571 -2.90368,1.47348 -4.43359,2.1211 -1.52992,0.64761 -3.11192,1.23615 -4.74024,1.76171 -1.62832,0.52556 -3.30347,0.98912 -5.02343,1.38868 -1.71997,0.39955 -3.48422,0.73431 -5.28907,1.0039 -1.80484,0.2696 -3.65024,0.4737 -5.5332,0.60938 -1.88296,0.13568 -3.8035,0.20336 -5.75781,0.20117 h -38.19336 l -0.0176,-0.0156 24.20508,-22.07031 h 12.92187 c 1.08857,0.001 2.16232,-0.0235 3.21875,-0.0762 9.50788,-0.47413 17.61767,-3.15925 22.58789,-8.61133 0.55225,-0.60579 1.06478,-1.24503 1.53711,-1.91992 0.47234,-0.67489 0.90532,-1.38533 1.29297,-2.13086 0.38765,-0.74553 0.73111,-1.52605 1.0293,-2.34375 0.29819,-0.8177 0.54996,-1.67306 0.75391,-2.56445 0.20394,-0.89139 0.35992,-1.82049 0.46484,-2.78711 0.10492,-0.96662 0.15903,-1.9703 0.16016,-3.01367 10e-4,-1.04338 -0.0513,-2.04889 -0.1543,-3.01563 -0.10301,-0.96673 -0.25671,-1.89549 -0.45899,-2.78711 -0.20228,-0.89162 -0.45324,-1.74447 -0.75,-2.5625 -0.29675,-0.81802 -0.63894,-1.59974 -1.02539,-2.3457 -0.38644,-0.74596 -0.81773,-1.4574 -1.28906,-2.13281 -0.47133,-0.67542 -0.98373,-1.31549 -1.53516,-1.92188 -1.65464,-1.81958 -3.65782,-3.33108 -5.94726,-4.55664 -0.76293,-0.40847 -1.55701,-0.78531 -2.38086,-1.13086 -4.94308,-2.07328 -10.93895,-3.02734 -17.4707,-3.02734 h -12.90235 c 0,0 -13.49929,-12.45263 -20.33593,-18.5918 -2.27889,-2.04639 -3.81764,-3.39159 -3.86914,-3.33984 z m -0.0996,21.57031 c 0.86562,1.29638 1.76874,2.54256 2.70898,3.74024 0.94024,1.19768 1.91742,2.34753 2.93164,3.44726 1.01422,1.09974 2.06478,2.14982 3.15234,3.15235 1.08757,1.00252 2.21276,1.95722 3.37305,2.86328 1.16029,0.90606 2.35551,1.76388 3.58789,2.57422 1.23238,0.81034 2.50085,1.5737 3.80469,2.28906 1.30384,0.71536 2.64486,1.38279 4.01953,2.00391 1.37467,0.62112 2.78364,1.19503 4.22852,1.72265 l 6.28906,2.18946 -6.30664,2.16992 c -1.445,0.5255 -2.84735,1.09737 -4.20899,1.71679 -1.36164,0.61943 -2.683,1.28603 -3.96679,2 -1.28379,0.71398 -2.52878,1.47602 -3.74024,2.28516 -1.21146,0.80914 -2.38856,1.66539 -3.5332,2.57031 -1.14464,0.90493 -2.25846,1.85805 -3.3418,2.85938 -1.08333,1.00133 -2.13652,2.05204 -3.16406,3.15039 -2.05508,2.1967 -4.00414,4.58728 -5.86914,7.17578 -0.86563,-1.29637 -1.76883,-2.54255 -2.70899,-3.74023 -0.94015,-1.19769 -1.91755,-2.34754 -2.93164,-3.44727 -1.01408,-1.09973 -2.06493,-2.14982 -3.15234,-3.15234 -1.08741,-1.00253 -2.21096,-1.95722 -3.37109,-2.86328 -1.16014,-0.90607 -2.35759,-1.76389 -3.58985,-2.57422 -1.23225,-0.81034 -2.49896,-1.57371 -3.80273,-2.28907 -1.30378,-0.71535 -2.64289,-1.38278 -4.01758,-2.0039 -1.37469,-0.62112 -2.78547,-1.19503 -4.23047,-1.72266 l -6.28906,-2.1875 6.30664,-2.17187 c 1.445,-0.52538 2.85532,-1.09741 4.23047,-1.7168 1.37514,-0.61939 2.71497,-1.28601 4.01953,-2 1.30456,-0.71399 2.57339,-1.47596 3.80664,-2.28516 1.23325,-0.80919 2.43059,-1.66532 3.5918,-2.57031 1.1612,-0.90499 2.28656,-1.85799 3.375,-2.85937 1.08843,-1.00138 2.14131,-2.05203 3.15625,-3.15039 1.01493,-1.09837 1.99288,-2.24546 2.93359,-3.44141 0.94071,-1.19595 1.84324,-2.44025 2.70899,-3.73438 z"></path>
            </symbol>
          </svg>
          <img className="w-auto invert" alt="Leakjar AWS partnership" src="/l_aws.png">
          <svg className="w-auto"><use href="#nvidia"></use></svg>
          <svg className="w-auto" style="width: 4rem"><use href="#drata"></use></svg>
        </div>
      </section>

      {/* Impressive Stats */}
      <section className="bg-gray-900 text-white py-20 border-y border-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-16 leading-tight text-white">
              LeakJar has over <span className="text-blue-400">{formatNumber(stats.totalRecords)}</span> pieces of data,
              <br className="hidden md:block" />
              with an average of <span className="text-blue-400">{formatNumber(stats.dailyAdditions)}</span> new additions every day
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="p-6 rounded-lg bg-gray-800 border border-gray-700">
                <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-3">
                  {formatNumber(stats.totalRecords)}
                </div>
                <p className="text-gray-300 font-medium">Total Records</p>
              </div>
              <div className="p-6 rounded-lg bg-gray-800 border border-gray-700">
                <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-3">
                  {formatNumber(stats.dailyAdditions)}
                </div>
                <p className="text-gray-300 font-medium">Daily Additions</p>
              </div>
              <div className="p-6 rounded-lg bg-gray-800 border border-gray-700">
                <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-3">
                  24/7
                </div>
                <p className="text-gray-300 font-medium">Monitoring</p>
              </div>
              <div className="p-6 rounded-lg bg-gray-800 border border-gray-700">
                <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-3">
                  &lt;1hr
                </div>
                <p className="text-gray-300 font-medium">Alert Time</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Social Proof - Trusted by Market Leaders */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Trusted by Market Leaders
            </h2>
          </div>
          
          {/* Horizontal Scrollable Container */}
          <div className="relative">
            <div className="overflow-x-auto pb-4 scrollbar-hide">
              <div className="flex gap-4 min-w-max px-4">
                {/* #1 Global Chat API */}
                <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow w-44 flex-shrink-0">
                  <CardContent className="p-5 text-center">
                    <div className="h-14 w-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="h-7 w-7 text-gray-700" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">#1 Global</h3>
                    <p className="text-xs text-gray-600">Chat API</p>
                  </CardContent>
                </Card>

                {/* #1 Global Live commerce */}
                <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow w-44 flex-shrink-0">
                  <CardContent className="p-5 text-center">
                    <div className="h-14 w-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Globe className="h-7 w-7 text-gray-700" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">#1 Global Live</h3>
                    <p className="text-xs text-gray-600">commerce platform</p>
                  </CardContent>
                </Card>

                {/* #1 AI-powered Translate */}
                <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow w-44 flex-shrink-0">
                  <CardContent className="p-5 text-center">
                    <div className="h-14 w-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Languages className="h-7 w-7 text-gray-700" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">#1 AI-powered</h3>
                    <p className="text-xs text-gray-600">Translate Service</p>
                  </CardContent>
                </Card>

                {/* Leading e-commerce */}
                <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow w-44 flex-shrink-0">
                  <CardContent className="p-5 text-center">
                    <div className="h-14 w-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <ShoppingCart className="h-7 w-7 text-gray-700" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">Leading e-commerce</h3>
                    <p className="text-xs text-gray-600">companies</p>
                  </CardContent>
                </Card>

                {/* Leading collaboration tool */}
                <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow w-44 flex-shrink-0">
                  <CardContent className="p-5 text-center">
                    <div className="h-14 w-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Users className="h-7 w-7 text-gray-700" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">Leading business</h3>
                    <p className="text-xs text-gray-600">collaboration tool</p>
                  </CardContent>
                </Card>

                {/* Leading B2B SaaS */}
                <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow w-44 flex-shrink-0">
                  <CardContent className="p-5 text-center">
                    <div className="h-14 w-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Building2 className="h-7 w-7 text-gray-700" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">Leading B2B SaaS</h3>
                    <p className="text-xs text-gray-600">companies</p>
                  </CardContent>
                </Card>

                {/* eGaming */}
                <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow w-44 flex-shrink-0">
                  <CardContent className="p-5 text-center">
                    <div className="h-14 w-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Dices className="h-7 w-7 text-gray-700" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">eGaming</h3>
                    <p className="text-xs text-gray-600">Online casinos</p>
                  </CardContent>
                </Card>

                {/* Leading AI startups */}
                <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow w-44 flex-shrink-0">
                  <CardContent className="p-5 text-center">
                    <div className="h-14 w-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Brain className="h-7 w-7 text-gray-700" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">Leading AI</h3>
                    <p className="text-xs text-gray-600">startups</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Value Proposition */}
      <section className="bg-white py-20 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Measurable Security Outcomes
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Security teams using LeakJar detect and neutralize credential threats faster, 
                reducing mean time to respond (MTTR) and preventing costly breaches before they escalate.
              </p>
            </div>

            {/* Primary Value Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <Card className="border-2 border-gray-200 shadow-sm">
                <CardHeader>
                  <div className="h-12 w-12 bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-3">Accelerate Incident Response</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    Real-time alerts enable security teams to reset compromised credentials and contain threats 
                    within minutes instead of days or weeks—dramatically reducing your attack surface window.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">&lt;1hr</span>
                    <span className="text-sm text-gray-600">average alert time</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200 shadow-sm">
                <CardHeader>
                  <div className="h-12 w-12 bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-3">Stop Breaches Before They Start</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    Identify vulnerabilities before attackers exploit them. Prevent account takeovers, 
                    data exfiltration, and ransomware deployment by detecting compromised credentials at the source.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">80%</span>
                    <span className="text-sm text-gray-600">of breaches start with credentials</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200 shadow-sm">
                <CardHeader>
                  <div className="h-12 w-12 bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-3">Intelligence Others Miss</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    Access threat data from targeted attacks, stealer malware, and underground sources that 
                    traditional breach databases never see—giving you visibility into emerging threats first.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">60B+</span>
                    <span className="text-sm text-gray-600">credential records monitored</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200 shadow-sm">
                <CardHeader>
                  <div className="h-12 w-12 bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-3">Meet Compliance Requirements</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    Satisfy PCI DSS 8.3.10, NIST SP 800-63B, and other mandatory credential monitoring controls. 
                    Demonstrate audit readiness with comprehensive logging and reporting capabilities.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">PCI DSS</Badge>
                    <Badge variant="outline" className="text-xs">NIST</Badge>
                    <Badge variant="outline" className="text-xs">HIPAA</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200 shadow-sm">
                <CardHeader>
                  <div className="h-12 w-12 bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-3">Reduce Security Costs</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    Avoid the $4.45M average cost of a data breach. Prevent expensive incident response, 
                    legal fees, regulatory fines, and brand damage by stopping attacks at the credential level.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">$4.45M</span>
                    <span className="text-sm text-gray-600">avg breach cost avoided</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200 shadow-sm">
                <CardHeader>
                  <div className="h-12 w-12 bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                    <Database className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-3">Seamless Integration</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    Deploy in minutes with our RESTful API, dashboard, and webhook integrations. 
                    Connect with your existing SIEM, ticketing systems, and security workflows instantly.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">&lt;5min</span>
                    <span className="text-sm text-gray-600">integration time</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ROI Highlight */}
            <Card className="bg-gray-900 text-white border-0">
              <CardContent className="p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-3xl font-bold mb-4">
                      Protect Your Organization's Most Valuable Assets
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      A single compromised credential can cascade into ransomware deployment, data exfiltration, 
                      supply chain attacks, and business email compromise. LeakJar stops the attack chain before 
                      it starts—protecting your employees, customers, and bottom line.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-blue-400 flex-shrink-0" />
                        <span className="text-gray-300">Prevent account takeover and lateral movement</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-blue-400 flex-shrink-0" />
                        <span className="text-gray-300">Avoid regulatory fines and compliance violations</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-blue-400 flex-shrink-0" />
                        <span className="text-gray-300">Protect brand reputation and customer trust</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-lg p-6 text-center">
                      <div className="text-4xl font-bold text-blue-400 mb-2">287</div>
                      <p className="text-sm text-gray-300">Days avg to detect breach</p>
                      <p className="text-xs text-gray-400 mt-1">Industry Standard</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-6 text-center">
                      <div className="text-4xl font-bold text-green-400 mb-2">&lt;1</div>
                      <p className="text-sm text-gray-300">Hour with LeakJar</p>
                      <p className="text-xs text-gray-400 mt-1">Real-time Alerts</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-6 text-center col-span-2">
                      <div className="text-4xl font-bold text-blue-400 mb-2">99.6%</div>
                      <p className="text-sm text-gray-300">Reduction in detection time</p>
                      <p className="text-xs text-gray-400 mt-1">Faster Response = Lower Impact</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Compliance Requirements Section */}
      <section className="bg-gray-50 py-20 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 px-4 py-1.5" variant="secondary">
                <Shield className="h-3.5 w-3.5 mr-2 inline" />
                Compliance & Regulatory Standards
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Meet Mandatory Compliance Requirements
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Satisfy credential monitoring mandates across major regulatory frameworks. 
                One platform delivers comprehensive coverage for PCI DSS, NIST, HIPAA, GDPR, CCPA, and emerging AI regulations.
              </p>
            </div>

            {/* Compliance Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {/* PCI DSS */}
              <Card className="border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <CardHeader className="flex-grow">
                  <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="h-8 flex items-start mb-3">
                    <Badge variant="outline" className="w-fit text-xs">
                      Payment Card Industry
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mb-2">PCI DSS 4.0</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed mb-4">
                    Meet Requirement 8.3.10 for blocking compromised credentials. 
                    Mandatory as of March 31, 2025—avoid heavy fines and pass your QSA audit.
                  </CardDescription>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Requirement 8.3.10 compliance</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Audit-ready documentation</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link href="/pci-compliance">
                    <Button variant="outline" size="sm" className="w-full">
                      Learn More
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* NIST */}
              <Card className="border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <CardHeader className="flex-grow">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Lock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="h-8 flex items-start mb-3">
                    <Badge variant="outline" className="w-fit text-xs">
                      Federal Standard
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mb-2">NIST SP 800-63B</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed mb-4">
                    Implement mandatory credential monitoring controls. 
                    Align with NIST Cybersecurity Framework 2.0 and federal security standards.
                  </CardDescription>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Section 5.1.1.2 compliance</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">CSF 2.0 alignment</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link href="/nist-compliance">
                    <Button variant="outline" size="sm" className="w-full">
                      Learn More
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* HIPAA */}
              <Card className="border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <CardHeader className="flex-grow">
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Activity className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="h-8 flex items-start mb-3">
                    <Badge variant="outline" className="w-fit text-xs">
                      Healthcare
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mb-2">HIPAA Security Rule</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed mb-4">
                    Protect ePHI and complete your Security Risk Analysis. 
                    Demonstrate "reasonable and appropriate" safeguards to avoid willful neglect penalties.
                  </CardDescription>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">164.308(a)(1)(ii)(A) addressable</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Risk analysis documentation</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link href="/hipaa-compliance">
                    <Button variant="outline" size="sm" className="w-full">
                      Learn More
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* GDPR */}
              <Card className="border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <CardHeader className="flex-grow">
                  <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                    <Globe className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="h-8 flex items-start mb-3">
                    <Badge variant="outline" className="w-fit text-xs">
                      EU Data Protection
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mb-2">GDPR Article 32</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed mb-4">
                    Meet "state of the art" security requirements for protecting personal data. 
                    Avoid fines up to 4% of annual revenue from EU regulators.
                  </CardDescription>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Article 32 technical measures</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Breach notification support</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link href="/gdpr-compliance">
                    <Button variant="outline" size="sm" className="w-full">
                      Learn More
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* CCPA */}
              <Card className="border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <CardHeader className="flex-grow">
                  <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <Scale className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="h-8 flex items-start mb-3">
                    <Badge variant="outline" className="w-fit text-xs">
                      California Privacy Law
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mb-2">CCPA/CPRA</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed mb-4">
                    Demonstrate "reasonable security" measures and protect against class-action lawsuits. 
                    California consumers have a private right of action for data breaches.
                  </CardDescription>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Reasonable security standard</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Consumer protection measures</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link href="/ccpa-compliance">
                    <Button variant="outline" size="sm" className="w-full">
                      Learn More
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* EU AI Act */}
              <Card className="border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <CardHeader className="flex-grow">
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Brain className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="h-8 flex items-start mb-3">
                    <Badge variant="outline" className="w-fit text-xs">
                      AI Regulation
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mb-2">EU AI Act</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed mb-4">
                    Prevent data poisoning attacks and meet Article 15 robustness requirements. 
                    Protect high-risk AI systems from compromised training data.
                  </CardDescription>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Article 15 data governance</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Data poisoning prevention</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link href="/ai-act-compliance">
                    <Button variant="outline" size="sm" className="w-full">
                      Learn More
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* NIST AI RMF */}
              <Card className="border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <CardHeader className="flex-grow">
                  <div className="h-12 w-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-teal-600" />
                  </div>
                  <div className="h-8 flex items-start mb-3">
                    <Badge variant="outline" className="w-fit text-xs">
                      AI Framework
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mb-2">NIST AI RMF</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed mb-4">
                    Operationalize the NIST AI Risk Management Framework with continuous monitoring. 
                    Govern, Map, Measure, and Manage AI risks with trustworthy AI practices.
                  </CardDescription>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">AI risk governance</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Trustworthy AI framework</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link href="/nist-ai-rmf">
                    <Button variant="outline" size="sm" className="w-full">
                      Learn More
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Compliance Value Proposition */}
            <Card className="bg-gray-900 text-white border-0">
              <CardContent className="p-8 md:p-10">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-3xl font-bold mb-4">
                      One Platform, Complete Compliance Coverage
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      Stop managing multiple vendors and solutions. LeakJar provides comprehensive credential 
                      monitoring that satisfies requirements across all major regulatory frameworks—from payment 
                      card security to healthcare privacy to emerging AI governance.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-blue-400 flex-shrink-0" />
                        <span className="text-gray-300">Single integration for multiple frameworks</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-blue-400 flex-shrink-0" />
                        <span className="text-gray-300">Audit-ready documentation and logging</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-blue-400 flex-shrink-0" />
                        <span className="text-gray-300">Stay current with evolving regulations</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="bg-white/10 rounded-lg p-6 mb-4">
                      <div className="text-center mb-4">
                        <div className="text-5xl font-bold text-blue-400 mb-2">$4.45M</div>
                        <p className="text-sm text-gray-300">Average cost of a compliance breach</p>
                      </div>
                      <div className="pt-4 border-t border-white/20">
                        <p className="text-xs text-gray-400 text-center">
                          IBM Cost of a Data Breach Report 2023
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/10 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-blue-400 mb-1">€35M</div>
                        <p className="text-xs text-gray-300">Max EU AI Act fine</p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-blue-400 mb-1">4%</div>
                        <p className="text-xs text-gray-300">Max GDPR revenue fine</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* View All Solutions CTA */}
            <div className="text-center mt-12">
              <Link href="/solutions">
                <Button size="lg" variant="outline" className="bg-white hover:bg-gray-50">
                  View All Compliance Solutions
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dig Deeper - Intelligence Gathering */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Dig Deeper to Uncover Real-World Data
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              LeakJar offers unmatched leaked data intelligence beyond the public internet and dark web, 
              delivering actionable insights through our proprietary collection process that harnesses a 
              <strong> global Human Intelligence (HUMINT) network</strong> and <strong>in-house data analysis expertise</strong>. 
              Our fully automated, 24/7 sensitive data gathering and analysis service empowers you to thwart 
              account takeovers and fortify your digital security posture.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="border-blue-200 bg-white">
              <CardHeader>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Comprehensive Data Collection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Continuous collection from unique sources, leveraging human intelligence and underground channels 
                  to process real-world data from the cyber underground.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-white">
              <CardHeader>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <AlertTriangle className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Early Breach Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Identify compromised credentials from the first attempt of an attack, with plaintext format 
                  enabling quick identification and immediate password resets.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-white">
              <CardHeader>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Proactive Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Instant notifications via dashboard, email, or RESTful API with detailed information and 
                  actionable recommendations for immediate response.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Data Processing Power */}
      <section className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Unmatched Data Processing,
              <br />
              <span className="text-blue-400">Hundreds of Gigabytes Daily</span>
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              LeakJar is a data processing powerhouse, analyzing hundreds of gigabytes of sensitive information 
              daily, including compromised accounts, passwords, IP addresses, and associated services. Our advanced 
              systems identify potential breaches <strong>before the data is widely shared on the dark web or public internet</strong>, 
              enabling you to take swift action against both known and unknown attacks.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/10 rounded-lg p-6">
                <Database className="h-10 w-10 text-blue-400 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Multi-Source Intelligence</h3>
                <p className="text-gray-300 text-sm">Underground forums, HUMINT networks, and proprietary data channels</p>
              </div>
              <div className="bg-white/10 rounded-lg p-6">
                <Lock className="h-10 w-10 text-blue-400 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Encrypted Storage</h3>
                <p className="text-gray-300 text-sm">All data securely encrypted and accessible only to authenticated customers</p>
              </div>
              <div className="bg-white/10 rounded-lg p-6">
                <Activity className="h-10 w-10 text-blue-400 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Continuous Monitoring</h3>
                <p className="text-gray-300 text-sm">24/7 automated analysis ensuring your defense stays ahead of threats</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How LeakJar Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A seamless four-step intelligence pipeline that keeps you protected 24/7
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="relative mb-16">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-14 w-14 bg-gray-900 text-white rounded-xl flex items-center justify-center font-bold text-xl">
                      1
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Collect Intelligence</h3>
                      <p className="text-sm text-gray-600">Continuous Monitoring</p>
                    </div>
                  </div>
                  <p className="text-lg text-gray-600 leading-relaxed mb-4">
                    Our global network gathers leaked credential data from underground forums, HUMINT operatives, 
                    and exclusive threat intelligence sources—data you won't find through traditional channels.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">Underground Forums</Badge>
                    <Badge variant="outline" className="text-xs">HUMINT Networks</Badge>
                    <Badge variant="outline" className="text-xs">Dark Web</Badge>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                        <Globe className="h-5 w-5 text-gray-700" />
                        <span className="text-sm font-medium text-gray-700">Global data sources</span>
                      </div>
                      <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                        <Eye className="h-5 w-5 text-gray-700" />
                        <span className="text-sm font-medium text-gray-700">Real-time collection</span>
                      </div>
                      <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                        <Lock className="h-5 w-5 text-gray-700" />
                        <span className="text-sm font-medium text-gray-700">Encrypted transfer</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Connecting line */}
              <div className="hidden md:block absolute left-1/2 -bottom-8 transform -translate-x-1/2">
                <div className="h-8 w-px bg-gradient-to-b from-gray-300 to-transparent"></div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative mb-16">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2">
                  <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                        <Zap className="h-5 w-5 text-gray-700" />
                        <span className="text-sm font-medium text-gray-700">Hybrid (AI + Human Experts) Analysis</span>
                      </div>
                      <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                        <Database className="h-5 w-5 text-gray-700" />
                        <span className="text-sm font-medium text-gray-700">Deduplication engine</span>
                      </div>
                      <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                        <Activity className="h-5 w-5 text-gray-700" />
                        <span className="text-sm font-medium text-gray-700">Data enrichment</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="order-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-14 w-14 bg-gray-900 text-white rounded-xl flex items-center justify-center font-bold text-xl">
                      2
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Process & Analyze</h3>
                      <p className="text-sm text-gray-600">Intelligent Processing</p>
                    </div>
                  </div>
                  <p className="text-lg text-gray-600 leading-relaxed mb-4">
                    Advanced algorithms process hundreds of gigabytes daily, extracting and enriching critical 
                    data points including credentials, IPs, timestamps, and breach context.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">100GB+ Daily</Badge>
                    <Badge variant="outline" className="text-xs">12+ Data Points</Badge>
                  </div>
                </div>
              </div>
              {/* Connecting line */}
              <div className="hidden md:block absolute left-1/2 -bottom-8 transform -translate-x-1/2">
                <div className="h-8 w-px bg-gradient-to-b from-gray-300 to-transparent"></div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative mb-16">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-14 w-14 bg-gray-900 text-white rounded-xl flex items-center justify-center font-bold text-xl">
                      3
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Match & Identify</h3>
                      <p className="text-sm text-gray-600">Precision Targeting</p>
                    </div>
                  </div>
                  <p className="text-lg text-gray-600 leading-relaxed mb-4">
                    Intelligent matching compares credentials against your organization's domains and email addresses, 
                    instantly flagging potential security threats requiring immediate attention.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">Domain Matching</Badge>
                    <Badge variant="outline" className="text-xs">Email Filtering</Badge>
                    <Badge variant="outline" className="text-xs">Risk Scoring</Badge>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                        <CheckCircle2 className="h-5 w-5 text-gray-700" />
                        <span className="text-sm font-medium text-gray-700">Automated matching</span>
                      </div>
                      <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                        <Shield className="h-5 w-5 text-gray-700" />
                        <span className="text-sm font-medium text-gray-700">Threat prioritization</span>
                      </div>
                      <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                        <AlertTriangle className="h-5 w-5 text-gray-700" />
                        <span className="text-sm font-medium text-gray-700">Risk assessment</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Connecting line */}
              <div className="hidden md:block absolute left-1/2 -bottom-8 transform -translate-x-1/2">
                <div className="h-8 w-px bg-gradient-to-b from-gray-300 to-transparent"></div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2">
                  <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                        <Activity className="h-5 w-5 text-gray-700" />
                        <span className="text-sm font-medium text-gray-700">Real-time alerts</span>
                      </div>
                      <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                        <Database className="h-5 w-5 text-gray-700" />
                        <span className="text-sm font-medium text-gray-700">Dashboard access</span>
                      </div>
                      <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                        <Zap className="h-5 w-5 text-gray-700" />
                        <span className="text-sm font-medium text-gray-700">API integration</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="order-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-14 w-14 bg-gray-900 text-white rounded-xl flex items-center justify-center font-bold text-xl">
                      4
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Alert & Respond</h3>
                      <p className="text-sm text-gray-600">Immediate Action</p>
                    </div>
                  </div>
                  <p className="text-lg text-gray-600 leading-relaxed mb-4">
                    Instant notifications through your preferred channel—dashboard, email, or RESTful API—with 
                    detailed breach information and actionable security recommendations.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">&lt;1hr Response</Badge>
                    <Badge variant="outline" className="text-xs">Multi-Channel</Badge>
                    <Badge variant="outline" className="text-xs">Actionable Intel</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gray-900 text-white py-24 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
              Protect Your Organization's<br />
              Most Vulnerable Asset
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
              Join security teams at <strong className="text-white">leading companies</strong> who rely on LeakJar to detect and respond 
              to compromised credentials <strong className="text-white">before they become breaches</strong>.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Link href="/auth/freetier" className="group">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 text-lg transition-all">
                  See Your Exposure Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-400" />
                <span>14-day free trial</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      </main>

      <SharedFooter />
      </div>
    </>
  );
}