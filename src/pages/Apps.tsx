import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apps } from '@/lib/appData';
import { trackEvent } from '@/lib/analytics';
import MetricsBar from '@/components/MetricsBar';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';

export default function Apps() {
  usePageAnalytics('apps', 'page_view_apps');

  const appEvents: Record<string, string> = {
    coinzy: 'apps_coinzy_explore_click',
    banknotes: 'apps_Banknotes_explore_click',
    insecto: 'apps_Insecto_explore_click',
    habiteazy: 'apps_Habiteazy_explore_click',
  };

  return (
    <>
      <section className="section-padding">
        <div className="container-site">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold font-display">Our Apps</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Explore our suite of AI-powered mobile applications designed to make your life easier and more insightful.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {apps.map((app, i) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.06, 0.4) }}
                className="flex"
              >
                <Link
                  to={`/apps/${app.id}`}
                  onClick={() => trackEvent(appEvents[app.id], { app_name: app.name, page_name: 'apps' })}
                  className="card-glass p-8 flex flex-col w-full group transition-colors"
                  style={{ '--hover-accent': app.accentHsl } as React.CSSProperties}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = `hsl(${app.accentHsl} / 0.5)`)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '')}
                >
                  <img src={app.logo} alt={`${app.name} logo`} className="w-16 h-16 rounded-xl mb-4 shadow-md" />
                  <h2 className="text-2xl font-bold font-display text-foreground">{app.name}</h2>
                  <p className="mt-2 text-muted-foreground flex-1">{app.tagline}</p>
                  <span className="mt-6 inline-flex text-sm font-semibold group-hover:underline" style={{ color: `hsl(${app.accentHsl})` }}>
                    Learn More →
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <MetricsBar />
    </>
  );
}
