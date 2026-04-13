/**
 * Validates content/blogs/*.md and content/apps/apps.json. Exits 1 on failure.
 * Run: npx tsx scripts/validate-content.ts
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { blogFrontmatterSchema, appsManifestSchema } from "../src/lib/content/schemas";

const root = process.cwd();
const blogsDir = path.join(root, "content/blogs");
const appsPath = path.join(root, "content/apps/apps.json");

function fail(msg: string): never {
  console.error(msg);
  process.exit(1);
}

function validateBlogs() {
  if (!fs.existsSync(blogsDir)) fail("Missing content/blogs directory");
  const files = fs.readdirSync(blogsDir).filter((f) => f.endsWith(".md"));
  if (files.length === 0) fail("No markdown files in content/blogs");

  const slugs = new Set<string>();
  for (const file of files) {
    const full = path.join(blogsDir, file);
    const raw = fs.readFileSync(full, "utf8");
    const { data } = matter(raw);
    const parsed = blogFrontmatterSchema.safeParse(data);
    if (!parsed.success) {
      fail(`Invalid frontmatter in ${file}: ${parsed.error.message}`);
    }
    const { slug } = parsed.data;
    const base = file.replace(/\.md$/i, "");
    if (base !== slug) {
      fail(`Filename must match slug: ${file} (expected ${slug}.md)`);
    }
    if (slugs.has(slug)) fail(`Duplicate slug: ${slug}`);
    slugs.add(slug);
  }
  console.log(`Validated ${files.length} blog file(s).`);
}

function validateApps() {
  if (!fs.existsSync(appsPath)) fail("Missing content/apps/apps.json");
  const raw = fs.readFileSync(appsPath, "utf8");
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch (e) {
    fail(`Invalid JSON in apps.json: ${e}`);
  }
  const parsed = appsManifestSchema.safeParse(json);
  if (!parsed.success) {
    fail(`Invalid apps.json: ${parsed.error.message}`);
  }
  const ids = parsed.data.map((e) => e.id);
  if (new Set(ids).size !== ids.length) fail("Duplicate app id in apps.json");
  console.log(`Validated apps.json (${ids.length} entries).`);
}

validateBlogs();
validateApps();
console.log("Content validation OK.");
