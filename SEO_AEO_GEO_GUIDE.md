# LeakJar SEO, AEO, and GEO Implementation Guide

This document outlines the comprehensive Search Engine Optimization (SEO), Answer Engine Optimization (AEO), and Generative Engine Optimization (GEO) implementation for LeakJar.

## Table of Contents

1. [Overview](#overview)
2. [SEO Implementation](#seo-implementation)
3. [AEO Implementation](#aeo-implementation)
4. [GEO Implementation](#geo-implementation)
5. [Technical Implementation](#technical-implementation)
6. [Keyword Strategy](#keyword-strategy)
7. [Structured Data](#structured-data)
8. [Maintenance & Updates](#maintenance--updates)

---

## Overview

### What is SEO, AEO, and GEO?

- **SEO (Search Engine Optimization)**: Optimizing content for traditional search engines like Google and Bing
- **AEO (Answer Engine Optimization)**: Optimizing for featured snippets, voice search, and direct answer boxes
- **GEO (Generative Engine Optimization)**: Optimizing for AI assistants like ChatGPT, Claude, Perplexity, and Google Gemini

### Why All Three Matter for LeakJar

As a B2B cybersecurity company, LeakJar's target audience (CISOs, security engineers, compliance officers) increasingly uses:
- Traditional search for research and vendor evaluation
- Voice assistants for quick answers
- AI chatbots for technical questions and recommendations

---

## SEO Implementation

### Files Modified/Created

| File | Purpose |
|------|---------|
| `lib/seo-config.ts` | Central SEO configuration with keywords, metadata, and schema generators |
| `app/layout.tsx` | Enhanced metadata with comprehensive Open Graph and Twitter Cards |
| `app/sitemap.ts` | Expanded sitemap with all public and compliance pages |
| `public/robots.txt` | Updated with AI bot directives and proper crawl rules |
| `public/manifest.json` | PWA manifest for app stores and mobile |

### Key SEO Elements

#### 1. Metadata Configuration

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    default: "LeakJar - Proactive Credential Leak Monitoring & Breach Detection",
    template: "%s | LeakJar - Credential Monitoring"
  },
  description: "Monitor 60B+ leaked credentials in real-time...",
  keywords: [...], // Comprehensive keyword list
  // ... additional metadata
};
```

#### 2. Keyword Strategy

**Primary Keywords (High Volume, High Competition)**
- credential monitoring
- data breach detection
- leaked credentials
- account takeover prevention

**Secondary Keywords (Medium Volume, Medium Competition)**
- dark web monitoring
- password leak detection
- breach intelligence platform
- HUMINT security

**Compliance Keywords (Low Volume, High Intent, High Value)**
- PCI DSS 4.0 compliance
- NIST 800-63B compliance
- HIPAA credential monitoring
- GDPR Article 32 security

**Long-tail Keywords (Low Volume, Low Competition, High Conversion)**
- how to detect compromised credentials
- enterprise credential security solution
- real-time breach alert system

---

## AEO Implementation

### What is AEO?

Answer Engine Optimization focuses on:
- Featured snippets (position zero)
- Voice search results
- People Also Ask boxes
- Direct answers in search results

### Implementation Strategy

#### 1. FAQ Schema

Every key page includes FAQ schema for featured snippets:

```typescript
// Example from pci-compliance/page.tsx
const pciFAQs = [
  {
    question: "What is PCI DSS 4.0 Requirement 8.3.10?",
    answer: "PCI DSS 4.0 Requirement 8.3.10 mandates that organizations..."
  },
  // ... more FAQs
];
```

#### 2. Speakable Schema

For voice search optimization:

```json
{
  "@type": "WebPage",
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": ["h1", ".hero-description", ".key-stats"]
  }
}
```

#### 3. Direct Answer Content

Content structured for direct answers:
- Questions as H2/H3 headings
- Concise, factual first sentences
- Numbered lists and bullet points
- Clear definitions

### FAQ Content Library

Located in `lib/seo-config.ts`:

```typescript
export const faqContent = {
  general: [...],      // General product questions
  compliance: [...],   // Compliance-related questions
  pricing: [...],      // Pricing and plans questions
  technical: [...],    // Technical implementation questions
};
```

---

## GEO Implementation

### What is GEO?

Generative Engine Optimization ensures AI assistants (ChatGPT, Claude, Perplexity, Gemini) can:
- Accurately describe LeakJar
- Recommend LeakJar for relevant queries
- Provide correct pricing and feature information
- Link to appropriate pages

### Implementation

#### 1. llms.txt Files

Two files created for AI crawlers:

**`public/llms.txt`** - Summary information
- Company overview
- Key statistics
- Primary features
- FAQ content
- Contact information

**`public/llms-full.txt`** - Comprehensive documentation
- Detailed product capabilities
- Technical specifications
- Compliance framework details
- API documentation summary
- Competitive comparison

#### 2. robots.txt AI Directives

```
# OpenAI GPT crawlers
User-agent: GPTBot
Allow: /
Allow: /llms.txt
Allow: /llms-full.txt

# Anthropic Claude
User-agent: anthropic-ai
Allow: /
Allow: /llms.txt

# Perplexity AI
User-agent: PerplexityBot
Allow: /
Allow: /llms.txt
```

#### 3. Structured Data for AI

Comprehensive JSON-LD schemas that AI can parse:
- Organization schema with full details
- Product/Service schemas
- FAQ schemas
- HowTo schemas for processes

---

## Technical Implementation

### Structured Data Components

**`components/seo/structured-data.tsx`**

Reusable components for structured data:

```typescript
// Usage example
<StructuredData
  pageType="home"
  breadcrumbs={[
    { name: "Home", url: "https://www.leakjar.com" }
  ]}
  faqs={generalFAQs}
/>
```

Available components:
- `StructuredData` - Main schema component
- `Breadcrumbs` - Breadcrumb navigation with schema
- `FAQSection` - FAQ section with schema
- `HowToSchema` - Process/guide schema
- `SpeakableSchema` - Voice search optimization

### Schema Generators

Located in `lib/seo-config.ts`:

```typescript
// Generate FAQ schema
generateFAQSchema(faqs: Array<{ question: string; answer: string }>)

// Generate breadcrumb schema
generateBreadcrumbSchema(items: Array<{ name: string; url: string }>)

// Generate HowTo schema
generateHowToSchema(name: string, description: string, steps: Array<...>)

// Generate Article schema
generateArticleSchema(headline: string, description: string, dates: {...})

// Generate Service schema
generateServiceSchema(name: string, description: string)
```

---

## Keyword Strategy

### Target Audience Segments

1. **Security Engineers/Analysts**
   - Keywords: credential monitoring API, breach detection integration, SIEM integration
   - Content: Technical documentation, API guides

2. **CISOs/Security Directors**
   - Keywords: enterprise security platform, threat intelligence, risk management
   - Content: ROI calculators, case studies, compliance guides

3. **Compliance Officers**
   - Keywords: PCI DSS compliance, NIST compliance, HIPAA security
   - Content: Compliance guides, audit preparation, regulatory updates

4. **IT Managers**
   - Keywords: password security, account protection, data breach prevention
   - Content: Implementation guides, best practices

### Keyword Mapping by Page

| Page | Primary Keywords | Secondary Keywords |
|------|-----------------|-------------------|
| Home | credential monitoring, breach detection | dark web monitoring, account takeover |
| Features | threat intelligence, HUMINT | real-time alerts, forensic data |
| Pricing | credential monitoring pricing | security platform cost |
| PCI Compliance | PCI DSS 4.0, requirement 8.3.10 | password breach, QSA audit |
| NIST Compliance | NIST 800-63B, federal security | credential screening |
| HIPAA Compliance | HIPAA security, ePHI protection | healthcare breach |

---

## Structured Data

### Schema Types Implemented

1. **Organization** - Company information
2. **WebSite** - Site-wide search action
3. **WebPage** - Individual page metadata
4. **SoftwareApplication** - Product details with pricing
5. **FAQPage** - Frequently asked questions
6. **HowTo** - Process explanations
7. **Article** - Blog/content pages
8. **Service** - Service offerings
9. **BreadcrumbList** - Navigation hierarchy
10. **SpeakableSpecification** - Voice search content

### Validation

Test structured data at:
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)

---

## Maintenance & Updates

### Regular Tasks

**Weekly**
- Update `llms.txt` with any product changes
- Review search console for new keyword opportunities
- Check for broken links in sitemap

**Monthly**
- Update statistics in structured data (total records, etc.)
- Review and update FAQ content
- Analyze competitor keyword strategies

**Quarterly**
- Full SEO audit
- Update compliance page content for regulatory changes
- Review AI assistant responses about LeakJar

### Monitoring Tools

1. **Google Search Console** - Search performance, indexing
2. **Google Analytics** - Traffic, conversions
3. **Ahrefs/SEMrush** - Keyword rankings, backlinks
4. **Perplexity/ChatGPT** - Test AI responses about LeakJar

### Key Metrics

- Organic traffic growth
- Keyword rankings for target terms
- Featured snippet appearances
- AI assistant mention accuracy
- Conversion rate from organic traffic

---

## File Reference

| File | Description |
|------|-------------|
| `lib/seo-config.ts` | Central SEO configuration |
| `components/seo/structured-data.tsx` | Reusable schema components |
| `app/layout.tsx` | Root metadata configuration |
| `app/sitemap.ts` | XML sitemap generator |
| `public/robots.txt` | Crawler directives |
| `public/llms.txt` | AI assistant summary |
| `public/llms-full.txt` | AI assistant full documentation |
| `public/manifest.json` | PWA manifest |
| `app/pricing/metadata.ts` | Pricing page SEO config |

---

## Contact

For SEO-related questions or updates:
- **Technical**: Development team
- **Content**: Marketing team
- **Strategy**: Ryan Lee / Min Hong

---

*Last Updated: January 26, 2026*
