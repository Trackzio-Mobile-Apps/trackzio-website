import type { GetStaticProps, GetStaticPaths, InferGetStaticPropsType } from "next";
import BlogArticle from "@/screens/BlogArticle";
import { getPublishedBlogSlugs, getBlogBySlug, type BlogPost } from "@/lib/content/blogs";

export default function BlogArticlePage(props: InferGetStaticPropsType<typeof getStaticProps>) {
  return <BlogArticle article={props.article} />;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getPublishedBlogSlugs();
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<{ article: BlogPost }> = async ({ params }) => {
  const slug = params?.slug as string;
  const article = await getBlogBySlug(slug);
  if (!article) return { notFound: true };
  return { props: { article } };
};
