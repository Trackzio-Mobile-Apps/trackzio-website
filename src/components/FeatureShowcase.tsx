import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const [current, setCurrent] = useState(0);
  const isMobile = useIsMobile();
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const count = features.length;

  // Preload all screenshots
  useEffect(() => {
    features.forEach(f => {
      const img = new Image();
      img.src = f.screenshot;
    });
  }, [features]);

  // Horizontal scroll pinning effect
  useEffect(() => {
    const section = sectionRef.current;
    const scrollContainer = scrollRef.current;
    if (!section || !scrollContainer || isMobile) return;

    const handleWheel = (e: WheelEvent) => {
      const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      if (maxScroll <= 0) return;

      const currentScroll = scrollContainer.scrollLeft;
      const delta = e.deltaY;

      // If we can scroll horizontally, prevent vertical scroll
      if (
        (delta > 0 && currentScroll < maxScroll - 2) ||
        (delta < 0 && currentScroll > 2)
      ) {
        e.preventDefault();
        scrollContainer.scrollLeft += delta;
      }
    };

    const handleScroll = () => {
      const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      if (maxScroll <= 0) return;
      const pct = scrollContainer.scrollLeft / maxScroll;
      setProgress(Math.min(1, Math.max(0, pct)));

      // Update current card index
      const cardWidth = scrollContainer.clientWidth / 3;
      const idx = Math.round(scrollContainer.scrollLeft / cardWidth);
      setCurrent(Math.min(idx, count - 1));
    };

    section.addEventListener('wheel', handleWheel, { passive: false });
    scrollContainer.addEventListener('scroll', handleScroll);

    return () => {
      section.removeEventListener('wheel', handleWheel);
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile, count]);

  if (count === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="h-screen flex flex-col items-center justify-center py-6 sm:py-8 snap-start overflow-hidden"
    >
      <div className="container-site flex flex-col items-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-4"
        >
          <p className="text-sm font-medium tracking-[0.2em] uppercase mb-2" style={{ color: `hsl(${accentHsl})` }}>
            App Showcase
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
            See it in action
          </h2>
        </motion.div>

        {/* Horizontal Scroll Carousel */}
        {isMobile ? (
          /* Mobile: simple swipe carousel */
          <div className="w-full">
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 px-2" style={{ scrollbarWidth: 'none' }}>
              {features.map((feat, i) => (
                <div key={i} className="flex-shrink-0 w-[80vw] snap-center">
                  <CarouselCard feat={feat} accentHsl={accentHsl} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Desktop: 3-visible pinned scroll */
          <div className="w-full max-w-5xl">
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto pb-4"
              style={{ scrollbarWidth: 'none', scrollBehavior: 'smooth' }}
            >
              {features.map((feat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex-shrink-0"
                  style={{ width: 'calc(33.333% - 16px)', maxHeight: '55vh' }}
                >
                  <CarouselCard feat={feat} accentHsl={accentHsl} />
                </motion.div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mt-6 w-full h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  backgroundColor: `hsl(${accentHsl})`,
                  width: `${Math.max(10, progress * 100)}%`,
                }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>
        )}

        {/* Dot indicators for mobile */}
        {isMobile && (
          <div className="flex items-center justify-center gap-2 mt-4">
            {features.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: i === current ? `hsl(${accentHsl})` : `hsl(${accentHsl} / 0.2)`,
                  transform: i === current ? 'scale(1.3)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ── Carousel Card with ultra-rounded corners ── */
function CarouselCard({
  feat,
  accentHsl,
}: {
  feat: ShowcaseFeature;
  accentHsl: string;
}) {
  return (
    <div className="flex flex-col h-full">
      <div
        className="overflow-hidden mb-4"
        style={{
          borderRadius: '32px',
          boxShadow: `0 16px 40px -12px hsl(${accentHsl} / 0.15), 0 6px 20px -6px rgba(0,0,0,0.1)`,
        }}
      >
        <img
          src={feat.screenshot}
          alt={feat.title}
          className="w-full h-auto block max-h-[45vh] object-cover"
          loading="eager"
          decoding="async"
        />
      </div>
      <h3 className="text-base sm:text-lg font-bold font-display text-foreground mb-1">
        {feat.title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
        {feat.description}
      </p>
    </div>
  );
}
