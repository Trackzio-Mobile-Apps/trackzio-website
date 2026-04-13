import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { apps } from '@/lib/appData';
import { trackEvent } from '@/lib/analytics';

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

function AppChip({
  app,
  isSelected,
  onSelect,
  compact,
}: {
  app: (typeof showcaseApps)[0];
  isSelected: boolean;
  onSelect: () => void;
  compact?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      aria-label={app.name}
      aria-pressed={isSelected}
      className={`flex w-full rounded-xl cursor-pointer select-none border-2 transition-colors duration-300 ${
        compact
          ? 'min-h-[52px] flex-col items-center justify-center gap-1 px-1.5 py-2 min-[400px]:flex-row min-[400px]:gap-2 min-[400px]:px-2.5'
          : 'min-h-[48px] items-center justify-center gap-2 px-3 py-2.5'
      }`}
      style={{
        borderColor: isSelected ? `hsl(${app.accentHsl})` : 'hsl(var(--border))',
        background: isSelected
          ? `linear-gradient(135deg, hsl(${app.accentHsl} / 0.08), hsl(${app.accentHsl} / 0.02))`
          : 'hsl(var(--card))',
      }}
      animate={{ scale: isSelected ? 1.02 : 1, opacity: isSelected ? 1 : 0.85 }}
      whileHover={{ scale: isSelected ? 1.02 : 1.01, opacity: 1 }}
      whileTap={{ scale: 0.98 }}
    >
      <img src={app.logo} alt="" className={`rounded-lg shrink-0 ${compact ? 'h-8 w-8 min-[400px]:h-7 min-[400px]:w-7 sm:h-8 sm:w-8' : 'h-9 w-9'}`} />
      <span
        className="font-semibold text-[11px] min-[400px]:text-xs sm:text-sm text-center leading-snug transition-colors duration-300 line-clamp-2 break-words min-[400px]:line-clamp-none min-[400px]:whitespace-nowrap"
        style={{ color: isSelected ? `hsl(${app.accentHsl})` : 'hsl(var(--foreground))' }}
      >
        {app.name}
      </span>
    </motion.button>
  );
}

