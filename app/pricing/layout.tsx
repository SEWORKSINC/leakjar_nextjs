import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Pricing - Start Free, No Credit Card Required",
  description: "LeakJar pricing: Start Free with full features. Pro plan $499/month. Enterprise custom solutions. Monitor leaked credentials with 60B+ breach records. No credit card required for free tier.",
  keywords: [
    "credential monitoring pricing",
    "breach detection cost",
    "free security monitoring",
    "enterprise security pricing",
    "account takeover prevention pricing"
  ],
  openGraph: {
    title: "LeakJar Pricing - Start Free, Upgrade Anytime",
    description: "Free tier with full features. Pro $499/mo. Enterprise custom. Monitor 60B+ leaked credentials.",
    url: "https://www.leakjar.com/pricing",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LeakJar Pricing - Start Free",
    description: "Free tier available. Pro $499/mo. Enterprise custom solutions.",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

