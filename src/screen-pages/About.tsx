import { motion } from 'framer-motion';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';
import { Linkedin } from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const }
};


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
  { name: 'Aayushya Aggarwal', role: 'Founder', linkedin: 'https://www.linkedin.com/in/aayushya-aggarwal-a61250ab/', photo: '/assets/team/aayushya-aggarwal.jpg' },
  { name: 'Sayan Chakrabarti', role: 'Lead Engineer – Backend, Founding Member', linkedin: 'https://www.linkedin.com/in/sayanriju/', photo: '/assets/team/sayan-chakrabarti.jpeg' },
  { name: 'Abhishek P Anand', role: 'Founding Product (UI/UX) Designer', linkedin: 'https://www.linkedin.com/in/abhishekpanand/', photo: '/assets/team/abhishek-anand.jpeg' },
  { name: 'Shreyans Jain', role: 'Senior React Native Engineer – Founding Member', linkedin: 'https://www.linkedin.com/in/shreyans-jain-8396b6245', photo: '/assets/team/shreyans-jain.png' },
  { name: 'Chitvan Singhal', role: 'Backend Engineer – Founding Member', linkedin: 'https://in.linkedin.com/in/chitvan-singhal-26550b198', photo: '/assets/team/chitvan-singhal.jpg' },
  { name: 'Burhanuddin Makda', role: 'Senior Software Developer', linkedin: 'https://www.linkedin.com/in/burhanuddin-makda-865a48103', photo: '/assets/team/burhanuddin-makda.png' },
  { name: 'Ijaaz Ahamed', role: 'Senior React Native Engineer', linkedin: 'https://www.linkedin.com/in/ijaazahamed', photo: '/assets/team/ijaaz-ahamed.jpeg' },
  { name: 'Koppala Sai Preetham Reddy', role: 'Web Scraping and LLM Enrichment Engineer', linkedin: 'https://in.linkedin.com/in/preethamkoppala', photo: '/assets/team/preetham-reddy.jpg' },
  { name: 'Aishik Kirtaniya', role: 'Android Engineer', linkedin: 'https://in.linkedin.com/in/aishik-k-0030b516a', photo: '/assets/team/aishik-kirtaniya.jpg' },
  { name: 'Jaya Krishna Cheemala', role: 'iOS Developer', linkedin: 'https://www.linkedin.com/in/jayakrishna-cheemala0540', photo: '/assets/team/jaya-krishna.jpg' },
  { name: 'Vignesh R', role: 'QA Engineer – Founding Member', linkedin: 'https://www.linkedin.com/in/vignesh217', photo: '/assets/team/vignesh-raja.jpeg' },
];

