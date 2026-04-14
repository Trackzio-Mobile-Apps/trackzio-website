import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogArticle from "@/screens/BlogArticle";
import {
  getBlogBySlug,
  getPublishedBlogSlugs,
  getBlogMetadata,
} from "@/lib/content/blogs";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return getPublishedBlogSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  return getBlogMetadata(params.slug);
}

export default async function BlogPostPage({ params }: Props) {
  const article = await getBlogBySlug(params.slug);
  if (!article) notFound();
  return <BlogArticle article={article} />;
}
