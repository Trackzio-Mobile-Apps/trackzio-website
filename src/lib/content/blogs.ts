import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import { blogFrontmatterSchema, type BlogFrontmatter } from "./schemas";

const blogsDir = path.join(process.cwd(), "content/blogs");

export type BlogSummary = BlogFrontmatter;

export type BlogPost = BlogFrontmatter & {
  html: string;
};

function listMarkdownFiles(): string[] {
  if (!fs.existsSync(blogsDir)) return [];
  return fs
    .readdirSync(blogsDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => path.join(blogsDir, f));
}

/** Parse and validate frontmatter + body (no HTML). */
function parseMarkdownFile(filePath: string): { data: BlogFrontmatter; body: string } {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const parsed = blogFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`Invalid frontmatter in ${filePath}: ${parsed.error.message}`);
  }
  return { data: parsed.data, body: content };
}

export function getAllBlogs(): BlogSummary[] {
  const items: BlogSummary[] = [];
  for (const file of listMarkdownFiles()) {
    const { data } = parseMarkdownFile(file);
    if (!data.published) continue;
    items.push(data);
  }
  items.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return items;
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const file = await remark().use(remarkHtml).process(markdown);
  return String(file);
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  const filePath = path.join(blogsDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const { data, body } = parseMarkdownFile(filePath);
  if (!data.published) return null;
  const html = await markdownToHtml(body);
  return { ...data, html };
}

export function getPublishedBlogSlugs(): string[] {
  return getAllBlogs().map((b) => b.slug);
}

export function blogOfTheWeekFromList(blogs: BlogSummary[]): BlogSummary | undefined {
  return blogs.find((b) => b.blogOfTheWeek) ?? blogs[0];
}
