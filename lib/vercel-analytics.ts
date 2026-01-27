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
// Configuration
// ============================================================================

const isDev = process.env.NODE_ENV === 'development';
const DEBUG_ANALYTICS = process.env.NEXT_PUBLIC_DEBUG_ANALYTICS === 'true';

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

/**
 * Strict type definitions for event properties
 */
export type PlanName = 'Free Trial' | 'Pro' | 'Enterprise';
export type BillingCycle = 'monthly' | 'annual';
export type DomainType = 'URL' | 'EMAIL';
export type LoginMethod = 'email' | 'google' | 'github' | 'sso';

/**
 * Standardized error codes for authentication events
 * Prevents PII leakage in error tracking
 */
export type SignupErrorCode = 
  | 'email_exists'
  | 'invalid_email'
  | 'password_too_short'
  | 'passwords_mismatch'
  | 'network_error'
  | 'rate_limited'
  | 'unknown_error';

export type LoginErrorCode =
  | 'invalid_credentials'
  | 'account_locked'
  | 'email_not_verified'
  | 'no_session'
  | 'network_error'
  | 'unknown_error';

export type ContactErrorCode =
  | 'validation_error'
  | 'network_error'
  | 'rate_limited'
  | 'unknown_error';

// ============================================================================
// Safe Track Wrapper with Error Handling & Debug Mode
// ============================================================================

/**
 * Safely track an event with error handling
 * - In development: logs to console instead of sending
 * - In production: silently fails if tracking errors (analytics shouldn't break UX)
 */
function safeTrack(eventName: string, properties?: Record<string, string | number | boolean | null>) {
  // Debug mode - log to console
  if (isDev || DEBUG_ANALYTICS) {
    console.log('📊 [Analytics]', eventName, properties || '');
    if (isDev) {
      return; // Don't send events in development
    }
  }

  try {
    track(eventName, properties);
  } catch (error) {
    // Silent fail - analytics should never break user experience
    if (DEBUG_ANALYTICS) {
      console.warn('⚠️ [Analytics] Tracking failed:', eventName, error);
    }
  }
}

// ============================================================================
// Throttle Utility for High-Frequency Events
// ============================================================================

/**
 * Creates a throttled version of a function
 * Useful for scroll events, resize events, etc.
 */
export function createThrottledTracker<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number = 200
): T {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return ((...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;

    if (timeSinceLastCall >= delay) {
      lastCall = now;
      fn(...args);
    } else if (!timeoutId) {
      // Schedule a call for the end of the throttle period
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        timeoutId = null;
        fn(...args);
      }, delay - timeSinceLastCall);
    }
  }) as T;
}

// ============================================================================
// Error Code Mapper
// ============================================================================

/**
 * Maps raw error messages to standardized error codes
 * Prevents PII from being sent to analytics
 */
export function mapSignupError(errorMessage: string): SignupErrorCode {
  const message = errorMessage.toLowerCase();
  
  if (message.includes('already') || message.includes('exists') || message.includes('registered')) {
    return 'email_exists';
  }
  if (message.includes('invalid') && message.includes('email')) {
    return 'invalid_email';
  }
  if (message.includes('password') && (message.includes('short') || message.includes('length') || message.includes('character'))) {
    return 'password_too_short';
  }
  if (message.includes('match') || message.includes('mismatch')) {
    return 'passwords_mismatch';
  }
  if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
    return 'network_error';
  }
  if (message.includes('rate') || message.includes('limit') || message.includes('too many')) {
    return 'rate_limited';
  }
  
  return 'unknown_error';
}

export function mapLoginError(errorMessage: string): LoginErrorCode {
  const message = errorMessage.toLowerCase();
  
  if (message.includes('invalid') || message.includes('incorrect') || message.includes('wrong')) {
    return 'invalid_credentials';
  }
  if (message.includes('locked') || message.includes('disabled') || message.includes('blocked')) {
    return 'account_locked';
  }
  if (message.includes('verify') || message.includes('confirm') || message.includes('verification')) {
    return 'email_not_verified';
  }
  if (message.includes('session') || message.includes('no_session')) {
    return 'no_session';
  }
  if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
    return 'network_error';
  }
  
  return 'unknown_error';
}

// ============================================================================
// Authentication Events
// ============================================================================

/**
 * Track when a user starts the signup process
 */
export function trackSignupStarted(location?: string) {
  safeTrack(EventNames.SIGNUP_STARTED, {
    location: location || 'unknown',
  });
}

/**
 * Track successful signup
 */
export function trackSignupSuccess() {
  safeTrack(EventNames.SIGNUP_SUCCESS);
}

/**
 * Track signup error with sanitized error code
 * @param errorCode - Standardized error code (no PII)
 */
export function trackSignupError(errorCode: SignupErrorCode) {
  safeTrack(EventNames.SIGNUP_ERROR, {
    errorCode,
  });
}

/**
 * Track successful login
 * @param method - Authentication method used
 */
