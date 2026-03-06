import { motion } from 'framer-motion';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';
import { trackEvent } from '@/lib/analytics';
import { Lightbulb, Rocket, Heart, BookOpen, ArrowRight, MapPin, Briefcase, Users, Zap, Palette, Globe } from 'lucide-react';

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
  { icon: Heart, title: 'Meaningful Work', description: "Build apps used by millions. Every line of code makes a real difference in people's lives." },
];

const cultureBlocks = [
  { icon: Users, title: 'Team Collaboration', description: 'We believe the best ideas emerge from diverse perspectives working together seamlessly.' },
  { icon: Zap, title: 'Innovation First', description: 'We experiment freely, embrace new technologies, and push boundaries every day.' },
  { icon: Globe, title: 'Remote-First Culture', description: 'Work from anywhere in the world. Our team spans cities, time zones, and backgrounds.' },
  { icon: Palette, title: 'Creative Freedom', description: 'Every team member has the space to explore ideas and turn them into reality.' },
];

const openRoles = [
  {
    title: 'Data Analyst',
    description: 'Help us understand user behavior, optimize AI models, and drive product decisions with data.',
    location: 'Remote · India',
    type: 'Full-time',
    applyUrl: 'https://forms.google.com',
  },
  {
    title: 'Mobile Developer (React Native)',
    description: 'Build and maintain cross-platform mobile experiences used by millions of users worldwide.',
    location: 'Remote · India',
    type: 'Full-time',
    applyUrl: 'https://forms.google.com',
  },
  {
    title: 'AI / ML Engineer',
    description: 'Train and deploy machine learning models for image recognition across our product suite.',
    location: 'Remote · India',
    type: 'Full-time',
    applyUrl: 'https://forms.google.com',
  },
  {
    title: 'Product Designer',
    description: 'Design intuitive, beautiful interfaces that make complex AI features feel simple and delightful.',
    location: 'Remote · India',
    type: 'Full-time',
    applyUrl: 'https://forms.google.com',
  },
];

export default function Careers() {
  usePageAnalytics('careers', 'Career_page_view');

  return (
    <div className="snap-y snap-mandatory">
      {/* Hero (compact) */}
      <section className="min-h-[45vh] flex items-center justify-center pt-8 pb-12 snap-start">
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

      {/* Culture — Illustration Blocks */}
      <section className="min-h-screen flex items-center py-24 sm:py-32 snap-start">
        <div className="container-site max-w-5xl w-full">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">Our Culture</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">Curiosity-driven innovation</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              At Trackzio, we believe the best products come from genuine curiosity and creative freedom.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {cultureBlocks.map((block, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-3xl bg-card p-8 sm:p-10 flex flex-col items-center text-center"
                style={{ boxShadow: 'var(--shadow-card)' }}
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <block.icon size={28} className="text-primary" />
                </div>
                <h3 className="font-display font-bold text-lg text-foreground mb-3">{block.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{block.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="min-h-screen flex items-center py-24 sm:py-32 snap-start">
        <div className="container-site max-w-4xl w-full">
          <motion.div {...fadeUp} className="text-center mb-20">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">Benefits</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">Why you'll love working here</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-14">
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

      {/* Open Roles — Job Listing Grid */}
      <section className="min-h-[80vh] flex items-center py-24 sm:py-32 snap-start">
        <div className="container-site max-w-5xl w-full">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">Open Positions</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">Join our team</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {openRoles.map((role, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl bg-card p-7 flex flex-col"
                style={{ boxShadow: 'var(--shadow-card)' }}
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <h3 className="text-lg font-bold font-display text-foreground">{role.title}</h3>
                  <span className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold shrink-0">
                    {role.type}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
                  {role.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin size={13} /> {role.location}
                  </span>
                  <a
                    href={role.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('hiring_form_open', { page_name: 'careers', role: role.title })}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:opacity-80 transition-opacity group"
                  >
                    View Role <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
