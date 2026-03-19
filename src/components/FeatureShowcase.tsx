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

  if (count === 0) return null;

  const feat = features[current];

  return (
    <section className="py-20 sm:py-28 snap-start overflow-hidden">
      <div className="container-site">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 sm:mb-16"
        >
          <p className="text-sm font-medium tracking-[0.2em] uppercase mb-3" style={{ color: `hsl(${accentHsl})` }}>
            App Showcase
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
            See it in action
          </h2>
        </motion.div>

        {/* Phone mockups */}
        <div className="relative flex items-center justify-center gap-4 sm:gap-8 lg:gap-12 mb-10 sm:mb-14">
          {/* Left preview — hidden on mobile */}
          {!isMobile && (
            <div
              className="relative flex-shrink-0 transition-all duration-700 ease-out cursor-pointer"
              style={{ width: '160px', opacity: 0.5, filter: 'blur(1px)' }}
              onClick={() => setCurrent(prev)}
            >
              <PhoneMockup
                screenshot={features[prev].screenshot}
                accentHsl={accentHsl}
                label={features[prev].title}
              />
            </div>
          )}

          {/* Center phone */}
          <div className="relative flex-shrink-0" style={{ width: isMobile ? '220px' : '240px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <PhoneMockup
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
              style={{ width: '160px', opacity: 0.5, filter: 'blur(1px)' }}
              onClick={() => setCurrent(next)}
            >
              <PhoneMockup
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
        <div className="flex items-center justify-center gap-2 mt-8">
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

/* ── Phone Mockup Frame ── */
function PhoneMockup({
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
      {/* Outer phone frame */}
      <div
        className="relative rounded-[2rem] p-[6px] bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900"
        style={{
          boxShadow: isCenter
            ? `0 25px 60px -12px hsl(${accentHsl} / 0.25), 0 12px 30px -8px rgba(0,0,0,0.3)`
            : '0 8px 24px -6px rgba(0,0,0,0.2)',
        }}
      >
        {/* Notch */}
        <div className="absolute top-[6px] left-1/2 -translate-x-1/2 z-10 w-[35%] h-[18px] bg-zinc-900 rounded-b-xl" />

        {/* Screen */}
        <div className="relative rounded-[1.6rem] overflow-hidden bg-black">
          <img
            src={screenshot}
            alt={label}
            className="w-full h-auto block"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
