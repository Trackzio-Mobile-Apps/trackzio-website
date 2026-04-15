/**
 * Validates all content under /content. Exits 1 on failure.
 * Run: npx tsx scripts/validate-content.ts
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { z } from "zod";
import {
  blogFrontmatterSchema,
  appsManifestSchema,
  appDetailsBundleSchema,
  appLegalFrontmatterSchema,
  teamManifestSchema,
  jobsManifestSchema,
  formatZodError,
} from "../src/lib/content/schemas";

const root = process.cwd();
const blogsDir = path.join(root, "content/blogs");
const appsPath = path.join(root, "content/apps/apps.json");
const appDetailsPath = path.join(root, "content/apps/app-details.json");
const teamPath = path.join(root, "content/team/team.json");
const jobsPath = path.join(root, "content/jobs/jobs.json");
const publicDir = path.join(root, "public");
const appAssetsPath = path.join(root, "src/lib/content/appAssets.ts");

/**
 * Reads appAssets.ts (no image imports) and extracts Record keys for appLogoMap / appScreenshotMap.
 * Keeps validation aligned with the real asset map without loading PNGs in Node.
 *
 * Parsing strategy:
 * 1. Locate `export const <name> ... = {` — use the `{` after `=`, not any `{` in the type (if present).
 * 2. Extract the balanced `{ ... }` object body only (ignores imports and other exports).
 * 3. Extract keys from lines that look like `"filename": value` (quoted keys only), ignoring blanks and // comments.
 * 4. Fail if zero keys — avoids silent bypass if the file format changes.
 */
function stripTrailingLineComment(line: string): string {
  const idx = line.indexOf("//");
  if (idx === -1) return line;
  return line.slice(0, idx);
}

/** Property keys at the root of the object literal: `"key":` */
const OBJECT_PROPERTY_KEY_LINE = /^\s*"([^"]+)"\s*:/;

function extractKeysFromObjectLiteralBody(body: string, exportName: string): Set<string> {
  const keys: string[] = [];
  for (const rawLine of body.split(/\r?\n/)) {
    const line = stripTrailingLineComment(rawLine).trimEnd();
    if (line.trim() === "") continue;
    const m = line.match(OBJECT_PROPERTY_KEY_LINE);
    if (m) keys.push(m[1]);
  }
  if (keys.length === 0) {
    fail(
      `appAssets.ts: no keys parsed inside ${exportName} object (expected lines like "file.png": importName). Update the parser or fix appAssets.ts format.`,
    );
  }
  return new Set(keys);
}

function extractExportRecordKeysFromAppAssetsTs(
  source: string,
  exportName: "appLogoMap" | "appScreenshotMap",
): Set<string> {
  const marker = `export const ${exportName}`;
  const declStart = source.indexOf(marker);
  if (declStart === -1) {
    fail(`appAssets.ts: missing export ${exportName}`);
  }
  const eqIndex = source.indexOf("=", declStart + marker.length);
  if (eqIndex === -1) {
    fail(`appAssets.ts: missing '=' after export ${exportName}`);
  }
  const braceStart = source.indexOf("{", eqIndex);
  if (braceStart === -1) {
    fail(`appAssets.ts: missing object literal '{' for ${exportName} (expected after '=')`);
  }

  let depth = 0;
  for (let i = braceStart; i < source.length; i++) {
    const c = source[i];
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) {
        const body = source.slice(braceStart + 1, i);
        return extractKeysFromObjectLiteralBody(body, exportName);
      }
    }
  }
  fail(`appAssets.ts: unclosed object for ${exportName}`);
}

function loadAppAssetKeysFromFile(): {
  logos: Set<string>;
  screenshots: Set<string>;
} {
  if (!fs.existsSync(appAssetsPath)) {
    fail(`Missing appAssets.ts (${appAssetsPath})`);
  }
  const source = fs.readFileSync(appAssetsPath, "utf8");
  return {
    logos: extractExportRecordKeysFromAppAssetsTs(source, "appLogoMap"),
    screenshots: extractExportRecordKeysFromAppAssetsTs(source, "appScreenshotMap"),
  };
}

type SlugRef = { slug: string; where: string };

function fail(msg: string): never {
  console.error(`\n[content] ${msg}\n`);
  process.exit(1);
}

function parseJsonFile<T>(filePath: string, label: string): unknown {
  if (!fs.existsSync(filePath)) fail(`Missing ${label} (${filePath})`);
  const raw = fs.readFileSync(filePath, "utf8");
  try {
    return JSON.parse(raw);
  } catch (e) {
    fail(`Invalid JSON in ${label}: ${e instanceof Error ? e.message : String(e)}`);
  }
}

function safeParse<T>(
  schema: z.ZodType<T>,
  data: unknown,
  label: string,
): T {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    fail(`${label}:\n${formatZodError(parsed.error)}`);
  }
  return parsed.data;
}

