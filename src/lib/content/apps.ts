import fs from "fs";
import path from "path";
import { appsManifestSchema, type AppManifestEntry } from "./schemas";

const appsJsonPath = path.join(process.cwd(), "content/apps/apps.json");

export function getApps(): AppManifestEntry[] {
  const raw = fs.readFileSync(appsJsonPath, "utf8");
  const json = JSON.parse(raw);
  const parsed = appsManifestSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error(`Invalid apps.json: ${parsed.error.message}`);
  }
  return [...parsed.data].sort((a, b) => a.order - b.order);
}
