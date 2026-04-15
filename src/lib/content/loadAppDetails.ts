import appDetailsJson from "../../../content/apps/app-details.json";
import { appDetailsBundleSchema, type AppDetailBlock } from "./schemas";

const parsed = appDetailsBundleSchema.safeParse(appDetailsJson);
if (!parsed.success) {
  throw new Error(`Invalid content/apps/app-details.json: ${parsed.error.message}`);
}

const byId = parsed.data;

export function getAppDetailBlock(id: string): AppDetailBlock {
  return byId[id] ?? { reviews: [], faqs: [] };
}
