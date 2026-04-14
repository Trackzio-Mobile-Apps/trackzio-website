"use client";

import { createContext, useContext, type ReactNode } from "react";

type Navigate = (href: string) => void | Promise<void>;
type SiteRouterValue = {
  pathname: string;
  navigate: Navigate;
};

const SiteRouterContext = createContext<SiteRouterValue | null>(null);

/**
 * Keep pathname shape identical across Pages Router and App Router.
 * This strips query/hash, ensures leading slash, and falls back to "/".
 */
export function normalizePathname(pathname: string): string {
  const cleaned = pathname.split("?")[0].split("#")[0].trim();
  if (!cleaned) return "/";
  return cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
}

export function SiteRouterProvider({
  pathname,
  navigate,
  children,
}: {
  pathname: string;
  navigate: Navigate;
  children: ReactNode;
}) {
  const value: SiteRouterValue = {
    pathname: normalizePathname(pathname),
    navigate,
  };

  return (
    <SiteRouterContext.Provider value={value}>
      {children}
    </SiteRouterContext.Provider>
  );
}

export function useSitePathname(): string {
  const v = useContext(SiteRouterContext);
  if (v === null) {
    throw new Error("useSitePathname must be used within SiteRouterProvider");
  }
  return v.pathname;
}

export function useSiteNavigate(): Navigate {
  const v = useContext(SiteRouterContext);
  if (v === null) {
    throw new Error("useSiteNavigate must be used within SiteRouterProvider");
  }
  return v.navigate;
}
