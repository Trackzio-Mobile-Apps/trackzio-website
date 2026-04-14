import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';
import { trackEvent } from '@/lib/analytics';
import { ArrowRight, MapPin, Users, Zap, Globe, Palette, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

import founderPhoto from "@/assets/founder-ayushya.jpg";
import { imageSrc } from "@/lib/imageSrc";
import { getPublishedJobs } from "@/lib/content/jobs";
import cultureTeamCollab from '@/assets/culture/team-collab.jpg';
import cultureInnovation from '@/assets/culture/innovation.jpg';
import cultureRemoteWork from '@/assets/culture/remote-work.jpg';
import cultureTeamFun from '@/assets/culture/team-fun.jpg';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

const cultureValues = [
  { icon: Users, title: 'Team Collaboration', description: 'We believe the best ideas emerge from diverse perspectives working together seamlessly.' },
  { icon: Zap, title: 'Innovation First', description: 'We experiment freely, embrace new technologies, and push boundaries every day.' },
  { icon: Globe, title: 'Remote-First Culture', description: 'Work from anywhere in the world. Our team spans cities, time zones, and backgrounds.' },
  { icon: Palette, title: 'Creative Freedom', description: 'Every team member has the space to explore ideas and turn them into reality.' },
];

const cultureImages = [
  { src: cultureTeamCollab, alt: 'Team collaborating in office' },
  { src: cultureInnovation, alt: 'Brainstorming and innovation session' },
  { src: cultureRemoteWork, alt: 'Remote work setup' },
  { src: cultureTeamFun, alt: 'Team fun outing' },
];

const openRoles = getPublishedJobs();

export default function Careers() {
  usePageAnalytics('careers', 'Career_page_view');
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % cultureImages.length);
  }, []);

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + cultureImages.length) % cultureImages.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="snap-y snap-mandatory">
      {/* Hero */}
      <section className="min-h-[40vh] flex items-center justify-center pt-8 pb-12 snap-start">
        <div className="container-site">
          <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">Careers</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-4">
              Build the future <span className="text-gradient">with us</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Join the team building the next generation of AI-powered apps.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Culture */}
      <section className="min-h-screen flex items-center py-24 sm:py-32 snap-start bg-section-tinted">
        <div className="container-site max-w-6xl w-full">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">Our Culture</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">Curiosity-driven innovation</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              At Trackzio, we believe the best products come from genuine curiosity and creative freedom.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cultureValues.map((block, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl bg-card p-6 flex flex-col"
                  style={{ boxShadow: 'var(--shadow-card)' }}
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <block.icon size={20} className="text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-sm text-foreground mb-2">{block.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{block.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-3xl overflow-hidden aspect-[4/3]"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              {cultureImages.map((img, i) => (
                <img
                  key={i}
                  src={imageSrc(img.src)}
                  alt={img.alt}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                    i === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}

              <button
                onClick={prevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/70 backdrop-blur flex items-center justify-center text-foreground hover:bg-background/90 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/70 backdrop-blur flex items-center justify-center text-foreground hover:bg-background/90 transition-colors"
              >
                <ChevronRight size={16} />
              </button>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {cultureImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentSlide ? 'bg-primary w-5' : 'bg-background/60'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section className="min-h-[80vh] flex items-center py-24 sm:py-32 snap-start">
        <div className="container-site max-w-5xl w-full">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">Open Positions</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">Join our team</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {openRoles.map((role, i) => (
              <motion.div
                key={role.title}
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

      {/* Founder Section */}
      <section className="py-24 sm:py-32 snap-start">
        <div className="container-site max-w-5xl w-full">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">From the Founder</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">
              What Our Founder Thinks
              <br />
              <span className="text-gradient">About His People</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col md:flex-row items-center gap-10 lg:gap-16 rounded-3xl bg-card p-8 sm:p-12 lg:p-16"
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            <div className="shrink-0">
              <div className="w-40 h-40 sm:w-52 sm:h-52 rounded-3xl overflow-hidden ring-4 ring-primary/10">
                <img
                  src={imageSrc(founderPhoto)}
                  alt="Ayushya, Founder of Trackzio"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center mt-4">
                <div className="font-display font-bold text-foreground">Aayushya Aggarwal</div>
                <div className="text-xs text-muted-foreground">Founder, Trackzio</div>
              </div>
            </div>

            <div className="flex-1">
              <Quote size={36} className="text-primary/20 mb-4" />
              <blockquote className="text-xl sm:text-2xl lg:text-3xl font-display font-bold leading-snug text-foreground italic">
                "I've always believed that leadership means being in the trenches with the team — learning, teaching, solving problems together, and trusting the people and the process through every high and low."
              </blockquote>
              <div className="mt-6 h-1 w-16 rounded-full bg-primary/20" />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
