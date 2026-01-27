/**
 * LeakJar SEO Configuration
 * Comprehensive SEO, AEO (Answer Engine Optimization), and GEO (Generative Engine Optimization) settings
 * 
 * Key cybersecurity and threat intelligence keywords based on market research:
 * - Primary: credential monitoring, data breach detection, leaked credentials
 * - Secondary: dark web monitoring, account takeover prevention, threat intelligence
 * - Compliance: PCI DSS, NIST 800-63B, HIPAA, GDPR, CCPA, EU AI Act
 * - Long-tail: compromised password detection, credential stuffing prevention
 */

export const siteConfig = {
  name: 'LeakJar',
  legalName: 'LeakJar by SEW Inc.',
  tagline: 'Proactive Credential Leak Monitoring & Breach Detection',
  description: 'Monitor 60B+ leaked credentials in real-time. LeakJar detects compromised employee and customer accounts from data breaches, preventing account takeovers before they happen.',
  url: 'https://www.leakjar.com',
  ogImage: 'https://www.leakjar.com/og-image.png',
  twitterHandle: '@leakjar',
  twitterCreator: '@leakjar',
  
  // Company information for structured data
  company: {
    name: 'SEW Inc.',
    alternateName: 'SEWORKS',
    foundingDate: '2013',
    location: {
      city: 'San Francisco',
      state: 'California',
      country: 'USA',
      postalCode: '94107',
    },
    contact: {
      email: 'support@leakjar.com',
      salesEmail: 'sales@leakjar.com',
      phone: '+1-415-555-0123',
    },
    social: {
      twitter: 'https://twitter.com/leakjar',
      linkedin: 'https://linkedin.com/company/leakjar',
      github: 'https://github.com/SEWORKSINC',
    },
  },

  // Key statistics for trust signals (update regularly)
  stats: {
    totalRecords: '60B+',
    dailyAdditions: '11M+',
    responseTime: '<1hr',
    satisfactionRate: '98%',
    renewalRate: '95%',
    yearsInBusiness: '12+',
  },
};

/**
 * Primary keywords for SEO targeting
 * Organized by search intent and buyer journey stage
 */
export const keywordStrategy = {
  // Awareness Stage - Problem Recognition
  awareness: [
    'what is credential monitoring',
    'how to detect data breaches',
    'leaked credentials meaning',
    'dark web credential exposure',
    'account takeover attack prevention',
    'credential stuffing explained',
  ],
  
  // Consideration Stage - Solution Evaluation
  consideration: [
    'credential monitoring service',
    'data breach detection platform',
    'leaked password checker for business',
    'dark web monitoring solution',
    'enterprise credential security',
    'breach intelligence service',
  ],
  
  // Decision Stage - Vendor Selection
  decision: [
    'LeakJar pricing',
    'LeakJar vs HaveIBeenPwned',
    'best credential monitoring platform',
    'enterprise breach detection tool',
    'PCI DSS credential monitoring compliance',
    'NIST 800-63B password monitoring',
  ],
  
  // Compliance-Focused (High-Value B2B)
  compliance: [
    'PCI DSS 4.0 requirement 8.3.10',
    'NIST SP 800-63B compliance',
    'HIPAA credential monitoring',
    'GDPR Article 32 security',
    'CCPA reasonable security measures',
    'EU AI Act data poisoning prevention',
  ],
  
  // Industry-Specific Long-tail
  industry: [
    'healthcare credential breach prevention',
    'financial services dark web monitoring',
    'SaaS account takeover prevention',
    'gaming credential security',
    'e-commerce password breach detection',
    'fintech compliance monitoring',
  ],
};

/**
 * Page-specific metadata configuration
 */
