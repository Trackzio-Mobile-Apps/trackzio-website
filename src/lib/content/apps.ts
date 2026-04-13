import appsRaw from "../../../content/apps/apps.json";
import { appsFileSchema, type AppRecord } from "./schemas";

const parsed = appsFileSchema.parse(appsRaw);

export function getApps(): AppRecord[] {
  return parsed.apps;
}

export function getApp(id: string): AppRecord | undefined {
  return parsed.apps.find((a) => a.id === id);
}
