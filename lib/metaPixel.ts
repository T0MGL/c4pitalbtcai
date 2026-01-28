/**
 * Meta Pixel (Facebook Pixel) - Production Ready Implementation
 *
 * Features:
 * - Type-safe event tracking
 * - Event deduplication with event_id
 * - Session-based duplicate prevention
 * - Configurable via environment variable
 * - Graceful fallback when Pixel is not configured
 */

// Get Pixel ID from environment variable
const META_PIXEL_ID = process.env.VITE_META_PIXEL_ID || '';

// Type definitions for Meta Pixel
declare global {
  interface Window {
    fbq: (
      action: 'init' | 'track' | 'trackCustom',
      eventOrId: string,
      params?: Record<string, unknown>,
      options?: { eventID?: string }
    ) => void;
    _fbq: unknown;
  }
}

// Standard Meta Pixel events
export type MetaStandardEvent =
  | 'PageView'
  | 'ViewContent'
  | 'Search'
  | 'AddToCart'
  | 'AddToWishlist'
  | 'InitiateCheckout'
  | 'AddPaymentInfo'
  | 'Purchase'
  | 'Lead'
  | 'CompleteRegistration'
  | 'Contact'
  | 'CustomizeProduct'
  | 'Donate'
  | 'FindLocation'
  | 'Schedule'
  | 'StartTrial'
  | 'SubmitApplication'
  | 'Subscribe';

// Event parameters interface
export interface MetaEventParams {
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  content_type?: string;
  contents?: Array<{ id: string; quantity: number }>;
  currency?: string;
  value?: number;
  num_items?: number;
  predicted_ltv?: number;
  search_string?: string;
  status?: string;
  // Custom params
  [key: string]: unknown;
}

// Session storage key for tracking fired events
const FIRED_EVENTS_KEY = 'meta_pixel_fired_events';

/**
 * Generate unique event ID for deduplication
 * Format: timestamp-random to ensure uniqueness
 */
const generateEventId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

/**
 * Get session ID (persists during browser session)
 */
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('meta_pixel_session_id');
  if (!sessionId) {
    sessionId = generateEventId();
    sessionStorage.setItem('meta_pixel_session_id', sessionId);
  }
  return sessionId;
};

/**
 * Check if an event has already been fired in this session
 * Used to prevent duplicate PageView, ViewContent, etc.
 */
const hasEventFired = (eventKey: string): boolean => {
  try {
    const firedEvents = JSON.parse(sessionStorage.getItem(FIRED_EVENTS_KEY) || '{}');
    return !!firedEvents[eventKey];
  } catch {
    return false;
  }
};

/**
 * Mark an event as fired for this session
 */
const markEventFired = (eventKey: string): void => {
  try {
    const firedEvents = JSON.parse(sessionStorage.getItem(FIRED_EVENTS_KEY) || '{}');
    firedEvents[eventKey] = Date.now();
    sessionStorage.setItem(FIRED_EVENTS_KEY, JSON.stringify(firedEvents));
  } catch {
    // Silent fail - tracking will still work, just might have duplicates
  }
};

/**
 * Check if Meta Pixel is initialized and available
 */
export const isPixelAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof window.fbq === 'function' && !!META_PIXEL_ID;
};

/**
 * Initialize Meta Pixel
 * Should be called once when the app loads
 */
export const initMetaPixel = (): void => {
  if (!META_PIXEL_ID) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Meta Pixel] No Pixel ID configured - tracking disabled');
    }
    return;
  }

  // Check if already initialized
  if (typeof window.fbq === 'function') {
    return;
  }

  // Meta Pixel base code (minified from official snippet)
  const f = window as unknown as { fbq: unknown; _fbq: unknown };
  const n = f.fbq = function (...args: unknown[]) {
    if ((n as { callMethod?: (...a: unknown[]) => void }).callMethod) {
      (n as { callMethod: (...a: unknown[]) => void }).callMethod(...args);
    } else {
      (n as { queue: unknown[] }).queue.push(args);
    }
  } as unknown as typeof window.fbq & { callMethod?: (...a: unknown[]) => void; queue: unknown[]; loaded: boolean; version: string };
  if (!f._fbq) f._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = '2.0';
  n.queue = [];

  // Load the pixel script
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  const firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode?.insertBefore(script, firstScript);

  // Initialize with Pixel ID
  window.fbq('init', META_PIXEL_ID);

  if (process.env.NODE_ENV === 'development') {
    console.log('[Meta Pixel] Initialized with ID:', META_PIXEL_ID);
  }
};

/**
 * Track a standard Meta Pixel event
 * @param event - Standard event name
 * @param params - Optional event parameters
 * @param options - Track options (unique: prevent duplicate fires)
 */
