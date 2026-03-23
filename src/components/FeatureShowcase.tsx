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

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (count <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % count);
    }, 3500);
  };

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [count]);

  const handleFeatureClick = (index: number) => {
    setCurrent(index);
    startTimer();
  };

  if (count === 0) return null;

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
          className="text-center mb-8"
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

        <div className={`w-full max-w-5xl flex ${isMobile ? 'flex-col gap-6' : 'flex-row gap-10'}`}>
          {/* Left: Static feature list */}
          <div className={`${isMobile ? 'w-full' : 'w-[38%]'} flex flex-col gap-1`}>
            {features.map((feat, i) => (
              <button
                key={i}
                onClick={() => handleFeatureClick(i)}
                className={`text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                  current === i
                    ? 'bg-card shadow-sm'
                    : 'hover:bg-muted/50'
                }`}
                style={current === i ? { borderLeft: `3px solid hsl(${accentHsl})` } : { borderLeft: '3px solid transparent' }}
              >
                <h3
                  className={`font-semibold text-sm mb-0.5 transition-colors ${current === i ? '' : 'text-foreground'}`}
                  style={current === i ? { color: `hsl(${accentHsl})` } : undefined}
                >
                  {feat.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {feat.description}
                </p>
              </button>
            ))}
          </div>

          {/* Right: Auto-rotating screenshot */}
          <div className={`${isMobile ? 'w-full' : 'w-[62%]'} flex flex-col items-center`}>
            <div
              className="overflow-hidden rounded-2xl w-full"
              style={{
                boxShadow: `0 12px 32px -8px hsl(${accentHsl} / 0.12), 0 4px 16px -4px rgba(0,0,0,0.08)`,
              }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={current}
                  src={features[current].screenshot}
                  alt={features[current].title}
                  className="w-full block"
                  style={{ maxHeight: isMobile ? '50vh' : '55vh', objectFit: 'contain' }}
                  loading="eager"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.35 }}
                />
              </AnimatePresence>
            </div>

            {/* Dots */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {features.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleFeatureClick(i)}
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: i === current ? `hsl(${accentHsl})` : 'hsl(var(--muted))',
                    transform: i === current ? 'scale(1.4)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
