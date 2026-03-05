import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { apps } from '@/lib/appData';
import { trackEvent } from '@/lib/analytics';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';
import { ArrowRight, Star, Quote } from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

const stagger = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const metrics = [
  { value: '2.5M+', label: 'Downloads' },
  { value: '4.7/5', label: 'Average Rating' },
  { value: '4+', label: 'Apps Published' },
  { value: '50K+', label: 'Daily Active Users' },
];

const testimonials = [
  {
    quote: "Coinzy completely changed how I manage my finances. The AI categorization is incredibly accurate and saves me hours every month.",
    author: "Priya M.",
    role: "Freelance Designer",
    app: "Coinzy",
  },
  {
    quote: "Insecto is a game-changer for nature enthusiasts. My kids love pointing the camera at bugs and learning about them instantly.",
    author: "Rahul K.",
    role: "Parent & Nature Lover",
    app: "Insecto",
  },
  {
    quote: "Habiteazy helped me build a consistent morning routine. The streak tracking keeps me motivated every single day.",
    author: "Sneha T.",
    role: "Marketing Professional",
    app: "Habiteazy",
  },
];

const appEvents: Record<string, string> = {
  coinzy: 'home_Coinzy_explore_click',
  banknotes: 'home_Banknotes_explore_click',
  insecto: 'home_insecto_explore_click',
  habiteazy: 'home_Habiteazy_explore_click',
};

export default function Home() {
  usePageAnalytics('home', 'page_view_home');

  return (
    <div className="snap-y snap-mandatory">
      {/* ── Section 1: Hero ── */}
      <section className="min-h-[90vh] flex items-center justify-center relative overflow-hidden snap-start">
        {/* Subtle radial accent */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(var(--primary)/0.06),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_bottom_right,hsl(var(--secondary)/0.04),transparent_60%)]" />
        
        <div className="container-site relative z-10">
          <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-6"
            >
              AI-Powered Mobile Apps
            </motion.p>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold font-display leading-[1.1] tracking-tight"
            >
              Bridging Curiosity
              <br />
              <span className="text-gradient">and Clarity</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed"
            >
              We build intelligent apps that transform everyday moments into opportunities for discovery.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-10"
            >
              <Link
                to="/apps"
                onClick={() => trackEvent('hero_explore_apps', { page_name: 'home' })}
                className="inline-flex items-center gap-2 h-12 px-8 rounded-2xl bg-primary text-primary-foreground font-semibold text-base transition-all hover:opacity-90 glow group"
              >
                Explore Our Apps
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-1.5 rounded-full bg-muted-foreground/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Section 2: Our Applications ── */}
      <section className="min-h-screen py-24 sm:py-32 snap-start">
        <div className="container-site">
          <motion.div {...fadeUp} className="max-w-2xl mb-20">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">Our Applications</p>
            <h2 className="text-4xl sm:text-5xl font-bold font-display leading-tight">
              Apps that make life
              <br />
              <span className="text-gradient">simpler & smarter</span>
            </h2>
          </motion.div>

          <div className="space-y-24 sm:space-y-32">
            {apps.map((app, i) => (
              <motion.div
                key={app.id}
                {...stagger}
                transition={{ duration: 0.7, delay: 0.1 }}
                className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}
              >
                {/* Visual block */}
                <div className="flex-1 w-full">
                  <div 
                    className="relative rounded-3xl overflow-hidden p-12 sm:p-16 flex items-center justify-center aspect-[4/3]"
                    style={{ 
                      background: `linear-gradient(135deg, hsl(${app.accentHsl} / 0.08), hsl(${app.accentHsl} / 0.03))`,
                    }}
                  >
                    <motion.img 
                      src={app.logo} 
                      alt={`${app.name} logo`} 
                      className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl shadow-lg"
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                    {/* Decorative circles */}
                    <div 
                      className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-[0.07]"
                      style={{ background: `hsl(${app.accentHsl})` }}
                    />
                    <div 
                      className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-[0.05]"
                      style={{ background: `hsl(${app.accentHsl})` }}
                    />
                  </div>
                </div>

                {/* Text block */}
                <div className="flex-1 w-full">
                  <div className="max-w-md">
                    <span 
                      className="inline-block text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full mb-4"
                      style={{ 
                        color: `hsl(${app.accentHsl})`,
                        background: `hsl(${app.accentHsl} / 0.1)`,
                      }}
                    >
                      {app.icon} {app.name}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold font-display leading-snug mb-4">
                      {app.tagline}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {app.description}
                    </p>
                    <Link
                      to={`/apps/${app.id}`}
                      onClick={() => {
                        trackEvent('portfolio_tile_click', { app_name: app.name, page_name: 'home' });
                        trackEvent(appEvents[app.id] || '', { app_name: app.name, page_name: 'home' });
                      }}
                      className="inline-flex items-center gap-2 text-sm font-semibold transition-all group"
                      style={{ color: `hsl(${app.accentHsl})` }}
                    >
                      Learn more
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Stats ── */}
      <section className="min-h-[70vh] flex items-center snap-start">
        <div className="container-site w-full">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">By the Numbers</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">
              Trusted by millions
            </h2>
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

      {/* ── Section 4: Testimonials ── */}
      <section className="min-h-[80vh] flex items-center py-24 sm:py-32 snap-start">
        <div className="container-site w-full">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">What People Say</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">
              Loved by our users
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="relative"
              >
                <div className="p-8 sm:p-10 rounded-3xl bg-card h-full flex flex-col" style={{ boxShadow: 'var(--shadow-card)' }}>
                  <Quote size={28} className="text-primary/20 mb-6" />
                  <p className="text-lg sm:text-xl leading-relaxed text-foreground flex-1 font-medium">
                    "{t.quote}"
                  </p>
                  <div className="mt-8 flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center font-display font-bold text-primary text-sm">
                      {t.author.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-sm">{t.author}</div>
                      <div className="text-xs text-muted-foreground">{t.role} · {t.app}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
