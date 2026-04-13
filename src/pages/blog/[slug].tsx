import type { GetStaticPaths, GetStaticProps } from "next";
import BlogArticle from "@/screen-pages/BlogArticle";
import { getAllBlogs, getBlogBySlug, type BlogPost } from "@/lib/content/blogs";

interface BlogArticlePageProps {
  article: BlogPost;
}

export default function BlogArticlePage({ article }: BlogArticlePageProps) {
  return <BlogArticle article={article} />;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const blogs = await getAllBlogs({ publishedOnly: true });
  return {
    paths: blogs.map((b) => ({ params: { slug: b.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<BlogArticlePageProps> = async ({ params }) => {
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const article = await getBlogBySlug(slug);
  if (!article) {
    return { notFound: true };
  }
  return { props: { article } };
};
