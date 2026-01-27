/**
 * Vercel Analytics Custom Events Utility
 * 
 * This module provides typed helper functions for tracking custom events
 * using Vercel Web Analytics. Events are tracked client-side using the
 * track() function from @vercel/analytics.
 * 
 * Reference: https://vercel.com/docs/analytics/custom-events
 */

import { track } from '@vercel/analytics';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Event names used throughout the application
 * Keeping event names centralized prevents typos and enables easy refactoring
 */
export const EventNames = {
  // Authentication Events
  SIGNUP_STARTED: 'Signup Started',
  SIGNUP_SUCCESS: 'Signup Success',
  SIGNUP_ERROR: 'Signup Error',
  LOGIN_SUCCESS: 'Login Success',
  LOGIN_ERROR: 'Login Error',
  LOGOUT: 'Logout',

  // Contact & Support Events
  CONTACT_FORM_SUBMITTED: 'Contact Form Submitted',
  CONTACT_FORM_ERROR: 'Contact Form Error',

  // Pricing & Billing Events
  PRICING_PAGE_VIEWED: 'Pricing Page Viewed',
  BILLING_CYCLE_TOGGLED: 'Billing Cycle Toggled',
  PLAN_CTA_CLICKED: 'Plan CTA Clicked',

  // Domain Management Events
  DOMAIN_ADDED: 'Domain Added',
  DOMAIN_DELETED: 'Domain Deleted',
  DOMAIN_VERIFICATION_STARTED: 'Domain Verification Started',

  // API Key Events
  API_KEY_CREATED: 'API Key Created',
  API_KEY_DELETED: 'API Key Deleted',
  API_KEY_COPIED: 'API Key Copied',

  // Dashboard Events
  DASHBOARD_VIEWED: 'Dashboard Viewed',
  DATA_EXPORTED: 'Data Exported',
  CHART_INTERACTED: 'Chart Interacted',

  // Developer/Documentation Events
  DOC_SECTION_VIEWED: 'Doc Section Viewed',
  CODE_SAMPLE_COPIED: 'Code Sample Copied',
  API_DOCS_LINK_CLICKED: 'API Docs Link Clicked',

  // Search & Data Events
  SEARCH_PERFORMED: 'Search Performed',
  BREACH_DATA_VIEWED: 'Breach Data Viewed',
  FILTER_APPLIED: 'Filter Applied',

  // Navigation Events
  CTA_CLICKED: 'CTA Clicked',
  FEATURE_EXPLORED: 'Feature Explored',
} as const;

// ============================================================================
// Authentication Events
// ============================================================================

/**
 * Track when a user starts the signup process
 */
export function trackSignupStarted(location?: string) {
  track(EventNames.SIGNUP_STARTED, {
    location: location || 'unknown',
  });
}

/**
 * Track successful signup
 */
export function trackSignupSuccess() {
  track(EventNames.SIGNUP_SUCCESS);
}

/**
 * Track signup error
 */
export function trackSignupError(errorType: string) {
  track(EventNames.SIGNUP_ERROR, {
    errorType,
  });
}

/**
 * Track successful login
 */
export function trackLoginSuccess(method: string = 'email') {
  track(EventNames.LOGIN_SUCCESS, {
    method,
  });
}

/**
 * Track login error
 */
export function trackLoginError(errorType: string) {
  track(EventNames.LOGIN_ERROR, {
    errorType,
  });
}

/**
 * Track user logout
 */
export function trackLogout() {
  track(EventNames.LOGOUT);
}

// ============================================================================
// Contact & Support Events
// ============================================================================

/**
 * Track contact form submission
 */
export function trackContactFormSubmitted(category: string) {
  track(EventNames.CONTACT_FORM_SUBMITTED, {
    category,
  });
}

/**
 * Track contact form error
 */
export function trackContactFormError(errorType: string) {
  track(EventNames.CONTACT_FORM_ERROR, {
    errorType,
  });
}

// ============================================================================
// Pricing & Billing Events
// ============================================================================

/**
 * Track when pricing page is viewed
 */
export function trackPricingPageViewed() {
  track(EventNames.PRICING_PAGE_VIEWED);
}

/**
 * Track billing cycle toggle (monthly/annual)
 */
export function trackBillingCycleToggled(cycle: 'monthly' | 'annual') {
  track(EventNames.BILLING_CYCLE_TOGGLED, {
    cycle,
  });
}

