import type { AppRecord } from "@/lib/content/schemas";
import { getApps, getApp } from "@/lib/content/apps";

export type AppFeature = AppRecord["features"][number];
export type AppInfo = AppRecord;

export { getApps, getApp };

export const apps = getApps();
