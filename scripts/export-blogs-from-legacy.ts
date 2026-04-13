/**
 * One-time helper: writes content/blogs/*.md from src/lib/blogData.ts articles.
 * Run: npx tsx scripts/export-blogs-from-legacy.ts
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { articles } from "../src/lib/blogData";

const outDir = path.join(process.cwd(), "content", "blogs");
fs.mkdirSync(outDir, { recursive: true });

for (const a of articles) {
  const fm: Record<string, unknown> = {
    title: a.title,
    slug: a.slug,
    published: true,
    date: a.date,
    category: a.category,
    excerpt: a.excerpt,
    readTime: a.readTime,
    author: a.author,
    image: a.image,
  };
  if (a.featured) fm.featured = true;
  if (a.blogOfTheWeek) fm.blogOfTheWeek = true;

  const fileContent = matter.stringify(a.body, fm);
  fs.writeFileSync(path.join(outDir, `${a.slug}.md`), fileContent, "utf8");
}

console.log(`Wrote ${articles.length} files to content/blogs`);
