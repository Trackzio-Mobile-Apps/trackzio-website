import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { apps } from '@/lib/appData';
import { trackEvent } from '@/lib/analytics';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';
import { useIsMobile } from '@/hooks/use-mobile';
import { getPlatform, getDownloadUrl } from '@/lib/platformUtils';
import { ArrowRight, Quote, ChevronDown, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import FloatingAppShowcase from '@/components/FloatingAppShowcase';
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
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);
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

    // Auto-scroll
    const startAutoScroll = () => {
      autoScrollRef.current = setInterval(() => {
        if (!el) return;
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 10) {
          el.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          const cardWidth = el.querySelector<HTMLElement>(':scope > div')?.offsetWidth || el.clientWidth;
          el.scrollBy({ left: cardWidth + 20, behavior: 'smooth' });
        }
      }, 4000);
    };
    startAutoScroll();

    const pause = () => { if (autoScrollRef.current) clearInterval(autoScrollRef.current); };
    const resume = () => { pause(); startAutoScroll(); };
    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', resume);

    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      el.removeEventListener('mouseenter', pause);
      el.removeEventListener('mouseleave', resume);
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, []);

  const scrollCarousel = (dir: 'left' | 'right') => {
    const el = carouselRef.current;
    if (!el) return;
    const cardWidth = el.querySelector<HTMLElement>(':scope > div')?.offsetWidth || el.clientWidth;
    const amount = cardWidth + 20;
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
      <section className="min-h-screen flex items-center justify-center py-24 sm:py-32 relative overflow-hidden snap-start">
        {/* Soft radial glow */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 65% 55% at 50% 45%, #f2f3f4 0%, #ffffff 75%)' }}
        />

        <div className="container-site relative z-10">
          <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-6">AI-Powered Mobile Apps</p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold font-display leading-[1.08] tracking-tight mb-6 text-foreground">
              Making Lives Easier{' '}
              <span className="text-primary">Every App, Every Day.</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Trackzio builds apps that fit into your life — thoughtfully made, deeply researched, and always built with you in mind.
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

      {/* ── Section 2: Floating App Showcase ── */}
      <section id="apps" className="snap-start bg-section-tinted">
        <FloatingAppShowcase />
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

          <div className="relative">
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
              className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(i * 0.08, 0.4) }}
                  className={`flex-shrink-0 snap-start ${isMobile ? 'w-full' : ''}`}
                  style={isMobile ? undefined : { width: 'calc(25% - 15px)', minWidth: '280px' }}
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
        </div>
      </section>
    </div>
  );
}
