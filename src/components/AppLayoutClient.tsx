"use client";

import { usePathname, useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { SiteRouterProvider, normalizePathname } from "@/contexts/SiteRouterContext";

export default function AppLayoutClient({ children }: { children: React.ReactNode }) {
  // Adapter boundary: App Router API is allowed only here.
  const pathname = normalizePathname(usePathname() ?? "/");
  const router = useRouter();

  return (
    <SiteRouterProvider pathname={pathname} navigate={(href) => void router.push(href)}>
      <Layout>{children}</Layout>
    </SiteRouterProvider>
  );
}
