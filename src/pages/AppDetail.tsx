import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getApp } from '@/lib/appData';
import { trackEvent } from '@/lib/analytics';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';
import MetricsBar from '@/components/MetricsBar';
import { useIsMobile } from '@/hooks/use-mobile';
import { QRCodeSVG } from 'qrcode.react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

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

const qrEvents: Record<string, string> = {
  coinzy: 'coinzy_qr_scan',
  banknotes: 'banknotes_qr_scan',
  insecto: 'insecto_qr_scan',
  habiteazy: 'habiteazy_qr_scan',
};

const faqs = [
  { q: 'Is this app free to use?', a: 'Yes! The core features are completely free. Premium features may be available via in-app subscription.' },
  { q: 'Which platforms are supported?', a: 'The app is available on both iOS (App Store) and Android (Google Play Store) where listed.' },
  { q: 'How does the AI work?', a: 'We use advanced machine learning models trained on millions of data points to deliver accurate, real-time results.' },
  { q: 'Is my data safe?', a: 'Absolutely. We follow industry best practices for data security and never sell your personal information.' },
];

export default function AppDetail() {
  const { appId } = useParams<{ appId: string }>();
  const app = getApp(appId || '');
  const isMobile = useIsMobile();

  if (!app) return <Navigate to="/apps" replace />;

  usePageAnalytics(app.id, pageViewEvents[app.id] || 'page_view');

  const hasIos = !!app.iosUrl;
  const hasAndroid = !!app.androidUrl;
  // Use android URL as primary QR target, fallback to iOS
  const qrTarget = app.androidUrl || app.iosUrl;

  return (
    <div style={{ '--app-accent': app.accentHsl } as React.CSSProperties}>
      {/* Hero */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at top, hsl(${app.accentHsl} / 0.1), transparent 60%)` }} />
        <div className="container-site relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center">
            <img src={app.logo} alt={`${app.name} logo`} className="w-24 h-24 rounded-2xl mx-auto mb-6 shadow-lg" style={{ boxShadow: `0 8px 30px -8px hsl(${app.accentHsl} / 0.4)` }} />
            <h1 className="text-4xl sm:text-5xl font-bold font-display" style={{ color: `hsl(${app.accentHsl})` }}>{app.name}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{app.description}</p>
          </motion.div>

          {/* Screenshots placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12 flex justify-center gap-4"
          >
            {[1, 2, 3].map(n => (
              <div key={n} className="w-40 sm:w-52 h-72 sm:h-96 rounded-2xl bg-muted border border-border flex items-center justify-center text-muted-foreground text-sm">
                Screenshot {n}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Conversion module */}
      <section className="section-padding">
        <div className="container-site">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card-glass p-8 sm:p-12 text-center">
            <h2 className="text-2xl font-bold font-display mb-6">Get {app.name}</h2>

            {isMobile ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {hasIos && (
                  <a
                    href={app.iosUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent(downloadEvents[app.id]?.ios, { app_name: app.name, page_name: app.id })}
                    className="inline-flex h-12 px-8 items-center justify-center rounded-lg font-semibold hover:opacity-90 transition-opacity text-white"
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
                    onClick={() => trackEvent(downloadEvents[app.id]?.android, { app_name: app.name, page_name: app.id })}
                    className="inline-flex h-12 px-8 items-center justify-center rounded-lg border-2 border-current font-semibold hover:opacity-80 transition-opacity"
                    style={{ color: `hsl(${app.accentHsl})` }}
                  >
                    Download for Android
                  </a>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center gap-8">
                {hasIos && (
                  <a
                    href={app.iosUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent(downloadEvents[app.id]?.ios, { app_name: app.name, page_name: app.id })}
                    className="inline-flex h-12 px-8 items-center justify-center rounded-lg font-semibold hover:opacity-90 transition-opacity text-white"
                    style={{ backgroundColor: `hsl(${app.accentHsl})` }}
                  >
                    Download for iOS
                  </a>
                )}
                {qrTarget && (
                  <button
                    onClick={() => trackEvent(qrEvents[app.id], { app_name: app.name, page_name: app.id })}
                    className="p-3 rounded-xl bg-card border border-border/40 transition-colors cursor-pointer"
                    style={{ borderColor: `hsl(${app.accentHsl} / 0.3)` }}
                    aria-label={`QR code to download ${app.name}`}
                  >
                    <QRCodeSVG value={qrTarget} size={100} level="M" />
                  </button>
                )}
                {hasAndroid && (
                  <a
                    href={app.androidUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent(downloadEvents[app.id]?.android, { app_name: app.name, page_name: app.id })}
                    className="inline-flex h-12 px-8 items-center justify-center rounded-lg border-2 border-current font-semibold hover:opacity-80 transition-opacity"
                    style={{ color: `hsl(${app.accentHsl})` }}
                  >
                    Download for Android
                  </a>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <MetricsBar />

      {/* Social proof */}
      <section className="section-padding">
        <div className="container-site">
          <h2 className="text-2xl font-bold font-display text-center mb-8">What Users Say</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {['Amazing app, changed my daily routine!', 'So intuitive and beautifully designed.', 'The AI features are incredibly accurate.'].map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-glass p-6"
              >
                <div className="flex gap-1 mb-3" style={{ color: `hsl(${app.accentHsl})` }}>{'★★★★★'}</div>
                <p className="text-sm text-muted-foreground italic">"{review}"</p>
                <p className="mt-3 text-xs font-medium text-foreground">— Happy User</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding">
        <div className="container-site max-w-2xl">
          <h2 className="text-2xl font-bold font-display text-center mb-8">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="card-glass px-6">
                <AccordionTrigger className="text-foreground font-medium text-left">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
