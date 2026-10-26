import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from "next/router";
import Link from "next/link";
import { motion } from 'framer-motion';
import { trackEvent } from '@/lib/analytics';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';
import { ArrowRight, Quote, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import FloatingAppShowcase from '@/components/FloatingAppShowcase';
import { getClientApps } from '@/lib/content/apps-client';
import { homeMetrics } from '@/lib/companyMetrics';

function getScrollStep(el: HTMLElement): number {
  const first = el.firstElementChild as HTMLElement | null;
  if (!first) return el.clientWidth;
  const gap = parseFloat(getComputedStyle(el).gap) || 0;
  return first.offsetWidth + gap;
}

function visibleReviewDots(count: number, active: number) {
  const size = 7;
  if (count <= size) {
    return Array.from({ length: count }, (_, index) => ({ index, more: false }));
  }
  const start = Math.max(0, Math.min(active - 3, count - size));
  return Array.from({ length: size }, (_, offset) => {
    const index = start + offset;
    const more = (offset === 0 && start > 0) || (offset === size - 1 && start + size < count);
    return { index, more };
  });
}

function getActiveSlideIndex(el: HTMLElement, count: number): number {
  if (count <= 1) return 0;
  const maxScroll = el.scrollWidth - el.clientWidth;
  if (maxScroll <= 0) return 0;
  const center = el.scrollLeft + el.clientWidth / 2;
  let best = 0;
  for (let i = 0; i < el.children.length; i++) {
    const c = el.children[i] as HTMLElement;
    const mid = c.offsetLeft + c.offsetWidth / 2;
    if (mid <= center) best = i;
  }
  return best;
}
const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

const metrics = homeMetrics;

const reviewApps = getClientApps().filter((app) => app.reviews.length > 0);

const allReviews = reviewApps.flatMap((app) =>
  app.reviews.map((review) => ({
    quote: review.quote,
    author: review.author,
    appId: app.id,
    appName: app.name,
    accentHsl: app.accentHsl,
  })),
);

export default function Home() {
  usePageAnalytics('home', 'page_view_home');
  const { asPath } = useRouter();
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedAppId, setSelectedAppId] = useState("all");
  const testimonials = selectedAppId === "all"
    ? allReviews
    : allReviews.filter((review) => review.appId === selectedAppId);

  // Handle hash scroll (e.g. /#apps from redirects)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const scrollToApps = () => {
      if (window.location.hash === "#apps" || asPath.includes("#apps")) {
        setTimeout(() => {
          document.getElementById("apps")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    };
    scrollToApps();
    window.addEventListener("hashchange", scrollToApps);
    return () => window.removeEventListener("hashchange", scrollToApps);
  }, [asPath]);

  const updateFromScroll = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      setScrollProgress(0);
      setCanScrollLeft(false);
      setCanScrollRight(false);
      setActiveIndex(0);
      return;
    }
    setScrollProgress(el.scrollLeft / maxScroll);
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < maxScroll - 10);
    setActiveIndex(getActiveSlideIndex(el, testimonials.length));
  }, [testimonials.length]);

  const onScroll = useCallback(() => {
    requestAnimationFrame(updateFromScroll);
  }, [updateFromScroll]);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollTo({ left: 0 });
    updateFromScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    const resizeObserver = new ResizeObserver(() => updateFromScroll());
    resizeObserver.observe(el);

    // Auto-scroll
    const startAutoScroll = () => {
      autoScrollRef.current = setInterval(() => {
        if (!el) return;
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 10) {
          el.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          el.scrollBy({ left: getScrollStep(el), behavior: 'smooth' });
        }
      }, 4000);
    };
    startAutoScroll();

    const pause = () => { if (autoScrollRef.current) clearInterval(autoScrollRef.current); };
    const resume = () => { pause(); startAutoScroll(); };
    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', resume);

    el.addEventListener('touchstart', pause, { passive: true });
    el.addEventListener('touchend', resume);

    const onResize = () => requestAnimationFrame(updateFromScroll);
    window.addEventListener('resize', onResize);

    return () => {
      resizeObserver.disconnect();
      el.removeEventListener('scroll', onScroll);
      el.removeEventListener('mouseenter', pause);
      el.removeEventListener('mouseleave', resume);
      el.removeEventListener('touchstart', pause);
      el.removeEventListener('touchend', resume);
      window.removeEventListener('resize', onResize);
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, [onScroll, updateFromScroll, selectedAppId]);

  const scrollCarousel = (dir: 'left' | 'right') => {
    const el = carouselRef.current;
    if (!el) return;
    const amount = getScrollStep(el);
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  const goToSlide = (index: number) => {
    const el = carouselRef.current;
    if (!el || index < 0 || index >= el.children.length) return;
    const child = el.children[index] as HTMLElement;
    el.scrollTo({ left: child.offsetLeft, behavior: 'smooth' });
  };

  return (
    <div className="snap-y snap-mandatory max-sm:snap-none">
      {/* ── Section 1: Hero — Light background ── */}
      <section className="min-h-[min(100dvh,56rem)] sm:min-h-screen flex items-center justify-center py-12 sm:py-24 lg:py-32 relative overflow-hidden snap-start pt-[max(0.75rem,env(safe-area-inset-top))]">
        {/* Soft radial glow */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 65% 55% at 50% 45%, #f2f3f4 0%, #ffffff 75%)' }}
        />

        <div className="container-site relative z-10 px-3 sm:px-0">
          <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center">
            <p className="text-xs sm:text-sm font-medium tracking-[0.15em] sm:tracking-[0.2em] uppercase text-primary mb-4 sm:mb-6">
              AI-Powered Tools
            </p>

            <h1 className="text-[clamp(1.65rem,5.5vw+0.5rem,2.5rem)] sm:text-5xl lg:text-6xl xl:text-7xl font-bold font-display leading-[1.1] sm:leading-[1.08] tracking-tight mb-5 sm:mb-6 text-foreground text-balance px-0.5">
              Digital Platforms for Collectibles &{' '}
              <span className="text-primary">Hobbies</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed px-1 sm:px-0">
              Trackzio builds intelligent tools that help people identify, understand, organize, and exchange the things they care about.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-6 sm:mt-8 flex items-stretch sm:items-center justify-center gap-4 flex-wrap"
            >
              <Link
                href="/about"
                onClick={() => {
                  trackEvent('hero_discover_story', { page_name: 'home' });
                }}
                className="inline-flex items-center justify-center gap-2 min-h-[48px] w-full max-w-[20rem] sm:w-auto sm:max-w-none px-6 sm:px-8 rounded-xl bg-primary text-primary-foreground font-semibold text-sm sm:text-base transition-all hover:opacity-90 glow group"
              >
                Discover Our Story
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1 shrink-0" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-6 sm:bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer pb-[env(safe-area-inset-bottom,0)]"
          onClick={() => document.getElementById('apps')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span className="text-xs tracking-[0.15em] uppercase text-foreground/50">Our Products</span>
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
      <section className="min-h-0 sm:min-h-screen flex items-center py-16 sm:py-24 lg:py-32 snap-start">
        <div className="container-site w-full">
          <motion.div {...fadeUp} className="text-center mb-10 sm:mb-14 md:mb-16 max-w-2xl mx-auto px-1">
            <p className="type-kicker">By the Numbers</p>
            <h2 className="type-title">
            Trusted by a global userbase
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-4 max-w-4xl sm:max-w-none mx-auto">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center py-4 sm:py-8"
              >
                <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display text-primary mb-2 sm:mb-3 tabular-nums">
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
      <section className="scroll-mt-20 py-16 sm:py-24 lg:py-32 snap-start bg-section-tinted">
        <div className="container-site w-full">
          <motion.div {...fadeUp} className="text-center mb-10 sm:mb-14 md:mb-16 max-w-2xl mx-auto px-1">
            <p className="type-kicker">What People Say</p>
            <h2 className="type-title">
              Our App Reviews
            </h2>
            <div className="mt-6 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Filter reviews by app">
              <button
                type="button"
                role="tab"
                aria-selected={selectedAppId === "all"}
                onClick={() => setSelectedAppId("all")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-colors ${
                  selectedAppId === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground hover:border-primary/40 border border-border shadow-sm"
                }`}
              >
                All
              </button>
              {reviewApps.map((app) => {
                const selected = selectedAppId === app.id;
                return (
                  <button
                    key={app.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setSelectedAppId(app.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-colors border ${
                      selected ? "text-white border-transparent shadow-sm" : "bg-card text-foreground hover:border-primary/40 border-border shadow-sm"
                    }`}
                    style={selected ? { backgroundColor: `hsl(${app.accentHsl})` } : undefined}
                  >
                    {app.name}
                  </button>
                );
              })}
            </div>
          </motion.div>

          <div className="relative px-1 sm:px-0 max-w-7xl mx-auto min-w-0">
            {testimonials.length > 1 && (
              <button
                type="button"
                aria-label="Previous testimonials"
                onClick={() => scrollCarousel('left')}
                disabled={!canScrollLeft}
                className="absolute left-1 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-colors hover:bg-card disabled:pointer-events-none disabled:opacity-40 sm:left-0 sm:h-10 sm:w-10"
                style={{ boxShadow: 'var(--shadow-card)' }}
              >
                <ChevronLeft className="h-5 w-5 shrink-0" />
              </button>
            )}
            {testimonials.length > 1 && (
              <button
                type="button"
                aria-label="Next testimonials"
                onClick={() => scrollCarousel('right')}
                disabled={!canScrollRight}
                className="absolute right-1 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-colors hover:bg-card disabled:pointer-events-none disabled:opacity-40 sm:right-0 sm:h-10 sm:w-10"
                style={{ boxShadow: 'var(--shadow-card)' }}
              >
                <ChevronRight className="h-5 w-5 shrink-0" />
              </button>
            )}

            <div
              ref={carouselRef}
              role="region"
              aria-label="App reviews carousel"
              aria-roledescription="carousel"
              className="flex gap-4 sm:gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-2 px-8 sm:px-10 lg:px-12"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {testimonials.map((t, i) => (
                <motion.div
                  key={`${t.appId}-${t.author}-${i}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(i * 0.08, 0.4) }}
                  className="flex shrink-0 flex-col min-h-0 snap-start w-full min-w-0 flex-[0_0_100%] lg:w-auto lg:flex-[0_0_calc((100%-3.75rem)/4)]"
                >
                  <div className="card-hover p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-card h-full flex flex-col min-h-[11rem] sm:min-h-0 border border-border/30">
                    <p className="type-kicker" style={{ color: `hsl(${t.accentHsl})` }}>
                      {t.appName}
                    </p>
                    <Quote size={22} className="text-primary/25 mb-3" />
                    <p className="type-copy flex-1 font-medium">"{t.quote}"</p>
                    <div className="mt-3 flex items-center gap-3">
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

            {testimonials.length > 1 && (
              <div className="mt-5 flex flex-col items-center gap-3">
                <div className="h-1 w-40 overflow-hidden rounded-full bg-foreground/15 sm:w-56" aria-hidden="true">
                  <div
                    className="h-full rounded-full bg-primary transition-[width] duration-150 ease-out"
                    style={{ width: `${Math.round(scrollProgress * 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-center" role="tablist" aria-label="Testimonial slides">
                  {visibleReviewDots(testimonials.length, activeIndex).map(({ index, more }) => {
                    const review = testimonials[index];
                    const selected = activeIndex === index;
                    return (
                      <button
                        key={`dot-${review.author}-${index}`}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        aria-label={`Go to ${review.appName} review from ${review.author}`}
                        onClick={() => goToSlide(index)}
                        className="flex h-6 w-6 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                      >
                        <span
                          className={`rounded-full transition-all duration-200 ${
                            selected ? "h-2 w-5 bg-primary" : more ? "h-1.5 w-1.5 bg-foreground/25" : "h-2 w-2 bg-foreground/35"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 border-t border-border/60 snap-start" aria-labelledby="home-disclaimer-heading">
        <div className="container-site max-w-3xl mx-auto px-3 sm:px-0">
          <motion.div {...fadeUp}>
            <h2 id="home-disclaimer-heading" className="type-disclaimer-title text-primary">
              Disclaimer
            </h2>
            <p className="type-body">
              This platform is a hobbyist identification and discovery tool and does not provide financial services, payment
              processing, or trading for cryptocurrencies or any digital assets. All listings for physical collectibles are for
              showcase purposes only, with any subsequent connections or transactions occurring entirely off-platform between
              independent users. Our identification tools for numismatics, banknotes, and nature are for educational use and
              do not constitute professional appraisals, legal certifications, or financial valuations.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
