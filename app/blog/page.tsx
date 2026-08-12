import type { Metadata } from "next";
import Blog from "@/screens/Blog";
import { getAllBlogs, blogOfTheWeekFromList } from "@/lib/content/blogs";

export const metadata: Metadata = {
  title: "Blog",
  description: "Updates, ideas, and stories from the Trackzio team.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Insights & Stories | Trackzio Blog",
    description: "Updates, ideas, and stories from the Trackzio team.",
    url: "/blog",
  },
};

export default function BlogListingPage() {
  const blogs = getAllBlogs();
  const blogOfTheWeek = blogOfTheWeekFromList(blogs);
  if (!blogOfTheWeek) {
    throw new Error("No published blog posts available for listing.");
  }
  return <Blog blogs={blogs} blogOfTheWeek={blogOfTheWeek} />;
}
