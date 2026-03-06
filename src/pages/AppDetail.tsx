import { useState, useRef, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getApp } from '@/lib/appData';
import { trackEvent } from '@/lib/analytics';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';
import { useIsMobile } from '@/hooks/use-mobile';
import { getPlatform, getDownloadUrl } from '@/lib/platformUtils';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowRight, Quote, ChevronDown, ChevronLeft, ChevronRight, Download } from 'lucide-react';
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
  {
    quote: "I've tried many similar apps but this one stands out for its clean design and smart features.",
    author: "Karthik R.",
    role: "Software Engineer",
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

// Feature bullet points per app
const featureBullets: Record<string, Record<string, string[]>> = {
  coinzy: {
    'AI Coin Scanner': ['Supports 10,000+ coin varieties', 'Works in low light conditions', 'Results in under 2 seconds'],
    'Rich History': ['Minting year and country details', 'Historical context and significance', 'Metal composition breakdown'],
    'Marketplace': ['Verified seller profiles', 'Secure in-app messaging', 'Price comparison tools'],
    'Rarity Analysis': ['Market value estimation', 'Condition grading assistance', 'Collection completeness tracking'],
  },
  banknotes: {
    'AI Banknote Scanner': ['Supports 150+ countries', 'Front and back recognition', 'Instant denomination detection'],
    'Global Coverage': ['Modern and historical notes', 'Commemorative editions', 'Regional variants included'],
    'Rarity & Value': ['Live market pricing', 'Condition-based valuation', 'Collector demand indicators'],
    'History & Design': ['Design symbolism explained', 'Security feature guide', 'Material and printing details'],
  },
  insecto: {
    'AI Identification': ['Works from safe distances', 'Photo library scanning', 'Real-time camera mode'],
    'Explore by Category': ['Filter by region', 'Toxicity level sorting', 'Seasonal availability info'],
    'Detailed Profiles': ['Habitat and diet info', 'Life cycle illustrations', 'Safety precautions listed'],
    'Build Collection': ['Personal discovery log', 'Location-tagged entries', 'Share with community'],
  },
  habiteazy: {
    'Streak Tracking': ['Fire badges for milestones', 'Weekly and monthly streaks', 'Recovery day options'],
    'Smart Scheduling': ['Custom repeat patterns', 'Time-of-day reminders', 'Weekend/weekday modes'],
    'Visual Progress': ['Heat map calendar view', 'Completion rate charts', 'Trend analysis over time'],
    'Fun Companion': ['Virtual pet evolution', 'Achievement unlocks', 'Motivational notifications'],
  },
};

export default function AppDetail() {
  const { appId } = useParams<{ appId: string }>();
  const app = getApp(appId || '');
  const isMobile = useIsMobile();
  const [showAllFaqs, setShowAllFaqs] = useState(false);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const [canScrollReviewLeft, setCanScrollReviewLeft] = useState(false);
  const [canScrollReviewRight, setCanScrollReviewRight] = useState(true);

  const appId2 = app?.id || '';
  usePageAnalytics(appId2, pageViewEvents[appId2] || 'page_view');

  useEffect(() => {
    const el = reviewsRef.current;
    if (!el) return;
    const update = () => {
      setCanScrollReviewLeft(el.scrollLeft > 10);
      setCanScrollReviewRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    };
    update();
    el.addEventListener('scroll', update);
    return () => el.removeEventListener('scroll', update);
  }, []);

  if (!app) return <Navigate to="/" replace />;

  const platform = getPlatform();
  const faqs = appFaqs[app.id] || [];
  const visibleFaqs = showAllFaqs ? faqs : faqs.slice(0, 3);
  const bullets = featureBullets[app.id] || {};

  const scrollReviews = (dir: 'left' | 'right') => {
    const el = reviewsRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <div style={{ '--app-accent': app.accentHsl } as React.CSSProperties}>
      {/* ── 1. Hero ── */}
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

            {/* Download section */}
            <div className="mt-6 flex flex-col items-center gap-4">
              {/* Download button */}
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 h-11 px-7 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity text-white"
                style={{ backgroundColor: `hsl(${app.accentHsl})` }}
              >
                <Download size={16} /> Download Now
              </button>

              {/* QR code — desktop only, below button */}
              {!isMobile && qrUrl && (
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 rounded-xl bg-card border border-border/40" style={{ borderColor: `hsl(${app.accentHsl} / 0.2)` }}>
                    <QRCodeSVG value={qrUrl} size={80} level="M" />
                  </div>
                  <span className="text-xs text-muted-foreground">Scan to download</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 3. Key Features — Alternating layout with bullet points ── */}
      <section className="py-20 sm:py-24 snap-start">
        <div className="container-site w-full">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">What makes it special</h2>
          </motion.div>

          <div className="space-y-20 max-w-5xl mx-auto">
            {app.features.map((feat, i) => {
              const isReversed = i % 2 === 1;
              const screenshot = app.screenshots[i % app.screenshots.length];
              const featBullets = bullets[feat.title] || [];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.7 }}
                  className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 lg:gap-14`}
                >
                  {/* Text side */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="text-4xl mb-3">{feat.icon}</div>
                    <h3 className="text-xl sm:text-2xl font-bold font-display text-foreground mb-3">{feat.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">{feat.description}</p>
                    {featBullets.length > 0 && (
                      <ul className="space-y-2">
                        {featBullets.map((bullet, bi) => (
                          <li key={bi} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: `hsl(${app.accentHsl})` }} />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {/* Screenshot side */}
                  <div className="flex-1 w-full max-w-xs mx-auto md:mx-0">
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

      {/* ── 4. Reviews — Horizontal Carousel with 4 cards ── */}
      <section className="py-20 sm:py-24 snap-start">
        <div className="container-site w-full">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">Reviews</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">What users say</h2>
          </motion.div>

          <div className="relative max-w-5xl mx-auto">
            {canScrollReviewLeft && (
              <button
                onClick={() => scrollReviews('left')}
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                style={{ boxShadow: 'var(--shadow-card)' }}
              >
                <ChevronLeft size={18} />
              </button>
            )}
            {canScrollReviewRight && (
              <button
                onClick={() => scrollReviews('right')}
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                style={{ boxShadow: 'var(--shadow-card)' }}
              >
                <ChevronRight size={18} />
              </button>
            )}

            <div
              ref={reviewsRef}
              className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {reviews.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex-shrink-0 snap-start"
                  style={{ width: 'calc(25% - 15px)', minWidth: '240px' }}
                >
                  <div className="p-6 sm:p-8 rounded-3xl bg-card h-full flex flex-col" style={{ boxShadow: 'var(--shadow-card)' }}>
                    <Quote size={20} className="text-primary/20 mb-4" />
                    <div className="flex gap-0.5 mb-3 text-sm" style={{ color: `hsl(${app.accentHsl})` }}>
                      {'★★★★★'}
                    </div>
                    <p className="text-sm leading-relaxed text-foreground flex-1 font-medium">"{r.quote}"</p>
                    <div className="mt-5 flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-xs"
                        style={{ color: `hsl(${app.accentHsl})`, background: `hsl(${app.accentHsl} / 0.1)` }}
                      >
                        {r.author.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-xs">{r.author}</div>
                        <div className="text-[11px] text-muted-foreground">{r.role}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. App Stats ── */}
      <section className="min-h-[60vh] flex items-center py-20 sm:py-24 snap-start">
        <div className="container-site w-full">
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

      {/* ── 6. FAQs — Show first 3 with "More" toggle ── */}
      {faqs.length > 0 && (
        <section className="min-h-[60vh] flex items-center py-20 sm:py-24 snap-start">
          <div className="container-site w-full flex justify-center">
            <div className="w-full max-w-xl">
              <motion.div {...fadeUp} className="text-center mb-16">
                <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">FAQ</p>
                <h2 className="text-3xl sm:text-4xl font-bold font-display">Frequently asked questions</h2>
              </motion.div>

              <Accordion type="single" collapsible className="space-y-3">
                {visibleFaqs.map((faq, i) => (
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

              {faqs.length > 3 && (
                <div className="text-center mt-6">
                  <button
                    onClick={() => setShowAllFaqs(!showAllFaqs)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:opacity-80 transition-opacity"
                  >
                    {showAllFaqs ? 'Show Less' : 'More'}
                    <ChevronDown size={16} className={`transition-transform ${showAllFaqs ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
