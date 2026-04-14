import jobsJson from "../../../content/jobs/jobs.json";
import type { JobPostingContent } from "./schemas";
import { jobsManifestSchema } from "./schemas";

function parseJobs(): JobPostingContent[] {
  const parsed = jobsManifestSchema.safeParse(jobsJson);
  if (!parsed.success) {
    throw new Error(`Invalid content/jobs/jobs.json: ${parsed.error.message}`);
  }
  return parsed.data;
}

/** Published open roles for the Careers page, sorted by `order`. */
export function getPublishedJobs(): JobPostingContent[] {
  return parseJobs()
    .filter((j) => j.published)
    .sort((a, b) => a.order - b.order);
}
