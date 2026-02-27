import { motion } from 'framer-motion';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';
import { trackEvent } from '@/lib/analytics';

export default function Careers() {
  usePageAnalytics('careers', 'Career_page_view');

  return (
    <section className="section-padding">
      <div className="container-site max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl sm:text-5xl font-bold font-display mb-4">Careers</h1>
          <p className="text-lg text-muted-foreground mb-12">Join the team building the next generation of AI-powered apps.</p>
        </motion.div>
        <div className="card-glass p-12 text-center">
          <p className="text-muted-foreground mb-6">We're always looking for talented individuals to join our team.</p>
          <a
            href="https://forms.google.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              trackEvent('hiring_form_open', { page_name: 'careers' });
            }}
            className="inline-flex h-11 px-6 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            Apply Now
          </a>
        </div>
      </div>
    </section>
  );
}
