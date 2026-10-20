"use client";

import { useState, useRef, useEffect } from 'react';
import Link from "next/link";
import { motion } from 'framer-motion';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';
import { useIsMobile } from '@/hooks/use-mobile';
import { getPlatform } from "@/lib/platformUtils";
import { QRCodeSVG } from 'qrcode.react';
import SiteImage from "@/components/SiteImage";
import coinzyExpert from "@/assets/screenshots/coinzy-3.webp";
import { Quote, ChevronDown, ChevronLeft, ChevronRight, Images, Bell, Store } from 'lucide-react';
import { APP_PARTNER_CATEGORY } from "@/lib/partnerForm";
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
  antiqzy: 'antiqzy_page_view',
  shroomzy: 'shroomzy_page_view',
};

function reviewStars(rating?: number) {
  const filled = Math.min(5, Math.max(1, Math.round(rating ?? 5)));
  return `${"★".repeat(filled)}${"☆".repeat(5 - filled)}`;
}

function getScrollStep(el: HTMLElement): number {
  const first = el.firstElementChild as HTMLElement | null;
  if (!first) return el.clientWidth;
  const gap = parseFloat(getComputedStyle(el).gap) || 0;
  return first.offsetWidth + gap;
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
  const coinzyReviewsRef = useRef<HTMLDivElement>(null);
  const [canScrollReviewLeft, setCanScrollReviewLeft] = useState(false);
  const [canScrollReviewRight, setCanScrollReviewRight] = useState(true);
  const [canScrollCoinzyLeft, setCanScrollCoinzyLeft] = useState(false);
  const [canScrollCoinzyRight, setCanScrollCoinzyRight] = useState(true);

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
    description: app.featureCaptions?.[index] ?? "",
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

  const coinzyAutoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeCoinzyAutoRef = useRef<() => void>(() => {});

  useEffect(() => {
    const el = coinzyReviewsRef.current;
    if (!el || app.id !== "coinzy") return;

    const update = () => {
      setCanScrollCoinzyLeft(el.scrollLeft > 10);
      setCanScrollCoinzyRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    };
    update();

    const clearAuto = () => {
      if (coinzyAutoScrollRef.current) {
        clearInterval(coinzyAutoScrollRef.current);
        coinzyAutoScrollRef.current = null;
      }
    };
    const startAuto = () => {
      clearAuto();
      coinzyAutoScrollRef.current = setInterval(() => {
        if (el.scrollWidth <= el.clientWidth + 1) return;
        const step = getScrollStep(el);
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 10) {
          el.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          el.scrollBy({ left: step, behavior: "smooth" });
        }
      }, 4000);
    };
    resumeCoinzyAutoRef.current = startAuto;

    const pause = () => clearAuto();
    const resume = () => startAuto();
    el.addEventListener("scroll", update, { passive: true });
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", resume);
    window.addEventListener("resize", update);
    startAuto();

    return () => {
      clearAuto();
      resumeCoinzyAutoRef.current = () => {};
      el.removeEventListener("scroll", update);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", resume);
      window.removeEventListener("resize", update);
    };
  }, [app.id, reviews.length]);

  const scrollCoinzyReviews = (dir: "left" | "right") => {
    const el = coinzyReviewsRef.current;
    if (!el) return;
    if (coinzyAutoScrollRef.current) {
      clearInterval(coinzyAutoScrollRef.current);
      coinzyAutoScrollRef.current = null;
    }
    window.setTimeout(() => resumeCoinzyAutoRef.current(), 8000);
    const step = getScrollStep(el);
    el.scrollBy({ left: dir === "left" ? -step : step, behavior: "smooth" });
  };

  return (
    <div style={{ '--app-accent': app.accentHsl } as React.CSSProperties}>
      {/* ── 1. Hero ── */}
      <section className="relative min-h-[40vh] flex items-center justify-center pt-8 pb-12 snap-start overflow-hidden">
        <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse at top, hsl(${app.accentHsl} / 0.08), transparent 60%)` }} />
        <div className="container-site relative z-10">
          <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center">
            <span
              className="inline-flex rounded-2xl mb-5"
              style={{ boxShadow: `0 8px 30px -8px hsl(${app.accentHsl} / 0.35)` }}
            >
              <SiteImage
                src={app.logo}
                alt={`${app.name} logo`}
                priority
                sizes="80px"
                className="rounded-2xl object-cover"
                style={{ width: "5rem", height: "5rem" }}
              />
            </span>
            <h1 className="type-page-title" style={{ color: `hsl(${app.accentHsl})` }}>
              {app.heroTitle ?? app.fullName}
            </h1>
            <p className="type-lead mt-2 max-w-2xl mx-auto">{app.heroDescription ?? app.longDescription}</p>

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

      {app.id === "coinzy" && (
        <section className="py-16 sm:py-20 snap-start" aria-labelledby="coinzy-expert-heading">
          <div className="container-site grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="type-kicker">Expert Evaluation</p>
              <h2 id="coinzy-expert-heading" className="type-title">
                Not sure about a coin? Ask an expert.
              </h2>
              <p className="type-lead mt-4">
                Request an evaluation from an experienced numismatist in the app.
              </p>
              <ol className="type-copy mt-5 list-decimal space-y-2 pl-5">
                <li>Scan your coin.</li>
                <li>Tap Expert Evaluation.</li>
                <li>Get a report within 72 hours.</li>
              </ol>
              <p className="type-body mt-5">
                Each report covers identification, condition, rarity, history, estimated value, and a recommendation.
              </p>
              <p className="type-body mt-3">
                Paid per coin; price shown in the app. Reports are advisory opinions, not formal grading or certification.
              </p>
              <div className="mt-8">
                <PlatformDownloadButtons
                  iosUrl={app.iosUrl}
                  androidUrl={app.androidUrl}
                  appName={app.fullName}
                  appId={app.id}
                  accentHsl={app.accentHsl}
                />
              </div>
            </div>
            <SiteImage
              src={coinzyExpert}
              alt="Connect with a real human expert"
              sizes="(min-width: 1024px) 480px, 90vw"
              className="mx-auto w-full max-w-md"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </section>
      )}

      {app.id === "coinzy" && (
        <section id="for-businesses" className="scroll-mt-24 border-t border-border/60 py-16 snap-start sm:py-24" aria-labelledby="coinzy-business-heading">
          <div className="container-site">
            <div className="mx-auto max-w-2xl text-center">
              <h2 id="coinzy-business-heading" className="type-title">
                For coin shops and dealers
              </h2>
              <p className="type-lead mt-3">
                Reach collectors beyond your local area, at no cost.
              </p>
            </div>
            <div className="mt-10 grid items-stretch gap-5 md:grid-cols-3">
              {[
                {
                  title: "Free listing",
                  text: "Send us photos and prices, and we'll list your coins for free.",
                  icon: Images,
                },
                {
                  title: "Seller leads",
                  text: "We tell you when people near you want to sell coins or collections.",
                  icon: Bell,
                },
                {
                  title: "Your sale, your way",
                  text: "Your coins go directly in front of thousands of Coinzy users every day.",
                  icon: Store,
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="card-hover flex h-full flex-col items-center rounded-3xl bg-card px-6 py-8 text-center"
                >
                  <span
                    className="card-hover-icon mb-4 flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: "hsl(168 30% 90%)", color: "#064e3b" }}
                  >
                    <card.icon size={22} aria-hidden="true" />
                  </span>
                  <h3 className="type-card-title card-hover-title">{card.title}</h3>
                  <p className="type-body mt-2">{card.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <Link
                href="/partners?category=coins"
                onClick={() => window.scrollTo(0, 0)}
                className="inline-flex h-12 items-center justify-center rounded-xl px-6 text-sm font-semibold"
                style={{ backgroundColor: "#064e3b", color: "#ffffff" }}
              >
                Partner with us
              </Link>
            </div>
          </div>
        </section>
      )}

      {app.id === "coinzy" && reviews.length > 0 && (
        <section className="py-20 sm:py-24 snap-start" aria-labelledby="coinzy-reviews-heading">
          <div className="container-site w-full">
            <motion.div {...fadeUp} className="text-center mb-12">
              <p className="type-kicker">Reviews</p>
              <h2 id="coinzy-reviews-heading" className="type-title">What users say</h2>
            </motion.div>

            <div className="relative max-w-6xl mx-auto">
              {canScrollCoinzyLeft && (
                <button
                  type="button"
                  aria-label="Previous reviews"
                  onClick={() => scrollCoinzyReviews("left")}
                  className="absolute left-0 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/95 text-muted-foreground shadow-md backdrop-blur-sm hover:text-foreground sm:flex"
                >
                  <ChevronLeft size={18} />
                </button>
              )}
              {canScrollCoinzyRight && (
                <button
                  type="button"
                  aria-label="Next reviews"
                  onClick={() => scrollCoinzyReviews("right")}
                  className="absolute right-0 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/95 text-muted-foreground shadow-md backdrop-blur-sm hover:text-foreground sm:flex"
                >
                  <ChevronRight size={18} />
                </button>
              )}

              <div
                ref={coinzyReviewsRef}
                role="region"
                aria-label="Coinzy reviews"
                className="flex items-stretch gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide pb-2 sm:px-12"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {reviews.map((review) => {
                  const card = (
                    <>
                      <div className="flex items-start justify-between gap-3">
                        <p className="type-kicker mb-0" style={{ color: `hsl(${app.accentHsl})` }}>
                          {review.store}
                        </p>
                        {review.date && (
                          <p className="type-body shrink-0">{review.date}</p>
                        )}
                      </div>
                      <p className="type-card-title mt-2">
                        {review.title ?? review.author}
                      </p>
                      <div
                        className="mt-1.5 text-sm tracking-tight text-amber-500"
                        aria-label={`${review.rating ?? 5} out of 5 stars`}
                      >
                        {reviewStars(review.rating)}
                      </div>
                      <p className="type-copy mt-3 flex-1">{review.quote}</p>
                      {(review.title || review.footnote) && (
                        <div className="mt-4 flex items-end justify-between gap-3">
                          {review.title && (
                            <p className="type-body font-medium">{review.author}</p>
                          )}
                          {review.footnote && (
                            <p className="text-xs text-muted-foreground">{review.footnote}</p>
                          )}
                        </div>
                      )}
                    </>
                  );
                  const className = "card-hover flex h-full flex-col rounded-2xl border border-border/50 bg-card p-4 sm:p-5";
                  return (
                    <div
                      key={`${review.store}-${review.author}-${review.date}`}
                      className="snap-start shrink-0 w-[88%] sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]"
                    >
                      {review.href ? (
                        <a
                          href={review.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={className}
                        >
                          {card}
                        </a>
                      ) : (
                        <article className={className}>
                          {card}
                        </article>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-12">
              <PlatformDownloadButtons
                iosUrl="https://apps.apple.com/us/app/coinzy-coin-ai-identification/id6752857760?see-all=reviews"
                androidUrl={app.androidUrl}
                appName={app.fullName}
                appId={app.id}
                linkNote="Read all reviews"
              />
            </div>
          </div>
        </section>
      )}

      {/* ── 4. Reviews — from content/apps/app-details.json */}
      {app.id !== "coinzy" && reviews.length > 0 && (
      <section className="py-20 sm:py-24 snap-start">
        <div className="container-site w-full">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="type-kicker">Reviews</p>
            <h2 className="type-title">What users say</h2>
              {app.reviewSummary?.line && (
                <p className="type-body mt-3 max-w-xl mx-auto">{app.reviewSummary.line}</p>
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
                  {(() => {
                    const card = (
                      <>
                        <Quote size={22} className="mb-3" style={{ color: `hsl(${app.accentHsl} / 0.25)` }} />
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div
                            className="text-sm tracking-tight font-medium"
                            style={{ color: `hsl(${app.accentHsl})` }}
                            aria-label={`${r.rating ?? 5} out of 5 stars`}
                          >
                            {reviewStars(r.rating)}
                          </div>
                          {r.date && <p className="text-xs text-muted-foreground">{r.date}</p>}
                        </div>
                        <p className="type-copy flex-1 font-medium">"{r.quote}"</p>
                        <div className="mt-5 flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm"
                            style={{ color: `hsl(${app.accentHsl})`, background: `hsl(${app.accentHsl} / 0.1)` }}
                          >
                            {r.author.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="type-copy font-semibold">— {r.author}</div>
                            {r.store && <p className="text-xs text-muted-foreground">{r.store}</p>}
                          </div>
                        </div>
                      </>
                    );
                    const className = "card-hover p-6 rounded-3xl bg-card h-full flex flex-col";
                    return r.href ? (
                      <a href={r.href} target="_blank" rel="noopener noreferrer" className={className}>
                        {card}
                      </a>
                    ) : (
                      <div className={className}>{card}</div>
                    );
                  })()}
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
            <p className="type-kicker">By the Numbers</p>
            <h2 className="type-title">{app.fullName} in numbers</h2>
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
                <div className="type-stat text-gradient mb-2">{stat.value}</div>
                <div className="type-body">{stat.label}</div>
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
                <p className="type-kicker">FAQ</p>
                <h2 className="type-title">Frequently asked questions</h2>
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
                      className="card-hover rounded-2xl bg-card px-6"
                    >
                      <AccordionTrigger className="type-copy text-left font-medium">{faq.q}</AccordionTrigger>
                      <AccordionContent className="type-body">{faq.a}</AccordionContent>
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
              className="type-disclaimer-title"
              style={{ color: `hsl(${app.accentHsl})` }}
            >
              Disclaimer
            </h2>
            <p className="type-body">
              Coinzy lets collectors list coins and contact each other directly. Coinzy does not handle payments or take part in any sale. Buyers and sellers agree on terms and settle payment between themselves. Coin identification and value estimates are for education and are not professional appraisals or certifications. Expert evaluations are advisory opinions based on the photos and details provided.
            </p>
          </div>
        </section>
      )}

      {APP_PARTNER_CATEGORY[app.id] && app.id !== "coinzy" && (
        <section className="border-t border-border/60 py-16 snap-start sm:py-20" aria-labelledby="partner-with-us-heading">
          <div className="container-site">
            <div className="mx-auto max-w-2xl text-center">
              <h2 id="partner-with-us-heading" className="type-title">Partner with us</h2>
              <p className="type-lead mt-3">
                List for free and reach collectors on {app.name}.
              </p>
              <Link
                href={`/partners?category=${APP_PARTNER_CATEGORY[app.id]}`}
                onClick={() => window.scrollTo(0, 0)}
                className="mt-8 inline-flex h-12 items-center justify-center rounded-xl px-6 text-sm font-semibold text-white"
                style={{ backgroundColor: `hsl(${app.accentHsl})` }}
              >
                Partner with us
              </Link>
            </div>
          </div>
        </section>
      )}

      <OtherAppsCarousel excludeAppId={app.id} accentHsl={app.accentHsl} />

    </div>
  );
}
