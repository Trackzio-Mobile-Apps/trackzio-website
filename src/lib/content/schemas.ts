import { z } from "zod";

export const blogFrontmatterSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  published: z.boolean(),
  date: z.string().min(1),
  dateDisplay: z.string().min(1),
  category: z.string().min(1),
  excerpt: z.string(),
  readTime: z.string().min(1),
  image: z.string().min(1),
  author: z.string().min(1),
  featured: z.boolean().optional(),
  blogOfTheWeek: z.boolean().optional(),
});

export type BlogFrontmatter = z.infer<typeof blogFrontmatterSchema>;

export const appManifestEntrySchema = z.object({
  id: z.string().min(1),
  published: z.boolean(),
  order: z.number().int(),
});

export const appsManifestSchema = z.array(appManifestEntrySchema);

export type AppManifestEntry = z.infer<typeof appManifestEntrySchema>;