export const pageMetadata = {
  home: {
    title: 'LeakJar - Proactive Credential Leak Monitoring & Breach Detection',
    description: 'Monitor 60B+ leaked credentials in real-time. LeakJar detects compromised employee and customer accounts from data breaches, preventing account takeovers 287 days faster than industry average.',
    keywords: [
      'credential monitoring',
      'data breach detection',
      'leaked credentials',
      'account takeover prevention',
      'breach intelligence',
      'cyber threat monitoring',
      'password leak detection',
      'HUMINT security',
      'dark web monitoring',
      'credential stuffing prevention',
    ],
  },
  
  features: {
    title: 'Features - Advanced Threat Intelligence & Breach Detection',
    description: 'Stop credential-based attacks with LeakJar. HUMINT networks, 24/7 monitoring, real-time alerts, and actionable intelligence from 60B+ breach records. Detect compromised accounts before exploitation.',
    keywords: [
      'credential breach detection',
      'HUMINT security intelligence',
      'real-time threat monitoring',
      'account takeover prevention',
      'credential stuffing defense',
      'dark web monitoring',
      'breach intelligence platform',
      'password leak alerts',
    ],
  },
  
  pricing: {
    title: 'Pricing - Credential Monitoring Plans Starting Free',
    description: 'Start free with full-featured credential monitoring. Upgrade for unlimited breach data, API access, and enterprise features. Plans from $0 to custom enterprise solutions.',
    keywords: [
      'credential monitoring pricing',
      'breach detection cost',
      'dark web monitoring plans',
      'enterprise security pricing',
      'LeakJar pricing',
    ],
  },
  
  about: {
    title: 'About Us - White Hat Hacker Driven Cybersecurity',
    description: 'Learn about LeakJar\'s mission to protect organizations with offensive security expertise. 98%+ satisfaction rate, backed by Qualcomm Ventures. 25+ years of white hat hacking experience.',
    keywords: [
      'LeakJar company',
      'SEWORKS cybersecurity',
      'white hat hackers',
      'offensive security experts',
      'San Francisco cybersecurity startup',
    ],
  },
  
  solutions: {
    title: 'Compliance Solutions - Meet Industry Security & Privacy Standards',
    description: 'Comprehensive leaked credential monitoring solutions for regulatory compliance. Meet PCI DSS, NIST, HIPAA, CCPA/CPRA, GDPR, and AI security requirements with one platform.',
    keywords: [
      'compliance solutions',
      'PCI DSS compliance',
      'NIST compliance',
      'HIPAA compliance',
      'CCPA compliance',
      'GDPR compliance',
      'EU AI Act',
      'regulatory compliance',
    ],
  },
  
  pciCompliance: {
    title: 'PCI DSS 4.0 Compliance - Meet Requirement 8.3.10 with LeakJar',
    description: 'Achieve PCI DSS 4.0 Requirement 8.3.10 compliance with automated credential monitoring. Block compromised passwords, pass QSA audits, and avoid $100K+ fines. Mandatory since March 31, 2025.',
    keywords: [
      'PCI DSS 4.0 compliance',
      'requirement 8.3.10',
      'compromised password blocking',
      'payment card security',
      'QSA audit preparation',
    ],
  },
  
  nistCompliance: {
    title: 'NIST SP 800-63B Compliance - Credential Monitoring for Federal Standards',
    description: 'Meet NIST SP 800-63B Section 5.1.1.2 requirements for credential monitoring. Align with Cybersecurity Framework 2.0 and federal security standards.',
    keywords: [
      'NIST 800-63B compliance',
      'NIST CSF 2.0',
      'federal credential standards',
      'digital identity guidelines',
    ],
  },
  
  hipaaCompliance: {
    title: 'HIPAA Compliance - Protect ePHI with Credential Monitoring',
    description: 'Meet HIPAA Security Rule 164.308(a)(1)(ii)(A) with comprehensive credential monitoring. Protect ePHI, complete your Security Risk Analysis, and avoid willful neglect penalties.',
    keywords: [
      'HIPAA compliance',
      'ePHI protection',
      'healthcare security',
      'Security Risk Analysis',
      'HIPAA breach prevention',
    ],
  },
  
  gdprCompliance: {
    title: 'GDPR Article 32 Compliance - State of the Art Security',
    description: 'Meet GDPR Article 32 "state of the art" security requirements with credential monitoring. Avoid 4% revenue fines from EU regulators with proactive breach detection.',
    keywords: [
      'GDPR compliance',
      'Article 32',
      'EU data protection',
      'personal data security',
    ],
  },
  
  ccpaCompliance: {
    title: 'CCPA/CPRA Compliance - Demonstrate Reasonable Security',
    description: 'Demonstrate "reasonable security" under CCPA/CPRA with credential monitoring. Protect against class-action lawsuits and California consumer privacy violations.',
    keywords: [
      'CCPA compliance',
      'CPRA compliance',
      'California privacy law',
      'reasonable security standard',
    ],
  },
  
  aiActCompliance: {
    title: 'EU AI Act Compliance - Prevent Data Poisoning Attacks',
    description: 'Meet EU AI Act Article 15 robustness requirements. Prevent data poisoning attacks on high-risk AI systems. Avoid €35M maximum fines with credential monitoring.',
    keywords: [
      'EU AI Act compliance',
      'Article 15',
      'data poisoning prevention',
      'AI system security',
    ],
  },
  
  nistAiRmf: {
    title: 'NIST AI RMF Compliance - Trustworthy AI Risk Management',
    description: 'Operationalize the NIST AI Risk Management Framework with continuous credential monitoring. Govern, Map, Measure, and Manage AI risks effectively.',
    keywords: [
      'NIST AI RMF',
      'AI risk management',
      'trustworthy AI',
      'AI governance',
    ],
  },
  
  developer: {
    title: 'API Documentation - Integrate Credential Monitoring',
    description: 'Complete API documentation for LeakJar credential monitoring. RESTful API with JSON responses, webhook integrations, and comprehensive SDKs for JavaScript and Python.',
    keywords: [
      'credential monitoring API',
      'breach detection API',
      'security API integration',
      'LeakJar API documentation',
    ],
  },
  
  contact: {
    title: 'Contact Sales - Enterprise Credential Monitoring Solutions',
    description: 'Contact LeakJar sales for enterprise solutions. Custom HUMINT investigations, SLA guarantees, and unlimited API access for large organizations.',
    keywords: [
      'contact LeakJar',
      'enterprise security sales',
      'custom credential monitoring',
    ],
  },
  
  openSearch: {
    title: 'Credential Search - Check Your Company\'s Breach Exposure',
    description: 'Search 60B+ leaked credentials to check if your company domain is exposed. Free instant results, no registration required. Protect against account takeovers.',
    keywords: [
      'credential search',
      'breach exposure check',
      'leaked password search',
      'domain breach check',
    ],
  },
};

