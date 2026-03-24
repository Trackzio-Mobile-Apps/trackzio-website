import { useState, useEffect, useRef } from 'react';
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
  const isMobile = useIsMobile();
  const count = features.length;
  const visibleCount = isMobile ? 1 : 3;
  const [startIndex, setStartIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Preload images
  useEffect(() => {
    features.forEach(f => {
      const img = new Image();
      img.src = f.screenshot;
    });
  }, [features]);

  // Auto-rotate
  useEffect(() => {
    if (count <= visibleCount) return;
    timerRef.current = setInterval(() => {
      setStartIndex(prev => (prev + 1) % count);
    }, 3500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [count, visibleCount]);

  if (count === 0) return null;

  // Get visible features with wrapping
  const visibleFeatures = Array.from({ length: Math.min(visibleCount, count) }, (_, i) => ({
    feature: features[(startIndex + i) % count],
    index: (startIndex + i) % count,
  }));

  return (
    <section
      className="flex flex-col items-center justify-center overflow-hidden"
      style={{ height: '100vh', maxHeight: '100vh', padding: 'clamp(16px, 2vh, 32px) 0' }}
    >
      <div className="flex flex-col items-center justify-between h-full" style={{ width: 'clamp(300px, 92%, 1200px)', maxHeight: '100%' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="text-center shrink-0 mb-3"
        >
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
        </motion.div>

        {/* 3-column card grid — fills remaining space */}
        <div className={`w-full grid gap-4 flex-1 min-h-0 ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
          <AnimatePresence mode="popLayout">
            {visibleFeatures.map(({ feature, index }) => (
              <motion.div
                key={`${index}-${startIndex}`}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
                className="flex flex-col rounded-2xl overflow-hidden bg-card border border-border/30 min-h-0"
                style={{ boxShadow: '0 4px 20px -4px rgba(0,0,0,0.06)' }}
              >
                {/* Screenshot — takes available space, never crops */}
                <div
                  className="flex-1 min-h-0 flex items-center justify-center p-2"
                  style={{
                    background: `linear-gradient(135deg, hsl(${accentHsl} / 0.06), hsl(${accentHsl} / 0.02))`,
                  }}
                >
                  <img
                    src={feature.screenshot}
                    alt={feature.title}
                    loading="eager"
                    className="object-contain"
                    style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto' }}
                  />
                </div>

                {/* Title & description */}
                <div className="px-3 py-2 text-center shrink-0">
                  <h3 className="font-bold text-xs text-foreground">{feature.title}</h3>
                  <p className="text-[0.65rem] text-muted-foreground mt-0.5 leading-snug">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        {count > visibleCount && (
          <div className="mt-3 w-full max-w-md mx-auto shrink-0">
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: `hsl(${accentHsl})` }}
                animate={{ width: `${((startIndex + 1) / count) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <div className="flex justify-center gap-2 mt-2">
              {features.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setStartIndex(i);
                    if (timerRef.current) clearInterval(timerRef.current);
                    timerRef.current = setInterval(() => {
                      setStartIndex(prev => (prev + 1) % count);
                    }, 3500);
                  }}
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: i === startIndex ? `hsl(${accentHsl})` : 'hsl(var(--muted))',
                    transform: i === startIndex ? 'scale(1.4)' : 'scale(1)',
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
