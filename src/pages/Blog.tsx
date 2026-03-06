import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';
import { ArrowRight, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

const categories = ['All', 'Personal Growth', 'Nature & AI', 'Technology', 'Product Updates', 'Tips & Tricks'];

const articles = [
  {
    category: 'Personal Growth',
    title: 'The Science Behind Habit Building: Why Small Steps Lead to Big Changes',
    excerpt: 'Discover how neuroscience explains why tiny daily habits compound into life-changing transformations.',
    date: 'Feb 28, 2026',
    readTime: '6 min read',
    thumbnail: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&h=250&fit=crop',
  },
  {
    category: 'Nature & AI',
    title: 'How AI is Revolutionizing Insect Identification for Everyday Explorers',
    excerpt: 'AI-powered tools are making it easier than ever to identify and learn about the insects around us.',
    date: 'Feb 20, 2026',
    readTime: '8 min read',
    thumbnail: 'https://images.unsplash.com/photo-1559235038-1b0fadf76f78?w=400&h=250&fit=crop',
  },
  {
    category: 'Technology',
    title: 'Building an AI Product Ecosystem: Lessons from Creating Four Apps in One Year',
    excerpt: 'What happens when you try to build multiple AI-powered apps simultaneously? Our journey and lessons.',
    date: 'Feb 12, 2026',
    readTime: '10 min read',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop',
  },
  {
    category: 'Product Updates',
    title: 'Coinzy 2.0: What\'s New in the Latest Update',
    excerpt: 'A closer look at the new features, improved AI accuracy, and redesigned marketplace in Coinzy 2.0.',
    date: 'Feb 5, 2026',
    readTime: '5 min read',
    thumbnail: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=250&fit=crop',
  },
  {
    category: 'Tips & Tricks',
    title: '5 Ways to Get the Most Out of Your Habit Tracker',
    excerpt: 'Practical tips from power users on how to maximize consistency and motivation with Habiteazy.',
    date: 'Jan 28, 2026',
    readTime: '4 min read',
    thumbnail: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=250&fit=crop',
  },
  {
    category: 'Nature & AI',
    title: 'The Most Fascinating Insects Found by Insecto Users in 2025',
    excerpt: 'A roundup of the rarest and most surprising insect identifications made by our community last year.',
    date: 'Jan 20, 2026',
    readTime: '7 min read',
    thumbnail: 'https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=400&h=250&fit=crop',
  },
];

const ITEMS_PER_PAGE = 6;

export default function Blog() {
  usePageAnalytics('blog', 'blog_page_view');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    let result = articles;
    if (activeCategory !== 'All') {
      result = result.filter(a => a.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a =>
        a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)
      );
    }
    return result;
  }, [searchQuery, activeCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  return (
    <div className="snap-y snap-mandatory">
      {/* Hero (compact) */}
      <section className="min-h-[40vh] flex items-center justify-center pt-8 pb-12 snap-start">
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

      {/* Articles with search, filter, grid, pagination */}
      <section className="min-h-screen py-24 sm:py-32 snap-start">
        <div className="container-site max-w-5xl w-full">
          {/* Search + Category filters */}
          <motion.div {...fadeUp} className="mb-12 space-y-6">
            {/* Search bar */}
            <div className="relative max-w-md mx-auto">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Search articles..."
                className="w-full h-11 pl-11 pr-4 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* Category filters */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                    activeCategory === cat
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Blog grid */}
          {paginated.length === 0 ? (
            <p className="text-center text-muted-foreground py-20">No articles found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginated.map((article, i) => (
                <motion.article
                  key={article.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl bg-card overflow-hidden group cursor-pointer flex flex-col"
                  style={{ boxShadow: 'var(--shadow-card)' }}
                >
                  {/* Thumbnail */}
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={article.thumbnail}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[11px] font-semibold tracking-wider uppercase text-primary">{article.category}</span>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Clock size={11} /> {article.readTime}
                      </span>
                    </div>

                    <h2 className="text-base font-bold font-display text-foreground mb-2 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h2>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-2">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{article.date}</span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        Read more <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-16">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                    currentPage === page
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
