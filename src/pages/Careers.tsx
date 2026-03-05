import { motion } from 'framer-motion';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';
import { trackEvent } from '@/lib/analytics';
import { Lightbulb, Rocket, Heart, BookOpen, ArrowRight } from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

const benefits = [
  { icon: Rocket, title: 'Flexible Work Culture', description: 'Work from anywhere, on your own schedule. We trust our team to deliver great results.' },
  { icon: BookOpen, title: 'Learning Opportunities', description: 'Access courses, conferences, and mentorship. Grow your skills every day.' },
  { icon: Lightbulb, title: 'Ownership of Ideas', description: 'Your ideas matter. Pitch features, lead projects, and shape the product roadmap.' },
  { icon: Heart, title: 'Meaningful Work', description: 'Build apps used by millions. Every line of code makes a real difference in people\'s lives.' },
];

export default function Careers() {
  usePageAnalytics('careers', 'Career_page_view');

  return (
    <div className="snap-y snap-mandatory">
      {/* Hero */}
      <section className="min-h-[60vh] flex items-center snap-start">
        <div className="container-site">
          <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">Careers</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-6">
              Build the future
              <br />
              <span className="text-gradient">with us</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Join the team building the next generation of AI-powered apps.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Culture */}
      <section className="py-16 sm:py-24 snap-start">
        <div className="container-site max-w-4xl">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">Our Culture</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-8">Curiosity-driven innovation</h2>
          </motion.div>

          <motion.div {...fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                At Trackzio, we believe the best products come from genuine curiosity. Our team is driven by the desire to understand real problems and build solutions that actually work — not just look good on paper.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We experiment freely, learn from failures fast, and celebrate the small wins that lead to meaningful breakthroughs. Every team member has the freedom to explore new ideas and the responsibility to turn them into reality.
              </p>
            </div>
            <div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We don't follow trends blindly. Instead, we focus on building useful products that solve real problems in people's everyday lives — from identifying insects to building better habits.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our culture is built on trust, transparency, and a shared belief that technology should make life simpler, not more complicated. If that resonates with you, we'd love to hear from you.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 sm:py-24 snap-start">
        <div className="container-site max-w-4xl">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">Benefits</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">Why you'll love working here</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-5"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <b.icon size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-foreground mb-2">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Role */}
      <section className="py-16 sm:py-24 snap-start">
        <div className="container-site max-w-3xl">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">Open Positions</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">Join our team</h2>
          </motion.div>

          <motion.div
            {...fadeUp}
            className="rounded-3xl bg-card p-8 sm:p-10"
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold font-display text-foreground">Data Analyst</h3>
                <p className="text-sm text-muted-foreground mt-1">Full-time · Remote · India</p>
              </div>
              <span className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                Open
              </span>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-6">
              We're looking for a Data Analyst to help us understand user behavior, optimize our AI models, and drive product decisions with data. You'll work closely with the product and engineering teams to uncover insights that shape our apps.
            </p>

            <div className="mb-8">
              <h4 className="font-display font-bold text-sm text-foreground mb-3">Responsibilities</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">·</span> Analyze user engagement data across all Trackzio apps</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">·</span> Build dashboards and reports to track key metrics</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">·</span> Collaborate with product teams to define and measure success</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">·</span> Identify patterns and opportunities for growth</li>
              </ul>
            </div>

            <a
              href="https://forms.google.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('hiring_form_open', { page_name: 'careers', role: 'data_analyst' })}
              className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Apply Now <ArrowRight size={16} />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
