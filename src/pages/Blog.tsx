import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';
import { ArrowRight, Clock } from 'lucide-react';
import { articles, blogCategories, blogOfTheWeek } from '@/lib/blogData';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

export default function Blog() {
  usePageAnalytics('blog', 'blog_page_view');
  const [activeSplitCategory, setActiveSplitCategory] = useState(blogCategories[0]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const splitFiltered = useMemo(() => {
    if (showAllCategories) return articles;
    return articles.filter(a => a.category === activeSplitCategory);
  }, [activeSplitCategory, showAllCategories]);

  const activePreview = splitFiltered[selectedIndex] || splitFiltered[0];

  const handleCategoryChange = (cat: string) => {
    setShowAllCategories(false);
    setActiveSplitCategory(cat);
    setSelectedIndex(0);
  };

  return (
    <div>
      {/* Section 1: Hero */}
      <section className="min-h-[40vh] flex items-center justify-center pt-8 pb-12">
        <div className="container-site">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">Blog</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-4">
              Insights & <span className="text-primary">Stories</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Updates, ideas, and stories from the Trackzio team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Blog of the Week */}
      <section className="pb-16 sm:pb-24">
        <div className="container-site max-w-5xl">
          <motion.div {...fadeUp}>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-6">Blog of the Week</p>
            <Link
              to={`/blog/${blogOfTheWeek.slug}`}
              className="rounded-xl bg-card overflow-hidden flex flex-col md:flex-row cursor-pointer group block"
              style={{ boxShadow: '0 8px 32px -8px hsla(0 0% 0% / 0.1)' }}
            >
              <div className="md:w-1/2 aspect-[16/10] md:aspect-auto overflow-hidden">
                <img
                  src={blogOfTheWeek.image}
                  alt={blogOfTheWeek.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="eager"
                />
              </div>
              <div className="md:w-1/2 p-8 sm:p-10 flex flex-col justify-center">
                <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-primary mb-3">
                  {blogOfTheWeek.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
                  {blogOfTheWeek.title}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">
                  {blogOfTheWeek.excerpt}
                </p>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-xs text-muted-foreground">{blogOfTheWeek.date}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock size={12} /> {blogOfTheWeek.readTime}
                  </span>
                </div>
                <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors w-fit">
                  Read <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Section 3: Interactive Split-View */}
      <section id="featured-articles" className="py-16 sm:py-24 bg-muted/40">
        <div className="container-site max-w-5xl">
          <motion.div {...fadeUp}>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-6">Featured Articles</p>

            <div className="flex flex-wrap gap-2 mb-8">
              {blogCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                    !showAllCategories && activeSplitCategory === cat
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-muted-foreground hover:text-foreground border border-border'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex flex-col lg:flex-row gap-6 rounded-xl overflow-hidden">
              <div className="lg:w-[38%] bg-card rounded-xl flex flex-col" style={{ boxShadow: '0 4px 20px -6px hsla(0 0% 0% / 0.08)' }}>
                <div
                  className="flex-1 overflow-y-auto divide-y divide-border"
                  style={{ height: '420px', scrollbarWidth: 'thin', scrollbarColor: 'hsl(var(--primary)) hsl(var(--muted))' }}
                >
                  {splitFiltered.length === 0 ? (
                    <p className="p-6 text-sm text-muted-foreground">No articles in this category yet.</p>
                  ) : (
                    splitFiltered.map((article, i) => (
                      <button
                        key={article.slug}
                        onClick={() => setSelectedIndex(i)}
                        className={`w-full text-left p-5 transition-colors ${
                          selectedIndex === i
                            ? 'bg-primary/5 border-l-[3px] border-l-primary'
                            : 'hover:bg-muted/50 border-l-[3px] border-l-transparent'
                        }`}
                      >
                        <h3 className={`text-sm font-semibold leading-snug mb-1 ${selectedIndex === i ? 'text-primary' : 'text-foreground'}`}>
                          {article.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">{article.author} · {article.date}</p>
                      </button>
                    ))
                  )}
                </div>
                <div className="p-4 border-t border-border">
                  <button
                    onClick={() => { setShowAllCategories(false); setSelectedIndex(0); }}
                    className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold tracking-wide hover:bg-primary/90 transition-colors uppercase"
                  >
                    View All {activeSplitCategory}
                  </button>
                </div>
              </div>

              <Link
                to={activePreview ? `/blog/${activePreview.slug}` : '#'}
                className="lg:w-[62%] bg-card rounded-xl overflow-hidden flex flex-col cursor-pointer group block"
                style={{ boxShadow: '0 4px 20px -6px hsla(0 0% 0% / 0.08)' }}
              >
                {activePreview ? (
                  <>
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={activePreview.image}
                        alt={activePreview.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="eager"
                      />
                    </div>
                    <div className="p-6 sm:p-8 flex-1 flex flex-col">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-primary">
                          {activePreview.category}
                        </span>
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Clock size={11} /> {activePreview.readTime}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold font-display text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
                        {activePreview.title}
                      </h2>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {activePreview.excerpt}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                        Read More <ArrowRight size={14} />
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full p-12">
                    <p className="text-muted-foreground text-sm">Select an article to preview.</p>
                  </div>
                )}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