export default function About() {
  usePageAnalytics('about', 'about us_page_view');

  return (
    <div className="snap-y snap-mandatory max-sm:snap-none">
      {/* ── Section 1: Hero ── */}
      <section className="min-h-[40vh] flex items-center justify-center pt-8 pb-12 snap-start">
        <div className="container-site">
          <motion.div {...fadeUp} className="max-w-5xl mx-auto text-center">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">
              About Us
            </p>
            <h1 className="text-[clamp(1.6rem,5.2vw,1.95rem)] sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display leading-[1.12] sm:leading-[1.1] tracking-tight mb-4 text-balance">
              <span className="block sm:inline">Trackzio builds AI-powered platforms for</span>
              <span className="text-gradient block sm:inline"> collectors and enthusiasts</span>
            </h1>
            {/* <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-1">
              Trackzio builds AI-powered platforms for collectors and enthusiasts.
            </p> */}
          </motion.div>
        </div>
      </section>

      {/* ── Section 2: Who We Are ── */}
      <section className="py-16 sm:py-24 lg:py-32 snap-start bg-section-tinted">
        <div className="container-site w-full">
          <motion.div {...fadeUp} className="max-w-4xl mx-auto">
            <div className="rounded-xl sm:rounded-2xl bg-card overflow-hidden" style={{ boxShadow: '0 4px 24px -4px rgba(40, 54, 24, 0.08)' }}>
              <div className="p-5 sm:p-8 md:p-10 lg:p-14 flex flex-col justify-center">
                <p className="text-xs sm:text-sm font-medium tracking-[0.15em] sm:tracking-[0.2em] uppercase text-primary mb-3 sm:mb-4">About Us</p>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-display mb-4 sm:mb-5 leading-snug text-balance">
                  Who we <span className="text-gradient">are</span>
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                  Our platforms combine artificial intelligence, structured data, and thoughtful design to help people identify, understand, and organize the things they care about.
                </p>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                  By bringing together identification technology, knowledge platforms, collection management tools, and enthusiast communities, Trackzio aims to create seamless digital ecosystems around people's interests.
                </p>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  For collectors, our platforms also enable expert insights and trusted marketplaces that make discovering, evaluating, and exchanging items easier.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Section 3: Vision & Mission ── */}
      <section className="py-16 sm:py-24 lg:py-32 snap-start">
        <div className="container-site w-full">
          <motion.div {...fadeUp} className="text-center mb-10 sm:mb-14 md:mb-16 max-w-3xl mx-auto px-1">
            <p className="text-xs sm:text-sm font-medium tracking-[0.15em] sm:tracking-[0.2em] uppercase text-primary mb-3 sm:mb-4">What Drives Us</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-balance leading-tight">
              Our Vision & <span className="text-gradient">Mission</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 max-w-5xl mx-auto">
            <motion.div
              {...fadeUp}
              className="rounded-xl sm:rounded-2xl bg-card p-6 sm:p-8 md:p-10 border border-border"
              style={{ boxShadow: '0 4px 24px -4px rgba(40, 54, 24, 0.08)' }}
            >
              <p className="text-xs sm:text-sm font-medium tracking-[0.15em] sm:tracking-[0.2em] uppercase text-primary mb-3 sm:mb-4">Vision</p>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold font-display leading-snug text-balance">
                To build the world's leading digital ecosystem for collectors and enthusiasts.
              </h3>
            </motion.div>
            <motion.div
              {...fadeUp}
              className="rounded-xl sm:rounded-2xl bg-card p-6 sm:p-8 md:p-10 border border-border"
              style={{ boxShadow: '0 4px 24px -4px rgba(40, 54, 24, 0.08)' }}
            >
              <p className="text-xs sm:text-sm font-medium tracking-[0.15em] sm:tracking-[0.2em] uppercase text-primary mb-3 sm:mb-4">Mission</p>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold font-display leading-snug text-balance">
                To develop AI-powered platforms that help people identify, understand, organize, and exchange the things they care about.
              </h3>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Section 4: Journey ── */}
      <section className="py-16 sm:py-24 lg:py-32 snap-start bg-section-tinted">
        <div className="container-site w-full">
          <motion.div {...fadeUp} className="text-center mb-12 sm:mb-16 md:mb-20 max-w-3xl mx-auto px-1">
            <p className="text-xs sm:text-sm font-medium tracking-[0.15em] sm:tracking-[0.2em] uppercase text-primary mb-3 sm:mb-4">Our Journey</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-balance leading-tight">
              From problem to <span className="text-gradient">ecosystem</span>
            </h2>
          </motion.div>

          <div className="space-y-16 sm:space-y-20 md:space-y-28 max-w-5xl mx-auto">
            {journeyBlocks.map((block, i) => {
              const isReversed = i % 2 === 1;
              return (
                <motion.div
                  key={block.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.7 }}
                  className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 sm:gap-12 lg:gap-20`}
                >
                  <div className="flex-1 flex items-center justify-center shrink-0">
                    <div className="w-36 h-36 min-[400px]:w-40 min-[400px]:h-40 sm:w-52 sm:h-52 rounded-2xl sm:rounded-3xl bg-primary/5 flex items-center justify-center">
                      <span className="text-6xl sm:text-7xl md:text-8xl" aria-hidden>
                        {block.emoji}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 text-center md:text-left w-full">
                    <p className="text-[0.65rem] sm:text-xs font-semibold tracking-[0.2em] uppercase text-primary/60 mb-2 sm:mb-3">Step {i + 1}</p>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold font-display text-foreground mb-3 sm:mb-4 text-balance">{block.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-base sm:text-lg max-w-prose mx-auto md:mx-0">{block.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Section 5: Team ── */}
      <section className="py-16 sm:py-24 lg:py-32 snap-start pb-20 sm:pb-24">
        <div className="container-site w-full">
          <motion.div {...fadeUp} className="text-center mb-10 sm:mb-14 md:mb-16 max-w-3xl mx-auto px-1">
            <p className="text-xs sm:text-sm font-medium tracking-[0.15em] sm:tracking-[0.2em] uppercase text-primary mb-3 sm:mb-4">Our Team</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-balance leading-tight">
              The people behind <span className="text-gradient">Trackzio</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 max-w-6xl mx-auto">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: Math.min(i * 0.07, 0.5) }}
                className="group relative aspect-[3/4] max-w-md min-[480px]:max-w-none mx-auto min-[480px]:mx-0 w-full rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer transition-shadow duration-300 hover:shadow-xl focus-within:ring-2 focus-within:ring-primary/40 focus-within:ring-offset-2 focus-within:ring-offset-background"
              >
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 to-teal-600 transition-transform duration-500 group-hover:scale-105">
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <span className="font-display text-5xl min-[400px]:text-7xl sm:text-[8rem] font-bold text-white/15 select-none leading-none">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent transition-opacity duration-300 group-hover:from-black/90" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 pr-14 sm:pr-16">
                  <h3 className="font-display font-bold text-sm sm:text-base text-white normal-case tracking-tight leading-snug">
                    {member.name}
                  </h3>
                  <p className="text-white/75 text-xs sm:text-sm mt-1.5 leading-snug line-clamp-3">{member.role}</p>
                </div>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} on LinkedIn`}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white border border-white/20 transition-all duration-200 hover:scale-110 hover:bg-white/30 z-10 active:scale-95"
                >
                  <Linkedin size={16} className="shrink-0" aria-hidden />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
