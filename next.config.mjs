/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  /**
   * Store / Play Console URLs — user-facing paths stay exactly these (no redirect away).
   * Internally we serve the same Pages Router routes (e.g. pages/coinzy/privacy-policy and terms).
   */
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/privacy-policy-banknote", destination: "/banknote-ai/privacy-policy" },
        { source: "/privacy-policy-coinzy", destination: "/coinzy/privacy-policy" },
        { source: "/privacy-policy-habit-eazy-1", destination: "/habit-eazy/privacy-policy" },
        { source: "/privacy-policy-insecto-ai-1", destination: "/insecto-ai/privacy-policy" },
        { source: "/privacy-policy-rockzy-ai", destination: "/rockzy/privacy-policy" },
        { source: "/privacy-policy-plantzy-ai", destination: "/plantzy/privacy-policy" },
        { source: "/privacy-policy-test-app-legal", destination: "/test-app-legal/privacy-policy" },
        { source: "/privacy-policy-test-app-legal-2", destination: "/test-app-legal-2/privacy-policy" },
        { source: "/banknote-terms", destination: "/banknote-ai/terms" },
        { source: "/coinzy%3A-terms", destination: "/coinzy/terms" },
        { source: "/habit-eazy%3A-terms", destination: "/habit-eazy/terms" },
        { source: "/terms-for-insecto-ai", destination: "/insecto-ai/terms" },
        { source: "/rockzy-terms-of-service", destination: "/rockzy/terms" },
        { source: "/plantzy-terms-of-service", destination: "/plantzy/terms" },
        { source: "/test-app-legal-terms", destination: "/test-app-legal/terms" },
        { source: "/test-app-legal-2-terms", destination: "/test-app-legal-2/terms" },
      ],
    };
  },

  async redirects() {
    return [
      { source: "/apps", destination: "/#apps", permanent: false },
      { source: "/apps/banknote-ai", destination: "/apps/banknotes", permanent: true },
      { source: "/apps/habit-eazy", destination: "/apps/habiteazy", permanent: true },
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/terms", destination: "/trackzio-terms", permanent: true },

      // Nested implementation URLs → permanent store URLs (bookmark / dev / old links)
      { source: "/banknote-ai/privacy-policy", destination: "/privacy-policy-banknote", permanent: true },
      { source: "/banknote-ai/terms", destination: "/banknote-terms", permanent: true },
      { source: "/coinzy/privacy-policy", destination: "/privacy-policy-coinzy", permanent: true },
      { source: "/coinzy/terms", destination: "/coinzy%3A-terms", permanent: true },
      { source: "/habit-eazy/privacy-policy", destination: "/privacy-policy-habit-eazy-1", permanent: true },
      { source: "/habit-eazy/terms", destination: "/habit-eazy%3A-terms", permanent: true },
      { source: "/insecto-ai/privacy-policy", destination: "/privacy-policy-insecto-ai-1", permanent: true },
      { source: "/insecto-ai/terms", destination: "/terms-for-insecto-ai", permanent: true },
      { source: "/rockzy/privacy-policy", destination: "/privacy-policy-rockzy-ai", permanent: true },
      { source: "/rockzy/terms", destination: "/rockzy-terms-of-service", permanent: true },
      { source: "/plantzy/privacy-policy", destination: "/privacy-policy-plantzy-ai", permanent: true },
      { source: "/plantzy/terms", destination: "/plantzy-terms-of-service", permanent: true },
      { source: "/test-app-legal/privacy-policy", destination: "/privacy-policy-test-app-legal", permanent: true },
      { source: "/test-app-legal/terms", destination: "/test-app-legal-terms", permanent: true },
      { source: "/test-app-legal-2/privacy-policy", destination: "/privacy-policy-test-app-legal-2", permanent: true },
      { source: "/test-app-legal-2/terms", destination: "/test-app-legal-2-terms", permanent: true },

      // Legacy typo paths → store URLs
      { source: "/coinzyterms", destination: "/coinzy%3A-terms", permanent: true },
      { source: "/coinzyprivacy", destination: "/privacy-policy-coinzy", permanent: true },
      { source: "/banknoteterms", destination: "/banknote-terms", permanent: true },
      { source: "/banknoteprivacy", destination: "/privacy-policy-banknote", permanent: true },
      { source: "/habiteazyterms", destination: "/habit-eazy%3A-terms", permanent: true },
      { source: "/habiteazyprivacy", destination: "/privacy-policy-habit-eazy-1", permanent: true },
      { source: "/insectoterms", destination: "/terms-for-insecto-ai", permanent: true },
      { source: "/insectoprivacy", destination: "/privacy-policy-insecto-ai-1", permanent: true },
      { source: "/rockzyterms", destination: "/rockzy-terms-of-service", permanent: true },
      { source: "/rockzyprivacy", destination: "/privacy-policy-rockzy-ai", permanent: true },
      { source: "/plantzyterms", destination: "/plantzy-terms-of-service", permanent: true },
      { source: "/plantzyprivacy", destination: "/privacy-policy-plantzy-ai", permanent: true },
      { source: "/testapplegalterms", destination: "/test-app-legal-terms", permanent: true },
      { source: "/testapplegalprivacy", destination: "/privacy-policy-test-app-legal", permanent: true },
      { source: "/testapplegal2terms", destination: "/test-app-legal-2-terms", permanent: true },
      { source: "/testapplegal2privacy", destination: "/privacy-policy-test-app-legal-2", permanent: true },
    ];
  },
};

export default nextConfig;
