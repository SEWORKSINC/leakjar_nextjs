import type { Metadata } from 'next';

/**
 * Pricing page metadata optimized for SEO, AEO, and GEO
 * 
 * Target keywords:
 * - credential monitoring pricing
 * - breach detection cost
 * - dark web monitoring plans
 * - enterprise security pricing
 * - LeakJar pricing
 */
export const pricingMetadata: Metadata = {
  title: 'Pricing - Credential Monitoring Plans Starting Free | LeakJar',
  description: 'Start free with full-featured credential monitoring. Monitor leaked credentials from 60B+ records. Pro plans from $499/mo with unlimited breach data, API access, and enterprise features. No credit card required for free tier.',
  
  keywords: [
    'credential monitoring pricing',
    'breach detection cost',
    'dark web monitoring pricing',
    'enterprise security pricing',
    'LeakJar pricing',
    'leaked credential monitoring cost',
    'data breach detection plans',
    'HUMINT intelligence pricing',
    'security compliance pricing',
    'free credential monitoring',
  ],
  
  alternates: {
    canonical: 'https://www.leakjar.com/pricing',
  },
  
  openGraph: {
    title: 'LeakJar Pricing - Start Free, Scale When Ready',
    description: 'Full-featured credential monitoring starting free. Pro plans from $499/mo with unlimited breach data and API access.',
    url: 'https://www.leakjar.com/pricing',
    type: 'website',
    images: [
      {
        url: 'https://www.leakjar.com/og-pricing.png',
        width: 1200,
        height: 630,
        alt: 'LeakJar Pricing Plans',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'LeakJar Pricing - Credential Monitoring Plans',
    description: 'Free tier available. Pro plans from $499/mo. Enterprise custom pricing.',
    images: ['https://www.leakjar.com/twitter-pricing.png'],
  },
};

// FAQ Schema data for pricing page (AEO optimization)
export const pricingFAQs = [
  {
    question: "What's included in LeakJar's free tier?",
    answer: "The Free tier provides access to 1 monitored domain with limited results (latest 5 breach records). You can search for exposed credentials and receive email alerts. No credit card required—available automatically when you sign up."
  },
  {
    question: "What does 'limited results' mean?",
    answer: "Free tier users can view the latest 5 breach records for their monitored domain. Paid plans provide full access to all historical breach data and unlimited searches."
  },
  {
    question: "Can I upgrade or downgrade my plan?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated accordingly."
  },
  {
    question: "Do paid plans include API access?",
    answer: "Yes! Pro plan includes API access with 10,000 calls/month. Enterprise plans include unlimited API access. All plans provide full API documentation and webhook support."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express) and ACH transfers for Enterprise customers. Annual plans can also be invoiced."
  },
  {
    question: "Can I use the Free tier for my business?",
    answer: "Absolutely! The Free tier is perfect for small organizations or evaluation purposes. You get access to all features with limited results (latest 5 breach records). Upgrade anytime as your needs grow."
  },
  {
    question: "How much does LeakJar cost per year?",
    answer: "LeakJar Pro costs $4,990/year when billed annually (17% savings vs monthly). Enterprise pricing is custom based on your organization's needs. Contact sales for a quote."
  },
  {
    question: "Is there a money-back guarantee?",
    answer: "We offer a 14-day free trial with full features. For paid plans, we provide a 30-day money-back guarantee if you're not satisfied with the service."
  },
];
