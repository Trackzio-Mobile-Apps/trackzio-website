import { motion } from 'framer-motion';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';
import { trackEvent } from '@/lib/analytics';
import { useState } from 'react';
import { Mail, MapPin } from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

export default function Contact() {
  usePageAnalytics('contact', 'page_view_contact');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackEvent('support_form_submit', { page_name: 'contact', form_id: 'contact_form' });
    setSubmitted(true);
  };

  return (
    <div className="snap-y snap-mandatory">
      {/* Hero */}
      <section className="min-h-[40vh] flex items-center justify-center pt-8 pb-12 snap-start">
        <div className="container-site">
          <motion.div {...fadeUp} className="max-w-2xl mx-auto text-center">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">Contact</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-4">Contact Us</h1>
            <p className="text-lg text-muted-foreground">We'd love to hear from you.</p>
          </motion.div>
        </div>
      </section>

      {/* Form + Info */}
      <section className="min-h-screen flex items-center py-24 sm:py-32 snap-start">
        <div className="container-site max-w-4xl w-full">
          <div className="grid md:grid-cols-2 gap-20">
            <motion.div {...fadeUp}>
              <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">Get in Touch</p>
              <h2 className="text-2xl sm:text-3xl font-bold font-display mb-8">Send a message</h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Email</p>
                    <a href="mailto:ayushya@trackzio.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      ayushya@trackzio.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Office</p>
                    <p className="text-sm text-muted-foreground">BHIVE Workspace, Indiranagar, Bengaluru</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div {...fadeUp} initial={{ opacity: 0, y: 40 }} transition={{ duration: 0.7, delay: 0.1 }}>
              <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">Message</p>
              <h2 className="text-2xl sm:text-3xl font-bold font-display mb-8">Write to us</h2>
              {submitted ? (
                <p className="text-primary font-medium">Thank you! We'll get back to you soon.</p>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">Name</label>
                    <input id="name" type="text" required className="w-full h-11 px-4 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                    <input id="email" type="email" required className="w-full h-11 px-4 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">Message</label>
                    <textarea id="message" rows={4} required className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                  </div>
                  <button type="submit" className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
                    Send Message
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
