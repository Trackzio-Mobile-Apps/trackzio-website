import { useEffect, useRef, useCallback, useState } from 'react';

interface ShowcaseFeature {
  screenshot: string;
  title: string;
  description: string;
}

interface FeatureShowcaseProps {
  features: ShowcaseFeature[];
  accentHsl: string;
}

export default function FeatureShowcase({ features, accentHsl }: FeatureShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const updateScrollProgress = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      setScrollProgress(0);
      return;
    }
    setScrollProgress(el.scrollLeft / maxScroll);
  }, []);

  const onScroll = useCallback(() => {
    requestAnimationFrame(updateScrollProgress);
  }, [updateScrollProgress]);

  useEffect(() => {
    updateScrollProgress();
  }, [features, updateScrollProgress]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || features.length === 0) return;

    const clearAuto = () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
        autoScrollRef.current = null;
      }
    };

    const scrollOneSlide = () => {
      const first = el.firstElementChild as HTMLElement | null;
      if (!first) return el.clientWidth;
      const gap = parseFloat(getComputedStyle(el).gap) || 0;
      return first.offsetWidth + gap;
    };

    const tick = () => {
      if (!el) return;
      if (el.scrollWidth <= el.clientWidth + 1) return;
      const step = scrollOneSlide();
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 10) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: step, behavior: 'smooth' });
      }
    };

    const startAuto = () => {
      clearAuto();
      autoScrollRef.current = setInterval(tick, 4000);
    };

    const pause = () => clearAuto();
    const resume = () => startAuto();

    el.addEventListener('scroll', onScroll, { passive: true });
    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', resume);
    el.addEventListener('touchstart', pause, { passive: true });
    el.addEventListener('touchend', resume);

    const onResize = () => requestAnimationFrame(updateScrollProgress);
    window.addEventListener('resize', onResize);

    startAuto();

    return () => {
      clearAuto();
      el.removeEventListener('scroll', onScroll);
      el.removeEventListener('mouseenter', pause);
      el.removeEventListener('mouseleave', resume);
      el.removeEventListener('touchstart', pause);
      el.removeEventListener('touchend', resume);
      window.removeEventListener('resize', onResize);
    };
  }, [features.length, onScroll, updateScrollProgress]);

  if (features.length === 0) return null;

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
        </div>

        <div
          ref={containerRef}
          role="region"
          aria-label="App screenshots carousel"
          className="flex flex-1 min-h-0 w-full gap-4 md:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory snap-always scrollbar-hide pb-2 px-2 sm:px-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {features.map((feature, index) => (
            <article
              key={`${feature.title}-${index}`}
              className="flex shrink-0 flex-col h-full min-h-0 py-1 snap-start w-full flex-[0_0_100%] md:w-auto md:flex-[0_0_calc((100%-2.5rem)/3)]"
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
                    src={feature.screenshot}
                    alt={feature.title}
                    loading="lazy"
                    decoding="async"
                    className="object-contain block mx-auto w-auto max-w-full max-h-[calc(100vh-220px)] h-full"
                  />
                </div>
                <div className="px-3 py-2 text-center shrink-0">
                  <h3 className="font-bold text-xs text-foreground">{feature.title}</h3>
                  <p className="text-[0.65rem] text-muted-foreground mt-0.5 leading-snug">{feature.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {features.length > 1 && (
          <div className="mt-2 w-full max-w-md mx-auto shrink-0 px-4" aria-hidden="true">
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-[width] duration-150 ease-out"
                style={{
                  width: `${Math.round(scrollProgress * 100)}%`,
                  backgroundColor: `hsl(${accentHsl})`,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
