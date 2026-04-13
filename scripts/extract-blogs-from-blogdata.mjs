/**
 * Reads legacy src/lib/blogData.ts and writes content/blogs/*.md
 * Run: node scripts/extract-blogs-from-blogdata.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const raw = fs.readFileSync(path.join(root, "src/lib/blogData.ts"), "utf8");
const start = raw.indexOf("export const articles: BlogArticle[] = [");
const sliceStart = raw.indexOf("[", start) + 1;
const end = raw.indexOf("];\n\nexport const blogOfTheWeek");
const inner = raw.slice(sliceStart, end);

const segments = inner.split(/\n  \},\n\n  \/\/[^\n]+\n/);

function normalizeToObjectString(seg) {
  let t = seg.trim();
  if (t.startsWith("//")) t = t.replace(/^\/\/[^\n]+\n\s*/, "");
  if (!t.startsWith("{")) t = "{" + t;
  t = t.replace(/,\s*\n\s*\}\s*,?\s*$/m, "\n  }");
  t = t.trimEnd();
  if (!t.endsWith("}")) t += "\n  }";
  return t;
}

function parseObject(c) {
  const category = c.match(/category: '((?:\\'|[^'])*)'/)?.[1]?.replace(/\\'/g, "'") ?? "";
  const title = c.match(/title: '((?:\\'|[^'])*)'/)?.[1]?.replace(/\\'/g, "'") ?? "";
  const excerpt = c.match(/excerpt: '((?:\\'|[^'])*)'/)?.[1]?.replace(/\\'/g, "'") ?? "";
  const bodyMatch = c.match(/body: `([\s\S]*?)`,\n    date:/);
  if (!bodyMatch) throw new Error("No body match");
  const body = bodyMatch[1];
  const dateDisplay = c.match(/date: '((?:\\'|[^'])*)'/)?.[1]?.replace(/\\'/g, "'") ?? "";
  const readTime = c.match(/readTime: '((?:\\'|[^'])*)'/)?.[1] ?? "";
  const author = c.match(/author: '((?:\\'|[^'])*)'/)?.[1]?.replace(/\\'/g, "'") ?? "";
  const slug = c.match(/slug: '((?:\\'|[^'])*)'/)?.[1] ?? "";
  const featured = /featured: true/.test(c);
  const blogOfTheWeek = /blogOfTheWeek: true/.test(c);
  return {
    category,
    title,
    excerpt,
    body,
    dateDisplay,
    readTime,
    author,
    slug,
    featured,
    blogOfTheWeek,
  };
}

const imageBySlug = {
  "small-habits-beat-big-resolutions": "/assets/blog/personal-growth-1.jpg",
  "hidden-cost-of-overthinking": "/assets/blog/personal-growth-2.jpg",
  "ai-helping-love-nature": "/assets/blog/nature-ai-1.jpg",
  "data-to-discovery-ai-nature": "/assets/blog/nature-ai-2.jpg",
  "simplicity-advantage-tech": "/assets/blog/technology-1.jpg",
  "psychology-behind-great-apps": "/assets/blog/technology-2.jpg",
  "building-trackzio-never-finished": "/assets/blog/product-updates-1.jpg",
  "what-goes-into-every-update": "/assets/blog/product-updates-2.jpg",
  "stay-consistent-without-motivation": "/assets/blog/tips-tricks-1.jpg",
  "manage-time-everything-urgent": "/assets/blog/tips-tricks-2.jpg",
};

function toIso(display) {
  const m = display.match(/^(\w+)\s+(\d+),\s+(\d+)$/);
  if (!m) return display;
  const months = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };
  const mo = months[m[1].slice(0, 3)];
  if (!mo) return display;
  const day = m[2].padStart(2, "0");
  return `${m[3]}-${mo}-${day}`;
}

const outDir = path.join(root, "content/blogs");
fs.mkdirSync(outDir, { recursive: true });

if (segments.length !== 10) throw new Error(`Expected 10 segments, got ${segments.length}`);

for (const seg of segments) {
  const objStr = normalizeToObjectString(seg);
  const p = parseObject(objStr);
  const image = imageBySlug[p.slug];
  if (!image) throw new Error("Missing image for slug " + p.slug);
  const iso = toIso(p.dateDisplay);
  const header = `---
title: ${JSON.stringify(p.title)}
slug: ${JSON.stringify(p.slug)}
published: true
date: ${JSON.stringify(iso)}
dateDisplay: ${JSON.stringify(p.dateDisplay)}
category: ${JSON.stringify(p.category)}
excerpt: ${JSON.stringify(p.excerpt)}
readTime: ${JSON.stringify(p.readTime)}
image: ${JSON.stringify(image)}
author: ${JSON.stringify(p.author)}${p.featured ? "\nfeatured: true" : ""}${
    p.blogOfTheWeek ? "\nblogOfTheWeek: true" : ""
  }
---

`;
  fs.writeFileSync(path.join(outDir, `${p.slug}.md`), header + p.body.trim() + "\n", "utf8");
  console.log("Wrote", p.slug + ".md");
}

console.log("Done.");
