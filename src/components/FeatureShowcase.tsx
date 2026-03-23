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
  const count = features.length;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    features.forEach(f => {
      const img = new Image();
      img.src = f.screenshot;
    });
  }, [features]);

  // Auto-rotating loop instead of scroll-locking
  useEffect(() => {
    if (count <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % count);
    }, 3500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [count]);

  if (count === 0) return null;

  // Show 3 at a time on desktop, 1 on mobile
  const visibleIndices = isMobile
    ? [current]
    : [current % count, (current + 1) % count, (current + 2) % count];

  return (
    <section
      className="flex flex-col items-center justify-center overflow-hidden"
      style={{ padding: 'clamp(32px, 5vh, 64px) 0' }}
    >
      <div className="flex flex-col items-center" style={{ width: 'clamp(300px, 90%, 1200px)' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-6"
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

        {/* Screenshots grid - auto-rotating */}
        <div className={`w-full max-w-5xl grid gap-5 ${isMobile ? 'grid-cols-1 max-w-xs mx-auto' : 'grid-cols-3'}`}>
          {visibleIndices.map((idx, pos) => {
            const feat = features[idx];
            return (
              <motion.div
                key={`${idx}-${pos}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col"
              >
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
                    style={{ maxHeight: isMobile ? '50vh' : '55vh', objectFit: 'contain' }}
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
              </motion.div>
            );
          })}
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {features.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrent(i);
                if (timerRef.current) clearInterval(timerRef.current);
                timerRef.current = setInterval(() => {
                  setCurrent(prev => (prev + 1) % count);
                }, 3500);
              }}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor: i === current ? `hsl(${accentHsl})` : 'hsl(var(--muted))',
                transform: i === current ? 'scale(1.4)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
