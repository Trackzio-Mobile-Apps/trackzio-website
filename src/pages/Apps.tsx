import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apps } from '@/lib/appData';
import { trackEvent } from '@/lib/analytics';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';
import { ArrowRight, ChevronDown } from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

const metrics = [
  { value: '2.5M+', label: 'Downloads' },
  { value: '4.7/5', label: 'Average Rating' },
  { value: '4+', label: 'Apps Published' },
  { value: '50K+', label: 'Daily Active Users' },
];

export default function Apps() {
  usePageAnalytics('apps', 'page_view_apps');
  const [expandedApp, setExpandedApp] = useState<string | null>(null);

  return (
    <div className="snap-y snap-mandatory">
      {/* Intro */}
      <section className="min-h-[45vh] flex items-center justify-center pt-8 pb-12 snap-start">
        <div className="container-site">
          <motion.div {...fadeUp} className="max-w-2xl mx-auto text-center">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">Our Ecosystem</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display leading-tight">
              AI-Powered Apps
              <br />
              <span className="text-gradient">One Ecosystem</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
              Explore our suite of intelligent apps, all connected through the Trackzio platform.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2x2 App Grid */}
      <section className="min-h-screen flex items-center py-24 sm:py-32 snap-start">
        <div className="container-site w-full">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">Apps</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">Explore our apps</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
            {apps.map((app, i) => {
              const isExpanded = expandedApp === app.id;
              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div
                    className="block p-8 sm:p-10 rounded-3xl bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group h-full"
                    style={{ boxShadow: 'var(--shadow-card)' }}
                  >
                    <div className="flex items-start gap-5 mb-5">
                      <img
                        src={app.logo}
                        alt={app.name}
                        className="w-16 h-16 rounded-2xl shrink-0"
                        style={{ boxShadow: `0 4px 16px -4px hsl(${app.accentHsl} / 0.25)` }}
                      />
                      <div className="min-w-0">
                        <h3 className="font-display font-bold text-lg text-foreground mb-1">{app.name}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{app.tagline}</p>
                      </div>
                    </div>

                    <p className={`text-sm text-muted-foreground leading-relaxed mb-2 ${isExpanded ? '' : 'line-clamp-2'}`}>
                      {app.description}
                    </p>

                    {app.description.length > 100 && (
                      <button
                        onClick={() => setExpandedApp(isExpanded ? null : app.id)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary mb-5 hover:opacity-80 transition-opacity"
                      >
                        {isExpanded ? 'Show less' : 'View More'}
                        <ChevronDown size={13} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    )}

                    <div className="mt-auto">
                      <Link
                        to={`/apps/${app.id}`}
                        onClick={() => trackEvent(`apps_${app.id}_explore_click`, { app_name: app.name })}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors group-hover:gap-2.5"
                        style={{ color: `hsl(${app.accentHsl})` }}
                      >
                        Explore Now <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="min-h-[60vh] flex items-center snap-start">
        <div className="container-site w-full">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">By the Numbers</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">Trusted by millions</h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center py-8"
              >
                <div className="text-5xl sm:text-6xl lg:text-7xl font-bold font-display text-gradient mb-3">
                  {m.value}
                </div>
                <div className="text-sm sm:text-base text-muted-foreground tracking-wide">
                  {m.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
