import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';
import { trackEvent } from '@/lib/analytics';
import { toast } from '@/components/ui/sonner';
import { Mail, Send, ArrowRight } from 'lucide-react';
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

const FEEDBACK_URL = 'https://forms.gle/pcmnfivhJZnr6Ybb9';
const SUPPORT_EMAIL = 'developer@trackzio.com';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldErrors = Partial<Record<'name' | 'email' | 'message', string>>;

const faqs = [
  { q: 'What is Trackzio?', a: 'Trackzio is a mobile app company that builds AI-powered identification apps and productivity tools designed to make everyday tasks easier and hobbies more engaging.\n\nOur apps combine AI image recognition, smart catalogs, collections, communities, and marketplaces.\n\nTrackzio apps currently include:\n• Habit Eazy – habit tracker and to-do list planner\n• Coinzy – AI coin identifier and coin collector app\n• Banknote Identification AI – banknote scanner and currency identifier\n• Rockzy – rock, mineral, and gem identifier app\n• Insecto – insect identifier and insect scanner\n\nAll Trackzio apps are available on Android and iOS.' },
  { q: 'How do Trackzio AI identification apps work?', a: 'Trackzio apps use AI image recognition technology to identify objects from photos.\n\nSteps:\n• Tap Identify / Scan\n• Take or upload photo\n• Adjust image\n• Submit to AI\n\nResults include:\n• Primary match\n• Similar matches\n• Detailed info' },
  { q: 'How accurate are Trackzio apps?', a: 'Accuracy depends on:\n• Image quality\n• Lighting\n• Visibility\n• Background\n\nUse clear close-up images for best results. AI results should be used as guidance.' },
  { q: 'Are Trackzio apps free?', a: 'Yes, all apps have a free version.\n\nFree users can:\n• Identify items\n• Save limited collections\n• Explore catalogs\n\nSome limits may apply.' },
  { q: 'What do Premium users get?', a: 'Premium features may include:\n• Unlimited identification\n• Unlimited collections\n• Full catalog access\n• Ad-free experience\n• AI chat features' },
  { q: 'What is the marketplace?', a: 'Users can list collectibles like:\n• Coins\n• Banknotes\n• Minerals\n\nTrackzio connects buyers and sellers but does not process payments.' },
  { q: 'What is the community feature?', a: 'Users can:\n• Share discoveries\n• Post images\n• Discuss collections\n• Learn from others' },
  { q: 'Can I save items?', a: 'Yes, users can:\n• Create collections\n• Save identified items\n• Organize data' },
  { q: 'Do apps work offline?', a: 'No, most features require internet:\n• AI identification\n• AI chat\n• Community\n• Marketplace' },
  { q: 'What devices are supported?', a: '• Android\n• iOS' },
  { q: 'Why is identification limited?', a: 'Free users have daily limits. Upgrade to Premium for unlimited use.' },
  { q: 'How to cancel subscription?', a: 'Android:\n• Play Store → Subscriptions → Cancel\n\niOS:\n• Settings → Apple ID → Subscriptions → Cancel' },
  { q: 'How to delete account?', a: 'Delete via app settings. Data is permanently removed.' },
  { q: 'How to contact support?', a: 'Email: developer@trackzio.com\n\nSupport response time: 24–48 hours' },
];

