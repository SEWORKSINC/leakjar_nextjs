import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LeakJar - Check if Your Company Email is Compromised | Free Breach Monitoring',
  description: 'Instantly check if your company appears in our database of 60+ billion leaked credentials. Free breach monitoring, real-time alerts, and comprehensive security intelligence.',
  keywords: 'leaked credentials, data breach monitoring, credential leak detection, email breach check, cybersecurity, breach alerts, dark web monitoring',
  authors: [{ name: 'LeakJar', url: 'https://leakjar.com' }],
  creator: 'LeakJar',
  publisher: 'SEW Inc.',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://leakjar.com/hello',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://leakjar.com/hello',
    siteName: 'LeakJar',
    title: 'Is Your Company Email Already Compromised? | LeakJar',
    description: 'Check instantly if your company appears in our database of 60+ billion leaked credentials. Free breach monitoring with real-time alerts.',
    images: [
      {
        url: 'https://leakjar.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LeakJar - Credential Breach Monitoring Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Is Your Company Email Already Compromised? | LeakJar',
    description: 'Check instantly if your company appears in 60B+ leaked credentials. Free breach monitoring.',
    images: ['https://leakjar.com/twitter-image.png'],
    creator: '@leakjar',
  },
};

export default function HelloLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

