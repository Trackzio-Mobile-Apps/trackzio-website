import { motion, AnimatePresence } from 'framer-motion';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';
import { Linkedin } from 'lucide-react';
import { useState, useEffect } from 'react';
import companyPhoto1 from '@/assets/culture/company-photo1.png';
import companyPhoto2 from '@/assets/culture/company-photo2.png';
import companyPhoto3 from '@/assets/culture/company-photo3.png';
import companyPhoto4 from '@/assets/culture/company-photo4.png';

// Team photos
import aishikImg from '@/assets/team/aishik-kirtaniya.jpg';
import shreyansImg from '@/assets/team/shreyans-jain.png';
import preethamImg from '@/assets/team/preetham-reddy.jpg';
import ijaazImg from '@/assets/team/ijaaz-ahamed.jpeg';
import burhanuddinImg from '@/assets/team/burhanuddin-makda.png';
import jayaKrishnaImg from '@/assets/team/jaya-krishna.jpg';
import chitvanImg from '@/assets/team/chitvan-singhal.jpg';
import aayushyaImg from '@/assets/team/aayushya-aggarwal.jpg';
import sayanImg from '@/assets/team/sayan-chakrabarti.jpeg';
import abhishekImg from '@/assets/team/abhishek-anand.jpeg';
import vigneshImg from '@/assets/team/vignesh-raja.jpeg';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const }
};

const cultureImages = [
  { src: companyPhoto1, alt: 'Trackzio team outing' },
  { src: companyPhoto2, alt: 'Working at Trackzio' },
  { src: companyPhoto3, alt: 'Team celebrations' },
  { src: companyPhoto4, alt: 'Trackzio office' },
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
  }
];

const teamMembers = [
  { name: 'Aayushya Aggarwal', role: 'Founder', linkedin: 'https://www.linkedin.com/in/aayushya-aggarwal-a61250ab/', photo: aayushyaImg },
  { name: 'Sayan Chakrabarti', role: 'Lead Engineer – Backend, Founding Member', linkedin: 'https://www.linkedin.com/in/sayanriju/', photo: sayanImg },
  { name: 'Abhishek P Anand', role: 'Founding Product (UI/UX) Designer', linkedin: 'https://www.linkedin.com/in/abhishekpanand/', photo: abhishekImg },
  { name: 'Shreyans Jain', role: 'Senior React Native Engineer – Founding Member', linkedin: 'https://www.linkedin.com/in/shreyans-jain-8396b6245', photo: shreyansImg },
  { name: 'Chitvan Singhal', role: 'Backend Engineer – Founding Member', linkedin: 'https://in.linkedin.com/in/chitvan-singhal-26550b198', photo: chitvanImg },
  { name: 'Burhanuddin Makda', role: 'Senior Software Developer', linkedin: 'https://www.linkedin.com/in/burhanuddin-makda-865a48103', photo: burhanuddinImg },
  { name: 'Ijaaz Ahamed', role: 'Senior React Native Engineer', linkedin: 'https://www.linkedin.com/in/ijaazahamed', photo: ijaazImg },
  { name: 'Koppala Sai Preetham Reddy', role: 'Web Scraping and LLM Enrichment Engineer', linkedin: 'https://in.linkedin.com/in/preethamkoppala', photo: preethamImg },
  { name: 'Aishik Kirtaniya', role: 'Android Engineer', linkedin: 'https://in.linkedin.com/in/aishik-k-0030b516a', photo: aishikImg },
  { name: 'Jaya Krishna Cheemala', role: 'iOS Developer', linkedin: 'https://www.linkedin.com/in/jayakrishna-cheemala0540', photo: jayaKrishnaImg },
  { name: 'Vignesh R', role: 'QA Engineer – Founding Member', linkedin: 'https://www.linkedin.com/in/vignesh217', photo: null },
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
      {/* ── Section 1: Hero ── */}
      <section className="min-h-[40vh] flex items-center justify-center pt-8 pb-12 snap-start">
        <div className="container-site">
          <motion.div {...fadeUp} className="max-w-5xl mx-auto text-center">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">About Us</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display leading-[1.1] tracking-tight mb-4 whitespace-nowrap">
              Designing better <span className="text-gradient">living</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Trackzio builds AI-powered platforms for collectors and enthusiasts.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Section 2: Who We Are ── */}
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
                    Our platforms combine artificial intelligence, structured data, and thoughtful design to help people identify, understand, and organize the things they care about.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    By bringing together identification technology, knowledge platforms, collection management tools, and enthusiast communities, Trackzio aims to create seamless digital ecosystems around people's interests.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    For collectors, our platforms also enable expert insights and trusted marketplaces that make discovering, evaluating, and exchanging items easier.
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

      {/* ── Section 3: Vision & Mission ── */}
      <section className="py-24 sm:py-32 snap-start">
        <div className="container-site w-full">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">What Drives Us</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">Our Vision & <span className="text-gradient">Mission</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              {...fadeUp}
              className="rounded-2xl bg-card p-8 sm:p-10 border border-border"
              style={{ boxShadow: '0 4px 24px -4px rgba(40, 54, 24, 0.08)' }}
            >
              <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">Vision</p>
              <h3 className="text-xl sm:text-2xl font-bold font-display mb-4 leading-snug">
                To build the world's leading digital ecosystem for collectors and enthusiasts.
              </h3>
            </motion.div>
            <motion.div
              {...fadeUp}
              className="rounded-2xl bg-card p-8 sm:p-10 border border-border"
              style={{ boxShadow: '0 4px 24px -4px rgba(40, 54, 24, 0.08)' }}
            >
              <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">Mission</p>
              <h3 className="text-xl sm:text-2xl font-bold font-display mb-4 leading-snug">
                To develop AI-powered platforms that help people identify, understand, organize, and exchange the things they care about.
              </h3>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Section 4: Journey ── */}
      <section className="py-24 sm:py-32 snap-start bg-section-tinted">
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

      {/* ── Section 5: Team ── */}
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
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 to-teal-600 transition-transform duration-500 group-hover:scale-105">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display text-[8rem] font-bold text-white/15 select-none leading-none">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                )}
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
    </div>
  );
}
