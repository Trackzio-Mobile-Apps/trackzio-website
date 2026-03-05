import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { apps } from '@/lib/appData';
import { trackEvent } from '@/lib/analytics';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';
import { ArrowRight } from 'lucide-react';
import trackzioLogo from '@/assets/trackzio-logo.jpg';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

// Positions for app nodes around the center (desktop)
const nodePositions = [
  { x: -240, y: -160 },  // top-left
  { x: 240, y: -160 },   // top-right
  { x: -240, y: 160 },   // bottom-left
  { x: 240, y: 160 },    // bottom-right
];

export default function Apps() {
  usePageAnalytics('apps', 'page_view_apps');
  const [hoveredApp, setHoveredApp] = useState<number | null>(null);

  return (
    <div className="snap-y snap-mandatory">
      {/* Intro */}
      <section className="min-h-[40vh] flex items-center snap-start">
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

      {/* Ecosystem Visual */}
      <section className="py-16 sm:py-24 snap-start">
        <div className="container-site">
          {/* Desktop: Visual ecosystem */}
          <div className="hidden lg:block">
            <div className="relative mx-auto" style={{ width: 640, height: 480 }}>
              {/* Connection lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 640 480">
                {nodePositions.map((pos, i) => (
                  <motion.line
                    key={i}
                    x1={320}
                    y1={240}
                    x2={320 + pos.x}
                    y2={240 + pos.y}
                    stroke="hsl(var(--border))"
                    strokeWidth={1}
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                  />
                ))}
              </svg>

              {/* Center: Trackzio */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg mb-3" style={{ boxShadow: 'var(--shadow-glow)' }}>
                  <img src={trackzioLogo} alt="Trackzio" className="w-full h-full object-cover" />
                </div>
                <span className="font-display font-bold text-lg text-foreground">Trackzio</span>
                <span className="text-xs text-muted-foreground">AI-Powered Apps Ecosystem</span>
              </motion.div>

              {/* App nodes */}
              {apps.map((app, i) => {
                const pos = nodePositions[i % nodePositions.length];
                return (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, scale: 0.6 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                    className="absolute z-10"
                    style={{
                      left: `calc(50% + ${pos.x}px)`,
                      top: `calc(50% + ${pos.y}px)`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    onMouseEnter={() => setHoveredApp(i)}
                    onMouseLeave={() => setHoveredApp(null)}
                  >
                    <div className="flex flex-col items-center text-center cursor-pointer group">
                      <div
                        className="w-16 h-16 rounded-2xl overflow-hidden mb-3 transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1"
                        style={{ boxShadow: `0 4px 16px -4px hsl(${app.accentHsl} / 0.2)` }}
                      >
                        <img src={app.logo} alt={app.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-display font-bold text-sm text-foreground">{app.name}</span>
                      <span className="text-xs text-muted-foreground max-w-[140px] mt-1">{app.tagline}</span>
                    </div>

                    {/* Hover preview panel */}
                    <AnimatePresence>
                      {hoveredApp === i && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-64 bg-card rounded-2xl p-4 z-20"
                          style={{ boxShadow: 'var(--shadow-card), 0 8px 30px -8px rgba(0,0,0,0.1)' }}
                        >
                          <img
                            src={app.screenshots[0]}
                            alt={`${app.name} preview`}
                            className="w-full h-36 object-cover rounded-xl mb-3"
                          />
                          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{app.description}</p>
                          <Link
                            to={`/apps/${app.id}`}
                            onClick={() => trackEvent(`apps_${app.id}_explore_click`, { app_name: app.name })}
                            className="inline-flex items-center gap-1 text-xs font-semibold transition-colors"
                            style={{ color: `hsl(${app.accentHsl})` }}
                          >
                            Explore App <ArrowRight size={12} />
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Mobile/Tablet: Clean list */}
          <div className="lg:hidden space-y-4">
            {apps.map((app, i) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={`/apps/${app.id}`}
                  onClick={() => trackEvent(`apps_${app.id}_explore_click`, { app_name: app.name })}
                  className="flex items-center gap-4 p-5 rounded-2xl transition-colors hover:bg-muted/60 group"
                >
                  <img src={app.logo} alt={app.name} className="w-14 h-14 rounded-xl shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-bold text-foreground">{app.name}</div>
                    <div className="text-sm text-muted-foreground truncate">{app.tagline}</div>
                  </div>
                  <ArrowRight size={18} className="text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
