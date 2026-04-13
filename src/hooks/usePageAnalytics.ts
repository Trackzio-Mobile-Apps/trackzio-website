import { useEffect } from "react";
import { useRouter } from "next/router";
import { trackScroll50, trackPagePerformance } from "@/lib/analytics";

export function usePageAnalytics(pageName: string, eventName: string) {
  const { asPath } = useRouter();

  useEffect(() => {
    import("@/lib/analytics").then(({ trackEvent }) => {
      trackEvent(eventName, { page_name: pageName, from_page: document.referrer });
    });

    const cleanup = trackScroll50(pageName);
    trackPagePerformance(pageName);

    return cleanup;
  }, [asPath, pageName, eventName]);
}
