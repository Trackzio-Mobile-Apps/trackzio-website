import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';
import { Mail, Phone, Send, ChevronDown } from 'lucide-react';
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
{ q: 'How do I scan a coin or banknote?', a: 'Open the app, tap the scan button, and point your camera at the item. Our AI will identify it instantly and show detailed information.' },
{ q: 'Is the AI identification accurate?', a: 'Our AI models are trained on millions of images and achieve over 95% accuracy. Results improve continuously as we update our models.' },
{ q: 'Can I use the apps offline?', a: 'Some features require an internet connection for AI processing. However, your saved collections and basic browsing work offline.' },
{ q: 'How does the marketplace work?', a: 'The marketplace allows you to list items for sale, browse listings, and connect with buyers and sellers in a trusted community.' },
{ q: 'Is my personal data safe?', a: 'Yes. We follow industry best practices for data security, encrypt all sensitive data, and never sell your personal information to third parties.' },
{ q: 'How do I create an account?', a: 'Download any Trackzio app, tap "Sign Up", and follow the steps. You can use your email or sign in with Google for quick access.' },
{ q: 'Can I sync data across devices?', a: 'Yes! Once you create an account, your collections, habits, and preferences sync automatically across all your devices.' },
{ q: 'How do I report a bug or incorrect identification?', a: 'In any app, go to Settings > Feedback. Describe the issue and our team will review it promptly. Your feedback helps improve our AI.' },
{ q: 'Are the apps free to use?', a: 'Core features are completely free. Premium features like advanced analytics and unlimited scans are available through optional subscriptions.' },
{ q: 'How do I cancel my subscription?', a: 'You can manage subscriptions through the App Store (iOS) or Google Play Store (Android). Go to your account settings to cancel anytime.' }];


export default function Help() {
  usePageAnalytics('help', 'help_page_view');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [showAllFaqs, setShowAllFaqs] = useState(false);

  const visibleFaqs = showAllFaqs ? faqs : faqs.slice(0, 3);

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
          <div className="w-full max-w-xl">
            <motion.div {...fadeUp} className="text-center mb-16">
              <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">FAQ</p>
              <h2 className="text-3xl sm:text-4xl font-bold font-display">Frequently asked questions</h2>
            </motion.div>

            <Accordion type="single" collapsible className="space-y-3">
              {visibleFaqs.map((faq, i) =>
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.04, 0.3) }}>
                
                  <AccordionItem value={`faq-${i}`} className="rounded-2xl bg-card px-6" style={{ boxShadow: 'var(--shadow-card)' }}>
                    <AccordionTrigger className="text-foreground font-medium text-left text-sm">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed">{faq.a}</AccordionContent>
                  </AccordionItem>
                </motion.div>
              )}
            </Accordion>

            {faqs.length > 3 &&
            <div className="text-center mt-6">
                <button
                onClick={() => setShowAllFaqs(!showAllFaqs)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:opacity-80 transition-opacity">
                
                  {showAllFaqs ? 'Show Less' : 'More'}
                  <ChevronDown size={16} className={`transition-transform ${showAllFaqs ? 'rotate-180' : ''}`} />
                </button>
              </div>
            }
          </div>
        </div>
      </section>
    </div>);

}