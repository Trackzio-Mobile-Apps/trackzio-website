"use client";

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';
import { useIsMobile } from '@/hooks/use-mobile';
import { getPlatform } from "@/lib/platformUtils";
import { imageSrc } from "@/lib/imageSrc";
import { QRCodeSVG } from 'qrcode.react';
import { Quote, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import PlatformDownloadButtons from '@/components/PlatformDownloadButtons';
import FeatureShowcase from '@/components/FeatureShowcase';
import OtherAppsCarousel from '@/components/OtherAppsCarousel';
import type { AppContent } from "@/lib/content/apps";
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
  rockzy: 'rockzy_page_view',
  plantzy: 'plantzy_page_view',
};

function reviewStars(rating?: number) {
  const filled = Math.min(5, Math.max(1, Math.round(rating ?? 5)));
  return `${"★".repeat(filled)}${"☆".repeat(5 - filled)}`;
}

type AppDetailProps = {
  app: AppContent;
};

export default function AppDetail({ app }: AppDetailProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [app.id]);
  const isMobile = useIsMobile();
  const [showAllFaqs, setShowAllFaqs] = useState(false);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const [canScrollReviewLeft, setCanScrollReviewLeft] = useState(false);
  const [canScrollReviewRight, setCanScrollReviewRight] = useState(true);

  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const appId2 = app.id;
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

    const startAutoScroll = () => {
      autoScrollRef.current = setInterval(() => {
        if (!el) return;
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 10) {
          el.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          el.scrollBy({ left: el.clientWidth * 0.8, behavior: 'smooth' });
        }
      }, 4000);
    };
    startAutoScroll();

    const pause = () => { if (autoScrollRef.current) clearInterval(autoScrollRef.current); };
    const resume = () => { pause(); startAutoScroll(); };
    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', resume);

    return () => {
      el.removeEventListener('scroll', update);
      el.removeEventListener('mouseenter', pause);
      el.removeEventListener('mouseleave', resume);
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, [app.id]);

  const platform = getPlatform();
  const faqs = app.faqs ?? [];
  const reviews = app.reviews ?? [];
  const visibleFaqs = showAllFaqs ? faqs : faqs.slice(0, 3);
  const showcaseFromContent = app.screenshots.map((s, index) => ({
    screenshot: s,
    title: app.features[index] || `Feature ${index + 1}`,
    description: app.longDescription,
  }));

  const qrUrl = (() => {
    if (platform === 'ios' && app.iosUrl) return app.iosUrl;
    if (platform === 'android' && app.androidUrl) return app.androidUrl;
    return app.androidUrl || app.iosUrl;
  })();

  const scrollReviews = (dir: 'left' | 'right') => {
    const el = reviewsRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <div style={{ '--app-accent': app.accentHsl } as React.CSSProperties}>
      {/* ── 1. Hero ── */}
      <section className="min-h-[40vh] flex items-center justify-center pt-8 pb-12 snap-start">
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at top, hsl(${app.accentHsl} / 0.08), transparent 60%)` }} />
        <div className="container-site relative">
          <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center">
            <img
              src={imageSrc(app.logo)}
              alt={`${app.fullName} logo`}
              className="w-20 h-20 rounded-2xl mx-auto mb-5"
              style={{ boxShadow: `0 8px 30px -8px hsl(${app.accentHsl} / 0.35)` }}
            />
            <h1 className="text-4xl sm:text-5xl font-bold font-display" style={{ color: `hsl(${app.accentHsl})` }}>
              {app.fullName}
            </h1>
            <p className="mt-2 text-base text-muted-foreground/90 max-w-2xl mx-auto leading-relaxed">{app.longDescription}</p>

            {/* Download section */}
            <div className="mt-6 flex flex-col items-center gap-4">
              <PlatformDownloadButtons
                iosUrl={app.iosUrl}
                androidUrl={app.androidUrl}
                appName={app.fullName}
                appId={app.id}
                accentHsl={app.accentHsl}
              />

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

      {/* ── 2. Feature Showcase — Premium Phone Mockup Carousel ── */}
      {showcaseFromContent.length > 0 && (
        <FeatureShowcase features={showcaseFromContent} accentHsl={app.accentHsl} />
      )}


      {/* ── 4. Reviews — from content/apps/app-details.json */}
      {reviews.length > 0 && (
      <section className="py-20 sm:py-24 snap-start">
        <div className="container-site w-full">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">Reviews</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">What users say</h2>
              {app.reviewSummary?.line && (
                <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">{app.reviewSummary.line}</p>
              )}
          </motion.div>

          <div className="relative max-w-5xl mx-auto">
            {canScrollReviewLeft && (
              <button
                  type="button"
                onClick={() => scrollReviews('left')}
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                style={{ boxShadow: 'var(--shadow-card)' }}
              >
                <ChevronLeft size={18} />
              </button>
            )}
            {canScrollReviewRight && (
              <button
                  type="button"
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
                    key={`${r.author}-${r.quote.slice(0, 24)}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(i * 0.08, 0.4) }}
                  className="flex-shrink-0 snap-start"
                  style={{ width: 'calc(25% - 15px)', minWidth: '260px' }}
                >
                  <div className="p-6 rounded-3xl bg-card h-full flex flex-col" style={{ boxShadow: 'var(--shadow-card)' }}>
                    <Quote size={22} className="mb-3" style={{ color: `hsl(${app.accentHsl} / 0.25)` }} />
                      <div
                        className="mb-3 text-sm tracking-tight font-medium"
                        style={{ color: `hsl(${app.accentHsl})` }}
                        aria-label={`${r.rating ?? 5} out of 5 stars`}
                      >
                        {reviewStars(r.rating)}
                    </div>
                    <p className="text-sm leading-relaxed text-foreground flex-1 font-medium">"{r.quote}"</p>
                    <div className="mt-5 flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm"
                        style={{ color: `hsl(${app.accentHsl})`, background: `hsl(${app.accentHsl} / 0.1)` }}
                      >
                        {r.author.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-sm">— {r.author}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ── 5. App Stats ── */}
      <section className="min-h-[60vh] flex items-center py-20 sm:py-24 snap-start">
        <div className="container-site w-full">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">By the Numbers</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">{app.fullName} in numbers</h2>
          </motion.div>

          <div className="grid gap-8 max-w-3xl mx-auto grid-cols-1 sm:grid-cols-3">
            {[
              {
                value: app.stats.downloads || "Coming soon",
                label: app.statLabels?.downloads ?? "Total Downloads",
              },
              {
                value: app.stats.rating || "Coming soon",
                label: app.statLabels?.rating ?? "Average Rating",
              },
              {
                value: app.stats.dau || "Coming soon",
                label: app.statLabels?.dau ?? "Total Active Users",
              },
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
                    key={faqs.indexOf(faq)}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: Math.min(i * 0.06, 0.3) }}
                  >
                    <AccordionItem
                      value={`faq-${faqs.indexOf(faq)}`}
                      className="rounded-2xl bg-card px-6"
                      style={{ boxShadow: 'var(--shadow-card)' }}
                    >
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

      {app.id === "coinzy" && (
        <section className="py-12 sm:py-16 border-t border-border/60 snap-start" aria-labelledby="coinzy-platform-disclaimer-heading">
          <div className="container-site max-w-3xl mx-auto">
            <h2
              id="coinzy-platform-disclaimer-heading"
              className="text-xl sm:text-2xl font-bold font-display mb-4"
              style={{ color: `hsl(${app.accentHsl})` }}
            >
              Disclaimer
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Coinzy is a hobbyist platform for physical numismatics only and does not facilitate the trading, holding, or
              exchange of Bitcoins, cryptocurrencies, or any digital assets. We do not process payments or host a marketplace,
              as all listings are for discovery only and any resulting sales occur entirely off-platform between users. Our
              service is strictly limited to connecting hobbyists to showcase collections, and we are not a party to or
              responsible for any private agreements or transactions.
            </p>
          </div>
        </section>
      )}

      <OtherAppsCarousel excludeAppId={app.id} accentHsl={app.accentHsl} />

    </div>
  );
}
