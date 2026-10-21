import { motion } from "framer-motion";
import { usePageAnalytics } from "@/hooks/usePageAnalytics";
import SiteImage from "@/components/SiteImage";
import PartnerForm from "@/components/PartnerForm";
import { getClientApps } from "@/lib/content/apps-client";
import {
  COMPANY_ACTIVE_USERS,
  COMPANY_AVERAGE_RATING,
  COMPANY_DOWNLOADS,
} from "@/lib/companyMetrics";
import {
  NETWORK_APPS,
  PARTNER_FAQS,
  PARTNER_STEPS,
  PARTNER_WAYS,
  partnerQuote,
} from "@/lib/partnerForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

const clientApps = new Map(getClientApps().map((app) => [app.id, app]));

const numberLine = [
  { value: COMPANY_DOWNLOADS, label: "downloads across our apps" },
  { value: COMPANY_ACTIVE_USERS, label: "active users" },
  { value: COMPANY_AVERAGE_RATING, label: "average rating" },
];

export default function Partners({ initialCategory }: { initialCategory: string }) {
  usePageAnalytics("partners", "partners_page_view");

  return (
    <div>
      <section className="flex items-center justify-center pb-12 pt-8 sm:pb-16 sm:pt-12">
        <div className="container-site">
          <motion.div {...fadeUp} className="mx-auto max-w-3xl text-center">
            <p className="type-kicker">Partners</p>
            <h1 className="type-page-title">The Trackzio Partner Network</h1>
            <p className="type-lead mx-auto mt-4 max-w-2xl">
              One partnership, collectors across all our apps. For shops, dealers, experts and clubs in coins, banknotes, cards, antiques, rocks and gems.
            </p>
            <a
              href="#apply"
              className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 glow sm:w-auto"
            >
              Apply to Partner
            </a>
            <p className="mt-3 text-sm text-muted-foreground">Free to list. No minimum listings.</p>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-border/20 bg-muted/50" aria-label="Trackzio in numbers">
        <div className="container-site grid grid-cols-1 gap-4 py-8 sm:grid-cols-3 sm:py-10">
          {numberLine.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              className="card-hover card-hover-motion rounded-3xl bg-card px-5 py-7 text-center sm:px-6 sm:py-8"
            >
              <p className="type-stat text-gradient">{item.value}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-section-tinted py-16 sm:py-24">
        <div className="container-site">
          <motion.div {...fadeUp} className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
            <h2 className="type-title">One network, every collector app</h2>
          </motion.div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {NETWORK_APPS.map((app, index) => {
              const clientApp = clientApps.get(app.id);
              const accent = clientApp?.accentHsl ?? "168 55% 24%";
              return (
                <motion.article
                  key={app.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                  whileHover={{ y: -6 }}
                  className="card-hover card-hover-motion flex h-full flex-col overflow-hidden rounded-3xl bg-card"
                >
                  <div className="h-1.5 w-full" style={{ backgroundColor: `hsl(${accent})` }} />
                  <div className="flex flex-1 flex-col p-4 sm:p-6">
                    {clientApp?.logo && (
                      <SiteImage
                        src={clientApp.logo}
                        alt=""
                        priority
                        sizes="48px"
                        className="card-hover-icon h-12 w-12 rounded-xl object-cover"
                        style={{ width: "3rem", height: "3rem", boxShadow: `0 8px 20px -8px hsl(${accent} / 0.55)` }}
                      />
                    )}
                    <h3 className="card-hover-title type-card-title mt-4 text-base sm:text-lg">{app.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">{app.line}</p>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-primary">Partners here</p>
                    <p className="mt-1 text-sm leading-relaxed text-foreground">{app.partners}</p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container-site">
          <motion.div {...fadeUp} className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
            <h2 className="type-title">Ways to partner</h2>
          </motion.div>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {PARTNER_WAYS.map((way, index) => (
              <motion.article
                key={way.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -6 }}
                className="card-hover card-hover-motion flex h-full flex-col rounded-3xl bg-card p-6 sm:p-8"
              >
                <p className="font-display text-3xl font-bold text-primary/25" aria-hidden="true">
                  0{index + 1}
                </p>
                <h3 className="card-hover-title type-card-title mt-3">{way.title}</h3>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-primary">Who it&apos;s for</p>
                <p className="mt-1 text-sm leading-relaxed text-foreground">{way.who}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-primary">What you get</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground sm:text-base">{way.get}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-section-tinted py-16 sm:py-24">
        <div className="container-site">
          <motion.div {...fadeUp} className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
            <h2 className="type-title">How it works</h2>
          </motion.div>
          <ol className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {PARTNER_STEPS.map((step, index) => (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -6 }}
                className="card-hover card-hover-motion relative rounded-3xl bg-card p-6 sm:p-8"
              >
                {index < PARTNER_STEPS.length - 1 && (
                  <span
                    className="pointer-events-none absolute -bottom-5 left-10 top-auto h-5 w-px bg-primary/25 md:bottom-auto md:left-auto md:right-[-1.25rem] md:top-11 md:h-px md:w-5"
                    aria-hidden="true"
                  />
                )}
                <span className="card-hover-icon flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                <h3 className="card-hover-title type-card-title mt-4">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">{step.text}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      <section id="apply" className="scroll-mt-24 py-16 sm:py-24">
        <div className="container-site max-w-3xl">
          <motion.div {...fadeUp} className="mb-8 text-center sm:text-left">
            <h2 className="type-title">Apply to Partner</h2>
          </motion.div>
          <div className="rounded-3xl border border-border/70 bg-card p-4 sm:p-8" style={{ boxShadow: "var(--shadow-card)" }}>
            <PartnerForm initialCategory={initialCategory} />
          </div>
        </div>
      </section>

      {partnerQuote && (
        <section className="pb-16 sm:pb-24" aria-label="Partner quote">
          <div className="container-site max-w-3xl">
            <blockquote className="rounded-3xl bg-card p-6 sm:p-8" style={{ boxShadow: "var(--shadow-card)" }}>
              <p className="type-copy font-medium">&ldquo;{partnerQuote.quote}&rdquo;</p>
              <footer className="mt-4 text-sm text-muted-foreground">
                {partnerQuote.name}, {partnerQuote.business}, {partnerQuote.city}
              </footer>
            </blockquote>
          </div>
        </section>
      )}

      <section className="bg-section-tinted py-16 sm:py-24">
        <div className="container-site flex justify-center">
          <div className="w-full max-w-3xl">
            <motion.div {...fadeUp} className="mb-10 text-center sm:mb-14">
              <p className="type-kicker">FAQ</p>
              <h2 className="type-title">Frequently asked questions</h2>
            </motion.div>
            <Accordion type="single" collapsible className="space-y-3">
              {PARTNER_FAQS.map((faq, index) => (
                <AccordionItem
                  key={faq.q}
                  value={`faq-${index}`}
                  className="rounded-2xl border border-transparent bg-card px-4 transition-shadow duration-300 hover:border-primary/20 hover:shadow-[0_16px_40px_-12px_rgba(6,78,59,0.18)] sm:px-6"
                >
                  <AccordionTrigger className="type-copy text-left font-medium hover:no-underline">{faq.q}</AccordionTrigger>
                  <AccordionContent className="type-body">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
}