/**
 * Track when a plan CTA is clicked
 */
export function trackPlanCtaClicked(planName: string, billingCycle: 'monthly' | 'annual') {
  track(EventNames.PLAN_CTA_CLICKED, {
    planName,
    billingCycle,
  });
}

// ============================================================================
// Domain Management Events
// ============================================================================

/**
 * Track when a domain is added
 */
export function trackDomainAdded(domainType: 'URL' | 'EMAIL') {
  track(EventNames.DOMAIN_ADDED, {
    domainType,
  });
}

/**
 * Track when a domain is deleted
 */
export function trackDomainDeleted(domainType: 'URL' | 'EMAIL') {
  track(EventNames.DOMAIN_DELETED, {
    domainType,
  });
}

/**
 * Track when domain verification is started
 */
export function trackDomainVerificationStarted(domainType: 'URL' | 'EMAIL') {
  track(EventNames.DOMAIN_VERIFICATION_STARTED, {
    domainType,
  });
}

// ============================================================================
// API Key Events
// ============================================================================

/**
 * Track when an API key is created
 */
export function trackApiKeyCreated() {
  track(EventNames.API_KEY_CREATED);
}

/**
 * Track when an API key is deleted
 */
export function trackApiKeyDeleted() {
  track(EventNames.API_KEY_DELETED);
}

/**
 * Track when an API key is copied
 */
export function trackApiKeyCopied() {
  track(EventNames.API_KEY_COPIED);
}

// ============================================================================
// Dashboard Events
// ============================================================================

/**
 * Track dashboard view with metrics
 */
export function trackDashboardViewed(domainsCount: number, totalBreaches: number) {
  track(EventNames.DASHBOARD_VIEWED, {
    domainsCount,
    totalBreaches,
  });
}

/**
 * Track data export
 */
export function trackDataExported(format: string, recordCount: number) {
  track(EventNames.DATA_EXPORTED, {
    format,
    recordCount,
  });
}

/**
 * Track chart interaction
 */
export function trackChartInteracted(chartType: string, action: string) {
  track(EventNames.CHART_INTERACTED, {
    chartType,
    action,
  });
}

// ============================================================================
// Developer/Documentation Events
// ============================================================================

/**
 * Track when a documentation section is viewed
 */
export function trackDocSectionViewed(sectionId: string) {
  track(EventNames.DOC_SECTION_VIEWED, {
    sectionId,
  });
}

/**
 * Track when a code sample is copied
 */
export function trackCodeSampleCopied(language: string) {
  track(EventNames.CODE_SAMPLE_COPIED, {
    language,
  });
}

/**
 * Track API docs link click
 */
export function trackApiDocsLinkClicked(linkTarget: string) {
  track(EventNames.API_DOCS_LINK_CLICKED, {
    linkTarget,
  });
}

// ============================================================================
// Search & Data Events
// ============================================================================

/**
 * Track search performed
 */
export function trackSearchPerformed(searchType: string, hasResults: boolean) {
  track(EventNames.SEARCH_PERFORMED, {
    searchType,
    hasResults,
  });
}

/**
 * Track breach data viewed
 */
export function trackBreachDataViewed(domain: string, recordCount: number) {
  track(EventNames.BREACH_DATA_VIEWED, {
    domain,
    recordCount,
  });
}

/**
 * Track filter applied
 */
export function trackFilterApplied(filterType: string, filterValue: string) {
  track(EventNames.FILTER_APPLIED, {
    filterType,
    filterValue,
  });
}

// ============================================================================
// Navigation Events
// ============================================================================

/**
 * Track CTA button click
 */
export function trackCtaClicked(ctaName: string, location: string) {
  track(EventNames.CTA_CLICKED, {
    ctaName,
    location,
  });
}

/**
 * Track feature exploration
 */
export function trackFeatureExplored(featureName: string) {
  track(EventNames.FEATURE_EXPLORED, {
    featureName,
  });
}

// ============================================================================
// Generic Event Tracking
// ============================================================================

/**
 * Generic event tracking function for custom events not covered above
 * @param eventName - The name of the event
 * @param properties - Optional properties to include with the event
 */
export function trackCustomEvent(eventName: string, properties?: Record<string, string | number | boolean | null>) {
  track(eventName, properties);
}
