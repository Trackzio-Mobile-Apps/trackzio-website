import { motion } from 'framer-motion';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';
import { Lightbulb, Rocket, Users, TrendingUp, Search, Linkedin } from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

const journeyStages = [
  { icon: Search, title: 'Problem', description: 'We recognised a problem in everyday life.' },
  { icon: Lightbulb, title: 'Idea', description: 'We started working on a meaningful solution.' },
  { icon: Rocket, title: 'Beta', description: 'We built the beta version of our first products.' },
  { icon: Users, title: 'Early Users', description: 'People started using our apps and sharing feedback.' },
  { icon: TrendingUp, title: 'Growing Ecosystem', description: "We continue building products that make people's lives easier." },
];

const teamMembers = [
  { initials: 'A', name: 'Ayushya', role: 'Founder & CEO', linkedin: '#' },
  { initials: 'R', name: 'Ravi Kumar', role: 'Head of Engineering', linkedin: '#' },
  { initials: 'M', name: 'Meera Patel', role: 'Product Designer', linkedin: '#' },
  { initials: 'S', name: 'Sanjay Nair', role: 'AI/ML Engineer', linkedin: '#' },
  { initials: 'D', name: 'Divya Sharma', role: 'Marketing Lead', linkedin: '#' },
  { initials: 'K', name: 'Karthik Reddy', role: 'Backend Developer', linkedin: '#' },
];

export default function About() {
  usePageAnalytics('about', 'about us_page_view');

  return (
    <div className="snap-y snap-mandatory">
      {/* ── Section 1: Intro ── */}
      <section className="min-h-[80vh] flex items-center justify-center snap-start">
        <div className="container-site">
          <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center">
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-6">About Us</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="text-5xl sm:text-6xl lg:text-7xl font-bold font-display leading-[1.1] tracking-tight mb-8">
              Building apps that
              <br />
              <span className="text-gradient">feel like magic</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Trackzio is a product studio building AI-powered mobile applications that turn curiosity into clarity. Founded in Bengaluru, India, we're passionate about creating tools that are not only smart but also delightful to use.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Section 2: Vision & Mission ── */}
      <section className="min-h-[60vh] flex items-center py-24 sm:py-32 snap-start">
        <div className="container-site w-full">
          <motion.div {...fadeUp} className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
              <div>
                <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">Vision</p>
                <h2 className="text-2xl sm:text-3xl font-bold font-display mb-5 leading-snug">Empowering everyday life through intelligent technology</h2>
                <p className="text-muted-foreground leading-relaxed">We envision a world where technology works seamlessly in the background — helping you make better decisions, learn something new, or build a healthier habit. With millions of downloads across our portfolio, we're just getting started.</p>
              </div>
              <div className="relative">
                <div className="hidden md:block absolute -left-12 top-0 bottom-0 w-px bg-border" />
                <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">Mission</p>
                <h2 className="text-2xl sm:text-3xl font-bold font-display mb-5 leading-snug">Creating tools people love to use every day</h2>
                <p className="text-muted-foreground leading-relaxed">Our apps span finance, nature, education, and personal growth — always with the user at the center. We believe great software should feel invisible, working quietly to make your life easier and more meaningful.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Section 3: Journey ── */}
      <section className="min-h-[60vh] flex items-center py-24 sm:py-32 snap-start">
        <div className="container-site w-full">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">Our Journey</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">From problem to <span className="text-gradient">ecosystem</span></h2>
          </motion.div>
          <div className="overflow-x-auto pb-4 -mx-4 px-4">
            <div className="relative flex items-start gap-0 min-w-[800px]">
              <div className="absolute top-8 left-8 right-8 h-px bg-border" />
              {journeyStages.map((stage, i) => (
                <motion.div key={stage.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="flex-1 relative group cursor-default">
                  <div className="flex flex-col items-center text-center px-3">
                    <div className="w-16 h-16 rounded-2xl bg-card flex items-center justify-center relative z-10 transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1" style={{ boxShadow: 'var(--shadow-card)' }}>
                      <stage.icon size={22} className="text-primary" />
                    </div>
                    <h3 className="font-display font-bold text-sm mt-5 mb-2 text-foreground">{stage.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-[160px]">{stage.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 4: Team ── */}
      <section className="min-h-[60vh] flex items-center py-24 sm:py-32 snap-start">
        <div className="container-site w-full">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">Our Team</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">The people behind <span className="text-gradient">Trackzio</span></h2>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-10 max-w-5xl mx-auto justify-items-center">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group text-center"
              >
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center font-display text-3xl font-bold text-primary mx-auto mb-4 transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                  {member.initials}
                </div>
                <h3 className="font-display font-bold text-sm text-foreground">{member.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 mb-2">{member.role}</p>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex text-muted-foreground/40 transition-colors duration-300 group-hover:text-primary"
                >
                  <Linkedin size={16} />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
