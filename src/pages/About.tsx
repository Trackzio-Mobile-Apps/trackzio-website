import { motion } from 'framer-motion';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';
import { Linkedin } from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

const journeyBlocks = [
  {
    emoji: '🔍',
    title: 'Recognising the Problem',
    description: 'We noticed everyday tasks — identifying coins, learning about insects, building habits — lacked simple, intelligent tools. That gap became our starting point.',
  },
  {
    emoji: '🛠️',
    title: 'Building the First Beta',
    description: 'With a small team and big ambitions, we built our first AI-powered prototypes. Fast iterations, late nights, and a relentless focus on getting the experience right.',
  },
  {
    emoji: '🌱',
    title: 'Early Users Discover the Apps',
    description: 'Real people started using our apps and sharing them with friends. Their feedback shaped every feature, every update, every decision we made next.',
  },
  {
    emoji: '🚀',
    title: 'Growing the Trackzio Ecosystem',
    description: 'What started as one app became a connected ecosystem. Four apps, millions of downloads, and a vision to keep building tools that make lives easier.',
  },
];

const teamMembers = [
  { initials: 'A', name: 'Ayushya', role: 'Founder & CEO', linkedin: '#' },
  { initials: 'R', name: 'Ravi Kumar', role: 'Head of Engineering', linkedin: '#' },
  { initials: 'M', name: 'Meera Patel', role: 'Product Designer', linkedin: '#' },
  { initials: 'S', name: 'Sanjay Nair', role: 'AI/ML Engineer', linkedin: '#' },
  { initials: 'D', name: 'Divya Sharma', role: 'Marketing Lead', linkedin: '#' },
  { initials: 'K', name: 'Karthik Reddy', role: 'Backend Developer', linkedin: '#' },
  { initials: 'N', name: 'Neha Gupta', role: 'Frontend Developer', linkedin: '#' },
  { initials: 'V', name: 'Vikram Singh', role: 'Data Scientist', linkedin: '#' },
  { initials: 'P', name: 'Pooja Menon', role: 'UX Researcher', linkedin: '#' },
  { initials: 'A', name: 'Arjun Das', role: 'DevOps Engineer', linkedin: '#' },
  { initials: 'T', name: 'Tanvi Joshi', role: 'Content Strategist', linkedin: '#' },
];

export default function About() {
  usePageAnalytics('about', 'about us_page_view');

  return (
    <div className="snap-y snap-mandatory">
      {/* ── Section 1: Intro (compact hero) ── */}
      <section className="min-h-[40vh] flex items-center justify-center pt-8 pb-12 snap-start">
        <div className="container-site">
          <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">About Us</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display leading-[1.1] tracking-tight mb-4">
              Building apps that <span className="text-gradient">feel like magic</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Trackzio is a product studio building AI-powered mobile applications that turn curiosity into clarity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Section 2: Vision & Mission ── */}
      <section className="min-h-screen flex items-center py-24 sm:py-32 snap-start">
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

      {/* ── Section 3: Journey — Story Blocks with Graphics ── */}
      <section className="py-24 sm:py-32 snap-start">
        <div className="container-site w-full">
          <motion.div {...fadeUp} className="text-center mb-20">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">Our Journey</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">From problem to <span className="text-gradient">ecosystem</span></h2>
          </motion.div>

          <div className="space-y-28 max-w-5xl mx-auto">
            {journeyBlocks.map((block, i) => {
              const isReversed = i % 2 === 1;
              return (
                <motion.div
                  key={block.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.7 }}
                  className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 lg:gap-20`}
                >
                  <div className="flex-1 flex items-center justify-center">
                    <div className="w-40 h-40 sm:w-52 sm:h-52 rounded-3xl bg-primary/5 flex items-center justify-center">
                      <span className="text-7xl sm:text-8xl">{block.emoji}</span>
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary/60 mb-3">Step {i + 1}</p>
                    <h3 className="text-2xl sm:text-3xl font-bold font-display text-foreground mb-4">{block.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-lg">{block.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Section 4: Team ── */}
      <section className="min-h-screen flex items-center py-24 sm:py-32 snap-start">
        <div className="container-site w-full">
          <motion.div {...fadeUp} className="text-center mb-20">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">Our Team</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">The people behind <span className="text-gradient">Trackzio</span></h2>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-12 max-w-5xl mx-auto justify-items-center">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="group text-center"
              >
                <div className="w-28 h-28 rounded-full bg-primary/10 flex items-center justify-center font-display text-3xl font-bold text-primary mx-auto mb-4 transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
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
