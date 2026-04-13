/**
 * Run before `next build`. Exits 1 if content is invalid.
 * Usage: npx tsx scripts/validate-content.ts
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { blogFrontmatterSchema, appsFileSchema } from "../src/lib/content/schemas";

const root = process.cwd();
const blogsDir = path.join(root, "content", "blogs");
const appsPath = path.join(root, "content", "apps", "apps.json");

function fail(msg: string): never {
  console.error(`[validate-content] ${msg}`);
  process.exit(1);
}

function validateBlogs() {
  if (!fs.existsSync(blogsDir)) fail(`Missing directory: ${blogsDir}`);
  const files = fs.readdirSync(blogsDir).filter((f) => f.endsWith(".md"));
  if (files.length === 0) fail("No .md files in content/blogs");

  const slugs = new Map<string, string>();

  for (const file of files) {
    const raw = fs.readFileSync(path.join(blogsDir, file), "utf8");
    const { data } = matter(raw);
    try {
      blogFrontmatterSchema.parse(data);
    } catch (e) {
      fail(`Invalid frontmatter in ${file}: ${e}`);
    }
    const slug = (data as { slug: string }).slug;
    if (slugs.has(slug)) fail(`Duplicate slug "${slug}" in ${file} and ${slugs.get(slug)}`);
    slugs.set(slug, file);
  }

  const botw = [...slugs.keys()].filter((slug) => {
    const raw = fs.readFileSync(path.join(blogsDir, slugs.get(slug)!), "utf8");
    const { data } = matter(raw);
    return (data as { blogOfTheWeek?: boolean }).blogOfTheWeek === true;
  });
  if (botw.length > 1) fail(`Multiple blogs marked blogOfTheWeek: ${botw.join(", ")}`);
}

function validateApps() {
  if (!fs.existsSync(appsPath)) fail(`Missing ${appsPath}`);
  const raw = JSON.parse(fs.readFileSync(appsPath, "utf8"));
  try {
    appsFileSchema.parse(raw);
  } catch (e) {
    fail(`Invalid apps.json: ${e}`);
  }
  const ids = raw.apps.map((a: { id: string }) => a.id);
  const dup = ids.filter((id: string, i: number) => ids.indexOf(id) !== i);
  if (dup.length) fail(`Duplicate app ids: ${[...new Set(dup)].join(", ")}`);
}

validateBlogs();
validateApps();
console.log("[validate-content] OK");