/**
 * FAQ content for AEO (Answer Engine Optimization)
 * Structured for featured snippets and voice search
 */
export const faqContent = {
  general: [
    {
      question: 'What is credential monitoring?',
      answer: 'Credential monitoring is a cybersecurity service that continuously scans for leaked usernames and passwords associated with your organization. When compromised credentials are detected in data breaches, dark web marketplaces, or threat actor networks, security teams are alerted so they can force password resets before attackers exploit the exposure.',
    },
    {
      question: 'How does LeakJar detect leaked credentials?',
      answer: 'LeakJar uses multiple intelligence sources including Human Intelligence (HUMINT) networks, underground forums, dark web marketplaces, and proprietary data collection systems. Our platform processes hundreds of gigabytes of breach data daily, identifying compromised credentials and alerting customers within 1 hour of detection.',
    },
    {
      question: 'What makes LeakJar different from HaveIBeenPwned?',
      answer: 'LeakJar provides enterprise-grade credential monitoring with exclusive HUMINT intelligence sources that go beyond publicly disclosed breaches. We offer real-time alerts, detailed forensic data (IP addresses, URLs, timestamps), compliance reporting, and API integration—capabilities designed for security teams managing organizational risk.',
    },
    {
      question: 'How many leaked credentials does LeakJar monitor?',
      answer: 'LeakJar monitors over 60 billion leaked credential records, with approximately 11 million new records added daily. Our database includes credentials from data breaches, stealer malware, phishing campaigns, and targeted attacks that never appear in public breach databases.',
    },
  ],
  
  compliance: [
    {
      question: 'Does LeakJar help with PCI DSS 4.0 compliance?',
      answer: 'Yes, LeakJar directly addresses PCI DSS 4.0 Requirement 8.3.10, which mandates blocking authentication attempts using compromised passwords. This requirement became mandatory on March 31, 2025. LeakJar provides automated credential monitoring and audit-ready documentation for QSA assessments.',
    },
    {
      question: 'How does LeakJar support NIST SP 800-63B compliance?',
      answer: 'LeakJar helps organizations meet NIST SP 800-63B Section 5.1.1.2, which requires verifiers to check passwords against lists of commonly-used, expected, or compromised values. Our real-time monitoring ensures compromised credentials are detected and blocked before attackers can exploit them.',
    },
    {
      question: 'Is LeakJar HIPAA compliant?',
      answer: 'LeakJar helps healthcare organizations meet HIPAA Security Rule requirements by providing credential monitoring that protects ePHI access. Our platform supports the Security Risk Analysis requirement under 164.308(a)(1)(ii)(A) by identifying compromised credentials that could provide unauthorized access to patient data.',
    },
  ],
  
  pricing: [
    {
      question: 'What\'s included in LeakJar\'s free tier?',
      answer: 'The Free tier includes 1 monitored domain, full feature access, and visibility into the latest 5 breach records. You get email search functionality, dashboard access, and email alerts—no credit card required. Perfect for small organizations or evaluating the platform.',
    },
    {
      question: 'How much does LeakJar cost?',
      answer: 'LeakJar offers a free tier with limited results, Pro plans starting at $499/month (or $4,990/year for 17% savings), and custom Enterprise pricing. All paid plans include unlimited breach data access, API integration, and priority support.',
    },
    {
      question: 'Does LeakJar offer API access?',
      answer: 'Yes, Pro plans include API access with 10,000 calls per month. Enterprise plans offer unlimited API access. All API plans include comprehensive documentation, webhook support, and SDK libraries for JavaScript and Python.',
    },
  ],
  
  technical: [
    {
      question: 'How quickly does LeakJar alert on new breaches?',
      answer: 'LeakJar delivers alerts within 1 hour of detecting compromised credentials—287 days faster than the industry average breach detection time of 287 days (IBM Security Report). Real-time monitoring and immediate notifications enable rapid incident response.',
    },
    {
      question: 'What information is provided in LeakJar alerts?',
      answer: 'LeakJar alerts include comprehensive forensic details: compromised email addresses, plaintext or hashed passwords, source IP addresses, geolocation data, affected URLs, timestamps, and breach source information. This enables security teams to assess impact and take immediate action.',
    },
    {
      question: 'Can LeakJar integrate with our SIEM?',
      answer: 'Yes, LeakJar offers RESTful API integration and webhook notifications that connect with popular SIEM platforms including Splunk, Microsoft Sentinel, IBM QRadar, and others. Enterprise plans include custom integration support.',
    },
  ],
};

