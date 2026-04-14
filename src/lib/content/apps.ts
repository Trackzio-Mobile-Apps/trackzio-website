import fs from "fs";
import path from "path";
import { appsManifestSchema, type AppManifestEntry } from "./schemas";
import { appLogoMap, appScreenshotMap } from "./appAssets";
import type { StaticImageData } from "next/image";

const appsJsonPath = path.join(process.cwd(), "content/apps/apps.json");

export type AppContent = Omit<AppManifestEntry, "logo" | "screenshots"> & {
  logo: string | StaticImageData;
  screenshots: (string | StaticImageData)[];
};

function withAssets(app: AppManifestEntry): AppContent {
  return {
    ...app,
    logo: appLogoMap[app.logo] ?? app.logo,
    screenshots: app.screenshots.map((s) => appScreenshotMap[s] ?? s),
  };
}

export function getApps(): AppContent[] {
  const raw = fs.readFileSync(appsJsonPath, "utf8");
  const json = JSON.parse(raw);
  const parsed = appsManifestSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error(`Invalid apps.json: ${parsed.error.message}`);
  }
  return [...parsed.data]
    .filter((a) => a.published)
    .sort((a, b) => a.order - b.order)
    .map(withAssets);
}

export function getApp(id: string): AppContent | null {
  return getApps().find((a) => a.id === id) ?? null;
}
