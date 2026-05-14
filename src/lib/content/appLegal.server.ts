import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import { appLegalFrontmatterSchema, formatZodError } from "./schemas";
import type { LegalPageDoc } from "./legalPageTypes";

const legalRoot = path.join(process.cwd(), "content/apps/legal");

/**
 * Leading spaces on body lines make CommonMark treat paragraphs as indented code
 * blocks (`<pre>` → monospace). Legal MD files were exported with visual indentation;
 * trim each line so prose and lists parse as normal markdown.
 */
function normalizeAppLegalMarkdownBody(markdown: string): string {
  return markdown
    .split(/\r?\n/)
    .map((line) => line.trimStart())
    .join("\n");
}

/**
 * Load app legal page (privacy or terms) from markdown.
 * Used by Pages Router `getStaticProps` (server-only). Import only from server contexts.
 */
export async function getLegalPageProps(
  appId: string,
  kind: "privacy" | "terms",
): Promise<LegalPageDoc | null> {
  const fileName = kind === "privacy" ? "privacy.md" : "terms.md";
  const filePath = path.join(legalRoot, appId, fileName);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const parsed = appLegalFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`Invalid frontmatter in ${filePath}:\n${formatZodError(parsed.error)}`);
  }
  const html = String(
    await remark().use(remarkHtml).process(normalizeAppLegalMarkdownBody(content)),
  );
  return {
    ...parsed.data,
    html,
  };
}

/** App ids that already have manually maintained legal pages under the pages directory. */
const LEGACY_MANUAL_PAGE_APP_IDS = new Set(["coinzy", "banknotes", "insecto", "habiteazy", "rockzy"]);

/**
 * Discover app ids from legal markdown folders that can be served by dynamic legal pages.
 * This lets newly added apps work without creating manual `pages/{appId}/privacy-policy|terms.tsx` files.
 */
export function getDynamicLegalAppIds(): string[] {
  if (!fs.existsSync(legalRoot)) return [];
  const entries = fs.readdirSync(legalRoot, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .filter((appId) => !LEGACY_MANUAL_PAGE_APP_IDS.has(appId))
    .filter((appId) => {
      const privacyPath = path.join(legalRoot, appId, "privacy.md");
      const termsPath = path.join(legalRoot, appId, "terms.md");
      return fs.existsSync(privacyPath) && fs.existsSync(termsPath);
    })
    .sort();
}
