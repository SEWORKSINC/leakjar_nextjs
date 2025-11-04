import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ToastProvider } from "@/components/ui/toast";
import { Analytics } from "@/components/analytics";
import { SkipToContent } from "@/components/skip-to-content";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.leakjar.com'),
  title: {
    default: "LeakJar - Proactive Credential Leak Monitoring & Breach Detection",
    template: "%s | LeakJar"
  },
  description: "Monitor 60B+ leaked credentials in real-time. LeakJar detects compromised employee and customer accounts from data breaches, preventing account takeovers before they happen.",
  keywords: [
    "credential monitoring",
    "data breach detection",
    "leaked credentials",
    "account takeover prevention",
    "breach intelligence",
    "cyber threat monitoring",
    "password leak detection",
    "HUMINT security",
    "dark web monitoring",
    "credential stuffing prevention"
  ],
  authors: [{ name: "SEW Inc." }],
  creator: "SEW Inc.",
  publisher: "SEW Inc.",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.leakjar.com",
    siteName: "LeakJar",
    title: "LeakJar - Proactive Credential Leak Monitoring & Breach Detection",
    description: "Monitor 60B+ leaked credentials in real-time. Detect compromised accounts before attackers exploit them.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LeakJar - Credential Monitoring Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LeakJar - Proactive Credential Leak Monitoring",
    description: "Monitor 60B+ leaked credentials. Detect compromised accounts before attackers exploit them.",
    images: ["/twitter-image.png"],
    creator: "@leakjar",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // other: "your-other-verification-code",
  },
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
        <SkipToContent />
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