/**
 * Structured data templates for JSON-LD
 */
export const structuredDataTemplates = {
  organization: {
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
  },
  
  website: {
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
  },
  
  softwareApplication: {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'LeakJar',
    applicationCategory: 'SecurityApplication',
    operatingSystem: 'Web',
    description: 'Enterprise credential monitoring and breach detection platform',
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
      'Real-time breach alerts',
      'HUMINT intelligence network',
      'PCI DSS 4.0 compliance',
      'NIST SP 800-63B compliance',
      'RESTful API access',
      '24/7 monitoring',
    ],
  },
};

/**
 * Generate FAQ Schema for AEO
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate Breadcrumb Schema
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate HowTo Schema for process pages (AEO optimization)
 */
export function generateHowToSchema(
  name: string,
  description: string,
  steps: Array<{ name: string; text: string; url?: string }>
) {
  return {
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
}

/**
 * Generate Article Schema for content pages
 */
export function generateArticleSchema(
  headline: string,
  description: string,
  datePublished: string,
  dateModified: string,
  author?: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    author: {
      '@type': 'Organization',
      name: author || 'LeakJar Security Team',
    },
    publisher: {
      '@id': 'https://www.leakjar.com/#organization',
    },
    datePublished,
    dateModified,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://www.leakjar.com',
    },
  };
}

/**
 * Generate Service Schema for solution pages
 */
export function generateServiceSchema(
  name: string,
  description: string,
  provider: string = 'LeakJar'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: {
      '@type': 'Organization',
      name: provider,
      '@id': 'https://www.leakjar.com/#organization',
    },
    serviceType: 'Cybersecurity',
    areaServed: {
      '@type': 'Place',
      name: 'Worldwide',
    },
  };
}

/**
 * Speakable Schema for voice search optimization (AEO)
 */
export function generateSpeakableSchema(
  cssSelectors: string[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: cssSelectors,
    },
  };
}

export default siteConfig;
