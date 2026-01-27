import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ToastProvider } from "@/components/ui/toast";
import { Analytics } from "@vercel/analytics/react";
import { Analytics as GA4Analytics } from "@/components/analytics";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Enhanced metadata for SEO, AEO (Answer Engine Optimization), and GEO (Generative Engine Optimization)
 * 
 * Key optimizations:
 * - Comprehensive Open Graph for social sharing
 * - Twitter Card optimization
 * - Structured keywords targeting cybersecurity decision-makers
 * - Proper canonical URLs and alternate links
 * - AI crawler support via llms.txt files
 */
export const metadata: Metadata = {
  metadataBase: new URL('https://www.leakjar.com'),
  
  // Title configuration with brand consistency
  title: {
    default: "LeakJar - Proactive Credential Leak Monitoring & Breach Detection | Stop $4.45M Breaches",
    template: "%s | LeakJar - Credential Monitoring"
  },
  
  // Primary description optimized for search and AI engines
  description: "Monitor 60B+ leaked credentials in real-time. LeakJar detects compromised employee and customer accounts from data breaches 287 days faster than industry average, preventing account takeovers and saving $4.45M in breach costs. HUMINT-powered threat intelligence.",
  
  // Comprehensive keyword targeting for cybersecurity B2B market
  keywords: [
    // Primary keywords
    "credential monitoring",
    "data breach detection",
    "leaked credentials",
    "account takeover prevention",
    "breach intelligence platform",
    // Secondary keywords
    "cyber threat monitoring",
    "password leak detection",
    "HUMINT security intelligence",
    "dark web monitoring",
    "credential stuffing prevention",
    // Compliance keywords (high-value B2B)
    "PCI DSS 4.0 compliance",
    "NIST 800-63B compliance",
    "HIPAA credential monitoring",
    "GDPR security requirements",
    "CCPA reasonable security",
    // Long-tail keywords
    "enterprise credential security",
    "real-time breach alerts",
    "compromised password detection",
    "threat intelligence platform",
    "security compliance automation"
  ],
  
  // Author and publisher information
  authors: [
    { name: "SEW Inc.", url: "https://www.leakjar.com/about" },
    { name: "LeakJar Security Team" }
  ],
  creator: "SEW Inc.",
  publisher: "SEW Inc.",
  
  // Prevent auto-formatting of contact info
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  // Canonical and alternate URLs
  alternates: {
    canonical: "https://www.leakjar.com",
    languages: {
      'en-US': 'https://www.leakjar.com',
    },
  },
  
  // Enhanced Open Graph for social sharing and AI crawlers
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.leakjar.com",
    siteName: "LeakJar",
    title: "LeakJar - Stop Credential-Based Attacks | 60B+ Leaked Records Monitored",
    description: "Detect compromised credentials 287 days faster. Real-time alerts, HUMINT intelligence, and compliance support for PCI DSS, NIST, HIPAA, GDPR. Prevent the $4.45M average breach cost.",
    images: [
      {
        url: "https://www.leakjar.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "LeakJar - Enterprise Credential Monitoring Platform",
        type: "image/png",
      },
      {
        url: "https://www.leakjar.com/og-image-square.png",
        width: 600,
        height: 600,
        alt: "LeakJar Logo",
        type: "image/png",
      },
    ],
    countryName: "United States",
  },
  
  // Twitter Card optimization
  twitter: {
    card: "summary_large_image",
    site: "@leakjar",
    creator: "@leakjar",
    title: "LeakJar - Proactive Credential Leak Monitoring",
    description: "Monitor 60B+ leaked credentials. Detect compromised accounts 287 days faster than industry average. Real-time alerts, HUMINT intelligence.",
    images: {
      url: "https://www.leakjar.com/twitter-image.png",
      alt: "LeakJar - Credential Monitoring Platform",
    },
  },
  
  // Comprehensive robot directives
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
      noimageindex: false,
    },
  },
  
  // Search engine verification codes
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
  
  // App manifest for PWA
  manifest: "/manifest.json",
  
  // Category for app stores and directories
  category: "Security",
  
  // Classification metadata
  classification: "Business/Security",
  
  // Additional metadata for rich results
  other: {
    // AI/LLM information files (GEO optimization)
    'ai-content-declaration': 'human-written',
    'llms-txt': 'https://www.leakjar.com/llms.txt',
    
    // Business information for rich snippets
    'business:contact_data:street_address': 'San Francisco, CA',
    'business:contact_data:country_name': 'United States',
    
    // Product information
    'product:price:amount': '0',
    'product:price:currency': 'USD',
    'product:availability': 'in stock',
    
    // Security/trust signals
    'security': 'SOC 2 Type II Compliant',
  },
};

// Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <GA4Analytics />
        <Analytics />
        <ToastProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
