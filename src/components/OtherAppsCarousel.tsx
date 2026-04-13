import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { apps } from '@/lib/appData';
import { trackEvent } from '@/lib/analytics';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

function getScrollStep(el: HTMLElement): number {
  const first = el.firstElementChild as HTMLElement | null;
  if (!first) return el.clientWidth;
  const gap = parseFloat(getComputedStyle(el).gap) || 0;
  return first.offsetWidth + gap;
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

interface OtherAppsCarouselProps {
  excludeAppId: string;
  accentHsl: string;
}

export default function OtherAppsCarousel({ excludeAppId, accentHsl }: OtherAppsCarouselProps) {
  const otherApps = useMemo(() => apps.filter((a) => a.id !== excludeAppId), [excludeAppId]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateFromScroll = useCallback(() => {
    const el = containerRef.current;
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
    setActiveIndex(getActiveSlideIndex(el, otherApps.length));
  }, [otherApps.length]);

  const onScroll = useCallback(() => {
    requestAnimationFrame(updateFromScroll);
  }, [updateFromScroll]);

  useEffect(() => {
    updateFromScroll();
  }, [otherApps, updateFromScroll]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onResize = () => requestAnimationFrame(updateFromScroll);
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [onScroll, updateFromScroll, otherApps.length]);

  const scrollCarousel = (dir: 'left' | 'right') => {
    const el = containerRef.current;
    if (!el) return;
    const step = getScrollStep(el);
    el.scrollBy({ left: dir === 'left' ? -step : step, behavior: 'smooth' });
  };

  const goToSlide = (index: number) => {
    const el = containerRef.current;
    if (!el || index < 0 || index >= el.children.length) return;
    const child = el.children[index] as HTMLElement;
    el.scrollTo({ left: child.offsetLeft, behavior: 'smooth' });
  };

  if (otherApps.length === 0) return null;

  const showNav = otherApps.length > 1;

  return (
    <section className="py-20 sm:py-24 snap-start border-t border-border/50">
      <div className="container-site w-full">
        <motion.div {...fadeUp} className="text-center mb-10 sm:mb-12">
          <p
            className="text-sm font-medium tracking-[0.2em] uppercase mb-3"
            style={{ color: `hsl(${accentHsl})` }}
          >
            More from Trackzio
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground">Explore our other apps</h2>
          {showNav && (
            <p className="text-sm text-muted-foreground mt-3 max-w-md mx-auto leading-snug">
              Swipe or use arrows to browse
            </p>
          )}
        </motion.div>

        <div className="relative max-w-5xl mx-auto min-w-0">
          {showNav && canScrollLeft && (
            <button
              type="button"
              aria-label="Previous apps"
              onClick={() => scrollCarousel('left')}
              className="absolute left-0 sm:left-0 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border bg-card/95 text-muted-foreground shadow-md backdrop-blur-sm transition-colors hover:text-foreground hover:bg-card lg:-left-2"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <ChevronLeft className="h-5 w-5 shrink-0" aria-hidden />
            </button>
          )}
          {showNav && canScrollRight && (
            <button
              type="button"
              aria-label="Next apps"
              onClick={() => scrollCarousel('right')}
              className="absolute right-0 sm:right-0 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border bg-card/95 text-muted-foreground shadow-md backdrop-blur-sm transition-colors hover:text-foreground hover:bg-card lg:-right-2"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <ChevronRight className="h-5 w-5 shrink-0" aria-hidden />
            </button>
          )}

          <div
            ref={containerRef}
            role="region"
            aria-label="Other Trackzio apps"
            aria-roledescription="carousel"
            className="flex gap-4 lg:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide pb-2 px-8 sm:px-10 lg:px-12"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {otherApps.map((app) => (
              <article
                key={app.id}
                className="flex shrink-0 flex-col min-h-0 snap-start w-full min-w-0 flex-[0_0_100%] lg:w-auto lg:flex-[0_0_calc((100%-2.5rem)/3)]"
              >
                <Link
                  to={`/apps/${app.id}`}
                  onClick={() =>
                    trackEvent('app_detail_other_app_click', {
                      from_app: excludeAppId,
                      to_app: app.id,
                      app_name: app.name,
                    })
                  }
                  className="group flex flex-col h-full rounded-2xl bg-card border border-border/40 p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-border"
                  style={{ boxShadow: 'var(--shadow-card)' }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={app.logo}
                      alt={`${app.name} logo`}
                      className="w-14 h-14 rounded-xl shrink-0"
                      style={{ boxShadow: `0 4px 16px -4px hsl(${app.accentHsl} / 0.25)` }}
                    />
                    <div className="min-w-0 text-left">
                      <h3 className="font-display font-bold text-lg text-foreground">{app.name}</h3>
                      <p className="text-sm text-muted-foreground leading-snug mt-0.5">{app.tagline}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 text-left flex-1 mb-5">
                    {app.description}
                  </p>
                  <span
                    className="inline-flex items-center gap-1.5 text-sm font-semibold mt-auto"
                    style={{ color: `hsl(${app.accentHsl})` }}
                  >
                    Explore app
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </Link>
              </article>
            ))}
          </div>
        </div>

        {showNav && (
          <div className="mt-4 w-full max-w-md mx-auto shrink-0 px-3 space-y-3">
            <div className="h-1.5 rounded-full bg-muted overflow-hidden" aria-hidden="true">
              <div
                className="h-full rounded-full transition-[width] duration-150 ease-out"
                style={{
                  width: `${Math.round(scrollProgress * 100)}%`,
                  backgroundColor: `hsl(${accentHsl})`,
                }}
              />
            </div>
            <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="App slides">
              {otherApps.map((app, i) => (
                <button
                  key={`dot-${app.id}`}
                  type="button"
                  role="tab"
                  aria-selected={activeIndex === i}
                  aria-label={`Go to ${app.name}`}
                  onClick={() => goToSlide(i)}
                  className="h-2.5 w-2.5 rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  style={{
                    backgroundColor: i === activeIndex ? `hsl(${accentHsl})` : 'hsl(var(--muted))',
                    transform: i === activeIndex ? 'scale(1.25)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
