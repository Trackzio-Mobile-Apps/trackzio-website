import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { apps } from '@/lib/appData';
import { trackEvent } from '@/lib/analytics';
import { useIsMobile } from '@/hooks/use-mobile';

const showcaseApps = apps.map((app, i) => ({
  ...app,
  floatDelay: i * 0.4,
  bulletPoints: [
    ['AI-powered identification', 'Global coin database', 'Collection tracking'],
    ['Instant banknote scanning', 'Worldwide currency coverage', 'Rarity & value insights'],
    ['Species identification', 'Toxicity information', 'Personal catalogue'],
    ['Streak-based motivation', 'Smart scheduling', 'Visual progress charts'],
    ['AI rock identification', '8,000+ mineral database', 'Collection management'],
  ][i],
}));

/* Desktop scattered positions — generous spacing, no overlap */
const desktopPositions = [
  { top: '2%', left: '4%' },
  { top: '0%', left: '54%' },
  { top: '36%', left: '8%' },
  { top: '38%', left: '56%' },
  { top: '72%', left: '28%' },
];

export default function FloatingAppShowcase() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = showcaseApps[selectedIndex];
  const isMobile = useIsMobile();

  return (
    <section
      className="min-h-screen flex items-center overflow-hidden snap-start"
      style={{ padding: 'clamp(32px, 5vh, 80px) 0' }}
    >
      <div style={{ width: 'clamp(300px, 90%, 1200px)', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 sm:mb-12"
        >
          <p className="font-medium tracking-[0.2em] uppercase text-primary mb-3" style={{ fontSize: 'clamp(0.7rem, 1.2vw, 0.875rem)' }}>
            Our Ecosystem
          </p>
          <h2 className="font-bold font-display leading-tight" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}>
            Apps built for the{' '}
            <span className="text-primary">curious</span>
          </h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-4 items-center">
          {/* LEFT — App selector + Center preview */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="lg:w-[60%] w-full flex flex-col lg:flex-row items-center gap-0"
          >
            {/* Mobile: horizontal scroll row */}
            {isMobile ? (
              <div
                className="w-full flex gap-3 overflow-x-auto pb-4 px-1 mb-4"
                style={{ scrollbarWidth: 'none' }}
              >
                {showcaseApps.map((app, i) => {
                  const isSelected = selectedIndex === i;
                  return (
                    <motion.button
                      key={app.id}
                      onClick={() => {
                        setSelectedIndex(i);
                        trackEvent('showcase_app_select', { app_name: app.name });
                      }}
                      className="flex-shrink-0 flex items-center gap-2 rounded-xl px-3 py-2.5 cursor-pointer select-none border-2 transition-colors duration-300"
                      style={{
                        borderColor: isSelected ? `hsl(${app.accentHsl})` : 'hsl(var(--border))',
                        background: isSelected
                          ? `linear-gradient(135deg, hsl(${app.accentHsl} / 0.08), hsl(${app.accentHsl} / 0.02))`
                          : 'hsl(var(--card))',
                        padding: '12px',
                      }}
                      animate={{ scale: isSelected ? 1.04 : 1, opacity: isSelected ? 1 : 0.7 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <img src={app.logo} alt={app.name} className="w-8 h-8 rounded-lg shrink-0" />
                      <span
                        className="font-semibold text-sm whitespace-nowrap transition-colors duration-300"
                        style={{ color: isSelected ? `hsl(${app.accentHsl})` : 'hsl(var(--foreground))' }}
                      >
                        {app.name}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            ) : (
              /* Desktop: scattered floating layout */
              <div className="relative w-[50%] sm:w-[45%] shrink-0" style={{ height: '420px' }}>
                {showcaseApps.map((app, i) => {
                  const isSelected = selectedIndex === i;
                  const pos = desktopPositions[i];
                  return (
                    <motion.button
                      key={app.id}
                      onClick={() => {
                        setSelectedIndex(i);
                        trackEvent('showcase_app_select', { app_name: app.name });
                      }}
                      className="absolute flex items-center gap-3 rounded-2xl cursor-pointer select-none border-2 transition-colors duration-300"
                      style={{
                        top: pos.top,
                        left: pos.left,
                        padding: '12px 20px',
                        borderColor: isSelected ? `hsl(${app.accentHsl})` : 'hsl(var(--border))',
                        background: isSelected
                          ? `linear-gradient(135deg, hsl(${app.accentHsl} / 0.08), hsl(${app.accentHsl} / 0.02))`
                          : 'hsl(var(--card))',
                        boxShadow: isSelected
                          ? `0 8px 32px -8px hsl(${app.accentHsl} / 0.25), 0 0 0 1px hsl(${app.accentHsl} / 0.1)`
                          : '0 4px 20px -6px rgba(0,0,0,0.08)',
                      }}
                      animate={{ scale: isSelected ? 1.04 : 1, opacity: isSelected ? 1 : 0.7 }}
                      whileHover={{ scale: isSelected ? 1.04 : 1.03, opacity: 1 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                      <img src={app.logo} alt={app.name} className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl shrink-0" />
                      <span
                        className="font-semibold text-sm sm:text-base whitespace-nowrap transition-colors duration-300"
                        style={{ color: isSelected ? `hsl(${app.accentHsl})` : 'hsl(var(--foreground))' }}
                      >
                        {app.name}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* CENTER — Large Logo */}
            <div className="flex items-center justify-center w-full lg:w-[55%] lg:-ml-6 z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selected.id + '-logo'}
                  initial={{ opacity: 0, scale: 0.85, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: [0, -8, 0] }}
                  exit={{ opacity: 0, scale: 0.85, filter: 'blur(4px)' }}
                  transition={{
                    opacity: { duration: 0.4 },
                    scale: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                    filter: { duration: 0.4 },
                    y: { repeat: Infinity, duration: 4, ease: 'easeInOut' },
                  }}
                  className="flex items-center justify-center"
                >
                  <img
                    src={selected.logo}
                    alt={selected.name}
                    className="rounded-[2rem] object-contain"
                    style={{
                      width: 'clamp(160px, 22vw, 256px)',
                      height: 'clamp(160px, 22vw, 256px)',
                      filter: `drop-shadow(0 24px 48px hsl(${selected.accentHsl} / 0.3))`,
                    }}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* RIGHT — Dynamic content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="lg:w-[40%] w-full flex items-start lg:pt-4"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                <span
                  className="inline-block text-xs font-bold tracking-[0.15em] uppercase px-3.5 py-1.5 rounded-full mb-5"
                  style={{ color: `hsl(${selected.accentHsl})`, background: `hsl(${selected.accentHsl} / 0.1)` }}
                >
                  {selected.name}
                </span>

                <h3
                  className="font-bold font-display leading-snug mb-4 text-foreground"
                  style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.875rem)' }}
                >
                  {selected.tagline}
                </h3>

                <p className="text-muted-foreground leading-relaxed mb-6" style={{ fontSize: 'clamp(0.8rem, 1.2vw, 0.9375rem)' }}>
                  {selected.description.length > 160 ? selected.description.slice(0, 160).trim() + '…' : selected.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {selected.bulletPoints.map((point, i) => (
                    <motion.li
                      key={point}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.08, duration: 0.35 }}
                      className="flex items-center gap-3 text-sm text-foreground/85"
                    >
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: `hsl(${selected.accentHsl} / 0.12)`, color: `hsl(${selected.accentHsl})` }}
                      >
                        <Check size={12} strokeWidth={3} />
                      </span>
                      {point}
                    </motion.li>
                  ))}
                </ul>

                <Link
                  to={`/apps/${selected.id}`}
                  onClick={() => { trackEvent('showcase_explore_click', { app_name: selected.name }); window.scrollTo(0, 0); }}
                  className="inline-flex items-center gap-2 h-11 px-7 rounded-xl text-sm font-semibold transition-all group bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.97]"
                  style={{ boxShadow: `0 4px 16px -4px hsl(${selected.accentHsl} / 0.3)` }}
                >
                  Explore Now
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
