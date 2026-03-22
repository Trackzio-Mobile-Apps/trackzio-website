import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';
import { ArrowRight, Clock } from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

const splitCategories = ['Personal Growth', 'Nature & AI', 'Technology', 'Product Updates', 'Tips & Tricks'];

const articles = [
  {
    category: 'Personal Growth',
    title: 'The Science Behind Habit Building: Why Small Steps Lead to Big Changes',
    excerpt: 'Discover how neuroscience explains why tiny daily habits compound into life-changing transformations.',
    body: `The human brain is wired for efficiency, not change. Every time you repeat an action, the neural pathway responsible for that behavior strengthens — a process neuroscientists call "long-term potentiation." This is why small, consistent habits are far more powerful than grand, one-time efforts. When you commit to just two minutes of meditation or five push-ups each morning, you're not just doing the activity — you're rewiring your brain's default mode.

Research from University College London found that it takes an average of 66 days for a new behavior to become automatic. But here's the nuance most people miss: the duration varies wildly depending on the complexity of the habit and the individual. What remains constant is the power of the "habit loop" — cue, routine, reward. By designing your environment to make the cue obvious and the reward immediate, you dramatically increase your chances of sticking with a new behavior.

At Trackzio, we built Habiteazy around this exact science. The streak system isn't just gamification — it's a neurological reward mechanism. Every time you see that streak counter climb, your brain releases a small burst of dopamine, reinforcing the behavior. Pair that with our smart scheduling engine that adapts to your daily rhythm, and you have a system that works with your brain, not against it.`,
    date: 'Feb 28, 2026',
    readTime: '8 min',
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&h=500&fit=crop',
    author: 'Aayushya Aggarwal',
    featured: true,
  },
  {
    category: 'Nature & AI',
    title: 'How AI is Revolutionizing Insect Identification for Everyday Explorers',
    excerpt: 'AI-powered tools are making it easier than ever to identify and learn about the insects around us.',
    body: `There are an estimated 10 quintillion insects alive on Earth at any given moment, spanning over 900,000 known species — with potentially millions more yet to be discovered. For centuries, identifying them required years of academic training, expensive equipment, and access to vast reference libraries. Today, a smartphone and the right AI model can do it in under two seconds.

The technology behind modern insect identification relies on convolutional neural networks (CNNs) trained on millions of labeled photographs. These models learn to recognize subtle patterns — the venation of a wing, the segmentation of an antenna, the iridescence of an exoskeleton — that even experienced entomologists might overlook. But accuracy is only part of the equation. What makes these tools truly revolutionary is accessibility: a farmer in rural India can now identify a crop pest as quickly as a researcher at a university lab.

Insecto, our AI-powered identification app, was built on this philosophy of democratized knowledge. Beyond simple identification, we layer in contextual information — is this insect beneficial or harmful? What does its presence indicate about local ecosystem health? Is it venomous? By combining deep learning with curated ecological data, we're turning every curious person with a phone into a citizen scientist, contributing to a global understanding of biodiversity.`,
    date: 'Feb 20, 2026',
    readTime: '10 min',
    image: 'https://images.unsplash.com/photo-1559235038-1b0fadf76f78?w=800&h=500&fit=crop',
    author: 'Trackzio Team',
  },
  {
    category: 'Technology',
    title: 'Building an AI Product Ecosystem: Lessons from Creating Five Apps in One Year',
    excerpt: 'What happens when you try to build multiple AI-powered apps simultaneously? Our journey and hard-earned lessons.',
    body: `When we set out to build Trackzio's ecosystem, conventional wisdom said to focus on one product. Ship it, scale it, then think about the next one. We chose a different path — and while it nearly broke us, it produced something far more valuable than any single app could have. We built a shared AI infrastructure that powers five distinct products, each serving a unique community of enthusiasts and collectors.

The key insight was recognizing that coin identification, banknote scanning, insect recognition, rock classification, and habit tracking all share a common technical backbone: image classification, user collections, community features, and gamification loops. By building a modular architecture from day one, we could spin up new verticals in weeks rather than months. Our shared ML pipeline handles model training, inference optimization, and edge deployment across all products simultaneously.

The hardest lesson wasn't technical — it was organizational. Each product needs its own identity, its own community voice, and its own growth strategy. Coinzy collectors care about market values and rarity; Insecto users care about ecological context; Rockzy enthusiasts want geological formation data. The temptation to homogenize everything for engineering efficiency is strong, but resisting it is what makes each app feel purpose-built rather than generic.`,
    date: 'Feb 12, 2026',
    readTime: '9 min',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop',
    author: 'Aayushya Aggarwal',
  },
  {
    category: 'Product Updates',
    title: "Coinzy 2.0: What's New in the Latest Update",
    excerpt: 'A closer look at the new features, improved AI accuracy, and redesigned marketplace in Coinzy 2.0.',
    body: `After six months of development and thousands of beta tester feedback sessions, Coinzy 2.0 is here — and it's our most ambitious update yet. The headline feature is our completely rebuilt AI identification engine, which now achieves 94% accuracy on first scan across over 15,000 coin types from 190 countries. That's a 23% improvement over our original model, achieved through a combination of larger training datasets, improved image preprocessing, and a novel multi-angle fusion technique.

The redesigned marketplace is the feature our community has been requesting most. We've moved from a simple listing board to a full-featured trading platform with verified seller badges, condition grading tools, and real-time price comparisons against major numismatic databases. Escrow protection is now built-in for transactions over $50, giving both buyers and sellers peace of mind. Early beta data shows a 3x increase in successful trades compared to the previous version.

Under the hood, we've also dramatically improved the app's performance. Cold start time is down 40%, image processing is now handled on-device for basic identifications (no internet required), and we've reduced the app's storage footprint by 60% through intelligent model compression. Battery usage during extended scanning sessions has been cut in half, addressing one of the most common complaints from power users.`,
    date: 'Feb 5, 2026',
    readTime: '7 min',
    image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=500&fit=crop',
    author: 'Trackzio Team',
  },
  {
    category: 'Tips & Tricks',
    title: '5 Ways to Get the Most Out of Your Habit Tracker',
    excerpt: 'Practical tips from power users on how to maximize consistency and motivation with Habiteazy.',
    body: `After analyzing the behavior patterns of over 200,000 Habiteazy users, we've identified five strategies that separate people who build lasting habits from those who abandon them within the first two weeks. These aren't generic productivity tips — they're data-driven insights specific to how people actually use habit tracking tools successfully.

First, stack your habits. Users who link a new habit to an existing routine (like "meditate for 2 minutes after brushing teeth") show 73% higher completion rates than those who schedule habits at arbitrary times. Second, keep your daily list to five habits or fewer. Users with more than seven daily habits show a sharp decline in overall completion rates after day 10. Quality beats quantity. Third, use the "never miss twice" rule — our data shows that a single missed day barely impacts long-term success, but two consecutive misses create a 40% chance of permanent abandonment.

Fourth, leverage Habiteazy's weekly review feature. Users who spend just three minutes reviewing their weekly stats on Sunday evening are 2.5x more likely to maintain their streaks through the following month. Finally, join a challenge group. Social accountability is the single strongest predictor of habit persistence in our data. Users in active groups maintain habits for an average of 4.2 months versus 1.8 months for solo users.`,
    date: 'Jan 28, 2026',
    readTime: '6 min',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=500&fit=crop',
    author: 'Aayushya Aggarwal',
  },
  {
    category: 'Nature & AI',
    title: 'The Most Fascinating Insects Found by Insecto Users in 2025',
    excerpt: 'A roundup of the rarest and most surprising insect identifications made by our community last year.',
    body: `Every scan made through Insecto contributes to a growing global database of insect sightings — and 2025 delivered some truly remarkable discoveries. Our community of over 100,000 active users logged more than 2.3 million identifications across 147 countries, with several sightings that even surprised professional entomologists who review our flagged specimens.

The standout discovery came from a user in rural Oaxaca, Mexico, who scanned what turned out to be a previously undocumented color morph of the Dynastes hyllus beetle. The specimen showed an unusual metallic blue-green coloration that didn't match any existing records. After verification by researchers at the National Autonomous University of Mexico, the sighting was published in the Journal of Insect Biodiversity, with full credit given to our user. It's moments like these that validate our mission of turning everyday people into citizen scientists.

Other highlights included the first confirmed sighting of the Asian giant hornet in southern Portugal (a critical early warning for European agricultural authorities), a population of bioluminescent click beetles documented by a tourist in Costa Rica's cloud forests, and a remarkable cluster of orchid mantises photographed by a user in Malaysia that revealed a previously unknown communal behavior pattern. Each of these sightings has been shared with relevant research institutions and conservation organizations.`,
    date: 'Jan 20, 2026',
    readTime: '8 min',
    image: 'https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=800&h=500&fit=crop',
    author: 'Trackzio Team',
  },
  {
    category: 'Personal Growth',
    title: 'Morning Routines That Actually Stick: A Data-Driven Approach',
    excerpt: 'We analyzed thousands of habit tracking patterns to find the morning routines that users maintain longest.',
    body: `The internet is saturated with morning routine advice from CEOs, athletes, and influencers — but how much of it actually works for regular people? We decided to find out by analyzing anonymized data from 50,000 Habiteazy users who tracked morning habits for at least 90 days. The results challenged many popular assumptions about what makes a successful morning routine.

The most surprising finding: the optimal morning routine length is just 15-25 minutes. Users who designed routines longer than 40 minutes had a 60% dropout rate within the first month, regardless of how motivated they initially were. The most persistently maintained morning habits were hydration (glass of water upon waking — 89% 90-day retention), brief movement (stretching or a 10-minute walk — 78% retention), and journaling (just 3 sentences — 71% retention). Notably, intense exercise had only 34% retention when placed first thing in the morning.

The time you wake up matters far less than consistency. Users who woke at the same time daily (within a 30-minute window) maintained their routines 2.8x longer than those with variable wake times — even if the consistent time was "late" by conventional standards. A 9 AM wake-up done consistently beats a 5 AM wake-up done sporadically. The key takeaway: design your morning routine around your actual life, not someone else's aspirational schedule.`,
    date: 'Jan 14, 2026',
    readTime: '7 min',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop',
    author: 'Aayushya Aggarwal',
  },
  {
    category: 'Technology',
    title: 'The Future of Mobile-First AI Applications',
    excerpt: 'How on-device machine learning is changing the way we build and interact with mobile applications.',
    body: `The AI landscape is undergoing a fundamental architectural shift. For the past decade, the dominant paradigm has been cloud-first: capture data on the device, send it to powerful servers for processing, return results. This approach works well when you have reliable connectivity and can tolerate latency — but for real-time identification apps like ours, it creates friction that directly impacts user experience and engagement.

On-device inference changes everything. Modern mobile chips — Apple's Neural Engine, Qualcomm's Hexagon DSP, Google's Tensor TPU — can now run sophisticated neural networks locally, delivering results in milliseconds rather than seconds. At Trackzio, we've been migrating our identification models to on-device execution using a combination of model quantization (reducing precision from 32-bit to 8-bit floats), knowledge distillation (training smaller "student" models to mimic larger "teacher" models), and dynamic model loading (only loading the classification layers relevant to the user's current context).

The benefits extend far beyond speed. On-device processing means identification works without internet — crucial for nature enthusiasts identifying insects or rocks in remote locations. It eliminates privacy concerns about uploading personal photos to servers. And it dramatically reduces our infrastructure costs, allowing us to serve millions of users without proportionally scaling our cloud compute. The tradeoff is model size and accuracy, but with each generation of mobile silicon, that gap narrows. We believe that within two years, on-device models will match cloud accuracy for most practical use cases.`,
    date: 'Jan 8, 2026',
    readTime: '10 min',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=500&fit=crop',
    author: 'Trackzio Team',
  },
];