export default function FloatingAppShowcase() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = showcaseApps[selectedIndex];
  const autoRotateRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const userInteractedRef = useRef(false);

  useEffect(() => {
    autoRotateRef.current = setInterval(() => {
      if (!userInteractedRef.current) {
        setSelectedIndex(prev => (prev + 1) % showcaseApps.length);
      }
    }, 3500);
    return () => {
      if (autoRotateRef.current) clearInterval(autoRotateRef.current);
    };
  }, []);

  const handleSelect = (i: number) => {
    userInteractedRef.current = true;
    setSelectedIndex(i);
    trackEvent('showcase_app_select', { app_name: showcaseApps[i].name });
    if (autoRotateRef.current) clearInterval(autoRotateRef.current);
    setTimeout(() => {
      userInteractedRef.current = false;
    }, 8000);
    autoRotateRef.current = setInterval(() => {
      if (!userInteractedRef.current) {
        setSelectedIndex(prev => (prev + 1) % showcaseApps.length);
      }
    }, 3500);
  };

  return (
    <section
      className="min-h-0 lg:min-h-screen flex items-center overflow-x-hidden snap-start py-12 sm:py-16 lg:py-[clamp(2rem,5vh,5rem)]"
      style={{ paddingLeft: 'max(1rem, env(safe-area-inset-left))', paddingRight: 'max(1rem, env(safe-area-inset-right))' }}
    >
      <div className="w-full max-w-[1200px] mx-auto px-3 sm:px-4 md:px-6 min-w-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 sm:mb-12"
        >
          <p
            className="font-medium tracking-[0.2em] uppercase text-primary mb-3"
            style={{ fontSize: 'clamp(0.7rem, 1.2vw, 0.875rem)' }}
          >
            Our Ecosystem
          </p>
          <h2 className="font-bold font-display leading-tight" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}>
            Apps built for the <span className="text-primary">curious</span>
          </h2>
        </motion.div>

        {/* ── Mobile & tablet: stacked — 2×2 + 1 grid (matches desktop), no horizontal scroll ── */}
        <div className="flex flex-col gap-8 lg:hidden min-w-0">
          <div className="w-full max-w-lg mx-auto px-0.5">
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full">
              {showcaseApps.slice(0, 4).map((app, i) => (
                <AppChip
                  key={app.id}
                  app={app}
                  isSelected={selectedIndex === i}
                  onSelect={() => handleSelect(i)}
                  compact
                />
              ))}
            </div>
            <div className="mt-2.5 sm:mt-3 flex justify-center w-full">
              <div className="w-full max-w-[calc(50%-0.375rem)]">
                <AppChip
                  app={showcaseApps[4]}
                  isSelected={selectedIndex === 4}
                  onSelect={() => handleSelect(4)}
                  compact
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center py-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.id + '-logo-m'}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="flex items-center justify-center"
              >
                <img
                  src={selected.logo}
                  alt={selected.name}
                  className="rounded-[1.5rem] sm:rounded-[2rem] object-contain w-[min(85vw,256px)] h-[min(85vw,256px)] max-w-full"
                  style={{ filter: `drop-shadow(0 24px 48px hsl(${selected.accentHsl} / 0.3))` }}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <ContentPanel selected={selected} />
        </div>

        {/* ── Desktop (lg+): contained 3-column grid ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.55 }}
          className="hidden lg:grid lg:grid-cols-[1.45fr_minmax(200px,250px)_minmax(20rem,26rem)] xl:grid-cols-[1.5fr_280px_minmax(22rem,30rem)] gap-6 xl:gap-10 lg:items-center w-full min-w-0 p-0 bg-transparent"
        >
          {/* Column 1: app grid — wider column, larger chips */}
          <div className="min-w-0 w-full">
            <div className="grid grid-cols-2 gap-3 w-full">
              {showcaseApps.slice(0, 4).map((app, i) => (
                <AppChip
                  key={app.id}
                  app={app}
                  isSelected={selectedIndex === i}
                  onSelect={() => handleSelect(i)}
                />
              ))}
            </div>
            <div className="mt-3 flex justify-center w-full">
              <div className="w-full max-w-[calc(50%-0.375rem)]">
                <AppChip
                  app={showcaseApps[4]}
                  isSelected={selectedIndex === 4}
                  onSelect={() => handleSelect(4)}
                />
              </div>
            </div>
          </div>

          {/* Column 2: logo */}
          <div className="flex items-center justify-center min-w-0 py-0 shrink-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.id + '-logo-d'}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.4 }}
                className="flex items-center justify-center"
              >
                <img
                  src={selected.logo}
                  alt={selected.name}
                  className="rounded-3xl object-contain w-full max-w-[220px] xl:max-w-[260px] aspect-square"
                  style={{ filter: `drop-shadow(0 20px 40px hsl(${selected.accentHsl} / 0.28))` }}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Column 3: copy — narrower fixed-width column */}
          <div className="min-w-0 w-full max-w-full flex flex-col justify-center justify-self-stretch lg:pl-4 xl:pl-6">
            <ContentPanel selected={selected} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ContentPanel({ selected, narrow }: { selected: (typeof showcaseApps)[0]; narrow?: boolean }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={selected.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35 }}
        className="w-full min-w-0 max-w-full"
      >
        <span
          className={`inline-block text-xs font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-full ${narrow ? 'mb-3' : 'mb-4'}`}
          style={{ color: `hsl(${selected.accentHsl})`, background: `hsl(${selected.accentHsl} / 0.1)` }}
        >
          {selected.name}
        </span>

        <h3
          className={`font-bold font-display leading-snug text-foreground text-balance ${
            narrow ? 'mb-2.5 text-lg xl:text-xl' : 'mb-3 text-xl xl:text-2xl'
          }`}
        >
          {selected.tagline}
        </h3>

        <p
          className={`text-muted-foreground leading-relaxed ${narrow ? 'mb-4 text-[0.8125rem] leading-relaxed' : 'mb-5 text-sm xl:text-[0.9375rem]'}`}
        >
          {selected.description.length > 220 ? selected.description.slice(0, 220).trim() + '…' : selected.description}
        </p>

        <ul className={narrow ? 'space-y-2 mb-5' : 'space-y-2.5 mb-6'}>
          {selected.bulletPoints.map((point, i) => (
            <motion.li
              key={point}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + i * 0.06, duration: 0.3 }}
              className={`flex items-start gap-2.5 text-foreground/90 ${narrow ? 'text-[0.8125rem]' : 'text-sm'}`}
            >
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: `hsl(${selected.accentHsl} / 0.12)`, color: `hsl(${selected.accentHsl})` }}
              >
                <Check size={12} strokeWidth={3} />
              </span>
              <span className="min-w-0 leading-snug">{point}</span>
            </motion.li>
          ))}
        </ul>

        <Link
          to={`/apps/${selected.id}`}
          onClick={() => {
            trackEvent('showcase_explore_click', { app_name: selected.name });
            window.scrollTo(0, 0);
          }}
          className={`inline-flex items-center justify-center gap-2 min-h-[44px] w-full sm:w-auto rounded-xl font-semibold transition-all group bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98] ${narrow ? 'px-5 text-sm' : 'px-7 text-sm'}`}
          style={{ boxShadow: `0 4px 16px -4px hsl(${selected.accentHsl} / 0.3)` }}
        >
          Explore Now
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1 shrink-0" />
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}
