import { useState } from 'react';

import { motion } from 'framer-motion';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';
import { Mail, Phone, Send } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger } from
'@/components/ui/accordion';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const }
};

const faqs = [
  {
    q: 'What is Trackzio?',
    a: 'Trackzio is a mobile app company that builds AI-powered identification apps and productivity tools designed to make everyday tasks easier and hobbies more engaging.\n\nOur apps combine AI image recognition, smart catalogs, collections, communities, and marketplaces.\n\nTrackzio apps currently include:\n• Habit Eazy – habit tracker and to-do list planner\n• Coinzy – AI coin identifier and coin collector app\n• Banknote Identification AI – banknote scanner and currency identifier\n• Rockzy – rock, mineral, and gem identifier app\n• Insecto – insect identifier and insect scanner\n\nAll Trackzio apps are available on Android and iOS.'
  },
  {
    q: 'How do Trackzio AI identification apps work?',
    a: 'Trackzio apps use AI image recognition technology to identify objects from photos.\n\nSteps:\n• Tap Identify / Scan\n• Take or upload photo\n• Adjust image\n• Submit to AI\n\nResults include:\n• Primary match\n• Similar matches\n• Detailed info'
  },
  {
    q: 'How accurate are Trackzio apps?',
    a: 'Accuracy depends on:\n• Image quality\n• Lighting\n• Visibility\n• Background\n\nUse clear close-up images for best results. AI results should be used as guidance.'
  },
  {
    q: 'Are Trackzio apps free?',
    a: 'Yes, all apps have a free version.\n\nFree users can:\n• Identify items\n• Save limited collections\n• Explore catalogs\n\nSome limits may apply.'
  },
  {
    q: 'What do Premium users get?',
    a: 'Premium features may include:\n• Unlimited identification\n• Unlimited collections\n• Full catalog access\n• Ad-free experience\n• AI chat features'
  },
  {
    q: 'What is the marketplace?',
    a: 'Users can list collectibles like:\n• Coins\n• Banknotes\n• Minerals\n\nTrackzio connects buyers and sellers but does not process payments.'
  },
  {
    q: 'What is the community feature?',
    a: 'Users can:\n• Share discoveries\n• Post images\n• Discuss collections\n• Learn from others'
  },
  {
    q: 'Can I save items?',
    a: 'Yes, users can:\n• Create collections\n• Save identified items\n• Organize data'
  },
  {
    q: 'Do apps work offline?',
    a: 'No, most features require internet:\n• AI identification\n• AI chat\n• Community\n• Marketplace'
  },
  {
    q: 'What devices are supported?',
    a: '• Android\n• iOS'
  },
  {
    q: 'Why is identification limited?',
    a: 'Free users have daily limits. Upgrade to Premium for unlimited use.'
  },
  {
    q: 'How to cancel subscription?',
    a: 'Android:\n• Play Store → Subscriptions → Cancel\n\niOS:\n• Settings → Apple ID → Subscriptions → Cancel'
  },
  {
    q: 'How to delete account?',
    a: 'Delete via app settings. Data is permanently removed.'
  },
  {
    q: 'How to contact support?',
    a: 'Email: developer@trackzio.com\n\nSupport response time: 24–48 hours'
  },
];

export default function Help() {
  usePageAnalytics('help', 'help_page_view');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [showAllFaqs, setShowAllFaqs] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="snap-y snap-mandatory">
      {/* Hero (compact) */}
      <section className="min-h-[40vh] flex items-center justify-center pt-8 pb-12 snap-start">
        <div className="container-site">
          <motion.div {...fadeUp} className="max-w-2xl mx-auto text-center">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">HOW CAN WE HELP?</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-4">Help <span className="text-primary">Center</span></h1>
            <p className="text-lg text-muted-foreground">Find answers to your questions and get support.</p>
          </motion.div>
        </div>
      </section>

      {/* Get in Touch */}
      <section id="contact-form" className="min-h-screen flex items-center py-16 sm:py-20 snap-start">
        <div className="container-site max-w-4xl w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            <motion.div {...fadeUp}>
              <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">Get in Touch</p>
              <h2 className="text-2xl sm:text-3xl font-bold font-display mb-8">Send us a message</h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Name</label>
                  <input type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  className="w-full h-11 px-4 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    className="w-full h-11 px-4 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="you@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                    placeholder="How can we help?" />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
                  <Send size={16} /> Send Message
                </button>
              </form>
            </motion.div>

            <motion.div {...fadeUp} className="flex flex-col justify-center">
              <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">Contact</p>
              <h2 className="text-2xl sm:text-3xl font-bold font-display mb-8">Reach us directly</h2>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Email</p>
                    <a href="mailto:support@trackzio.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      support@trackzio.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Phone</p>
                    <a href="tel:+919876543210" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      +91 98765 43210
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="flex items-center py-12 sm:py-16 snap-start">
        <div className="container-site w-full flex justify-center">
          <div className="w-full max-w-2xl">
            <motion.div {...fadeUp} className="text-center mb-10">
              <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">FAQ</p>
              <h2 className="text-3xl sm:text-4xl font-bold font-display mb-3">Trackzio <span className="text-primary">FAQs</span></h2>
              <p className="text-muted-foreground text-sm">Frequently asked questions about Trackzio apps, AI identification, and features</p>
            </motion.div>

            <Accordion type="single" collapsible className="space-y-3">
              {(showAllFaqs ? faqs : faqs.slice(0, 3)).map((faq, i) =>
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.04, 0.3) }}>
                  <AccordionItem value={`faq-${i}`} className="rounded-2xl bg-card px-6" style={{ boxShadow: 'var(--shadow-card)' }}>
                    <AccordionTrigger className="text-foreground font-medium text-left text-sm">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">{faq.a}</AccordionContent>
                  </AccordionItem>
                </motion.div>
              )}
            </Accordion>

            {!showAllFaqs && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setShowAllFaqs(true)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:opacity-80 transition-opacity"
                >
                  Show More
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>);
}
