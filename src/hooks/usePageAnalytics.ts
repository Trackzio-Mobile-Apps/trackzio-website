import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackScroll50, trackPagePerformance } from '@/lib/analytics';

export function usePageAnalytics(pageName: string, eventName: string) {
  const location = useLocation();

  useEffect(() => {
    // Dynamic import to avoid circular deps
    import('@/lib/analytics').then(({ trackEvent }) => {
      trackEvent(eventName, { page_name: pageName, from_page: document.referrer });
    });

    const cleanup = trackScroll50(pageName);
    trackPagePerformance(pageName);

    return cleanup;
  }, [location.pathname, pageName, eventName]);
}
