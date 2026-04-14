import { useEffect } from "react";
import { trackScroll50, trackPagePerformance } from "@/lib/analytics";
import { useSitePathname } from "@/contexts/SiteRouterContext";

export function usePageAnalytics(pageName: string, eventName: string) {
  const pathname = useSitePathname();

  useEffect(() => {
    import("@/lib/analytics").then(({ trackEvent }) => {
      trackEvent(eventName, { page_name: pageName, from_page: document.referrer });
    });

    const cleanup = trackScroll50(pageName);
    trackPagePerformance(pageName);

    return cleanup;
  }, [pathname, pageName, eventName]);
}
