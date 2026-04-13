/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  redirects: async () => [
    { source: "/apps", destination: "/#apps", permanent: false },
    { source: "/privacy-policy", destination: "/privacy", permanent: true },
    { source: "/terms", destination: "/trackzio-terms", permanent: true },
    { source: "/privacy-policy-banknote", destination: "/banknote-ai/privacy-policy", permanent: true },
    { source: "/banknote-terms", destination: "/banknote-ai/terms", permanent: true },
    { source: "/privacy-policy-coinzy", destination: "/coinzy/privacy-policy", permanent: true },
    { source: "/coinzy%3A-terms", destination: "/coinzy/terms", permanent: true },
    { source: "/privacy-policy-habit-eazy-1", destination: "/habit-eazy/privacy-policy", permanent: true },
    { source: "/habit-eazy%3A-terms", destination: "/habit-eazy/terms", permanent: true },
    { source: "/privacy-policy-insecto-ai-1", destination: "/insecto-ai/privacy-policy", permanent: true },
    { source: "/terms-for-insecto-ai", destination: "/insecto-ai/terms", permanent: true },
    { source: "/privacy-policy-rockzy-ai", destination: "/rockzy/privacy-policy", permanent: true },
    { source: "/rockzy-terms-of-service", destination: "/rockzy/terms", permanent: true },
  ],
};

export default nextConfig;
