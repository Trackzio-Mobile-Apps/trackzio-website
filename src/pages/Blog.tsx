import { motion } from 'framer-motion';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';

export default function Blog() {
  usePageAnalytics('blog', 'blog_page_view');

  return (
    <section className="section-padding">
      <div className="container-site max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl sm:text-5xl font-bold font-display mb-4">Blog</h1>
          <p className="text-lg text-muted-foreground mb-12">Insights, updates, and stories from the Trackzio team.</p>
        </motion.div>
        <div className="card-glass p-12 text-center">
          <p className="text-muted-foreground">Coming soon — stay tuned for our first posts!</p>
        </div>
      </div>
    </section>
  );
}
