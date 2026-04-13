import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import { blogFrontmatterSchema, type BlogFrontmatter } from "./schemas";

const blogsDir = path.join(process.cwd(), "content", "blogs");

export type BlogSummary = BlogFrontmatter;

export type BlogPost = BlogSummary & { contentHtml: string };

function listMarkdownFiles(): string[] {
  if (!fs.existsSync(blogsDir)) return [];
  return fs.readdirSync(blogsDir).filter((f) => f.endsWith(".md"));
}

export function parseBlogFile(filename: string): { data: BlogFrontmatter; body: string } {
  const raw = fs.readFileSync(path.join(blogsDir, filename), "utf8");
  const { data, content } = matter(raw);
  const parsed = blogFrontmatterSchema.parse(data);
  return { data: parsed, body: content };
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const file = await remark().use(remarkHtml).process(markdown);
  return String(file);
}

/** All blogs from disk (optionally only published). Sorted by date descending. */
export async function getAllBlogs(options?: { publishedOnly?: boolean }): Promise<BlogSummary[]> {
  const publishedOnly = options?.publishedOnly ?? false;
  const items: BlogSummary[] = [];

  for (const file of listMarkdownFiles()) {
    const { data } = parseBlogFile(file);
    if (publishedOnly && !data.published) continue;
    items.push(data);
  }

  items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return items;
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  for (const file of listMarkdownFiles()) {
    const { data, body } = parseBlogFile(file);
    if (data.slug !== slug) continue;
    if (!data.published) return null;
    const contentHtml = await markdownToHtml(body.trim());
    return { ...data, contentHtml };
  }
  return null;
}
