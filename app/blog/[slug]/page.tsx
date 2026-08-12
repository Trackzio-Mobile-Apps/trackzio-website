import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogArticle from "@/screens/BlogArticle";
import JsonLd from "@/components/JsonLd";
import {
  getBlogBySlug,
  getPublishedBlogSlugs,
  getBlogMetadata,
} from "@/lib/content/blogs";
import { articleJsonLd } from "@/lib/seo";

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

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title: article.title,
          description: article.excerpt || article.title,
          url: `/blog/${article.slug}`,
          image: article.image,
          datePublished: article.date,
          author: article.author,
        })}
      />
      <BlogArticle article={article} />
    </>
  );
}
