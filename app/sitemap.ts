import { MetadataRoute } from 'next';

/**
 * Comprehensive sitemap for LeakJar
 * Optimized for SEO, AEO, and GEO
 * 
 * Priority Guidelines:
 * - 1.0: Homepage
 * - 0.9: Core product/conversion pages (features, pricing, signup)
 * - 0.8: Important content pages (about, solutions, compliance)
 * - 0.7: Developer/documentation pages
 * - 0.6: Utility pages (login, contact)
 * - 0.5: Secondary content pages
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.leakjar.com';
  const currentDate = new Date().toISOString();

  return [
    // =========================================================================
    // CORE PAGES (Highest Priority)
    // =========================================================================
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/features`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/auth/signup`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/auth/freetier`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },

    // =========================================================================
    // COMPANY & CONTENT PAGES (High Priority)
    // =========================================================================
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/solutions`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },

    // =========================================================================
    // COMPLIANCE PAGES (High Priority - B2B SEO)
    // These pages target high-value compliance-related search queries
    // =========================================================================
    {
      url: `${baseUrl}/pci-compliance`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/nist-compliance`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/hipaa-compliance`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gdpr-compliance`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ccpa-compliance`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ai-act-compliance`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/nist-ai-rmf`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },

    // =========================================================================
    // DEVELOPER PAGES (Medium-High Priority)
    // =========================================================================
    {
      url: `${baseUrl}/developer`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/api-docs`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },

    // =========================================================================
    // PUBLIC SEARCH FEATURE (Medium Priority)
    // =========================================================================
    {
      url: `${baseUrl}/open-search`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.7,
    },

    // =========================================================================
    // AUTHENTICATION PAGES (Medium Priority)
    // =========================================================================
    {
      url: `${baseUrl}/auth/login`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },

    // =========================================================================
    // AI/LLM FILES (GEO Optimization)
    // These files are for AI crawlers and language models
    // =========================================================================
    {
      url: `${baseUrl}/llms.txt`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/llms-full.txt`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];
}
