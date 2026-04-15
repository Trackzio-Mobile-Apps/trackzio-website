import type { GetStaticProps } from "next";
import type { LegalPageDoc } from "@/lib/content/legalPageTypes";

/**
 * Server-only data loader for app Privacy / Terms pages.
 * Import this only from `getStaticProps` in `pages/` (never from client components).
 */
export function getAppLegalStaticProps(
  appId: string,
  kind: "privacy" | "terms",
): GetStaticProps<{ doc: LegalPageDoc }> {
  return async () => {
    const { getLegalPageProps } = await import("@/lib/content/appLegal.server");
    const doc = await getLegalPageProps(appId, kind);
    if (!doc) {
      return { notFound: true };
    }
    return { props: { doc } };
  };
}
