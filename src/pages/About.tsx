import { motion } from 'framer-motion';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';

export default function About() {
  usePageAnalytics('about', 'about us_page_view');

  return (
    <section className="section-padding">
      <div className="container-site max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl sm:text-5xl font-bold font-display mb-6">About <span className="text-gradient">Trackzio</span></h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Trackzio is a product studio building AI-powered mobile applications that turn curiosity into clarity. Founded in Bengaluru, India, we're passionate about creating tools that are not only smart but also delightful to use. Our apps span finance, nature, education, and personal growth — always with the user at the center.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-12">
            We believe great software should feel invisible — working seamlessly in the background to help you make better decisions, learn something new, or build a healthier habit. With millions of downloads across our portfolio, we're just getting started.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h2 className="text-2xl font-bold font-display mb-6">Our Team</h2>
          <div className="card-glass p-8">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center font-display text-2xl font-bold text-primary">A</div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Ayushya</h3>
                <p className="text-sm text-primary font-medium">Founder & CEO</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Passionate about building products at the intersection of AI and everyday life. Leading Trackzio's vision to empower millions through intelligent mobile experiences.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