const blogOfTheWeek = articles[0];

export default function Blog() {
  usePageAnalytics('blog', 'blog_page_view');
  const [activeSplitCategory, setActiveSplitCategory] = useState(splitCategories[0]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const splitFiltered = useMemo(() => {
    return articles.filter(a => a.category === activeSplitCategory);
  }, [activeSplitCategory]);

  const activePreview = splitFiltered[selectedIndex] || splitFiltered[0];

  const handleCategoryChange = (cat: string) => {
    setActiveSplitCategory(cat);
    setSelectedIndex(0);
  };

  return (
    <div>
      {/* Section 1: Hero */}
      <section className="min-h-[40vh] flex items-center justify-center pt-8 pb-12">
        <div className="container-site">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">Blog</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-4">
              Insights & <span className="text-primary">Stories</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Updates, ideas, and stories from the Trackzio team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Blog of the Week */}
      <section className="pb-16 sm:pb-24">
        <div className="container-site max-w-5xl">
          <motion.div {...fadeUp}>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-6">Blog of the Week</p>
            <div
              className="rounded-xl bg-card overflow-hidden flex flex-col md:flex-row"
              style={{ boxShadow: '0 8px 32px -8px hsla(0 0% 0% / 0.1)' }}
            >
              <div className="md:w-1/2 aspect-[16/10] md:aspect-auto overflow-hidden">
                <img
                  src={blogOfTheWeek.image}
                  alt={blogOfTheWeek.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
              <div className="md:w-1/2 p-8 sm:p-10 flex flex-col justify-center">
                <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-primary mb-3">
                  {blogOfTheWeek.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground mb-3 leading-tight">
                  {blogOfTheWeek.title}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">
                  {blogOfTheWeek.excerpt}
                </p>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-xs text-muted-foreground">{blogOfTheWeek.date}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock size={12} /> {blogOfTheWeek.readTime}
                  </span>
                </div>
                <button className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors w-fit">
                  Read More <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 3: Interactive Split-View */}
      <section className="py-16 sm:py-24 bg-muted/40">
        <div className="container-site max-w-5xl">
          <motion.div {...fadeUp}>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-6">Featured Articles</p>

            <div className="flex flex-wrap gap-2 mb-8">
              {splitCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                    activeSplitCategory === cat
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-muted-foreground hover:text-foreground border border-border'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex flex-col lg:flex-row gap-6 rounded-xl overflow-hidden">
              <div className="lg:w-[38%] bg-card rounded-xl flex flex-col" style={{ boxShadow: '0 4px 20px -6px hsla(0 0% 0% / 0.08)' }}>
                <div
                  className="flex-1 overflow-y-auto divide-y divide-border"
                  style={{ height: '420px', scrollbarWidth: 'thin', scrollbarColor: 'hsl(var(--primary)) hsl(var(--muted))' }}
                >
                  {splitFiltered.length === 0 ? (
                    <p className="p-6 text-sm text-muted-foreground">No articles in this category yet.</p>
                  ) : (
                    splitFiltered.map((article, i) => (
                      <button
                        key={article.title}
                        onClick={() => setSelectedIndex(i)}
                        className={`w-full text-left p-5 transition-colors ${
                          selectedIndex === i
                            ? 'bg-primary/5 border-l-[3px] border-l-primary'
                            : 'hover:bg-muted/50 border-l-[3px] border-l-transparent'
                        }`}
                      >
                        <h3 className={`text-sm font-semibold leading-snug mb-1 ${selectedIndex === i ? 'text-primary' : 'text-foreground'}`}>
                          {article.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">{article.author} · {article.date}</p>
                      </button>
                    ))
                  )}
                </div>
                <div className="p-4 border-t border-border">
                  <button className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold tracking-wide hover:bg-primary/90 transition-colors uppercase">
                    View All {activeSplitCategory}
                  </button>
                </div>
              </div>

              <div className="lg:w-[62%] bg-card rounded-xl overflow-hidden flex flex-col" style={{ boxShadow: '0 4px 20px -6px hsla(0 0% 0% / 0.08)' }}>
                {activePreview ? (
                  <>
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={activePreview.image}
                        alt={activePreview.title}
                        className="w-full h-full object-cover"
                        loading="eager"
                      />
                    </div>
                    <div className="p-6 sm:p-8 flex-1 flex flex-col">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-primary">
                          {activePreview.category}
                        </span>
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Clock size={11} /> {activePreview.readTime}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold font-display text-foreground mb-3 leading-tight">
                        {activePreview.title}
                      </h2>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {activePreview.excerpt}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full p-12">
                    <p className="text-muted-foreground text-sm">Select an article to preview.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
