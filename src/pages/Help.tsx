import { motion } from 'framer-motion';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';

export default function Help() {
  usePageAnalytics('help', 'help_page_view');

  return (
    <section className="section-padding">
      <div className="container-site max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl sm:text-5xl font-bold font-display mb-4">Help Center</h1>
          <p className="text-lg text-muted-foreground mb-12">Find answers to your questions and get support.</p>
        </motion.div>
        <div className="card-glass p-12 text-center">
          <p className="text-muted-foreground mb-4">Our help center is being built. In the meantime, reach out to us directly.</p>
          <a href="mailto:ayushya@trackzio.com" className="text-primary font-semibold hover:underline">
            ayushya@trackzio.com
          </a>
        </div>
      </div>
    </section>
  );
}
