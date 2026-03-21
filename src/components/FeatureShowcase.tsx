import { useState, useEffect, useCallback } from 'react';
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

  const count = features.length;
  const prev = (current - 1 + count) % count;
  const next = (current + 1) % count;

  const advance = useCallback(() => {
    setCurrent(c => (c + 1) % count);
  }, [count]);

  useEffect(() => {
    const id = setInterval(advance, 3500);
    return () => clearInterval(id);
  }, [advance]);

  // Preload all screenshots for instant display
  useEffect(() => {
    features.forEach(f => {
      const img = new Image();
      img.src = f.screenshot;
    });
  }, [features]);

  if (count === 0) return null;

  const feat = features[current];

  return (
    <section className="min-h-screen flex flex-col items-center justify-center py-12 sm:py-16 snap-start overflow-hidden">
      <div className="container-site flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-8 sm:mb-12"
        >
          <p className="text-sm font-medium tracking-[0.2em] uppercase mb-3" style={{ color: `hsl(${accentHsl})` }}>
            App Showcase
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
            See it in action
          </h2>
        </motion.div>

        {/* Screenshots as clean rounded rectangles */}
        <div className="relative flex items-center justify-center gap-4 sm:gap-8 lg:gap-12 mb-8 sm:mb-10">
          {/* Left preview — hidden on mobile */}
          {!isMobile && (
            <div
              className="relative flex-shrink-0 transition-all duration-700 ease-out cursor-pointer"
              style={{ width: '140px', opacity: 0.45 }}
              onClick={() => setCurrent(prev)}
            >
              <ScreenshotCard
                screenshot={features[prev].screenshot}
                accentHsl={accentHsl}
                label={features[prev].title}
              />
            </div>
          )}

          {/* Center screenshot */}
          <div className="relative flex-shrink-0" style={{ width: isMobile ? '220px' : '240px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <ScreenshotCard
                  screenshot={feat.screenshot}
                  accentHsl={accentHsl}
                  label={feat.title}
                  isCenter
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right preview — hidden on mobile */}
          {!isMobile && (
            <div
              className="relative flex-shrink-0 transition-all duration-700 ease-out cursor-pointer"
              style={{ width: '140px', opacity: 0.45 }}
              onClick={() => setCurrent(next)}
            >
              <ScreenshotCard
                screenshot={features[next].screenshot}
                accentHsl={accentHsl}
                label={features[next].title}
              />
            </div>
          )}
        </div>

        {/* Feature title + description */}
        <div className="text-center max-w-md mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-xl sm:text-2xl font-bold font-display text-foreground mb-2">
                {feat.title}
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {feat.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2 mt-6">
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
      </div>
    </section>
  );
}

/* ── Clean Rounded Screenshot Card ── */
function ScreenshotCard({
  screenshot,
  accentHsl,
  label,
  isCenter = false,
}: {
  screenshot: string;
  accentHsl: string;
  label: string;
  isCenter?: boolean;
}) {
  return (
    <div className="relative mx-auto">
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          boxShadow: isCenter
            ? `0 20px 50px -12px hsl(${accentHsl} / 0.2), 0 8px 24px -6px rgba(0,0,0,0.15)`
            : '0 6px 20px -6px rgba(0,0,0,0.12)',
        }}
      >
        <img
          src={screenshot}
          alt={label}
          className="w-full h-auto block"
          loading="eager"
          decoding="async"
        />
      </div>
    </div>
  );
}
