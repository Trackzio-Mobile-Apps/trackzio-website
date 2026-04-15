import appsJson from "../../../content/apps/apps.json";
import { appsManifestSchema } from "./schemas";
import { appLogoMap, appScreenshotMap } from "./appAssets";
import type { AppContent } from "./apps";
import { getAppDetailBlock } from "./loadAppDetails";

const parsed = appsManifestSchema.safeParse(appsJson);
if (!parsed.success) {
  throw new Error(`Invalid apps.json: ${parsed.error.message}`);
}

const normalized: AppContent[] = [...parsed.data]
  .filter((a) => a.published)
  .sort((a, b) => a.order - b.order)
  .map((a) => {
    const d = getAppDetailBlock(a.id);
    return {
      ...a,
      logo: appLogoMap[a.logo] ?? a.logo,
      screenshots: a.screenshots.map((s) => appScreenshotMap[s] ?? s),
      reviews: d.reviews,
      faqs: d.faqs,
      statLabels: d.statLabels,
      reviewSummary: d.reviewSummary,
    };
  });

export function getClientApps(): AppContent[] {
  return normalized;
}

export function getClientApp(id: string): AppContent | null {
  return normalized.find((a) => a.id === id) ?? null;
}
