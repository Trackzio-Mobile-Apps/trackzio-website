/**
 * Permanent Privacy / Terms URL paths used in Play Console, App Store, and marketing.
 * These must stay stable. They are implemented in `next.config.mjs` via:
 * - `rewrites`: store URL → internal page (so the browser can keep the store URL)
 * - `redirects`: internal nested route → store URL (so old/dev links still land on the public URL)
 *
 * When adding a new app, add entries here + rewrites/redirects + `content/apps/legal/{id}/` + pages — see `content/apps/LEGAL_STORE_URLS.md`.
 */
export const APP_STORE_LEGAL_URLS: Record<string, { privacy: string; terms: string }> = {
  coinzy: {
    privacy: "/privacy-policy-coinzy",
    terms: "/coinzy%3A-terms",
  },
  banknotes: {
    privacy: "/privacy-policy-banknote",
    terms: "/banknote-terms",
  },
  insecto: {
    privacy: "/privacy-policy-insecto-ai-1",
    terms: "/terms-for-insecto-ai",
  },
  habiteazy: {
    privacy: "/privacy-policy-habit-eazy-1",
    terms: "/habit-eazy%3A-terms",
  },
  rockzy: {
    privacy: "/privacy-policy-rockzy-ai",
    terms: "/rockzy-terms-of-service",
  },
  "test-app-legal": {
    privacy: "/privacy-policy-test-app-legal",
    terms: "/test-app-legal-terms",
  },
  "test-app-legal-2": {
    privacy: "/privacy-policy-test-app-legal-2",
    terms: "/test-app-legal-2-terms",
  },
};

/**
 * Pages Router paths that render each app's legal docs (same as `pages/...` routes).
 * During SSR, `router.pathname` / `router.asPath` may be these instead of the store URLs
 * in `APP_STORE_LEGAL_URLS`; matching both avoids footer hydration mismatches.
 * Segments are without a leading slash for use with `pathname.includes(...)`.
 */
export const APP_LEGAL_IMPLEMENTATION_PATH_SEGMENTS: Record<string, readonly string[]> = {
  banknotes: ["banknote-ai/privacy-policy", "banknote-ai/terms"],
  coinzy: ["coinzy/privacy-policy", "coinzy/terms"],
  insecto: ["insecto-ai/privacy-policy", "insecto-ai/terms"],
  habiteazy: ["habit-eazy/privacy-policy", "habit-eazy/terms"],
  rockzy: ["rockzy/privacy-policy", "rockzy/terms"],
  "test-app-legal": ["test-app-legal/privacy-policy", "test-app-legal/terms"],
  "test-app-legal-2": ["test-app-legal-2/privacy-policy", "test-app-legal-2/terms"],
};
