import Link from "next/link";
import { useRouter } from "next/router";
import { trackEvent } from '@/lib/analytics';

const socialLinks = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/trackzio-apps/', event: 'footer_linkedin_click', icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
  )},
  { label: 'Instagram', href: '#', event: 'footer_instagram_click', icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
  )},
  { label: 'Facebook', href: '#', event: 'footer_facebook_click', icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
  )},
  { label: 'X', href: '#', event: '', icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
  )},
];

/** Legal links keyed by `appData` app id (exact match for `/apps/[appId]`). Canonical store-style URLs. */
const appLegalByAppId: Record<string, { label: string; privacy: string; terms: string }> = {
  coinzy: { label: "Coinzy", privacy: "/privacy-policy-coinzy", terms: "/coinzy%3A-terms" },
  banknotes: { label: "Banknote AI", privacy: "/privacy-policy-banknote", terms: "/banknote-terms" },
  insecto: { label: "Insecto AI", privacy: "/privacy-policy-insecto-ai-1", terms: "/terms-for-insecto-ai" },
  habiteazy: { label: "Habit Eazy", privacy: "/privacy-policy-habit-eazy-1", terms: "/habit-eazy%3A-terms" },
  rockzy: { label: "Rockzy", privacy: "/privacy-policy-rockzy-ai", terms: "/rockzy-terms-of-service" },
};

type AppLegalEntry = (typeof appLegalByAppId)["coinzy"];

/** When not on `/apps/[appId]`, infer app from path (canonical slugs first, then nested routes). */
const appLegalPathSegments: { segment: string; legal: AppLegalEntry }[] = [
  { segment: "privacy-policy-banknote", legal: appLegalByAppId.banknotes },
  { segment: "banknote-terms", legal: appLegalByAppId.banknotes },
  { segment: "privacy-policy-coinzy", legal: appLegalByAppId.coinzy },
  { segment: "coinzy:", legal: appLegalByAppId.coinzy },
  { segment: "privacy-policy-habit-eazy-1", legal: appLegalByAppId.habiteazy },
  { segment: "habit-eazy:", legal: appLegalByAppId.habiteazy },
  { segment: "privacy-policy-insecto-ai-1", legal: appLegalByAppId.insecto },
  { segment: "terms-for-insecto-ai", legal: appLegalByAppId.insecto },
  { segment: "privacy-policy-rockzy-ai", legal: appLegalByAppId.rockzy },
  { segment: "rockzy-terms-of-service", legal: appLegalByAppId.rockzy },
  { segment: "banknote-ai", legal: appLegalByAppId.banknotes },
  { segment: "insecto-ai", legal: appLegalByAppId.insecto },
  { segment: "habit-eazy", legal: appLegalByAppId.habiteazy },
  { segment: "coinzy", legal: appLegalByAppId.coinzy },
  { segment: "banknotes", legal: appLegalByAppId.banknotes },
  { segment: "insecto", legal: appLegalByAppId.insecto },
  { segment: "habiteazy", legal: appLegalByAppId.habiteazy },
  { segment: "rockzy", legal: appLegalByAppId.rockzy },
];

/**
 * Use the real URL path for legal matching. Next.js sets `pathname` to the route *pattern*
 * for dynamic segments (e.g. `/apps/[appId]`), not `/apps/coinzy`, so `asPath` is required
 * to show the correct app in the footer on app detail pages.
 */
function getPathForLegalMatching(pathname: string, asPath: string): string {
  const cleaned = asPath.split("?")[0].split("#")[0];
  return cleaned || pathname || "";
}

function getAppLegal(pathname: string, asPath: string) {
  const path = getPathForLegalMatching(pathname, asPath);
  if (!path) return null;

  const appsMatch = path.match(/^\/apps\/([^/]+)/);
  if (appsMatch) {
    const appId = appsMatch[1];
    return appLegalByAppId[appId] ?? null;
  }

  for (const { segment, legal } of appLegalPathSegments) {
    if (path.includes(segment)) return legal;
  }
  return null;
}

const FEEDBACK_URL = 'https://forms.gle/pcmnfivhJZnr6Ybb9';

export default function Footer() {
  const { pathname, asPath } = useRouter();
  const appLegal = getAppLegal(pathname, asPath);

  return (
    <footer className="bg-primary" role="contentinfo">
      <div className="container-site py-12">
        {/* Top row: Social left, Buttons right */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {socialLinks.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow Trackzio on ${s.label}`}
                onClick={() => s.event && trackEvent(s.event, { page_name: pathname })}
                className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                {s.icon}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/help"
              onClick={() => window.scrollTo(0, 0)}
              className="inline-flex items-center h-9 px-5 rounded-xl bg-primary-foreground text-primary text-sm font-semibold transition-opacity hover:opacity-90"
            >
              Get in Touch
            </Link>
            <a
              href={FEEDBACK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center h-9 px-5 rounded-xl bg-primary-foreground text-primary text-sm font-semibold transition-opacity hover:opacity-90"
            >
              Share Your Feedback
            </a>
          </div>
        </div>

        {/* Bottom row: Legal links + copyright */}
        <div className="mt-8 pt-6 border-t border-primary-foreground/15 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-primary-foreground/50">
          {appLegal ? (
            <>
              <Link
                href={appLegal.privacy}
                onClick={() => window.scrollTo(0, 0)}
                className="hover:text-primary-foreground transition-colors"
              >
                {appLegal.label} Privacy Policy
              </Link>
              <span className="hidden sm:inline">·</span>
              <Link
                href={appLegal.terms}
                onClick={() => window.scrollTo(0, 0)}
                className="hover:text-primary-foreground transition-colors"
              >
                {appLegal.label} Terms & Conditions
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/privacy"
                onClick={() => window.scrollTo(0, 0)}
                className="hover:text-primary-foreground transition-colors"
              >
                Trackzio Privacy
              </Link>
              <span className="hidden sm:inline">·</span>
              <Link
                href="/trackzio-terms"
                onClick={() => window.scrollTo(0, 0)}
                className="hover:text-primary-foreground transition-colors"
              >
                Trackzio Terms
              </Link>
            </>
          )}
          <span className="hidden sm:inline">·</span>
          <span>© 2026 Trackzio</span>
        </div>
      </div>
    </footer>
  );
}
