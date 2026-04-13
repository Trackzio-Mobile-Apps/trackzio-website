import type { GetStaticProps } from "next";
import Blog from "@/screen-pages/Blog";
import { getAllBlogs, type BlogSummary } from "@/lib/content/blogs";

interface BlogPageProps {
  articles: BlogSummary[];
}

export default function BlogPage({ articles }: BlogPageProps) {
  return <Blog articles={articles} />;
}

export const getStaticProps: GetStaticProps<BlogPageProps> = async () => {
  const articles = await getAllBlogs({ publishedOnly: true });
  return { props: { articles } };
};
