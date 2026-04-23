import { useEffect, useRef, useCallback, useState } from "react";
import type { StaticImageData } from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { imageSrc } from "@/lib/imageSrc";

interface ShowcaseFeature {
  screenshot: string | StaticImageData;
  title: string;
  description: string;
}

interface FeatureShowcaseProps {
  features: ShowcaseFeature[];
  accentHsl: string;
}

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

export default function FeatureShowcase({ features, accentHsl }: FeatureShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeAutoRef = useRef<() => void>(() => {});
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
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
    setActiveIndex(getActiveSlideIndex(el, features.length));
  }, [features.length]);

  const onScroll = useCallback(() => {
    requestAnimationFrame(updateFromScroll);
  }, [updateFromScroll]);

  useEffect(() => {
    updateFromScroll();
  }, [features, updateFromScroll]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || features.length === 0) return;

    const clearAuto = () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
        autoScrollRef.current = null;
      }
    };

    const startAuto = () => {
      clearAuto();
      autoScrollRef.current = setInterval(() => {
        if (!el) return;
        if (el.scrollWidth <= el.clientWidth + 1) return;
        const step = getScrollStep(el);
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 10) {
          el.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          el.scrollBy({ left: step, behavior: 'smooth' });
        }
      }, 4000);
    };

    resumeAutoRef.current = startAuto;

    const pause = () => clearAuto();
    const resume = () => startAuto();

    el.addEventListener('scroll', onScroll, { passive: true });
    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', resume);
    el.addEventListener('touchstart', pause, { passive: true });
    el.addEventListener('touchend', resume);

    const onResize = () => requestAnimationFrame(updateFromScroll);
    window.addEventListener('resize', onResize);

    startAuto();

    return () => {
      clearAuto();
      resumeAutoRef.current = () => {};
      el.removeEventListener('scroll', onScroll);
      el.removeEventListener('mouseenter', pause);
      el.removeEventListener('mouseleave', resume);
      el.removeEventListener('touchstart', pause);
      el.removeEventListener('touchend', resume);
      window.removeEventListener('resize', onResize);
    };
  }, [features.length, onScroll, updateFromScroll]);

  const pauseAndResumeLater = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
      autoScrollRef.current = null;
    }
    window.setTimeout(() => resumeAutoRef.current(), 8000);
  };

  const scrollCarousel = (dir: 'left' | 'right') => {
    const el = containerRef.current;
    if (!el) return;
    pauseAndResumeLater();
    const step = getScrollStep(el);
    el.scrollBy({ left: dir === 'left' ? -step : step, behavior: 'smooth' });
  };

  const goToSlide = (index: number) => {
    const el = containerRef.current;
    if (!el || index < 0 || index >= el.children.length) return;
    pauseAndResumeLater();
    const child = el.children[index] as HTMLElement;
    el.scrollTo({ left: child.offsetLeft, behavior: 'smooth' });
  };

  if (features.length === 0) return null;

  const showNav = features.length > 1;

  return (
    <section
      className="flex flex-col items-center justify-center overflow-hidden"
      style={{ height: '100vh', maxHeight: '100vh', padding: 'clamp(16px, 2vh, 32px) 0' }}
    >
      <div className="flex flex-col items-center justify-between h-full w-full" style={{ maxWidth: '1200px', width: 'clamp(300px, 92%, 1200px)', maxHeight: '100%' }}>
        <div className="text-center shrink-0 mb-3 px-2">
          <p
            className="font-medium tracking-[0.2em] uppercase mb-1"
            style={{ color: `hsl(${accentHsl})`, fontSize: 'clamp(0.65rem, 1vw, 0.8rem)' }}
          >
            App Showcase
          </p>
          <h2
            className="font-bold font-display text-foreground"
            style={{ fontSize: 'clamp(1.25rem, 3vw, 2rem)' }}
          >
            See it in action
          </h2>
          {showNav && (
            <p className="text-[0.65rem] sm:text-xs text-muted-foreground mt-2 max-w-xs mx-auto leading-snug">
              Swipe or use arrows to explore
            </p>
          )}
        </div>

        <div className="relative flex-1 min-h-0 w-full flex flex-col min-w-0">
          {showNav && canScrollLeft && (
            <button
              type="button"
              aria-label="Previous screenshots"
              onClick={() => scrollCarousel('left')}
              className="absolute left-0 sm:left-1 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border bg-card/95 text-muted-foreground shadow-md backdrop-blur-sm transition-colors hover:text-foreground hover:bg-card lg:-left-2"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <ChevronLeft className="h-5 w-5 shrink-0" aria-hidden />
            </button>
          )}
          {showNav && canScrollRight && (
            <button
              type="button"
              aria-label="Next screenshots"
              onClick={() => scrollCarousel('right')}
              className="absolute right-0 sm:right-1 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border bg-card/95 text-muted-foreground shadow-md backdrop-blur-sm transition-colors hover:text-foreground hover:bg-card lg:-right-2"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <ChevronRight className="h-5 w-5 shrink-0" aria-hidden />
            </button>
          )}

          <div
            ref={containerRef}
            role="region"
            aria-label="App screenshots carousel"
            aria-roledescription="carousel"
            className="flex flex-1 min-h-0 w-full gap-4 lg:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory snap-always scrollbar-hide pb-2 px-8 sm:px-10 lg:px-12"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {features.map((feature, index) => (
              <article
                key={`${feature.title}-${index}`}
                className="flex shrink-0 flex-col h-full min-h-0 py-1 snap-start w-full min-w-0 flex-[0_0_100%] max-lg:max-w-full lg:w-auto lg:flex-[0_0_calc((100%-2.5rem)/3)]"
              >
                <div
                  className="flex flex-col rounded-2xl overflow-hidden bg-card border border-border/30 min-h-0 flex-1 h-full"
                  style={{ boxShadow: '0 4px 20px -4px rgba(0,0,0,0.06)' }}
                >
                  <div
                    className="flex-1 min-h-0 flex items-center justify-center p-2"
                    style={{
                      background: `linear-gradient(135deg, hsl(${accentHsl} / 0.06), hsl(${accentHsl} / 0.02))`,
                    }}
                  >
                    <img
                      src={imageSrc(feature.screenshot)}
                      alt={feature.title}
                      loading="lazy"
                      decoding="async"
                      className="object-contain block mx-auto w-auto max-w-full max-h-[calc(100vh-220px)] h-full"
                    />
                  </div>
                  <div className="px-3 py-2 text-center shrink-0">
                    <h3 className="font-bold text-base text-foreground">{feature.title}</h3>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {showNav && (
          <div className="mt-1 w-full max-w-md mx-auto shrink-0 px-3 space-y-3">
            <div className="h-1.5 rounded-full bg-muted overflow-hidden" aria-hidden="true">
              <div
                className="h-full rounded-full transition-[width] duration-150 ease-out"
                style={{
                  width: `${Math.round(scrollProgress * 100)}%`,
                  backgroundColor: `hsl(${accentHsl})`,
                }}
              />
            </div>
            <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="Screenshot slides">
              {features.map((feature, i) => (
                <button
                  key={`dot-${feature.title}-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={activeIndex === i}
                  aria-label={`Go to slide ${i + 1}: ${feature.title}`}
                  onClick={() => goToSlide(i)}
                  className="h-2.5 w-2.5 sm:h-2 sm:w-2 rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