export const trackEvent = (
  event: MetaStandardEvent,
  params?: MetaEventParams,
  options?: { unique?: boolean }
): void => {
  // Skip if Pixel not available
  if (!isPixelAvailable()) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Meta Pixel] (DISABLED) Would track: ${event}`, params);
    }
    return;
  }

  // Check for unique events (prevent duplicates)
  const eventKey = options?.unique ? `${event}:${getSessionId()}` : null;
  if (eventKey && hasEventFired(eventKey)) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Meta Pixel] Skipping duplicate: ${event}`);
    }
    return;
  }

  // Generate event ID for deduplication with Conversions API
  const eventId = generateEventId();

  // Fire the event
  if (params) {
    window.fbq('track', event, params, { eventID: eventId });
  } else {
    window.fbq('track', event, {}, { eventID: eventId });
  }

  // Mark as fired if unique
  if (eventKey) {
    markEventFired(eventKey);
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Meta Pixel] Tracked: ${event}`, { eventId, params });
  }
};

/**
 * Track a custom event (not in standard events list)
 */
export const trackCustomEvent = (
  eventName: string,
  params?: MetaEventParams
): void => {
  if (!isPixelAvailable()) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Meta Pixel] (DISABLED) Would track custom: ${eventName}`, params);
    }
    return;
  }

  const eventId = generateEventId();
  window.fbq('trackCustom', eventName, params || {}, { eventID: eventId });

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Meta Pixel] Tracked custom: ${eventName}`, { eventId, params });
  }
};

// ============================================
// CONVENIENCE FUNCTIONS FOR COMMON EVENTS
// ============================================

/**
 * Track PageView - Should only fire once per page load
 */
export const trackPageView = (): void => {
  trackEvent('PageView', undefined, { unique: true });
};

/**
 * Track ViewContent - User views a key page/content
 */
export const trackViewContent = (params: {
  content_name: string;
  content_category?: string;
  value?: number;
  currency?: string;
}): void => {
  trackEvent('ViewContent', params, { unique: true });
};

/**
 * Track InitiateCheckout - User starts checkout/application process
 */
export const trackInitiateCheckout = (params?: {
  content_name?: string;
  value?: number;
  currency?: string;
  num_items?: number;
}): void => {
  trackEvent('InitiateCheckout', params, { unique: true });
};

/**
 * Track Lead - User expresses interest
 */
export const trackLead = (params?: {
  content_name?: string;
  content_category?: string;
  value?: number;
  currency?: string;
}): void => {
  trackEvent('Lead', params);
};

/**
 * Track CompleteRegistration - User completes a form/signup
 */
export const trackCompleteRegistration = (params?: {
  content_name?: string;
  status?: string;
  value?: number;
  currency?: string;
}): void => {
  trackEvent('CompleteRegistration', params);
};

/**
 * Track Purchase - User completes a purchase
 * Note: Use this when the user successfully submits and payment/conversion happens
 */
export const trackPurchase = (params: {
  value: number;
  currency: string;
  content_name?: string;
  content_ids?: string[];
  content_type?: string;
  num_items?: number;
}): void => {
  trackEvent('Purchase', params);
};

// ============================================
// FUNNEL-SPECIFIC TRACKING FOR THIS PROJECT
// ============================================

/**
 * Track form step completion
 * Custom event for tracking progress through multi-step forms
 */
export const trackFormStep = (step: number, stepName: string, totalSteps: number): void => {
  trackCustomEvent('FormStep', {
    step_number: step,
    step_name: stepName,
    total_steps: totalSteps,
    progress_percent: Math.round((step / totalSteps) * 100),
  });
};

/**
 * Track form open (InitiateCheckout equivalent for lead gen)
 */
export const trackFormOpen = (): void => {
  trackInitiateCheckout({
    content_name: 'Qualification Form',
    value: 997,
    currency: 'USD',
  });
};

/**
 * Track form submission success (Lead + CompleteRegistration)
 */
export const trackFormSubmission = (params: {
  name: string;
  capital: string;
  experience: string;
  isDownsell: boolean;
}): void => {
  const value = params.isDownsell ? 447 : 997;

  // Track as Lead
  trackLead({
    content_name: 'License Application',
    content_category: params.experience,
    value,
    currency: 'USD',
  });

  // Track as CompleteRegistration
  trackCompleteRegistration({
    content_name: 'Qualification Form',
    status: 'submitted',
    value,
    currency: 'USD',
  });
};

/**
 * Track downsell activation
 */
export const trackDownsellActivated = (): void => {
  trackCustomEvent('DownsellActivated', {
    content_name: 'Partial Scholarship',
    value: 447,
    currency: 'USD',
    discount_amount: 550,
  });
};
