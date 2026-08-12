import type { MetadataRoute } from "next";
import { getApps } from "@/lib/content/apps";
import { getPublishedBlogSlugs } from "@/lib/content/blogs";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/careers",
    "/help",
    "/privacy",
    "/trackzio-terms",
    "/blog",
  ].map((path) => ({
    url: `${SITE_URL}${path || "/"}`,
    lastModified: now,
    changeFrequency: path === "" || path === "/blog" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/blog" ? 0.8 : 0.6,
  }));

  const appRoutes: MetadataRoute.Sitemap = getApps().map((app) => ({
    url: `${SITE_URL}/apps/${app.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const blogRoutes: MetadataRoute.Sitemap = getPublishedBlogSlugs().map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...appRoutes, ...blogRoutes];
}