function assertPublicFileExists(urlPath: string, where: string): void {
  if (!urlPath.startsWith("/")) fail(`${where}: image path must start with "/" (got "${urlPath}")`);
  const abs = path.join(publicDir, urlPath.replace(/^\//, ""));
  if (!fs.existsSync(abs)) {
    fail(
      `${where}: file not found for image "${urlPath}". Add it under public/${urlPath.replace(/^\//, "")}.`,
    );
  }
}

function registerSlugs(registry: SlugRef[], slug: string, where: string): void {
  const hit = registry.find((r) => r.slug === slug);
  if (hit) {
    fail(
      `Duplicate slug "${slug}".\n  — first: ${hit.where}\n  — also: ${where}\nSlugs must be unique across blogs, apps, team, and jobs.`,
    );
  }
  registry.push({ slug, where });
}

function validateBlogs(registry: SlugRef[]) {
  if (!fs.existsSync(blogsDir)) fail("Missing content/blogs directory");
  const files = fs.readdirSync(blogsDir).filter((f) => f.endsWith(".md"));
  if (files.length === 0) fail("No markdown files in content/blogs");

  for (const file of files) {
    const full = path.join(blogsDir, file);
    const raw = fs.readFileSync(full, "utf8");
    const { data } = matter(raw);
    const label = `content/blogs/${file} (frontmatter)`;
    const parsed = safeParse(blogFrontmatterSchema, data, label);
    const base = file.replace(/\.md$/i, "");
    if (base !== parsed.slug) {
      fail(
        `content/blogs/${file}: filename must match slug (rename to "${parsed.slug}.md" or fix slug field).`,
      );
    }
    registerSlugs(registry, parsed.slug, `blog post "${parsed.slug}" (${file})`);
  }
  console.log(`  • blogs: ${files.length} markdown file(s)`);
}

function validateApps(registry: SlugRef[]) {
  const json = parseJsonFile(appsPath, "content/apps/apps.json");
  const data = safeParse(appsManifestSchema, json, "content/apps/apps.json");
  const ids = data.map((e) => e.id);
  if (new Set(ids).size !== ids.length) {
    fail("content/apps/apps.json: duplicate id values.");
  }
  const slugs = data.map((e) => e.slug);
  if (new Set(slugs).size !== slugs.length) {
    fail("content/apps/apps.json: duplicate slug values.");
  }
  const { logos: validLogoKeys, screenshots: validScreenshotKeys } = loadAppAssetKeysFromFile();

  for (const row of data) {
    if (row.id !== row.slug) {
      fail(
        `content/apps/apps.json: id and slug should match for apps (got id="${row.id}", slug="${row.slug}").`,
      );
    }
    if (!validLogoKeys.has(row.logo)) {
      fail(`Invalid asset key '${row.logo}' in app '${row.id}' (logo must exist in appAssets).`);
    }
    for (const shot of row.screenshots) {
      if (!validScreenshotKeys.has(shot)) {
        fail(`Invalid asset key '${shot}' in app '${row.id}' (screenshot must exist in appAssets).`);
      }
    }
    registerSlugs(registry, row.slug, `apps.json → ${row.id}`);
  }
  console.log(`  • apps: ${data.length} entries`);

  const appDetailsJson = parseJsonFile(appDetailsPath, "content/apps/app-details.json");
  const details = safeParse(appDetailsBundleSchema, appDetailsJson, "content/apps/app-details.json");
  const idSet = new Set(data.map((e) => e.id));
  for (const id of Object.keys(details)) {
    if (!idSet.has(id)) {
      fail(`content/apps/app-details.json: key "${id}" is not an app id in apps.json`);
    }
  }
  console.log(`  • app-details: ${Object.keys(details).length} app(s)`);

  const legalSkip = new Set(["test-app-preview"]);
  for (const row of data) {
    if (!row.published || legalSkip.has(row.id)) continue;
    for (const kind of ["privacy", "terms"] as const) {
      const fileName = kind === "privacy" ? "privacy.md" : "terms.md";
      const legalPath = path.join(root, "content/apps/legal", row.id, fileName);
      if (!fs.existsSync(legalPath)) {
        fail(`Missing ${kind} legal file for app "${row.id}": content/apps/legal/${row.id}/${fileName}`);
      }
      const rawLegal = fs.readFileSync(legalPath, "utf8");
      const { data: legalFm } = matter(rawLegal);
      safeParse(
        appLegalFrontmatterSchema,
        legalFm,
        `content/apps/legal/${row.id}/${fileName} (frontmatter)`,
      );
    }
  }
  const legalCount = data.filter((r) => r.published && !legalSkip.has(r.id)).length;
  console.log(`  • app-legal: ${legalCount} app(s) (privacy + terms markdown)`);
}

function validateTeam(registry: SlugRef[]) {
  const json = parseJsonFile(teamPath, "content/team/team.json");
  const data = safeParse(teamManifestSchema, json, "content/team/team.json");
  const slugs = data.map((r) => r.slug);
  if (new Set(slugs).size !== slugs.length) {
    fail("content/team/team.json: duplicate slug values.");
  }
  for (const row of data) {
    registerSlugs(registry, row.slug, `team.json → ${row.slug} (${row.name})`);
    assertPublicFileExists(row.image, `team "${row.slug}"`);
  }
  console.log(`  • team: ${data.length} member(s)`);
}

function validateJobs(registry: SlugRef[]) {
  const json = parseJsonFile(jobsPath, "content/jobs/jobs.json");
  const data = safeParse(jobsManifestSchema, json, "content/jobs/jobs.json");
  const slugs = data.map((j) => j.slug);
  if (new Set(slugs).size !== slugs.length) {
    fail("content/jobs/jobs.json: duplicate slug values.");
  }
  const orders = new Set<number>();
  for (const job of data) {
    if (orders.has(job.order)) {
      fail(`content/jobs/jobs.json: duplicate order ${job.order} (job slug "${job.slug}").`);
    }
    orders.add(job.order);
    registerSlugs(registry, job.slug, `jobs.json → ${job.slug}`);
  }
  console.log(`  • jobs: ${data.length} role(s)`);
}

console.log("Validating content…\n");

const slugRegistry: SlugRef[] = [];

validateBlogs(slugRegistry);
validateApps(slugRegistry);
validateTeam(slugRegistry);
validateJobs(slugRegistry);

console.log("\nContent validation OK.");
