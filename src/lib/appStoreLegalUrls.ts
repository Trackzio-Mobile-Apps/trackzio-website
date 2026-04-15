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
