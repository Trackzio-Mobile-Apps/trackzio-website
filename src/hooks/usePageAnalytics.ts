import { useEffect } from "react";
import { trackScroll50, trackPagePerformance } from "@/lib/analytics";
import { useSitePathname } from "@/contexts/SiteRouterContext";

/** Second arg is optional; defaults to `page_view` (e.g. legal pages only pass `analyticsPage`). */
export function usePageAnalytics(pageName: string, eventName: string = "page_view") {
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
