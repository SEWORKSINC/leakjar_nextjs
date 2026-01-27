'use client';

import { usePathname } from 'next/navigation';
import { siteConfig, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo-config';

/**
 * Structured Data Component for SEO, AEO, and GEO
 * 
 * This component renders JSON-LD structured data for:
 * - Organization schema
 * - Website schema
 * - Breadcrumb navigation
 * - FAQ content (AEO)
 * - Product/Service information
 */

interface StructuredDataProps {
  pageType?: 'home' | 'product' | 'service' | 'faq' | 'article' | 'organization';
  breadcrumbs?: Array<{ name: string; url: string }>;
  faqs?: Array<{ question: string; answer: string }>;
  article?: {
    headline: string;
    description: string;
    datePublished: string;
    dateModified: string;
    author?: string;
  };
  service?: {
    name: string;
    description: string;
  };
  additionalSchemas?: object[];
}

export function StructuredData({
  pageType = 'home',
  breadcrumbs,
  faqs,
  article,
  service,
  additionalSchemas = [],
}: StructuredDataProps) {
  const pathname = usePathname();
  
  // Base schemas always included
  const schemas: object[] = [];
  
  // Organization schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://www.leakjar.com/#organization',
    name: 'LeakJar',
    alternateName: 'SEW Inc.',
    url: 'https://www.leakjar.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.leakjar.com/logo.png',
      width: 512,
      height: 512,
    },
    foundingDate: '2013',
    founder: {
      '@type': 'Person',
      name: 'Min Pyo Hong',
      jobTitle: 'Founder & CEO',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'San Francisco',
      addressRegion: 'CA',
      addressCountry: 'USA',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'Customer Support',
        email: 'support@leakjar.com',
        availableLanguage: ['English'],
      },
      {
        '@type': 'ContactPoint',
        contactType: 'Sales',
        email: 'sales@leakjar.com',
        availableLanguage: ['English'],
      },
    ],
    sameAs: [
      'https://twitter.com/leakjar',
      'https://linkedin.com/company/leakjar',
      'https://github.com/SEWORKSINC',
    ],
  };
  
  // Website schema with search action
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://www.leakjar.com/#website',
    url: 'https://www.leakjar.com',
    name: 'LeakJar',
    description: 'Proactive Credential Leak Monitoring & Breach Detection Platform',
    publisher: {
      '@id': 'https://www.leakjar.com/#organization',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.leakjar.com/open-search/{search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
  
  // Software Application schema
  const softwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'LeakJar',
    applicationCategory: 'SecurityApplication',
    operatingSystem: 'Web',
    description: 'Enterprise credential monitoring and breach detection platform with 60B+ leaked credential records',
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: '0',
      highPrice: '4990',
      priceCurrency: 'USD',
      offerCount: '3',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '150',
      bestRating: '5',
      worstRating: '1',
    },
    featureList: [
      '60B+ credential records monitored',
      'Real-time breach alerts in <1 hour',
      'HUMINT intelligence network',
      'PCI DSS 4.0 compliance support',
      'NIST SP 800-63B compliance',
      'HIPAA compliance support',
      'RESTful API access',
      '24/7 monitoring',
    ],
  };
  
  // Always include organization schema on homepage
  if (pageType === 'home') {
    schemas.push(organizationSchema);
    schemas.push(websiteSchema);
    schemas.push(softwareApplicationSchema);
  }
  
  // Add breadcrumb schema if provided
  if (breadcrumbs && breadcrumbs.length > 0) {
    schemas.push(generateBreadcrumbSchema(breadcrumbs));
  }
  
  // Add FAQ schema for AEO (Answer Engine Optimization)
  if (faqs && faqs.length > 0) {
    schemas.push(generateFAQSchema(faqs));
  }
  
  // Add article schema
  if (article) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.headline,
      description: article.description,
      author: {
        '@type': 'Organization',
        name: article.author || 'LeakJar Security Team',
      },
      publisher: {
        '@id': 'https://www.leakjar.com/#organization',
      },
      datePublished: article.datePublished,
      dateModified: article.dateModified,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://www.leakjar.com${pathname}`,
      },
    });
  }
  
  // Add service schema
  if (service) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.name,
      description: service.description,
      provider: {
        '@type': 'Organization',
        name: 'LeakJar',
        '@id': 'https://www.leakjar.com/#organization',
      },
      serviceType: 'Cybersecurity',
      areaServed: {
        '@type': 'Place',
        name: 'Worldwide',
      },
    });
  }
  
  // Add any additional custom schemas
  schemas.push(...additionalSchemas);
  
  // Combine all schemas into a graph
  const graphSchema = {
    '@context': 'https://schema.org',
    '@graph': schemas,
  };
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graphSchema) }}
    />
  );
}

/**
 * Breadcrumb component with both UI and structured data
 */
interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const breadcrumbSchema = generateBreadcrumbSchema(
    items.map(item => ({ name: item.name, url: `https://www.leakjar.com${item.href}` }))
  );
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <nav aria-label="Breadcrumb" className={`text-sm ${className}`}>
        <ol className="flex items-center space-x-2">
          {items.map((item, index) => (
            <li key={item.href} className="flex items-center">
              {index > 0 && <span className="mx-2 text-gray-400">/</span>}
              {index === items.length - 1 ? (
                <span className="text-gray-600" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <a
                  href={item.href}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {item.name}
                </a>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

/**
 * FAQ Section Component with AEO-optimized structured data
 */
interface FAQSectionProps {
  title?: string;
  faqs: Array<{ question: string; answer: string }>;
  className?: string;
}

export function FAQSection({ title = 'Frequently Asked Questions', faqs, className = '' }: FAQSectionProps) {
  const faqSchema = generateFAQSchema(faqs);
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <section className={`py-12 ${className}`} aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-3xl font-bold mb-8 text-center">
          {title}
        </h2>
        <div className="space-y-6 max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                {faq.question}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

/**
 * HowTo Schema Component for process/guide pages
 */
interface HowToStep {
  name: string;
  text: string;
  url?: string;
}

interface HowToSchemaProps {
  name: string;
  description: string;
  steps: HowToStep[];
}

export function HowToSchema({ name, description, steps }: HowToSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      url: step.url,
    })),
  };
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Speakable Schema for voice search optimization (AEO)
 */
interface SpeakableSchemaProps {
  cssSelectors: string[];
  pageUrl: string;
}

export function SpeakableSchema({ cssSelectors, pageUrl }: SpeakableSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: pageUrl,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: cssSelectors,
    },
  };
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default StructuredData;
