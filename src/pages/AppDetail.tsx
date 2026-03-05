import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getApp } from '@/lib/appData';
import { trackEvent } from '@/lib/analytics';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';
import { useIsMobile } from '@/hooks/use-mobile';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowRight, Quote } from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

const pageViewEvents: Record<string, string> = {
  coinzy: 'coinzy_page_view',
  banknotes: 'banknotes_page_view',
  insecto: 'insecto_page_view',
  habiteazy: 'habiteazy_page_view',
};

const downloadEvents: Record<string, { ios: string; android: string }> = {
  coinzy: { ios: 'coinzy_ios_download', android: 'coinzy_android_download' },
  banknotes: { ios: 'banknotes_ios_download', android: 'banknotes_android_download' },
  insecto: { ios: 'insecto_ios_download', android: 'insecto_android_download' },
  habiteazy: { ios: 'habiteazy_ios_download', android: 'habiteazy_android_download' },
};

const reviews = [
  {
    quote: "This app completely changed how I approach my daily routine. The AI is incredibly accurate and intuitive.",
    author: "Priya M.",
    role: "Freelance Designer",
  },
  {
    quote: "So beautifully designed and easy to use. I recommend it to everyone I know.",
    author: "Rahul K.",
    role: "Tech Enthusiast",
  },
  {
    quote: "The level of detail and accuracy is unmatched. This is exactly what I was looking for.",
    author: "Sneha T.",
    role: "Student",
  },
];

export default function AppDetail() {
  const { appId } = useParams<{ appId: string }>();
  const app = getApp(appId || '');
  const isMobile = useIsMobile();

  if (!app) return <Navigate to="/apps" replace />;

  usePageAnalytics(app.id, pageViewEvents[app.id] || 'page_view');

  const hasIos = !!app.iosUrl;
  const hasAndroid = !!app.androidUrl;
  const qrTarget = app.androidUrl || app.iosUrl;

  return (
    <div style={{ '--app-accent': app.accentHsl } as React.CSSProperties}>
      {/* ── 1. Hero ── */}
      <section className="min-h-[70vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at top, hsl(${app.accentHsl} / 0.08), transparent 60%)` }} />
        <div className="container-site relative">
          <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center">
            <img
              src={app.logo}
              alt={`${app.name} logo`}
              className="w-24 h-24 rounded-2xl mx-auto mb-6"
              style={{ boxShadow: `0 8px 30px -8px hsl(${app.accentHsl} / 0.35)` }}
            />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display" style={{ color: `hsl(${app.accentHsl})` }}>
              {app.name}
            </h1>
            <p className="mt-3 text-lg font-medium text-foreground">{app.tagline}</p>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto leading-relaxed">{app.description}</p>

            {/* Download buttons */}
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              {hasIos && (
                <a
                  href={app.iosUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent(downloadEvents[app.id]?.ios, { app_name: app.name })}
                  className="inline-flex h-12 px-8 items-center justify-center rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity text-white"
                  style={{ backgroundColor: `hsl(${app.accentHsl})` }}
                >
                  Download for iOS
                </a>
              )}
              {hasAndroid && (
                <a
                  href={app.androidUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent(downloadEvents[app.id]?.android, { app_name: app.name })}
                  className="inline-flex h-12 px-8 items-center justify-center rounded-xl border-2 font-semibold text-sm hover:opacity-80 transition-opacity"
                  style={{ color: `hsl(${app.accentHsl})`, borderColor: `hsl(${app.accentHsl} / 0.4)` }}
                >
                  Download for Android
                </a>
              )}
              {!isMobile && qrTarget && (
                <div className="p-2 rounded-xl bg-card border border-border/40" style={{ borderColor: `hsl(${app.accentHsl} / 0.2)` }}>
                  <QRCodeSVG value={qrTarget} size={80} level="M" />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 2. Screenshots ── */}
      <section className="py-16 sm:py-24">
        <div className="container-site">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">App Preview</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">See it in action</h2>
          </motion.div>

          <div className="flex gap-6 justify-center overflow-x-auto pb-4 -mx-4 px-4">
            {app.screenshots.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="shrink-0"
              >
                <div
                  className="w-48 sm:w-56 h-[380px] sm:h-[440px] rounded-3xl overflow-hidden"
                  style={{ boxShadow: `0 12px 40px -12px hsl(${app.accentHsl} / 0.2)` }}
                >
                  <img src={src} alt={`${app.name} screenshot ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Key Features ── */}
      <section className="py-16 sm:py-24">
        <div className="container-site">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">What makes it special</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 max-w-5xl mx-auto">
            {app.features.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center"
              >
                <div className="text-3xl mb-4">{feat.icon}</div>
                <h3 className="font-display font-bold text-sm text-foreground mb-2">{feat.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Reviews ── */}
      <section className="py-16 sm:py-24">
        <div className="container-site">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">Reviews</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">What users say</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {reviews.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
              >
                <div className="p-8 sm:p-10 rounded-3xl bg-card h-full flex flex-col" style={{ boxShadow: 'var(--shadow-card)' }}>
                  <Quote size={24} className="text-primary/20 mb-5" />
                  <div className="flex gap-0.5 mb-4" style={{ color: `hsl(${app.accentHsl})` }}>
                    {'★★★★★'}
                  </div>
                  <p className="text-base sm:text-lg leading-relaxed text-foreground flex-1 font-medium">"{r.quote}"</p>
                  <div className="mt-6 flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm"
                      style={{ color: `hsl(${app.accentHsl})`, background: `hsl(${app.accentHsl} / 0.1)` }}
                    >
                      {r.author.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-sm">{r.author}</div>
                      <div className="text-xs text-muted-foreground">{r.role}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. App Stats ── */}
      <section className="py-16 sm:py-24">
        <div className="container-site">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">By the Numbers</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">{app.name} in numbers</h2>
          </motion.div>

          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { value: app.stats.downloads, label: 'Downloads' },
              { value: app.stats.rating, label: 'Average Rating' },
              { value: app.stats.dau, label: 'Daily Active Users' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display text-gradient mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
