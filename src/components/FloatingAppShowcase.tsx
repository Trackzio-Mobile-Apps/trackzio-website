import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { apps } from '@/lib/appData';
import { trackEvent } from '@/lib/analytics';

const showcaseApps = apps.map((app, i) => ({
  ...app,
  position: [
    { top: '6%', left: '8%' },
    { top: '4%', left: '52%' },
    { top: '40%', left: '2%' },
    { top: '42%', left: '48%' },
    { top: '74%', left: '24%' },
  ][i],
  floatDelay: i * 0.4,
  bulletPoints: [
    ['AI-powered identification', 'Global coin database', 'Collection tracking'],
    ['Instant banknote scanning', 'Worldwide currency coverage', 'Rarity & value insights'],
    ['Species identification', 'Toxicity information', 'Personal catalogue'],
    ['Streak-based motivation', 'Smart scheduling', 'Visual progress charts'],
    ['AI rock identification', '8,000+ mineral database', 'Collection management'],
  ][i],
}));

export default function FloatingAppShowcase() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = showcaseApps[selectedIndex];

  return (
    <section className="min-h-screen flex items-center py-16 sm:py-20 overflow-hidden snap-start">
      <div className="container-site w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mb-10 sm:mb-14"
        >
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">
            Our Ecosystem
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold font-display leading-tight">
            Apps built for the{' '}
            <span className="text-primary">curious</span>
          </h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-4 items-center">
          {/* LEFT — Floating app selector + Center preview */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="lg:w-[60%] w-full flex items-center gap-0"
          >
            {/* App pills cluster */}
            <div className="relative w-[50%] sm:w-[45%] h-[380px] sm:h-[420px] shrink-0">
              {showcaseApps.map((app, i) => {
                const isSelected = selectedIndex === i;
                return (
                  <motion.button
                    key={app.id}
                    onClick={() => {
                      setSelectedIndex(i);
                      trackEvent('showcase_app_select', { app_name: app.name });
                    }}
                    className="absolute flex items-center gap-3 rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 cursor-pointer select-none border-2 transition-colors duration-300"
                    style={{
                      top: app.position.top,
                      left: app.position.left,
                      borderColor: isSelected ? `hsl(${app.accentHsl})` : 'hsl(var(--border))',
                      background: isSelected
                        ? `linear-gradient(135deg, hsl(${app.accentHsl} / 0.08), hsl(${app.accentHsl} / 0.02))`
                        : 'hsl(var(--card))',
                      boxShadow: isSelected
                        ? `0 8px 32px -8px hsl(${app.accentHsl} / 0.25), 0 0 0 1px hsl(${app.accentHsl} / 0.1)`
                        : '0 4px 20px -6px rgba(0,0,0,0.08)',
                    }}
                    animate={{
                      y: isSelected ? 0 : [0, -6, 0],
                      scale: isSelected ? 1.08 : 1,
                      opacity: isSelected ? 1 : 0.7,
                    }}
                    whileHover={{ scale: isSelected ? 1.08 : 1.05, opacity: 1, boxShadow: '0 8px 28px -6px rgba(0,0,0,0.12)' }}
                    whileTap={{ scale: 0.97 }}
                    transition={
                      isSelected
                        ? { type: 'spring', stiffness: 300, damping: 25 }
                        : {
                            y: { repeat: Infinity, duration: 3 + i * 0.3, ease: 'easeInOut', delay: app.floatDelay },
                            scale: { type: 'spring', stiffness: 300, damping: 25 },
                            opacity: { duration: 0.3 },
                          }
                    }
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

            {/* CENTER — Large Logo (no circle background) */}
            <div className="flex items-center justify-center w-[50%] sm:w-[55%] -ml-4 sm:-ml-6 z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selected.id + '-logo'}
                  initial={{ opacity: 0, scale: 0.85, filter: 'blur(6px)' }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    filter: 'blur(0px)',
                    y: [0, -8, 0],
                  }}
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
                    className="w-48 h-48 sm:w-64 sm:h-64 rounded-[2rem] object-contain"
                    style={{
                      filter: `drop-shadow(0 24px 48px hsl(${selected.accentHsl} / 0.3))`,
                    }}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* RIGHT — Dynamic content (40%) */}
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

                <h3 className="text-2xl sm:text-3xl font-bold font-display leading-snug mb-4 text-foreground">
                  {selected.tagline}
                </h3>

                <p className="text-muted-foreground leading-relaxed mb-6 text-[15px]">
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
