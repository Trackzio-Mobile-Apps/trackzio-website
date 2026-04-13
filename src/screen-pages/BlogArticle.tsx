import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Clock } from "lucide-react";
import { usePageAnalytics } from "@/hooks/usePageAnalytics";
import type { BlogPost } from "@/lib/content/blogs";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

export interface BlogArticleScreenProps {
  article: BlogPost;
}

export default function BlogArticle({ article }: BlogArticleScreenProps) {
  usePageAnalytics(`blog_${article.slug}`, `blog_article_view`);

  return (
    <div>
      <section className="pt-8 pb-12">
        <div className="container-site max-w-3xl">
          <motion.div {...fadeUp}>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:opacity-80 transition-opacity mb-8"
            >
              <ArrowLeft size={14} /> Back to Blog
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-primary">
                {article.category}
              </span>
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Clock size={11} /> {article.readTime}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-foreground leading-tight mb-6">
              {article.title}
            </h1>

            <div className="flex items-center gap-3 mb-8 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{article.author}</span>
              <span>·</span>
              <span>{article.date}</span>
            </div>

            <div className="rounded-xl overflow-hidden mb-10">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-auto object-cover"
                style={{ maxHeight: "420px" }}
                loading="eager"
              />
            </div>

            <div
              className="prose prose-lg max-w-none text-foreground/85 [&_a]:text-primary [&_p]:leading-relaxed [&_p]:mb-5"
              dangerouslySetInnerHTML={{ __html: article.contentHtml }}
            />

            <div className="mt-12 pt-8 border-t border-border">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:opacity-80 transition-opacity"
              >
                <ArrowLeft size={14} /> Back to all articles
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
