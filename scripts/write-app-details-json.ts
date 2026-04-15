/**
 * One-off / regen: builds content/apps/app-details.json from src/lib/content/appDetailContent.ts
 * Run: npx tsx scripts/write-app-details-json.ts
 */
import fs from "fs";
import path from "path";
import { appReviewsById, appFaqsById } from "../src/lib/content/appDetailContent";

const ids = new Set([...Object.keys(appReviewsById), ...Object.keys(appFaqsById)]);
const out: Record<string, { reviews: unknown[]; faqs: unknown[] }> = {};
for (const id of ids) {
  out[id] = {
    reviews: appReviewsById[id] ?? [],
    faqs: appFaqsById[id] ?? [],
  };
}
out["test-app-preview"] = {
  reviews: [
    {
      quote: "Placeholder review — content comes from content/apps/app-details.json.",
      author: "QA",
      rating: 5,
    },
  ],
  faqs: [
    {
      q: "Is this a real listing?",
      a: "No. Remove the test-app-preview entry from apps.json and this file when you are done testing.",
    },
  ],
};

const dest = path.join(process.cwd(), "content/apps/app-details.json");
fs.writeFileSync(dest, JSON.stringify(out, null, 2));
console.log("Wrote", dest, `(${Object.keys(out).length} apps)`);
