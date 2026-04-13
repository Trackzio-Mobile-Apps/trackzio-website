/**
 * Blog copy lives in /content/blogs/*.md.
 * Use getAllBlogs / getBlogBySlug from @/lib/content/blogs (SSG pages).
 */
export type { BlogSummary as BlogArticle } from "@/lib/content/blogs";
export { blogCategories } from "@/lib/blogConstants";
