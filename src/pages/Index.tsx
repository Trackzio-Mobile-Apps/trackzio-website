import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { apps } from '@/lib/appData';
import { trackEvent } from '@/lib/analytics';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';
import { useIsMobile } from '@/hooks/use-mobile';
import { getPlatform, getDownloadUrl } from '@/lib/platformUtils';
import { ArrowRight, Quote, ChevronDown, ChevronLeft, ChevronRight, Download } from 'lucide-react';

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
  { value: '400K+', label: 'Total Downloads' },
  { value: '4.3+', label: 'Average Rating' },
  { value: '50K+', label: 'Active Users' },
];

const testimonials = [
  { quote: "This app makes building good habits fun and rewarding. It gamifies daily chores, turning routine tasks into small achievements that keep me motivated.", author: "Kunal" },
  { quote: "I've used a lot of habit trackers and games, and I really like this one. It's easy to add tasks and habits and configure them to meet my needs. It doesn't have a ton of ads, and right now the premium is only about $2/month so it's affordable. I work a flexible schedule of 50hr/week with my schedule changing with less than a day's notice, regularly. This app makes it much easier to organize my life despite the chaos and lack of time.", author: "Amanda" },
  { quote: "I love this app. Much easier to use than other apps like it. The UI is simple, making it easier to do what you want. The widget is perfect. I can't find anything wrong with it. Looking forward to future updates. Try this app. You won't be sorry.", author: "Koni" },
  { quote: "Guys this is super cute and fantastic!", author: "Myat" },
  { quote: "I make money in various currencies and this app is very very helpful in identifying the money that I have made in the different currencies. Good community.", author: "Kirti" },
  { quote: "Best banknote identifier with good accuracy. A must for casual users and collectors.", author: "Chitvan" },
  { quote: "Nice application for identification.", author: "Jaya" },
  { quote: "As an avid collector of US coins and currency for over 20 years, I can say I love the concept of the app and the fact that there's an included community within the app that allows us to interact amongst each other.", author: "Jaylin" },
  { quote: "Good coin scanner.", author: "Naing" },
  { quote: "It's very good and helps a lot.", author: "Colete" },
  { quote: "This is a great app for coin collectors. It's helpful in cataloging the collection virtually. Also, it provides visibility on the coins that have not been collected by me yet.", author: "Ankit" },
  { quote: "Accurate and awesome tool utility.", author: "Pierre" },
  { quote: "The app has a great UI with quick turnaround time to satisfy my curiosity.", author: "Aanish" },
  { quote: "Decent repertoire of insects available for identifying them.", author: "Pintu" },
  { quote: "Amazing app with such a vast library of readily available insects.", author: "Pallav" },
  { quote: "Best app to identify insects!!!", author: "Jay" },
];

const appEvents: Record<string, string> = {
  coinzy: 'home_Coinzy_explore_click',
  banknotes: 'home_Banknotes_explore_click',
  insecto: 'home_insecto_explore_click',
  habiteazy: 'home_Habiteazy_explore_click',
};

export default function Home() {
  usePageAnalytics('home', 'page_view_home');
  const location = useLocation();
  const [activeApp, setActiveApp] = useState(0);
  const selected = apps[activeApp];
  const isMobile = useIsMobile();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Handle hash scroll on mount
  useEffect(() => {
    if (location.hash === '#apps') {
      setTimeout(() => {
        document.getElementById('apps')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location]);

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

  const handleDownload = (app: typeof selected) => {
    const url = getDownloadUrl(app.iosUrl, app.androidUrl);
    if (url) {
      const platform = getPlatform();
      trackEvent(`home_${app.id}_download`, { platform, app_name: app.name });
      window.open(url, '_blank');
    }
  };

  return (
    <div className="snap-y snap-mandatory">
      {/* ── Section 1: Hero — Light background ── */}
      <section className="min-h-screen flex items-center justify-center pt-8 pb-12 relative overflow-hidden snap-start">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(var(--primary)/0.05),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_bottom_right,hsl(var(--primary)/0.03),transparent_60%)]" />

        <div className="container-site relative z-10">
          <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">AI-Powered Mobile Apps</p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display leading-[1.1] tracking-tight mb-4">
              AI Platforms for Collectors and <span className="text-primary">Enthusiasts</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Trackzio builds intelligent apps that help people identify, understand, organise, and exchange the things they care about.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-8 flex items-center justify-center gap-4 flex-wrap"
            >
              <a
                href="#apps"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('apps')?.scrollIntoView({ behavior: 'smooth' });
                  trackEvent('hero_explore_apps', { page_name: 'home' });
                }}
                className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-primary text-primary-foreground font-semibold text-base transition-all hover:opacity-90 glow group"
              >
                Explore Our Apps
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </a>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer"
          onClick={() => document.getElementById('apps')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span className="text-xs tracking-[0.15em] uppercase text-foreground/50">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          >
            <ChevronDown size={20} className="text-foreground/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Section 2: Our Applications — Tinted background ── */}
      <section id="apps" className="min-h-screen py-24 sm:py-32 snap-start bg-section-tinted">
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
                      ? 'bg-card shadow-sm'
                      : 'hover:bg-card/60'
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
                    className="w-full sm:w-1/2 aspect-square max-w-[360px] rounded-3xl flex items-center justify-center relative overflow-hidden bg-card"
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
                    <div className="flex items-center gap-3 flex-wrap">
                      <Link
                        to={`/apps/${selected.id}`}
                        onClick={() => {
                          trackEvent('portfolio_tile_click', { app_name: selected.name, page_name: 'home' });
                          trackEvent(appEvents[selected.id] || '', { app_name: selected.name, page_name: 'home' });
                        }}
                        className="inline-flex items-center gap-2 h-10 px-6 rounded-xl text-sm font-semibold transition-all group bg-primary text-primary-foreground hover:opacity-90 glow"
                      >
                        Explore Now
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                      </Link>
                      {isMobile && (selected.iosUrl || selected.androidUrl) && (
                        <button
                          onClick={() => handleDownload(selected)}
                          className="inline-flex items-center gap-2 h-10 px-6 rounded-xl text-sm font-semibold border-2 border-primary/30 text-primary transition-all hover:bg-primary/5"
                        >
                          <Download size={15} /> Download
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Section 3: Stats — Light background ── */}
      <section className="min-h-screen flex items-center snap-start">
        <div className="container-site w-full">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">By the Numbers</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">
              Trusted by millions
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-4">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center py-8"
              >
                <div className="text-5xl sm:text-6xl lg:text-7xl font-bold font-display text-primary mb-3">
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

      {/* ── Section 4: Testimonials — Tinted background ── */}
      <section className="min-h-screen flex items-center py-24 sm:py-32 snap-start bg-section-tinted">
        <div className="container-site w-full">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">What People Say</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">
              Loved by our users
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(i * 0.08, 0.4) }}
                >
                  <div className="p-6 rounded-2xl bg-card h-full flex flex-col" style={{ boxShadow: 'var(--shadow-card)' }}>
                    <Quote size={22} className="text-primary/25 mb-3" />
                    <p className="text-sm leading-relaxed text-foreground flex-1 font-medium">"{t.quote}"</p>
                    <div className="mt-5 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-display font-bold text-primary text-sm">
                        {t.author.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-sm">— {t.author}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
