import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getApp } from '@/lib/appData';
import { trackEvent } from '@/lib/analytics';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';
import { useIsMobile } from '@/hooks/use-mobile';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowRight, Quote } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

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

const appFaqs: Record<string, { q: string; a: string }[]> = {
  coinzy: [
    { q: 'How accurate is the coin identification?', a: 'Coinzy uses advanced AI trained on millions of coin images, achieving over 95% accuracy for most commonly circulated coins worldwide.' },
    { q: 'Can I identify rare or ancient coins?', a: 'Yes! Our AI model supports ancient, rare, and commemorative coins. The rarity analysis feature provides estimated value and historical context.' },
    { q: 'How does the marketplace work?', a: 'You can list coins for sale, browse listings from other collectors, and connect with buyers and sellers in a trusted community with verified profiles.' },
    { q: 'Is my collection data backed up?', a: 'Yes, your collection syncs to the cloud automatically. You can access it from any device by signing into your account.' },
    { q: 'Does Coinzy work offline?', a: 'Basic browsing and your saved collection work offline. Coin scanning and marketplace features require an internet connection.' },
  ],
  banknotes: [
    { q: 'How many currencies does the app support?', a: 'Banknotes currently supports identification of banknotes from over 150 countries, covering both modern and historical currencies.' },
    { q: 'Can I check if a banknote is counterfeit?', a: 'While our AI can identify banknotes and highlight security features, we recommend professional verification for authenticity confirmation.' },
    { q: 'Does it show exchange rates?', a: 'Yes, the app displays current exchange rates for identified currencies, updated regularly to reflect market conditions.' },
    { q: 'Can I scan damaged banknotes?', a: 'Our AI can identify most banknotes even with moderate wear or damage. Severely damaged notes may require manual identification.' },
    { q: 'Is the app available in multiple languages?', a: 'Yes, Banknotes supports English, Hindi, Spanish, French, and several other languages with more being added regularly.' },
  ],
  insecto: [
    { q: 'Is Insecto safe to use around insects?', a: 'Absolutely! Simply point your camera from a safe distance. The AI can identify insects from photos without needing to get too close.' },
    { q: 'Can it identify harmful or venomous insects?', a: 'Yes, Insecto provides toxicity information, bite/sting details, and safety recommendations for potentially dangerous species.' },
    { q: 'How many insect species does it recognize?', a: 'Our AI model is trained on thousands of species and is continuously expanding. It covers the most common insects found worldwide.' },
    { q: 'Can I contribute to the insect database?', a: 'Yes! Verified identifications help improve our AI. You can submit photos and feedback through the app to help expand our database.' },
    { q: 'Does it work for other bugs like spiders?', a: 'While primarily designed for insects, Insecto can also identify many arachnids, centipedes, and other common arthropods.' },
  ],
  habiteazy: [
    { q: 'How does streak tracking work?', a: 'Complete your habit each day to build a streak. The app tracks consecutive days and rewards you with badges and visual progress indicators.' },
    { q: 'Can I set multiple habits at once?', a: 'Yes, you can track unlimited habits simultaneously. We recommend starting with 2-3 key habits and building from there.' },
    { q: 'Does the app send reminders?', a: 'Yes, you can set flexible reminders for each habit with custom times and days. Smart notifications adapt to your schedule over time.' },
    { q: 'What happens if I miss a day?', a: 'Missing a day resets your streak, but your overall progress history is preserved. The app encourages you to get back on track without judgment.' },
    { q: 'Can I see my long-term progress?', a: 'Absolutely! Beautiful charts and statistics show your daily, weekly, and monthly progress with completion rates and trends over time.' },
  ],
};