export function trackLoginSuccess(method: LoginMethod = 'email') {
  safeTrack(EventNames.LOGIN_SUCCESS, {
    method,
  });
}

/**
 * Track login error with sanitized error code
 * @param errorCode - Standardized error code (no PII)
 */
export function trackLoginError(errorCode: LoginErrorCode) {
  safeTrack(EventNames.LOGIN_ERROR, {
    errorCode,
  });
}

/**
 * Track user logout
 */
export function trackLogout() {
  safeTrack(EventNames.LOGOUT);
}

// ============================================================================
// Contact & Support Events
// ============================================================================

/**
 * Track contact form submission
 */
export function trackContactFormSubmitted(category: string) {
  safeTrack(EventNames.CONTACT_FORM_SUBMITTED, {
    category,
  });
}

/**
 * Track contact form error
 */
export function trackContactFormError(errorCode: ContactErrorCode) {
  safeTrack(EventNames.CONTACT_FORM_ERROR, {
    errorCode,
  });
}

// ============================================================================
// Pricing & Billing Events
// ============================================================================

/**
 * Track when pricing page is viewed
 */
export function trackPricingPageViewed() {
  safeTrack(EventNames.PRICING_PAGE_VIEWED);
}

/**
 * Track billing cycle toggle (monthly/annual)
 */
export function trackBillingCycleToggled(cycle: BillingCycle) {
  safeTrack(EventNames.BILLING_CYCLE_TOGGLED, {
    cycle,
  });
}

/**
 * Track when a plan CTA is clicked
 */
export function trackPlanCtaClicked(planName: PlanName, billingCycle: BillingCycle) {
  safeTrack(EventNames.PLAN_CTA_CLICKED, {
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
export function trackDomainAdded(domainType: DomainType) {
  safeTrack(EventNames.DOMAIN_ADDED, {
    domainType,
  });
}

/**
 * Track when a domain is deleted
 */
export function trackDomainDeleted(domainType: DomainType) {
  safeTrack(EventNames.DOMAIN_DELETED, {
    domainType,
  });
}

/**
 * Track when domain verification is started
 */
export function trackDomainVerificationStarted(domainType: DomainType) {
  safeTrack(EventNames.DOMAIN_VERIFICATION_STARTED, {
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
  safeTrack(EventNames.API_KEY_CREATED);
}

/**
 * Track when an API key is deleted
 */
export function trackApiKeyDeleted() {
  safeTrack(EventNames.API_KEY_DELETED);
}

/**
 * Track when an API key is copied
 */
export function trackApiKeyCopied() {
  safeTrack(EventNames.API_KEY_COPIED);
}

// ============================================================================
// Dashboard Events
// ============================================================================

/**
 * Track dashboard view with metrics
 */
export function trackDashboardViewed(domainsCount: number, totalBreaches: number) {
  safeTrack(EventNames.DASHBOARD_VIEWED, {
    domainsCount,
    totalBreaches,
  });
}

/**
 * Track data export
 */
export function trackDataExported(format: string, recordCount: number) {
  safeTrack(EventNames.DATA_EXPORTED, {
    format,
    recordCount,
  });
}

/**
 * Track chart interaction
 */
export function trackChartInteracted(chartType: string, action: string) {
  safeTrack(EventNames.CHART_INTERACTED, {
    chartType,
    action,
  });
}

// ============================================================================
// Developer/Documentation Events
// ============================================================================

/**
 * Track when a documentation section is viewed
 * Note: Use createThrottledTracker() wrapper for scroll-based tracking
 */
export function trackDocSectionViewed(sectionId: string) {
  safeTrack(EventNames.DOC_SECTION_VIEWED, {
    sectionId,
  });
}

/**
 * Track when a code sample is copied
 */
export function trackCodeSampleCopied(language: string) {
  safeTrack(EventNames.CODE_SAMPLE_COPIED, {
    language,
  });
}

/**
 * Track API docs link click
 */
export function trackApiDocsLinkClicked(linkTarget: string) {
  safeTrack(EventNames.API_DOCS_LINK_CLICKED, {
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
  safeTrack(EventNames.SEARCH_PERFORMED, {
    searchType,
    hasResults,
  });
}

/**
 * Track breach data viewed
 */
export function trackBreachDataViewed(domain: string, recordCount: number) {
  safeTrack(EventNames.BREACH_DATA_VIEWED, {
    domain,
    recordCount,
  });
}

/**
 * Track filter applied
 */
export function trackFilterApplied(filterType: string, filterValue: string) {
  safeTrack(EventNames.FILTER_APPLIED, {
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
  safeTrack(EventNames.CTA_CLICKED, {
    ctaName,
    location,
  });
}

/**
 * Track feature exploration
 */
export function trackFeatureExplored(featureName: string) {
  safeTrack(EventNames.FEATURE_EXPLORED, {
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
  safeTrack(eventName, properties);
}
