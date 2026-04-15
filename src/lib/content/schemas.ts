import { z } from "zod";

/** Lowercase kebab-case, stable IDs for URLs and cross-content uniqueness. */
export const slugFieldSchema = z
  .string()
  .min(1)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must be lowercase letters, numbers, and single hyphens (kebab-case).",
  );

export type SlugField = z.infer<typeof slugFieldSchema>;

export const blogFrontmatterSchema = z.object({
  title: z.string().min(1),
  slug: slugFieldSchema,
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

/** Root-relative path to a file in `public/` (e.g. `/content/team/jane-doe.jpg`). */
export const publicImagePathSchema = z
  .string()
  .min(1)
  .refine((s) => s.startsWith("/") && !s.includes(".."), "Image path must be root-relative and not contain '..'.")
  .refine((s) => /\.(jpe?g|png|gif|webp)$/i.test(s), "Image path must end with .jpg, .png, .gif, or .webp.");

export const appManifestEntrySchema = z.object({
  id: z.string().min(1),
  slug: slugFieldSchema,
  published: z.boolean(),
  order: z.number().int(),
  name: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
  longDescription: z.string().min(1),
  accentHsl: z.string().min(1),
  logo: z.string().min(1),
  iosUrl: z.string().url().nullable(),
  androidUrl: z.string().url().nullable(),
  stats: z.object({
    downloads: z.string().min(1).optional(),
    rating: z.string().min(1).optional(),
    dau: z.string().min(1).optional(),
  }),
  features: z.array(z.string().min(1)).min(1),
  screenshots: z.array(z.string().min(1)).min(1),
});

export const appsManifestSchema = z.array(appManifestEntrySchema);

export type AppManifestEntry = z.infer<typeof appManifestEntrySchema>;

export const appDetailReviewSchema = z.object({
  quote: z.string().min(1),
  author: z.string().min(1),
  rating: z.number().min(1).max(5).optional(),
});

export const appDetailFaqSchema = z.object({
  q: z.string().min(1),
  a: z.string().min(1),
});

/** Per-app rich content for app detail pages (reviews, FAQ, optional labels). */
export const appDetailBlockSchema = z.object({
  reviews: z.array(appDetailReviewSchema),
  faqs: z.array(appDetailFaqSchema),
  statLabels: z
    .object({
      downloads: z.string().optional(),
      rating: z.string().optional(),
      dau: z.string().optional(),
    })
    .optional(),
  reviewSummary: z
    .object({
      line: z.string().min(1),
    })
    .optional(),
});

export const appDetailsBundleSchema = z.record(z.string(), appDetailBlockSchema);

export type AppDetailBlock = z.infer<typeof appDetailBlockSchema>;

/** Frontmatter for `content/apps/legal/{appId}/privacy.md` and `terms.md`. */
export const appLegalFrontmatterSchema = z.object({
  title: z.string().min(1),
  lastUpdated: z.string().min(1),
  analyticsPage: z.string().min(1),
  analyticsEvent: z.string().min(1),
});

export type AppLegalFrontmatter = z.infer<typeof appLegalFrontmatterSchema>;

export const teamMemberSchema = z.object({
  slug: slugFieldSchema,
  name: z.string().min(1),
  role: z.string().min(1),
  linkedin: z.string().url("LinkedIn must be a valid URL."),
  image: publicImagePathSchema,
  published: z.boolean(),
});

export const teamManifestSchema = z.array(teamMemberSchema);

export type TeamMemberContent = z.infer<typeof teamMemberSchema>;

export const jobPostingSchema = z.object({
  slug: slugFieldSchema,
  title: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  type: z.string().min(1),
  applyUrl: z.string().url("applyUrl must be a valid URL."),
  order: z.number().int(),
  published: z.boolean(),
});

export const jobsManifestSchema = z.array(jobPostingSchema);

export type JobPostingContent = z.infer<typeof jobPostingSchema>;

/** Human-readable Zod errors for validation script output. */
export function formatZodError(err: z.ZodError): string {
  return err.issues
    .map((i) => `${i.path.length ? i.path.join(".") : "(root)"}: ${i.message}`)
    .join("\n");
}
