// Analytics event tracking helper
// When GA4 is configured, update this file to send events via gtag

type EventParams = Record<string, string | number | boolean | undefined>;

const eventQueue: Array<{ event: string; params: EventParams; timestamp: number }> = [];
const MAX_QUEUE = 100;

export function trackEvent(eventName: string, params: EventParams = {}) {
  const entry = {
    event: eventName,
    params: {
      ...params,
      url: window.location.href,
      timestamp: Date.now(),
    },
    timestamp: Date.now(),
  };

  // Log for debugging
  console.log(`[Analytics] ${eventName}`, entry.params);

  // Store in memory queue
  eventQueue.push(entry);
  if (eventQueue.length > MAX_QUEUE) eventQueue.shift();

  // Send to GA4 if available
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, entry.params);
  }
}

export function getEventQueue() {
  return [...eventQueue];
}

// Track scroll depth
let scrollTracked = new Set<string>();

export function trackScroll50(pageName: string) {
  if (scrollTracked.has(pageName)) return;

  const handleScroll = () => {
    const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
    if (scrollPercent >= 0.5) {
      scrollTracked.add(pageName);
      trackEvent('scroll_50', { page_name: pageName });
      window.removeEventListener('scroll', handleScroll);
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}

// Track page load performance
export function trackPagePerformance(pageName: string) {
  if (typeof window === 'undefined') return;

  const start = performance.now();

  window.addEventListener('load', () => {
    const loadTime = performance.now() - start;
    if (loadTime > 5000) {
      trackEvent('slow_load', { page_name: pageName, load_time: Math.round(loadTime) });
    }
  }, { once: true });
}

// Session tracking
let sessionInitialized = false;

export function initSession() {
  if (sessionInitialized) return;
  sessionInitialized = true;

  trackEvent('site_open', { page_name: 'entry' });

  const hasVisited = localStorage.getItem('trackzio_visited');
  if (!hasVisited) {
    trackEvent('first_visit', { page_name: 'entry' });
    localStorage.setItem('trackzio_visited', 'true');
  }
}
