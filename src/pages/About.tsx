import { motion, AnimatePresence } from 'framer-motion';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';
import { Linkedin } from 'lucide-react';
import { useState, useEffect } from 'react';
import innovationImg from '@/assets/culture/innovation.jpg';
import remoteWorkImg from '@/assets/culture/remote-work.jpg';
import teamCollabImg from '@/assets/culture/team-collab.jpg';
import teamFunImg from '@/assets/culture/team-fun.jpg';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const }
};

const cultureImages = [
  { src: innovationImg, alt: 'Innovation at Trackzio' },
  { src: remoteWorkImg, alt: 'Remote work culture' },
  { src: teamCollabImg, alt: 'Team collaboration' },
  { src: teamFunImg, alt: 'Team fun moments' },
];

const journeyBlocks = [
{
  emoji: '🔍',
  title: 'Recognising the Problem',
  description: 'We noticed everyday tasks — identifying coins, learning about insects, building habits — lacked simple, intelligent tools. That gap became our starting point.'
},
{
  emoji: '🛠️',
  title: 'Building the First Beta',
  description: 'With a small team and big ambitions, we built our first AI-powered prototypes. Fast iterations, late nights, and a relentless focus on getting the experience right.'
},
{
  emoji: '🌱',
  title: 'Early Users Discover the Apps',
  description: 'Real people started using our apps and sharing them with friends. Their feedback shaped every feature, every update, every decision we made next.'
},
{
  emoji: '🚀',
  title: 'Growing the Trackzio Ecosystem',
  description: 'What started as one app became a connected ecosystem. Four apps, millions of downloads, and a vision to keep building tools that make lives easier.'
}];


const teamMembers = [
  { initials: 'A', name: 'Ayushya', role: 'Founder & CEO', linkedin: '#', color: 'from-emerald-800 to-teal-600' },
  { initials: 'R', name: 'Ravi Kumar', role: 'Head of Engineering', linkedin: '#', color: 'from-slate-700 to-slate-500' },
  { initials: 'M', name: 'Meera Patel', role: 'Product Designer', linkedin: '#', color: 'from-teal-700 to-cyan-500' },
  { initials: 'S', name: 'Sanjay Nair', role: 'AI/ML Engineer', linkedin: '#', color: 'from-green-800 to-emerald-500' },
  { initials: 'D', name: 'Divya Sharma', role: 'Marketing Lead', linkedin: '#', color: 'from-slate-800 to-gray-500' },
  { initials: 'K', name: 'Karthik Reddy', role: 'Backend Developer', linkedin: '#', color: 'from-teal-800 to-teal-500' },
  { initials: 'N', name: 'Neha Gupta', role: 'Frontend Developer', linkedin: '#', color: 'from-emerald-700 to-green-500' },
  { initials: 'V', name: 'Vikram Singh', role: 'Data Scientist', linkedin: '#', color: 'from-cyan-800 to-teal-500' },
];


export default function About() {
  usePageAnalytics('about', 'about us_page_view');

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % cultureImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="snap-y snap-mandatory">
      {/* ── Section 1: Intro (compact hero) ── */}
      <section className="min-h-[40vh] flex items-center justify-center pt-8 pb-12 snap-start">
        <div className="container-site">
          <motion.div {...fadeUp} className="max-w-5xl mx-auto text-center">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">About Us</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display leading-[1.1] tracking-tight mb-4 whitespace-nowrap">
              Designing better <span className="text-gradient">living</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              AI-powered apps transforming curiosity into everyday clarity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Section 2: About Us Card ── */}
      <section className="py-24 sm:py-32 snap-start bg-section-tinted">
        <div className="container-site w-full">
          <motion.div {...fadeUp} className="max-w-6xl mx-auto">
            <div className="rounded-2xl bg-card overflow-hidden" style={{ boxShadow: '0 4px 24px -4px rgba(40, 54, 24, 0.08)' }}>
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Left: Text Content */}
                <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
                  <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">About Us</p>
                  <h2 className="text-2xl sm:text-3xl font-bold font-display mb-5 leading-snug">
                    Who we <span className="text-gradient">are</span>
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Trackzio is a product studio building AI-powered apps for collectors, enthusiasts, and curious minds. From identifying coins and insects to tracking habits and managing finances — our apps are designed to make everyday life smarter and more organized.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We're a small, passionate team that believes great software should feel invisible. Our products are used by hundreds of thousands of people across the globe, and we're just getting started.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    We foster a culture of innovation, remote collaboration, and continuous learning — where every team member has the freedom to experiment, grow, and make an impact.
                  </p>
                </div>

                {/* Right: Auto-changing Image Slider */}
                <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center">
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentImage}
                        src={cultureImages[currentImage].src}
                        alt={cultureImages[currentImage].alt}
                        className="absolute inset-0 w-full h-full object-cover rounded-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                      />
                    </AnimatePresence>
                    {/* Dots indicator */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                      {cultureImages.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentImage(i)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentImage ? 'bg-white w-5' : 'bg-white/50'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Section 3: Team ── */}
      <section className="py-24 sm:py-32 snap-start">
        <div className="container-site w-full">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">Our Team</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">The people behind <span className="text-gradient">Trackzio</span></h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer transition-shadow duration-300 hover:shadow-xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${member.color} transition-transform duration-500 group-hover:scale-105`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display text-[8rem] font-bold text-white/15 select-none leading-none">
                      {member.initials}
                    </span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/90" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-display font-bold text-lg text-white uppercase tracking-wide leading-tight">
                    {member.name}
                  </h3>
                  <p className="text-white/70 text-sm mt-1">{member.role}</p>
                </div>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white border border-white/20 transition-all duration-200 hover:scale-110 hover:bg-white/30 z-10"
                >
                  <Linkedin size={16} />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: Vision & Mission ── */}
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

      {/* ── Section 5: Journey ── */}
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
                  className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 lg:gap-20`}>
                  
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
                </motion.div>);
            })}
          </div>
        </div>
      </section>
    </div>);

}