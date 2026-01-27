'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Check, ArrowRight, Zap, Building2 } from 'lucide-react';
import { SharedHeader } from '@/components/shared-header';
import { SharedFooter } from '@/components/shared-footer';
import { trackPricingPageViewed, trackBillingCycleToggled, trackPlanCtaClicked, type PlanName, type BillingCycle } from '@/lib/vercel-analytics';

// FAQ Structured Data for SEO
const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What's included in the Free tier?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The Free tier provides access to 1 monitored domain with limited results (latest 5 breach records). You can search for exposed credentials and receive email alerts. No credit card required—available automatically when you sign up."
      }
    },
    {
      "@type": "Question",
      "name": "What does 'limited results' mean?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Free tier users can view the latest 5 breach records for their monitored domain. Paid plans provide full access to all historical breach data and unlimited searches."
      }
    },
    {
      "@type": "Question",
      "name": "Can I upgrade or downgrade my plan?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated accordingly."
      }
    },
    {
      "@type": "Question",
      "name": "Do paid plans include API access?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Pro plan includes API access with 10,000 calls/month. Enterprise plans include unlimited API access. All plans provide full API documentation and webhook support."
      }
    },
    {
      "@type": "Question",
      "name": "What payment methods do you accept?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We accept all major credit cards (Visa, Mastercard, American Express) and ACH transfers for Enterprise customers. Annual plans can also be invoiced."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use the Free tier for my business?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely! The Free tier is perfect for small organizations or evaluation purposes. You get access to all features with limited results (latest 5 breach records). Upgrade anytime as your needs grow."
      }
    }
  ]
};

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  // Track pricing page view on mount
  useEffect(() => {
    trackPricingPageViewed();
  }, []);

  const handleBillingToggle = (cycle: 'monthly' | 'annual') => {
    setBillingCycle(cycle);
    trackBillingCycleToggled(cycle);
  };

  const handlePlanClick = (planName: PlanName) => {
    trackPlanCtaClicked(planName, billingCycle);
  };

  const pricingTiers = [
    {
      name: 'Free Trial',
      description: 'Experience full platform capabilities with sample data',
      monthlyPrice: 0,
      annualPrice: 0,
      badge: 'Start Here',
      icon: Shield,
      features: [
        '1 monitored domain',
        'Full feature access',
        'Limited results (latest 5 records)',
        'Email search functionality',
        'Dashboard access',
        'Email alerts',
        'Perfect for small organizations',
        'No credit card required',
      ],
      cta: 'Get Started Free',
      ctaVariant: 'default' as const,
      popular: true,
    },
    {
      name: 'Pro',
      description: 'Full features with unlimited breach data',
      monthlyPrice: 499,
      annualPrice: 4990,
      badge: 'Most Popular',
      icon: Zap,
      features: [
        '1 monitored domain',
        'Full feature access',
        'Full breach data (unlimited)',
        'Real-time email alerts',
        'Dashboard & analytics',
        'Detailed forensic reports',
        'API access (10,000 calls/month)',
        'Email, ticket, and AI support',
        'Custom integrations',
      ],
      cta: 'Start Protection Now',
      ctaVariant: 'outline' as const,
      popular: false,
    },
    {
      name: 'Enterprise',
      description: 'For large organizations requiring custom solutions',
      monthlyPrice: null,
      annualPrice: null,
      badge: 'Custom',
      icon: Building2,
      features: [
        'Unlimited monitored domains',
        'Unlimited credential checks',
        'Multi-channel alerts (Email, Webhook)',
        'Dashboard & analytics',
        'Instant alert delivery',
        'Unlimited API access',
        'Custom HUMINT investigations',
        'SLA guarantees',
        '24/7 priority support (e-mail, ticket, and AI support)',
      ],
      cta: 'Contact Sales',
      ctaVariant: 'outline' as const,
      popular: false,
    },
  ];

  return (
    <>
      {/* FAQ Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header Navigation */}
        <SharedHeader />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 tracking-tight leading-[1.1]">
            Start Free,<br />
            Scale When Ready
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Begin with <strong>full-featured monitoring</strong> at no cost. 
            Upgrade anytime for <strong>unlimited breach intelligence</strong> and enterprise features.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-gray-100 rounded-full p-1 mb-12">
            <button
              onClick={() => handleBillingToggle('monthly')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => handleBillingToggle('annual')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                billingCycle === 'annual'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annual
              <span className="ml-2 text-xs text-green-600 font-semibold">Save 17%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pricingTiers.map((tier) => {
            const Icon = tier.icon;
            const price = billingCycle === 'monthly' ? tier.monthlyPrice : tier.annualPrice;
            const displayPrice = price === 0 ? 'Free' : price !== null ? `$${price}` : 'Custom';
            const priceLabel = (price !== null && price > 0) ? (billingCycle === 'annual' ? '/year' : '/month') : '';

            return (
              <Card
                key={tier.name}
                className={`relative flex flex-col ${
                  tier.popular
                    ? 'border-2 border-blue-600 shadow-xl scale-105'
                    : 'border-gray-200 hover:border-gray-300 transition-all'
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className={tier.popular ? 'bg-blue-600' : 'bg-gray-700'}>
                      {tier.badge}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8 pt-8">
                  <div className="mx-auto mb-4 h-12 w-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Icon className="h-6 w-6 text-gray-700" />
                  </div>
                  <CardTitle className="text-2xl mb-2">{tier.name}</CardTitle>
                  <CardDescription className="text-sm min-h-[40px]">
                    {tier.description}
                  </CardDescription>
                  
                  <div className="mt-6">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-5xl font-bold text-gray-900">{displayPrice}</span>
                      {price !== null && price > 0 && <span className="text-gray-600">{priceLabel}</span>}
                    </div>
                    {price !== null && price > 0 && billingCycle === 'annual' && (
                      <p className="text-sm text-gray-500 mt-2">
                        ${Math.round(price / 12)}/month billed annually
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="flex-grow flex flex-col">
                  <ul className="space-y-3 mb-8 flex-grow">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full mt-auto ${
                      tier.popular ? 'bg-blue-600 hover:bg-blue-700' : ''
                    }`}
                    variant={tier.ctaVariant}
                    asChild
                    onClick={() => handlePlanClick(tier.name as PlanName)}
                  >
                    <Link href={tier.name === 'Enterprise' ? '/contact' : '/auth/signup'}>
                      {tier.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

      </section>

      {/* Why Start Free Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why Start with Our Free Tier?
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Evaluate LeakJar's full capabilities with real data from your organization before committing to a paid plan.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <Check className="h-10 w-10 text-green-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">No Risk</h3>
                <p className="text-sm text-gray-600">Full features with limited results. No credit card. Cancel anytime.</p>
              </div>
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <Shield className="h-10 w-10 text-blue-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Real Evaluation</h3>
                <p className="text-sm text-gray-600">See actual exposed credentials from your domain in minutes.</p>
              </div>
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <Zap className="h-10 w-10 text-purple-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Upgrade Anytime</h3>
                <p className="text-sm text-gray-600">Seamlessly upgrade when you need full historical data.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What's included in the Free tier?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    The Free tier provides access to 1 monitored domain with limited results (latest 5 breach records). 
                    You can search for exposed credentials and receive email alerts. No credit card required—available automatically when you sign up.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What does "limited results" mean?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Free tier users can view the latest 5 breach records for their monitored domain. 
                    Paid plans provide full access to all historical breach data and unlimited searches.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I upgrade or downgrade my plan?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                    and billing is prorated accordingly.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Do paid plans include API access?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Yes! Pro plan includes API access with 10,000 calls/month. Enterprise plans include unlimited API access. 
                    All plans provide full API documentation and webhook support.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We accept all major credit cards (Visa, Mastercard, American Express) and ACH transfers for 
                    Enterprise customers. Annual plans can also be invoiced.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I use the Free tier for my business?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Absolutely! The Free tier is perfect for small organizations or evaluation purposes. You get access to 
                    all features with limited results (latest 5 breach records). Upgrade anytime as your needs grow.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Building2 className="h-12 w-12 mx-auto mb-6 text-blue-400" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Need a Custom Solution?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Enterprise plans include custom HUMINT investigations, dedicated support, 
              and SLA guarantees tailored to your organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-300">
                  Contact Sales
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-300">
                  Start Free Tier
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SharedFooter />
      </div>
    </>
  );
}

