import { z } from "zod";

export const blogFrontmatterSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  published: z.boolean(),
  date: z.string().min(1),
  category: z.string().min(1),
  excerpt: z.string().min(1),
  readTime: z.string().min(1),
  author: z.string().min(1),
  image: z.string().min(1),
  featured: z.boolean().optional(),
  blogOfTheWeek: z.boolean().optional(),
});

export type BlogFrontmatter = z.infer<typeof blogFrontmatterSchema>;

export const appFeatureSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
});

export const showcaseItemSchema = z.object({
  screenshot: z.string(),
  title: z.string(),
  description: z.string(),
});

export const appRecordSchema = z.object({
  id: z.string(),
  name: z.string(),
  tagline: z.string(),
  description: z.string(),
  color: z.string(),
  accentHsl: z.string(),
  iosUrl: z.string().nullable(),
  androidUrl: z.string().nullable(),
  icon: z.string(),
  logo: z.string(),
  screenshots: z.array(z.string()),
  features: z.array(appFeatureSchema),
  stats: z.object({
    downloads: z.string(),
    rating: z.string(),
    dau: z.string(),
  }),
  showcase: z.array(showcaseItemSchema),
});

export const appsFileSchema = z.object({
  apps: z.array(appRecordSchema),
});

export type AppRecord = z.infer<typeof appRecordSchema>;