export default function AppDetail() {
  const { appId } = useParams<{ appId: string }>();
  const app = getApp(appId || '');
  const isMobile = useIsMobile();

  if (!app) return <Navigate to="/apps" replace />;

  usePageAnalytics(app.id, pageViewEvents[app.id] || 'page_view');

  const hasIos = !!app.iosUrl;
  const hasAndroid = !!app.androidUrl;
  const qrTarget = app.androidUrl || app.iosUrl;
  const faqs = appFaqs[app.id] || [];

  return (
    <div style={{ '--app-accent': app.accentHsl } as React.CSSProperties}>
      {/* ── 1. Hero (compact) ── */}
      <section className="min-h-[50vh] flex items-center pt-12 pb-16 snap-start">
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at top, hsl(${app.accentHsl} / 0.08), transparent 60%)` }} />
        <div className="container-site relative">
          <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center">
            <img
              src={app.logo}
              alt={`${app.name} logo`}
              className="w-20 h-20 rounded-2xl mx-auto mb-5"
              style={{ boxShadow: `0 8px 30px -8px hsl(${app.accentHsl} / 0.35)` }}
            />
            <h1 className="text-4xl sm:text-5xl font-bold font-display" style={{ color: `hsl(${app.accentHsl})` }}>
              {app.name}
            </h1>
            <p className="mt-2 text-lg font-medium text-foreground">{app.tagline}</p>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto leading-relaxed">{app.description}</p>

            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              {hasIos && (
                <a
                  href={app.iosUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent(downloadEvents[app.id]?.ios, { app_name: app.name })}
                  className="inline-flex h-11 px-7 items-center justify-center rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity text-white"
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
                  className="inline-flex h-11 px-7 items-center justify-center rounded-xl border-2 font-semibold text-sm hover:opacity-80 transition-opacity"
                  style={{ color: `hsl(${app.accentHsl})`, borderColor: `hsl(${app.accentHsl} / 0.4)` }}
                >
                  Download for Android
                </a>
              )}
              {!isMobile && qrTarget && (
                <div className="p-2 rounded-xl bg-card border border-border/40" style={{ borderColor: `hsl(${app.accentHsl} / 0.2)` }}>
                  <QRCodeSVG value={qrTarget} size={72} level="M" />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>


      {/* ── 3. Key Features — Alternating layout ── */}
      <section className="py-24 sm:py-32 snap-start">
        <div className="container-site w-full">
          <motion.div {...fadeUp} className="text-center mb-20">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">What makes it special</h2>
          </motion.div>

          <div className="space-y-32 max-w-5xl mx-auto">
            {app.features.map((feat, i) => {
              const isReversed = i % 2 === 1;
              const screenshot = app.screenshots[i % app.screenshots.length];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.7 }}
                  className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 lg:gap-20`}
                >
                  {/* Text side */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="text-5xl mb-5">{feat.icon}</div>
                    <h3 className="text-2xl sm:text-3xl font-bold font-display text-foreground mb-4">{feat.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-lg">{feat.description}</p>
                  </div>
                  {/* Screenshot side */}
                  <div className="flex-1 w-full">
                    <div
                      className="rounded-2xl overflow-hidden bg-card"
                      style={{ boxShadow: '0 8px 32px -8px hsl(0 0% 0% / 0.1)' }}
                    >
                      <img
                        src={screenshot}
                        alt={feat.title}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. Reviews ── */}
      <section className="min-h-screen flex items-center py-24 sm:py-32 snap-start">
        <div className="container-site w-full">
          <motion.div {...fadeUp} className="text-center mb-20">
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
      <section className="min-h-[60vh] flex items-center py-24 sm:py-32 snap-start">
        <div className="container-site w-full">
          <motion.div {...fadeUp} className="text-center mb-20">
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

      {/* ── 6. FAQs — 50% width centered ── */}
      {faqs.length > 0 && (
        <section className="min-h-[60vh] flex items-center py-24 sm:py-32 snap-start">
          <div className="container-site w-full flex justify-center">
            <div className="w-full max-w-xl">
              <motion.div {...fadeUp} className="text-center mb-16">
                <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">FAQ</p>
                <h2 className="text-3xl sm:text-4xl font-bold font-display">Frequently asked questions</h2>
              </motion.div>

              <Accordion type="single" collapsible className="space-y-3">
                {faqs.map((faq, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: Math.min(i * 0.06, 0.3) }}
                  >
                    <AccordionItem value={`faq-${i}`} className="rounded-2xl bg-card px-6" style={{ boxShadow: 'var(--shadow-card)' }}>
                      <AccordionTrigger className="text-foreground font-medium text-left text-sm">{faq.q}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-sm leading-relaxed">{faq.a}</AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
