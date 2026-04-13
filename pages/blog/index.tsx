import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Blog from "@/screens/Blog";
import { getAllBlogs, blogOfTheWeekFromList, type BlogSummary } from "@/lib/content/blogs";

export default function BlogPage(props: InferGetStaticPropsType<typeof getStaticProps>) {
  return <Blog blogs={props.blogs} blogOfTheWeek={props.blogOfTheWeek} />;
}

export const getStaticProps: GetStaticProps<{
  blogs: BlogSummary[];
  blogOfTheWeek: BlogSummary;
}> = async () => {
  const blogs = getAllBlogs();
  const botw = blogOfTheWeekFromList(blogs);
  if (!botw) {
    throw new Error("No blog posts available for listing.");
  }
  return { props: { blogs, blogOfTheWeek: botw } };
};