export default function Help() {
  usePageAnalytics('help', 'help_page_view');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showAllFaqs, setShowAllFaqs] = useState(false);

  const validate = (): boolean => {
    const next: FieldErrors = {};
    const name = formData.name.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();

    if (name.length < 2) {
      next.name = 'Please enter your name (at least 2 characters).';
    }
    if (!email) {
      next.email = 'Email is required.';
    } else if (!emailRegex.test(email)) {
      next.email = 'Please enter a valid email address.';
    }
    if (message.length < 10) {
      next.message = 'Please enter a message (at least 10 characters).';
    } else if (message.length > 5000) {
      next.message = 'Message is too long (max 5,000 characters).';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the form', {
        description: 'Check the highlighted fields and try again.',
      });
      return;
    }

    const name = formData.name.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();

    trackEvent('help_center_message_submit', { page_name: 'help', form_id: 'help_contact' });

    const subject = encodeURIComponent(`Help Center message from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    const mailto = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;

    toast.success('Thank you!', {
      description: 'Your email app will open so you can send the message—we typically reply within 24–48 hours.',
      duration: 6000,
    });

    setFormData({ name: '', email: '', message: '' });
    setErrors({});

    window.setTimeout(() => {
      window.open(mailto, '_blank', 'noopener,noreferrer');
    }, 200);
  };

  return (
    <div className="snap-y snap-mandatory max-sm:snap-none">
      {/* Hero */}
      <section className="min-h-[40vh] flex items-center justify-center pt-8 pb-12 snap-start">
        <div className="container-site">
          <motion.div {...fadeUp} className="max-w-2xl mx-auto text-center px-1">
            <p className="text-xs sm:text-sm font-medium tracking-[0.15em] sm:tracking-[0.2em] uppercase text-primary mb-3 sm:mb-4">
              HOW CAN WE HELP?
            </p>
            <h1 className="text-[clamp(1.85rem,5vw,2.75rem)] sm:text-5xl lg:text-6xl font-bold font-display mb-3 sm:mb-4 text-balance leading-tight">
              Help <span className="text-primary">Center</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto leading-relaxed px-1">
              Find answers to your questions and get support.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Get in Touch */}
      <section
        id="contact-form"
        className="min-h-0 md:min-h-screen flex items-center py-16 sm:py-24 lg:py-32 snap-start bg-section-tinted"
      >
        <div className="container-site max-w-4xl w-full min-w-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 lg:gap-20">
            <motion.div {...fadeUp} className="min-w-0">
              <p className="text-xs sm:text-sm font-medium tracking-[0.15em] sm:tracking-[0.2em] uppercase text-primary mb-2 sm:mb-3">Get in Touch</p>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-display mb-6 sm:mb-8 text-balance">Send us a message</h2>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>
                <div>
                  <label htmlFor="help-name" className="block text-sm font-medium text-foreground mb-1.5">
                    Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="help-name"
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData((p) => ({ ...p, name: e.target.value }));
                      if (errors.name) setErrors((er) => ({ ...er, name: undefined }));
                    }}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'help-name-error' : undefined}
                    className={`w-full h-11 min-h-[44px] px-4 rounded-xl bg-muted border text-foreground text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                      errors.name ? 'border-destructive ring-1 ring-destructive/30' : 'border-border'
                    }`}
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <p id="help-name-error" className="mt-1.5 text-sm text-destructive" role="alert">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="help-email" className="block text-sm font-medium text-foreground mb-1.5">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="help-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    inputMode="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData((p) => ({ ...p, email: e.target.value }));
                      if (errors.email) setErrors((er) => ({ ...er, email: undefined }));
                    }}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'help-email-error' : undefined}
                    className={`w-full h-11 min-h-[44px] px-4 rounded-xl bg-muted border text-foreground text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                      errors.email ? 'border-destructive ring-1 ring-destructive/30' : 'border-border'
                    }`}
                    placeholder="you@email.com"
                  />
                  {errors.email && (
                    <p id="help-email-error" className="mt-1.5 text-sm text-destructive" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="help-message" className="block text-sm font-medium text-foreground mb-1.5">
                    Message <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="help-message"
                    name="message"
                    value={formData.message}
                    onChange={(e) => {
                      setFormData((p) => ({ ...p, message: e.target.value }));
                      if (errors.message) setErrors((er) => ({ ...er, message: undefined }));
                    }}
                    rows={5}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'help-message-error' : undefined}
                    className={`w-full min-h-[120px] px-4 py-3 rounded-xl bg-muted border text-foreground text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y sm:resize-none ${
                      errors.message ? 'border-destructive ring-1 ring-destructive/30' : 'border-border'
                    }`}
                    placeholder="How can we help?"
                  />
                  {errors.message && (
                    <p id="help-message-error" className="mt-1.5 text-sm text-destructive" role="alert">
                      {errors.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 min-h-[48px] w-full sm:w-auto px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity active:scale-[0.98]"
                >
                  <Send size={16} aria-hidden className="shrink-0" /> Send Message
                </button>
              </form>
            </motion.div>

            <motion.div {...fadeUp} className="flex flex-col justify-center pt-8 md:pt-0 border-t border-border/40 md:border-t-0">
              <p className="text-xs sm:text-sm font-medium tracking-[0.15em] sm:tracking-[0.2em] uppercase text-primary mb-2 sm:mb-3">Contact</p>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-display mb-6 sm:mb-8 text-balance">Reach us directly</h2>

              <div className="space-y-6">
                <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail size={20} className="text-primary" aria-hidden />
                  </div>
                  <div className="min-w-0 pt-0.5 sm:pt-0">
                    <p className="text-sm font-medium text-foreground">Email</p>
                    <a
                      href="mailto:developer@trackzio.com"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors break-all sm:break-words"
                    >
                      developer@trackzio.com
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feedback CTA */}
      <section className="py-12 sm:py-16 md:py-20 snap-start">
        <div className="container-site max-w-2xl text-center px-1">
          <motion.div {...fadeUp}>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed mb-6 max-w-md mx-auto">
              Your insights help us grow—tell us what you think about our apps.
            </p>
            <a
              href={FEEDBACK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 min-h-[48px] w-full max-w-sm sm:w-auto sm:max-w-none mx-auto px-6 sm:px-8 rounded-xl bg-primary text-primary-foreground font-semibold text-sm sm:text-base hover:opacity-90 transition-opacity"
            >
              Share Your Feedback <ArrowRight size={18} className="shrink-0" aria-hidden />
            </a>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="flex items-center py-10 sm:py-14 md:py-16 snap-start pb-16 sm:pb-20">
        <div className="container-site w-full flex justify-center px-0.5 sm:px-0">
          <div className="w-full max-w-2xl min-w-0">
            <motion.div {...fadeUp} className="text-center mb-8 sm:mb-10 px-1">
              <p className="text-xs sm:text-sm font-medium tracking-[0.15em] sm:tracking-[0.2em] uppercase text-primary mb-2 sm:mb-3">FAQ</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display mb-2 sm:mb-3 text-balance leading-tight">
                Trackzio <span className="text-primary">FAQs</span>
              </h2>
              <p className="text-muted-foreground text-xs sm:text-sm max-w-md mx-auto">
                Frequently asked questions about Trackzio apps, AI identification, and features
              </p>
            </motion.div>

            <Accordion type="single" collapsible className="space-y-2 sm:space-y-3">
              {(showAllFaqs ? faqs : faqs.slice(0, 3)).map((faq, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: Math.min(i * 0.04, 0.3) }}>
                  <AccordionItem
                    value={`faq-${i}`}
                    className="rounded-xl sm:rounded-2xl bg-card px-4 sm:px-6"
                    style={{ boxShadow: 'var(--shadow-card)' }}
                  >
                    <AccordionTrigger className="text-foreground font-medium text-left text-sm py-4 sm:py-4 [&>svg]:shrink-0">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-xs sm:text-sm leading-relaxed whitespace-pre-line pb-4">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>

            {!showAllFaqs && (
              <div className="text-center mt-6">
                <button
                  type="button"
                  onClick={() => setShowAllFaqs(true)}
                  className="inline-flex items-center gap-1.5 min-h-[44px] px-3 text-sm font-semibold text-primary hover:opacity-80 transition-opacity"
                >
                  Show More
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
