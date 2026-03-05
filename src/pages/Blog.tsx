import { motion } from 'framer-motion';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';
import { ArrowRight, Clock } from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

const articles = [
  {
    category: 'Personal Growth',
    title: 'The Science Behind Habit Building: Why Small Steps Lead to Big Changes',
    excerpt: 'Discover how neuroscience explains why tiny daily habits compound into life-changing transformations. We explore the psychology of consistency and how apps like Habiteazy leverage these principles to help users stick to their goals.',
    date: 'Feb 28, 2026',
    readTime: '6 min read',
  },
  {
    category: 'Nature & AI',
    title: 'How AI is Revolutionizing Insect Identification for Everyday Explorers',
    excerpt: 'From backyard gardens to tropical forests, AI-powered tools are making it easier than ever to identify and learn about the insects around us. Here\'s how machine learning models are trained on millions of species images to deliver instant, accurate results.',
    date: 'Feb 20, 2026',
    readTime: '8 min read',
  },
  {
    category: 'Technology',
    title: 'Building an AI Product Ecosystem: Lessons from Creating Four Apps in One Year',
    excerpt: 'What happens when you try to build multiple AI-powered apps simultaneously? We share our journey, the challenges of scaling machine learning across different domains, and why a platform-first approach changed everything for Trackzio.',
    date: 'Feb 12, 2026',
    readTime: '10 min read',
  },
];

export default function Blog() {
  usePageAnalytics('blog', 'blog_page_view');

  return (
    <div className="snap-y snap-mandatory">
      {/* Hero */}
      <section className="min-h-[60vh] flex items-center justify-center snap-start">
        <div className="container-site">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">Blog</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-4">Insights & Stories</h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Updates, ideas, and stories from the Trackzio team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Articles */}
      <section className="min-h-screen flex items-center py-24 sm:py-32 snap-start">
        <div className="container-site max-w-4xl w-full">
          <div className="space-y-0 divide-y divide-border">
            {articles.map((article, i) => (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="py-12 first:pt-0 last:pb-0 group cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-semibold tracking-wider uppercase text-primary">{article.category}</span>
                  <span className="text-xs text-muted-foreground/60">·</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock size={12} /> {article.readTime}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold font-display text-foreground mb-4 leading-snug group-hover:text-primary transition-colors">
                  {article.title}
                </h2>

                <p className="text-muted-foreground leading-relaxed mb-5">{article.excerpt}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{article.date}</span>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Read more <ArrowRight size={14} />
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
