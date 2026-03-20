import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { apps } from '@/lib/appData';
import { trackEvent } from '@/lib/analytics';

const showcaseApps = apps.map((app, i) => ({
  ...app,
  // Structured floating positions — controlled scatter, no overlap
  position: [
    { top: '8%', left: '12%' },
    { top: '6%', left: '58%' },
    { top: '42%', left: '4%' },
    { top: '44%', left: '50%' },
    { top: '76%', left: '28%' },
  ][i],
  // Unique float animation offset
  floatDelay: i * 0.4,
  bulletPoints: [
    [
      'AI-powered identification',
      'Global coin database',
      'Collection tracking',
    ],
    [
      'Instant banknote scanning',
      'Worldwide currency coverage',
      'Rarity & value insights',
    ],
    [
      'Species identification',
      'Toxicity information',
      'Personal catalogue',
    ],
    [
      'Streak-based motivation',
      'Smart scheduling',
      'Visual progress charts',
    ],
    [
      'AI rock identification',
      '8,000+ mineral database',
      'Collection management',
    ],
  ][i],
}));

// Mobile positions — simple vertical list-like layout
const mobilePositions = [
  { top: '2%', left: '5%' },
  { top: '2%', left: '52%' },
  { top: '36%', left: '8%' },
  { top: '36%', left: '55%' },
  { top: '70%', left: '25%' },
];

export default function FloatingAppShowcase() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = showcaseApps[selectedIndex];

  return (
    <section className="py-24 sm:py-32 overflow-hidden">
      <div className="container-site">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mb-16"
        >
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">
            Our Ecosystem
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold font-display leading-tight">
            Apps built for the{' '}
            <span className="text-primary">curious</span>
          </h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 items-stretch">
          {/* LEFT — Floating app selector (60%) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="lg:w-[58%] w-full"
          >
            <div className="relative w-full h-[420px] sm:h-[480px]">
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
                      borderColor: isSelected
                        ? `hsl(${app.accentHsl})`
                        : 'hsl(var(--border))',
                      background: isSelected
                        ? `linear-gradient(135deg, hsl(${app.accentHsl} / 0.08), hsl(${app.accentHsl} / 0.02))`
                        : 'hsl(var(--card))',
                      boxShadow: isSelected
                        ? `0 8px 32px -8px hsl(${app.accentHsl} / 0.25), 0 0 0 1px hsl(${app.accentHsl} / 0.1)`
                        : '0 4px 20px -6px rgba(0,0,0,0.08)',
                    }}
                    animate={{
                      y: isSelected
                        ? 0
                        : [0, -6, 0],
                      scale: isSelected ? 1.08 : 1,
                      opacity: isSelected ? 1 : selectedIndex === i ? 1 : 0.7,
                    }}
                    whileHover={{
                      scale: isSelected ? 1.08 : 1.05,
                      opacity: 1,
                      boxShadow: '0 8px 28px -6px rgba(0,0,0,0.12)',
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={
                      isSelected
                        ? { type: 'spring', stiffness: 300, damping: 25 }
                        : {
                            y: {
                              repeat: Infinity,
                              duration: 3 + i * 0.3,
                              ease: 'easeInOut',
                              delay: app.floatDelay,
                            },
                            scale: { type: 'spring', stiffness: 300, damping: 25 },
                            opacity: { duration: 0.3 },
                          }
                    }
                  >
                    <img
                      src={app.logo}
                      alt={app.name}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl shrink-0"
                    />
                    <span
                      className="font-semibold text-sm sm:text-base whitespace-nowrap transition-colors duration-300"
                      style={{
                        color: isSelected
                          ? `hsl(${app.accentHsl})`
                          : 'hsl(var(--foreground))',
                      }}
                    >
                      {app.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* RIGHT — Dynamic content (40%) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="lg:w-[42%] w-full flex items-center"
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
                {/* Tag */}
                <span
                  className="inline-block text-xs font-bold tracking-[0.15em] uppercase px-3.5 py-1.5 rounded-full mb-5"
                  style={{
                    color: `hsl(${selected.accentHsl})`,
                    background: `hsl(${selected.accentHsl} / 0.1)`,
                  }}
                >
                  {selected.name}
                </span>

                {/* Heading */}
                <h3 className="text-2xl sm:text-3xl font-bold font-display leading-snug mb-4 text-foreground">
                  {selected.tagline}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed mb-6 text-[15px]">
                  {selected.description.length > 160
                    ? selected.description.slice(0, 160).trim() + '…'
                    : selected.description}
                </p>

                {/* Bullet points */}
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
                        style={{
                          background: `hsl(${selected.accentHsl} / 0.12)`,
                          color: `hsl(${selected.accentHsl})`,
                        }}
                      >
                        <Check size={12} strokeWidth={3} />
                      </span>
                      {point}
                    </motion.li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  to={`/apps/${selected.id}`}
                  onClick={() =>
                    trackEvent('showcase_explore_click', {
                      app_name: selected.name,
                    })
                  }
                  className="inline-flex items-center gap-2 h-11 px-7 rounded-xl text-sm font-semibold transition-all group bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.97]"
                  style={{
                    boxShadow: `0 4px 16px -4px hsl(${selected.accentHsl} / 0.3)`,
                  }}
                >
                  Explore Now
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
