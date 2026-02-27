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

          <div className="grid sm:grid-cols-2 gap-6">
            {apps.map((app, i) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={`/apps/${app.id}`}
                  onClick={() => trackEvent(appEvents[app.id], { app_name: app.name, page_name: 'apps' })}
                  className="card-glass p-8 flex flex-col h-full group hover:border-primary/40 transition-colors block"
                >
                  <div className="text-5xl mb-4">{app.icon}</div>
                  <h2 className="text-2xl font-bold font-display text-foreground">{app.name}</h2>
                  <p className="mt-2 text-muted-foreground flex-1">{app.tagline}</p>
                  <span className="mt-6 inline-flex text-sm font-semibold text-primary group-hover:underline">
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
