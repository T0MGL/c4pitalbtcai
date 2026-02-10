const META_PIXEL_ID = '1194541592872537';
declare global {
  interface Window {
    fbq: (
      action: 'init' | 'track',
      eventOrId: string,
      params?: Record<string, unknown>
    ) => void;
    _fbq: unknown;
  }
}

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
  [key: string]: unknown;
}

const FIRED_EVENTS_KEY = 'meta_pixel_fired_events';

const generateEventId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('meta_pixel_session_id');
  if (!sessionId) {
    sessionId = generateEventId();
    sessionStorage.setItem('meta_pixel_session_id', sessionId);
  }
  return sessionId;
};

const hasEventFired = (eventKey: string): boolean => {
  try {
    const firedEvents = JSON.parse(sessionStorage.getItem(FIRED_EVENTS_KEY) || '{}');
    return !!firedEvents[eventKey];
  } catch {
    return false;
  }
};

const markEventFired = (eventKey: string): void => {
  try {
    const firedEvents = JSON.parse(sessionStorage.getItem(FIRED_EVENTS_KEY) || '{}');
    firedEvents[eventKey] = Date.now();
    sessionStorage.setItem(FIRED_EVENTS_KEY, JSON.stringify(firedEvents));
  } catch {
  }
};

export const isPixelAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof window.fbq === 'function' && !!META_PIXEL_ID;
};

export const initMetaPixel = (): void => {
  if (!META_PIXEL_ID) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Meta Pixel] No Pixel ID configured - tracking disabled');
    }
    return;
  }

  if (typeof window.fbq === 'function') {
    return;
  }

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

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  const firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode?.insertBefore(script, firstScript);

  window.fbq('init', META_PIXEL_ID);

  if (process.env.NODE_ENV === 'development') {
    console.log('[Meta Pixel] Initialized with ID:', META_PIXEL_ID);
  }
};

export const trackEvent = (
  event: MetaStandardEvent,
  params?: MetaEventParams,
  options?: { unique?: boolean }
): void => {
  if (!isPixelAvailable()) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Meta Pixel] (DISABLED) Would track: ${event}`, params);
    }
    return;
  }

  const eventKey = options?.unique ? `${event}:${getSessionId()}` : null;
  if (eventKey && hasEventFired(eventKey)) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Meta Pixel] Skipping duplicate: ${event}`);
    }
    return;
  }

  const eventId = generateEventId();
  const eventData = params || {};

  // Add eventID to the data object
  eventData.eventID = eventId;

  window.fbq('track', event, eventData);

  if (eventKey) {
    markEventFired(eventKey);
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Meta Pixel] Tracked: ${event}`, { eventId, params });
  }
};

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
  const eventData = params || {};
  eventData.eventID = eventId;

  window.fbq('track', eventName, eventData);

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Meta Pixel] Tracked custom: ${eventName}`, { eventId, params });
  }
};

export const trackPageView = (): void => {
  trackEvent('PageView', undefined, { unique: true });
};

export const trackViewContent = (params: {
  content_name: string;
  content_category?: string;
  value?: number;
  currency?: string;
}): void => {
  trackEvent('ViewContent', params, { unique: true });
};

export const trackInitiateCheckout = (params?: {
  content_name?: string;
  value?: number;
  currency?: string;
  num_items?: number;
}): void => {
  trackEvent('InitiateCheckout', params, { unique: true });
};

export const trackLead = (params?: {
  content_name?: string;
  content_category?: string;
  value?: number;
  currency?: string;
}): void => {
  trackEvent('Lead', params);
};

export const trackCompleteRegistration = (params?: {
  content_name?: string;
  status?: string;
  value?: number;
  currency?: string;
}): void => {
  trackEvent('CompleteRegistration', params);
};

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

export const trackFormStep = (step: number, stepName: string, totalSteps: number): void => {
  trackCustomEvent('FormStep', {
    step_number: step,
    step_name: stepName,
    total_steps: totalSteps,
    progress_percent: Math.round((step / totalSteps) * 100),
  });
};

export const trackFormOpen = (): void => {
  trackInitiateCheckout({
    content_name: 'Qualification Form',
    value: 997,
    currency: 'USD',
  });
};

export const trackFormSubmission = (params: {
  name: string;
  capital: string;
  experience: string;
  isDownsell: boolean;
}): void => {
  const value = params.isDownsell ? 447 : 997;

  trackLead({
    content_name: 'License Application',
    content_category: params.experience,
    value,
    currency: 'USD',
  });

  trackCompleteRegistration({
    content_name: 'Qualification Form',
    status: 'submitted',
    value,
    currency: 'USD',
  });
};

export const trackDownsellActivated = (): void => {
  trackCustomEvent('DownsellActivated', {
    content_name: 'Partial Scholarship',
    value: 447,
    currency: 'USD',
    discount_amount: 550,
  });
};
