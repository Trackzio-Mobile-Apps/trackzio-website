import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apps } from '@/lib/appData';
import { trackEvent } from '@/lib/analytics';
import MetricsBar from '@/components/MetricsBar';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function Home() {
  usePageAnalytics('home', 'page_view_home');

  const appEvents: Record<string, string> = {
    coinzy: 'home_Coinzy_explore_click',
    banknotes: 'home_Banknotes_explore_click',
    insecto: 'home_insecto_explore_click',
    habiteazy: 'home_Habiteazy_explore_click',
  };

  return (
    <>
      {/* Hero */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(174_72%_52%/0.08),transparent_60%)]" />
        <div className="container-site relative">
          <motion.div {...fadeUp} className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display leading-tight tracking-tight">
              <span className="text-gradient">Trackzio</span>: Bridging the Gap Between Curiosity and Clarity Through AI
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              We build intelligent mobile apps that transform everyday moments into opportunities for discovery. From finances to nature, our AI-powered tools make knowledge accessible to everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Identity */}
      <section className="section-padding">
        <div className="container-site">
          <motion.div {...fadeUp} className="card-glass p-8 sm:p-12">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">Our Team</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { initials: 'A', name: 'Ayushya', role: 'Founder & CEO', bg: 'bg-primary/20' },
                    { initials: 'T', name: 'Team Trackzio', role: 'Engineers, Designers & Dreamers', bg: 'bg-accent/40' },
                  ].map((member) => (
                    <div key={member.name} className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full ${member.bg} flex items-center justify-center font-display font-bold text-primary shrink-0`}>{member.initials}</div>
                      <div className="min-w-0">
                        <div className="font-medium text-foreground truncate">{member.name}</div>
                        <div className="text-sm text-muted-foreground truncate">{member.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  At Trackzio, we believe technology should amplify human curiosity. Our mission is to create AI-powered tools that are intuitive, beautiful, and genuinely useful — turning complex information into clear, actionable insights for millions of users worldwide.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Portfolio */}
      <section className="section-padding">
        <div className="container-site">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl font-bold font-display text-center mb-12">Our Apps</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {apps.map((app, i) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.08, 0.4) }}
                className="flex"
              >
                <Link
                  to={`/apps/${app.id}`}
                  onClick={() => {
                    trackEvent('portfolio_tile_click', { app_name: app.name, page_name: 'home' });
                    trackEvent(appEvents[app.id], { app_name: app.name, page_name: 'home' });
                  }}
                  className="card-glass p-6 sm:p-8 flex flex-col w-full group hover:border-primary/40 transition-colors"
                >
                  <img src={app.logo} alt={`${app.name} logo`} className="w-14 h-14 rounded-xl mb-4 shadow-md" />
                  <h3 className="text-xl font-bold font-display text-foreground">{app.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground flex-1">{app.tagline}</p>
                  <span className="mt-4 inline-flex text-sm font-semibold text-primary group-hover:underline">
                    Explore →
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
