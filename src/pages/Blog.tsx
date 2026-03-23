import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';
import { ArrowRight, Clock } from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

const splitCategories = ['Personal Growth', 'Nature & AI', 'Technology', 'Product Updates', 'Tips & Tricks'];

const articles = [
  {
    category: 'Personal Growth',
    title: 'The Science Behind Habit Building: Why Small Steps Lead to Big Changes',
    excerpt: 'Discover how neuroscience explains why tiny daily habits compound into life-changing transformations.',
    body: `The human brain is wired for efficiency, not change. Every time you repeat an action, the neural pathway responsible for that behavior strengthens — a process neuroscientists call "long-term potentiation." This is why small, consistent habits are far more powerful than grand, one-time efforts.`,
    date: 'Feb 28, 2026',
    readTime: '8 min',
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&h=500&fit=crop',
    author: 'Aayushya Aggarwal',
    featured: true,
    slug: 'science-behind-habit-building',
  },
  {
    category: 'Nature & AI',
    title: 'How AI is Revolutionizing Insect Identification for Everyday Explorers',
    excerpt: 'AI-powered tools are making it easier than ever to identify and learn about the insects around us.',
    body: '',
    date: 'Feb 20, 2026',
    readTime: '10 min',
    image: 'https://images.unsplash.com/photo-1559235038-1b0fadf76f78?w=800&h=500&fit=crop',
    author: 'Trackzio Team',
    slug: 'ai-insect-identification',
  },
  {
    category: 'Technology',
    title: 'Building an AI Product Ecosystem: Lessons from Creating Five Apps in One Year',
    excerpt: 'What happens when you try to build multiple AI-powered apps simultaneously? Our journey and hard-earned lessons.',
    body: '',
    date: 'Feb 12, 2026',
    readTime: '9 min',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop',
    author: 'Aayushya Aggarwal',
    slug: 'building-ai-product-ecosystem',
  },
  {
    category: 'Product Updates',
    title: "Coinzy 2.0: What's New in the Latest Update",
    excerpt: 'A closer look at the new features, improved AI accuracy, and redesigned marketplace in Coinzy 2.0.',
    body: '',
    date: 'Feb 5, 2026',
    readTime: '7 min',
    image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=500&fit=crop',
    author: 'Trackzio Team',
    slug: 'coinzy-2-update',
  },
  {
    category: 'Tips & Tricks',
    title: '5 Ways to Get the Most Out of Your Habit Tracker',
    excerpt: 'Practical tips from power users on how to maximize consistency and motivation with Habiteazy.',
    body: '',
    date: 'Jan 28, 2026',
    readTime: '6 min',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=500&fit=crop',
    author: 'Aayushya Aggarwal',
    slug: 'habit-tracker-tips',
  },
  {
    category: 'Nature & AI',
    title: 'The Most Fascinating Insects Found by Insecto Users in 2025',
    excerpt: 'A roundup of the rarest and most surprising insect identifications made by our community last year.',
    body: '',
    date: 'Jan 20, 2026',
    readTime: '8 min',
    image: 'https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=800&h=500&fit=crop',
    author: 'Trackzio Team',
    slug: 'fascinating-insects-2025',
  },
  {
    category: 'Personal Growth',
    title: 'Morning Routines That Actually Stick: A Data-Driven Approach',
    excerpt: 'We analyzed thousands of habit tracking patterns to find the morning routines that users maintain longest.',
    body: '',
    date: 'Jan 14, 2026',
    readTime: '7 min',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop',
    author: 'Aayushya Aggarwal',
    slug: 'morning-routines-data-driven',
  },
  {
    category: 'Technology',
    title: 'The Future of Mobile-First AI Applications',
    excerpt: 'How on-device machine learning is changing the way we build and interact with mobile applications.',
    body: '',
    date: 'Jan 8, 2026',
    readTime: '10 min',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=500&fit=crop',
    author: 'Trackzio Team',
    slug: 'future-mobile-ai',
  },
];

const blogOfTheWeek = articles[0];

export default function Blog() {
  usePageAnalytics('blog', 'blog_page_view');
  const [activeSplitCategory, setActiveSplitCategory] = useState(splitCategories[0]);
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

  // handleReadArticle no longer needed - using Link components instead

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
              {splitCategories.map(cat => (
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
                        key={article.title}
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
                    onClick={() => { setShowAllCategories(true); setSelectedIndex(0); }}
                    className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold tracking-wide hover:bg-primary/90 transition-colors uppercase"
                  >
                    {showAllCategories ? 'Showing All Articles' : `View All ${activeSplitCategory}`}
                  </button>
                </div>
              </div>

              <div
                className="lg:w-[62%] bg-card rounded-xl overflow-hidden flex flex-col cursor-pointer group"
                style={{ boxShadow: '0 4px 20px -6px hsla(0 0% 0% / 0.08)' }}
                onClick={() => activePreview && handleReadArticle(activePreview.slug)}
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
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
