"use client";

import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { SiteRouterProvider, normalizePathname } from "@/contexts/SiteRouterContext";

export default function PagesLayoutClient({ children }: { children: React.ReactNode }) {
  // Adapter boundary: Pages Router API is allowed only here.
  const router = useRouter();
  const pathname = normalizePathname(router.asPath || router.pathname);

  return (
    <SiteRouterProvider pathname={pathname} navigate={(href) => void router.push(href)}>
      <Layout>{children}</Layout>
    </SiteRouterProvider>
  );
}
