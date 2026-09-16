import { motion } from 'framer-motion';
import { usePageAnalytics } from "@/hooks/usePageAnalytics";
import { imageSrc } from "@/lib/imageSrc";
import { getTeamMembers } from "@/lib/content/team";
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
    description: 'We saw how fragmented the experience could be for people who collect, explore, and learn about the things they love. The tools they needed were often spread across different places, leaving no single experience built around their complete journey.'
  },
  {
    emoji: '🛠️',
    title: 'Building the First Beta',
    description: 'With a small team and big ambitions, we started building focused apps that brought the tools people needed for each hobby into one platform — creating end-to-end experiences around their journey. We began with AI-powered identification and kept expanding from there. Fast iterations, late nights, and a relentless focus on getting the experience right shaped our first products.'
  },
  {
    emoji: '🌱',
    title: 'Early Users Discover the Apps',
    description: 'People started discovering and using our apps, sharing them with friends and giving us feedback along the way. Their experiences helped shape every feature, every update, and every decision we made next — teaching us more about what passionate users truly needed.'
  },
  {
    emoji: '🚀',
    title: 'Growing the Trackzio Ecosystem',
    description: 'What started as a single mobile app has evolved into an ecosystem of eight focused platforms, now expanding across mobile and web. Today, we’re going deeper into coins and banknotes, building and refining the model around the needs of these communities. As we learn what works, we’ll create a playbook to expand into new categories, while our other platforms continue to grow organically.'
  },
  {
    emoji: '🗺️',
    title: 'The Road Ahead',
    description: 'Our ambition is to make Trackzio a leading platform across a range of major collectibles and hobbies. Over the next five years, we see an opportunity to bring this model to roughly 9–10 categories — expanding thoughtfully based on what we learn along the way.'
  }
];

const teamMembers = getTeamMembers();

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
              <span className="text-gradient block sm:inline"> collectors and hobbyists</span>
            </h1>
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
                  We believe the things people are passionate about deserve better digital experiences. We started with AI-powered identification, helping people identify what they collect and love.
                </p>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                  As we built and learned from users, we understood there was much more they needed. What began as identification tools has evolved into digital spaces that bring together the tools they need throughout their journey.
                </p>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Today, we’re building focused platforms across collectibles and hobbies, starting with coins and banknotes, and expanding into antiques, cards, vinyl, and much more.
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
                Build the tools and experiences that bring everything collectors and hobbyists need into one place.
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
                key={member.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: Math.min(i * 0.07, 0.5) }}
                className="group relative aspect-[3/4] max-w-md min-[480px]:max-w-none mx-auto min-[480px]:mx-0 w-full rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer transition-shadow duration-300 hover:shadow-xl focus-within:ring-2 focus-within:ring-primary/40 focus-within:ring-offset-2 focus-within:ring-offset-background"
              >
                {member.image ? (
                  <img
                    src={imageSrc(member.image)}
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
