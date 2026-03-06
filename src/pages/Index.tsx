import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { apps } from '@/lib/appData';
import { trackEvent } from '@/lib/analytics';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';
import { ArrowRight, Quote, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

const stagger = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const metrics = [
  { value: '2.5M+', label: 'Downloads' },
  { value: '4.7/5', label: 'Average Rating' },
  { value: '4+', label: 'Apps Published' },
  { value: '50K+', label: 'Daily Active Users' },
];

const testimonials = [
  {
    quote: "Coinzy completely changed how I manage my finances. The AI categorization is incredibly accurate and saves me hours every month.",
    author: "Priya M.",
    role: "Freelance Designer",
    app: "Coinzy",
  },
  {
    quote: "Insecto is a game-changer for nature enthusiasts. My kids love pointing the camera at bugs and learning about them instantly.",
    author: "Rahul K.",
    role: "Parent & Nature Lover",
    app: "Insecto",
  },
  {
    quote: "Habiteazy helped me build a consistent morning routine. The streak tracking keeps me motivated every single day.",
    author: "Sneha T.",
    role: "Marketing Professional",
    app: "Habiteazy",
  },
  {
    quote: "Banknotes is fascinating! I travel a lot and love scanning currencies from different countries. The history section is amazing.",
    author: "Arjun D.",
    role: "Travel Blogger",
    app: "Banknotes",
  },
  {
    quote: "The AI accuracy across all Trackzio apps is impressive. You can tell the team really cares about getting it right.",
    author: "Meera S.",
    role: "Tech Enthusiast",
    app: "Trackzio",
  },
];

const appEvents: Record<string, string> = {
  coinzy: 'home_Coinzy_explore_click',
  banknotes: 'home_Banknotes_explore_click',
  insecto: 'home_insecto_explore_click',
  habiteazy: 'home_Habiteazy_explore_click',
};

export default function Home() {
  usePageAnalytics('home', 'page_view_home');
  const [activeApp, setActiveApp] = useState(0);
  const selected = apps[activeApp];
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener('scroll', updateScrollButtons);
    return () => el.removeEventListener('scroll', updateScrollButtons);
  }, []);

  const scrollCarousel = (dir: 'left' | 'right') => {
    const el = carouselRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <div className="snap-y snap-mandatory">
      {/* ── Section 1: Hero ── */}
      <section className="min-h-[90vh] flex items-center justify-center relative overflow-hidden snap-start">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(var(--primary)/0.06),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_bottom_right,hsl(var(--secondary)/0.04),transparent_60%)]" />

        <div className="container-site relative z-10">
          <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-6"
            >
              AI-Powered Mobile Apps
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold font-display leading-[1.1] tracking-tight"
            >
              Making Lives Easier
              <br />
              <span className="text-gradient">Every App, Every Day.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed"
            >
              Trackzio builds apps that fit into your life, whether you're exploring a hobby, taking care of your health, or looking to the stars. Thoughtfully made, deeply researched, and always built with you in mind.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-10 flex items-center justify-center gap-4 flex-wrap"
            >
              <Link
                to="/apps"
                onClick={() => trackEvent('hero_explore_apps', { page_name: 'home' })}
                className="inline-flex items-center gap-2 h-12 px-8 rounded-2xl bg-primary text-primary-foreground font-semibold text-base transition-all hover:opacity-90 glow group"
              >
                Explore Our Apps
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator — small bouncing arrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={24} className="text-muted-foreground/40" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Section 2: Our Applications ── */}
      <section className="min-h-screen py-24 sm:py-32 snap-start">
        <div className="container-site">
          <motion.div {...fadeUp} className="max-w-2xl mb-20">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">Our Applications</p>
            <h2 className="text-4xl sm:text-5xl font-bold font-display leading-tight">
              Apps that make life
              <br />
              <span className="text-gradient">simpler & smarter</span>
            </h2>
          </motion.div>

          {/* Interactive list + preview */}
          <motion.div
            {...stagger}
            transition={{ duration: 0.7 }}
            className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start"
          >
            {/* Left: App list */}
            <div className="lg:w-[300px] w-full shrink-0 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
              {apps.map((app, i) => (
                <button
                  key={app.id}
                  onClick={() => setActiveApp(i)}
                  onMouseEnter={() => setActiveApp(i)}
                  className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all duration-300 w-full min-w-[200px] lg:min-w-0 ${
                    activeApp === i
                      ? 'bg-primary/10'
                      : 'hover:bg-muted/60'
                  }`}
                >
                  <img
                    src={app.logo}
                    alt={app.name}
                    className="w-10 h-10 rounded-xl shrink-0"
                  />
                  <div className="overflow-hidden flex-1">
                    <div
                      className={`font-semibold text-sm transition-colors duration-300 ${
                        activeApp === i ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      {app.name}
                    </div>
                    <div className="text-xs text-muted-foreground leading-snug">
                      {app.tagline}
                    </div>
                  </div>
                  {activeApp === i && (
                    <motion.div
                      layoutId="app-indicator"
                      className="hidden lg:block ml-auto w-1 h-8 rounded-full bg-primary shrink-0"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Right: Preview panel */}
            <div className="flex-1 w-full min-h-[420px] relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="flex flex-col sm:flex-row items-center gap-10 lg:gap-14"
                >
                  {/* Preview visual */}
                  <div
                    className="w-full sm:w-1/2 aspect-square max-w-[360px] rounded-3xl flex items-center justify-center relative overflow-hidden"
                    style={{
                      background: `linear-gradient(160deg, hsl(${selected.accentHsl} / 0.1), hsl(${selected.accentHsl} / 0.03))`,
                    }}
                  >
                    <motion.img
                      src={selected.logo}
                      alt={`${selected.name} logo`}
                      className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      style={{
                        boxShadow: `0 20px 60px -12px hsl(${selected.accentHsl} / 0.25)`,
                      }}
                    />
                    <div
                      className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-[0.06]"
                      style={{ background: `hsl(${selected.accentHsl})` }}
                    />
                    <div
                      className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full opacity-[0.04]"
                      style={{ background: `hsl(${selected.accentHsl})` }}
                    />
                  </div>

                  {/* Preview text */}
                  <div className="flex-1 w-full sm:w-1/2">
                    <span
                      className="inline-block text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full mb-4"
                      style={{
                        color: `hsl(${selected.accentHsl})`,
                        background: `hsl(${selected.accentHsl} / 0.1)`,
                      }}
                    >
                      {selected.icon} {selected.name}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold font-display leading-snug mb-4">
                      {selected.tagline}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {selected.description}
                    </p>
                    <Link
                      to={`/apps/${selected.id}`}
                      onClick={() => {
                        trackEvent('portfolio_tile_click', { app_name: selected.name, page_name: 'home' });
                        trackEvent(appEvents[selected.id] || '', { app_name: selected.name, page_name: 'home' });
                      }}
                      className="inline-flex items-center gap-2 h-10 px-6 rounded-xl text-sm font-semibold transition-all group text-primary-foreground"
                      style={{ backgroundColor: `hsl(${selected.accentHsl})` }}
                    >
                      Explore Now
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Section 3: Stats ── */}
      <section className="min-h-[70vh] flex items-center snap-start">
        <div className="container-site w-full">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">By the Numbers</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">
              Trusted by millions
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center py-8"
              >
                <div className="text-5xl sm:text-6xl lg:text-7xl font-bold font-display text-gradient mb-3">
                  {m.value}
                </div>
                <div className="text-sm sm:text-base text-muted-foreground tracking-wide">
                  {m.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: Testimonials Carousel ── */}
      <section className="min-h-[80vh] flex items-center py-24 sm:py-32 snap-start">
        <div className="container-site w-full">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">What People Say</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">
              Loved by our users
            </h2>
          </motion.div>

          <div className="relative">
            {/* Carousel scroll buttons */}
            {canScrollLeft && (
              <button
                onClick={() => scrollCarousel('left')}
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                style={{ boxShadow: 'var(--shadow-card)' }}
              >
                <ChevronLeft size={18} />
              </button>
            )}
            {canScrollRight && (
              <button
                onClick={() => scrollCarousel('right')}
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                style={{ boxShadow: 'var(--shadow-card)' }}
              >
                <ChevronRight size={18} />
              </button>
            )}

            <div
              ref={carouselRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="min-w-[320px] sm:min-w-[380px] max-w-[400px] flex-shrink-0 snap-start"
                >
                  <div className="p-8 sm:p-10 rounded-3xl bg-card h-full flex flex-col" style={{ boxShadow: 'var(--shadow-card)' }}>
                    <Quote size={28} className="text-primary/20 mb-6" />
                    <p className="text-base sm:text-lg leading-relaxed text-foreground flex-1 font-medium">
                      "{t.quote}"
                    </p>
                    <div className="mt-8 flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center font-display font-bold text-primary text-sm">
                        {t.author.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-sm">{t.author}</div>
                        <div className="text-xs text-muted-foreground">{t.role} · {t.app}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
