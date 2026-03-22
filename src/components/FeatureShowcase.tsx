import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
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

  useEffect(() => {
    features.forEach(f => {
      const img = new Image();
      img.src = f.screenshot;
    });
  }, [features]);

  // Desktop horizontal scroll pinning
  useEffect(() => {
    const section = sectionRef.current;
    const scrollContainer = scrollRef.current;
    if (!section || !scrollContainer || isMobile) return;

    const handleWheel = (e: WheelEvent) => {
      const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      if (maxScroll <= 0) return;
      const currentScroll = scrollContainer.scrollLeft;
      const delta = e.deltaY;
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

  // Mobile snap tracking
  useEffect(() => {
    if (!isMobile) return;
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const cardW = el.scrollWidth / count;
      const idx = Math.round(el.scrollLeft / cardW);
      setCurrent(Math.min(idx, count - 1));
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll > 0) setProgress(el.scrollLeft / maxScroll);
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, [isMobile, count]);

  if (count === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex flex-col items-center justify-center snap-start overflow-hidden"
      style={{ padding: 'clamp(16px, 3vh, 32px) 0' }}
    >
      <div className="flex flex-col items-center" style={{ width: 'clamp(300px, 90%, 1200px)' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-3"
        >
          <p
            className="font-medium tracking-[0.2em] uppercase mb-1"
            style={{ color: `hsl(${accentHsl})`, fontSize: 'clamp(0.7rem, 1.2vw, 0.875rem)' }}
          >
            App Showcase
          </p>
          <h2
            className="font-bold font-display text-foreground"
            style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)' }}
          >
            See it in action
          </h2>
        </motion.div>

        {isMobile ? (
          /* Mobile: horizontal snap carousel */
          <div className="w-full">
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4"
              style={{ scrollbarWidth: 'none', paddingBottom: '12px' }}
            >
              {features.map((feat, i) => (
                <div key={i} className="flex-shrink-0 snap-center" style={{ width: '75vw' }}>
                  <MobileCard feat={feat} accentHsl={accentHsl} />
                </div>
              ))}
            </div>
            {/* Mobile progress bar */}
            <div className="mx-4 mt-3 h-1 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-150"
                style={{ backgroundColor: '#064e3b', width: `${Math.max(10, progress * 100)}%` }}
              />
            </div>
            {/* Dots */}
            <div className="flex items-center justify-center gap-2 mt-3">
              {features.map((_, i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: i === current ? '#064e3b' : 'hsl(var(--muted))',
                    transform: i === current ? 'scale(1.4)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Desktop: 3-visible pinned scroll */
          <div className="w-full max-w-5xl">
            <div
              ref={scrollRef}
              className="flex gap-5 overflow-x-auto pb-2"
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
                  style={{ width: 'calc(33.333% - 14px)' }}
                >
                  <DesktopCard feat={feat} accentHsl={accentHsl} />
                </motion.div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mt-4 w-full h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  backgroundColor: '#064e3b',
                  width: `${Math.max(10, progress * 100)}%`,
                }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* Desktop card - image fits fully with object-contain */
function DesktopCard({ feat, accentHsl }: { feat: ShowcaseFeature; accentHsl: string }) {
  return (
    <div className="flex flex-col">
      <div
        className="overflow-hidden rounded-2xl mb-3"
        style={{
          boxShadow: `0 12px 32px -8px hsl(${accentHsl} / 0.12), 0 4px 16px -4px rgba(0,0,0,0.08)`,
        }}
      >
        <img
          src={feat.screenshot}
          alt={feat.title}
          className="w-full block"
          style={{ maxHeight: '55vh', objectFit: 'contain' }}
          loading="eager"
        />
      </div>
      <h3
        className="font-bold font-display text-foreground mb-1"
        style={{ fontSize: 'clamp(0.85rem, 1.3vw, 1.125rem)' }}
      >
        {feat.title}
      </h3>
      <p className="text-muted-foreground leading-relaxed line-clamp-2" style={{ fontSize: 'clamp(0.75rem, 1.1vw, 0.875rem)' }}>
        {feat.description}
      </p>
    </div>
  );
}

/* Mobile card - scaled down to fit */
function MobileCard({ feat, accentHsl }: { feat: ShowcaseFeature; accentHsl: string }) {
  return (
    <div className="flex flex-col">
      <div
        className="overflow-hidden rounded-2xl mb-2"
        style={{
          boxShadow: `0 8px 24px -6px hsl(${accentHsl} / 0.15)`,
        }}
      >
        <img
          src={feat.screenshot}
          alt={feat.title}
          className="w-full block"
          style={{ maxHeight: '50vh', objectFit: 'contain' }}
          loading="eager"
        />
      </div>
      <h3 className="font-bold font-display text-foreground text-base mb-0.5">{feat.title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{feat.description}</p>
    </div>
  );
}
