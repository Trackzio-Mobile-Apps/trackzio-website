import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock } from 'lucide-react';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';

const articles = [
  {
    category: 'Personal Growth',
    title: 'The Science Behind Habit Building: Why Small Steps Lead to Big Changes',
    excerpt: 'Discover how neuroscience explains why tiny daily habits compound into life-changing transformations.',
    body: `The human brain is wired for efficiency, not change. Every time you repeat an action, the neural pathway responsible for that behavior strengthens — a process neuroscientists call "long-term potentiation." This is why small, consistent habits are far more powerful than grand, one-time efforts.

When you start small — say, meditating for just two minutes a day — you lower the activation energy required to begin. Your brain doesn't resist because the task feels trivial. But over weeks and months, that two-minute practice rewires your neural circuitry, making the behavior automatic.

This is the essence of habit stacking: attaching a new behavior to an existing routine. By leveraging established neural pathways, you reduce cognitive load and increase the likelihood of follow-through.

Research from University College London found that it takes an average of 66 days for a new behavior to become automatic — not the commonly cited 21 days. The key insight? Consistency matters more than intensity. Missing one day doesn't reset your progress, but missing two consecutive days significantly increases the chance of abandoning the habit entirely.

Apps like Habiteazy leverage this science by providing streak tracking, gentle reminders, and visual progress indicators. When you can see your 30-day streak, the psychological cost of breaking it becomes a powerful motivator.

The compound effect of small habits is staggering. A 1% improvement every day results in being 37 times better after one year. This mathematical reality explains why the most successful people aren't those who make dramatic changes, but those who relentlessly optimize small, daily behaviors.

Start with something so small it feels almost laughable. That's exactly the point. Your future self will thank you.`,
    date: 'Feb 28, 2026',
    readTime: '8 min',
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&h=500&fit=crop',
    author: 'Aayushya Aggarwal',
    slug: 'science-behind-habit-building',
  },
  {
    category: 'Nature & AI',
    title: 'How AI is Revolutionizing Insect Identification for Everyday Explorers',
    excerpt: 'AI-powered tools are making it easier than ever to identify and learn about the insects around us.',
    body: `Insects are the most diverse group of organisms on Earth, with over a million described species and millions more yet to be discovered. For centuries, identifying them required specialized knowledge, reference books, and often a trip to a university entomology department.

Today, AI is changing that entirely. With apps like Insecto, anyone with a smartphone can point their camera at a beetle, butterfly, or moth and receive an instant identification along with detailed information about the species.

The technology behind this is convolutional neural networks (CNNs), trained on millions of labeled insect images. These networks learn to recognize patterns in wing venation, body segmentation, coloration, and antenna shape — the same features entomologists use, but processed in milliseconds.

The implications extend beyond casual curiosity. Citizen science projects powered by AI identification apps are generating unprecedented amounts of biodiversity data. Researchers can track insect population changes, migration patterns, and the spread of invasive species using data contributed by millions of everyday users.

For gardeners, farmers, and homeowners, AI identification provides practical value: quickly determining whether an insect is beneficial (like a ladybug) or harmful (like a Japanese beetle), and receiving actionable advice on what to do next.

The accuracy of these systems continues to improve as more images are added to training datasets. What started as a novelty is becoming an essential tool for understanding and protecting the natural world around us.`,
    date: 'Feb 20, 2026',
    readTime: '10 min',
    image: 'https://images.unsplash.com/photo-1559235038-1b0fadf76f78?w=800&h=500&fit=crop',
    author: 'Trackzio Team',
    slug: 'ai-insect-identification',
  },
  {
    category: 'Technology',
    title: 'Building an AI Product Ecosystem: Lessons from Creating Five Apps in One Year',
    excerpt: 'What happens when you try to build multiple AI-powered apps simultaneously? Our journey and hard-earned lessons.',
    body: `Building one AI-powered app is challenging. Building five simultaneously is a masterclass in prioritization, shared infrastructure, and knowing when to say no.

When we started Trackzio, the vision was clear: create a family of intelligent apps that help people identify, collect, and learn about the things they care about — coins, banknotes, insects, rocks, and daily habits. The challenge was executing this vision without drowning in complexity.

The first lesson we learned was the power of shared AI infrastructure. Rather than building separate machine learning pipelines for each app, we created a unified image recognition platform that could be trained on different domains. This dramatically reduced development time and allowed improvements in one app to benefit all others.

The second lesson was about user experience consistency. Users who love Coinzy should feel immediately at home in Insecto or Rockzy. We invested heavily in a shared design system — consistent navigation patterns, similar onboarding flows, and a unified visual language that adapts to each app's unique personality.

The third and perhaps most important lesson was about focus. Not every feature belongs in every app. We learned to resist the temptation to add "just one more thing" and instead focused on making each app's core functionality exceptional before expanding.

The result? Five apps that feel both unique and part of a cohesive family, each serving a passionate community of collectors and enthusiasts.`,
    date: 'Feb 12, 2026',
    readTime: '9 min',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop',
    author: 'Aayushya Aggarwal',
    slug: 'building-ai-product-ecosystem',
  },
  {
    category: 'Product Updates',
    title: "Coinzy 2.0: What's New in the Latest Update",
    excerpt: 'A closer look at the new features, improved AI accuracy, and redesigned marketplace in Coinzy 2.0.',
    body: `Coinzy 2.0 represents our biggest update yet, with improvements across every aspect of the app. Here's what's new.

The AI scanning engine has been completely rebuilt. Using a new transformer-based architecture, coin identification accuracy has improved by 40% across all categories. The system now recognizes over 10,000 coin varieties from 195 countries, including ancient coins that were previously difficult to identify.

The Marketplace has been redesigned from the ground up. Sellers can now create professional listings with multiple photos, detailed condition descriptions, and price comparisons against recent sales. Buyers benefit from improved search filters, a watchlist feature, and secure in-app messaging.

Collection management received major upgrades. You can now create unlimited custom collections, track your collection's estimated value over time, and export your collection data as CSV for insurance or personal records.

The Community Feed now supports video posts, allowing collectors to share unboxing videos, coin cleaning tutorials, and identification walkthroughs. We've also added a "Coin of the Day" feature that highlights a different fascinating coin each day.

Performance improvements include 50% faster app launch time, reduced battery consumption during scanning, and offline access to your saved collections. The UI has been refreshed with smoother animations and better accessibility support.

We're incredibly grateful to our community for the feedback that shaped this update. Coinzy 2.0 is for you.`,
    date: 'Feb 5, 2026',
    readTime: '7 min',
    image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=500&fit=crop',
    author: 'Trackzio Team',
    slug: 'coinzy-2-update',
  },
  {
    category: 'Tips & Tricks',
    title: '5 Ways to Get the Most Out of Your Habit Tracker',
    excerpt: 'Practical tips from power users on how to maximize consistency and motivation with Habiteazy.',
    body: `After analyzing usage patterns from thousands of Habiteazy users, we've identified the five strategies that separate successful habit builders from those who give up.

1. Start with just one habit. The most common mistake is trying to change everything at once. Users who start with a single habit and maintain it for 30 days before adding another have a 73% higher long-term success rate.

2. Use the 2-minute rule. When creating a new habit, make it so easy it takes less than two minutes. "Read for 30 minutes" becomes "Read one page." Once the habit is established, you can gradually increase the difficulty.

3. Leverage the streak effect. Our data shows that users who reach a 7-day streak are 4x more likely to maintain the habit for 60+ days. The visual streak counter in Habiteazy creates a powerful psychological incentive to keep going.

4. Set specific time-based reminders. Vague intentions like "I'll exercise sometime today" have a 40% lower completion rate compared to time-specific plans like "I'll exercise at 7 AM." Use Habiteazy's reminder feature to anchor habits to specific times.

5. Review your stats weekly. Users who check their weekly statistics report higher motivation and better habit adherence. The visual progress charts help you see patterns — maybe you always skip Wednesdays, or you're most consistent in the morning.

The key takeaway? Consistency beats intensity, every time.`,
    date: 'Jan 28, 2026',
    readTime: '6 min',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=500&fit=crop',
    author: 'Aayushya Aggarwal',
    slug: 'habit-tracker-tips',
  },
  {
    category: 'Nature & AI',
    title: 'The Most Fascinating Insects Found by Insecto Users in 2025',
    excerpt: 'A roundup of the rarest and most surprising insect identifications made by our community last year.',
    body: `2025 was an incredible year for the Insecto community. With over 2 million identifications made worldwide, users discovered some truly remarkable insects. Here are the highlights.

A user in Costa Rica identified a Hercules Beetle — one of the largest beetles in the world, reaching up to 17 cm in length. The photo showed the beetle's distinctive horn in stunning detail, and the identification was confirmed within seconds.

In Australia, a backyard gardener used Insecto to identify a rare Pink Underwing Moth larva, which has evolved to look exactly like a skull. This species is critically endangered, and the sighting was reported to local conservation authorities.

Perhaps the most unexpected find came from London, where a user identified a Hummingbird Hawk-moth hovering over lavender bushes. Often mistaken for an actual hummingbird due to its rapid wing movement, this moth is a rare visitor to the UK.

The community also contributed to real scientific discovery. Aggregated data from Insecto users helped researchers at three universities track the northward migration of the Brown Marmorated Stink Bug, an invasive species affecting agriculture across North America and Europe.

These stories remind us why we built Insecto: to connect people with the incredible diversity of insect life that exists all around us, often unnoticed.`,
    date: 'Jan 20, 2026',
    readTime: '8 min',
    image: 'https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=800&h=500&fit=crop',
    author: 'Trackzio Team',
    slug: 'fascinating-insects-2025',
  },
  {
    category: 'Personal Growth',
    title: 'Morning Routines That Actually Stick: A Data-Driven Approach',
    excerpt: 'We analyzed thousands of habit tracking patterns to find the morning routines that users maintain longest.',
    body: `We analyzed data from over 50,000 Habiteazy users to understand which morning routines have the highest long-term adherence rates. The results challenged many popular assumptions.

The most sustainable morning habit? Drinking a glass of water. With a 89% 90-day adherence rate, this simple action outperformed meditation (67%), journaling (54%), and exercise (48%). The reason is clear: it requires zero willpower and takes seconds to complete.

The second most sustainable habit was making the bed — an 82% adherence rate. Behavioral psychologists call this a "keystone habit" because it creates a cascade of productivity. Users who made their bed reported feeling more organized throughout the day.

Surprisingly, the "5 AM Club" approach had one of the lowest adherence rates at just 23%. While waking up early works for some, our data suggests that consistency of wake time matters more than the specific hour. Users who woke up at the same time every day (regardless of when) had 3x better habit adherence than those who tried to wake up earlier.

The optimal morning routine, according to our data, consists of 3-4 habits that take a combined total of less than 20 minutes. Any longer, and completion rates drop sharply. Quality over quantity applies to morning routines too.

The bottom line: the best morning routine is the one you actually do, consistently.`,
    date: 'Jan 14, 2026',
    readTime: '7 min',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop',
    author: 'Aayushya Aggarwal',
    slug: 'morning-routines-data-driven',
  },
  {
    category: 'Technology',
    title: 'The Future of Mobile-First AI Applications',
    excerpt: 'How on-device machine learning is changing the way we build and interact with mobile applications.',
    body: `The next revolution in mobile AI isn't happening in the cloud — it's happening on the device in your pocket. On-device machine learning is fundamentally changing how we build and interact with mobile applications, and the implications are enormous.

Traditional AI apps send data to cloud servers for processing. This introduces latency, requires internet connectivity, and raises privacy concerns. On-device ML eliminates all three issues by running models directly on the phone's neural processing unit (NPU).

Apple's Core ML and Google's ML Kit have made it possible to run sophisticated models locally. We've been implementing this at Trackzio, and the results are impressive: coin identification that works offline, insect recognition with zero latency, and rock identification in areas with no cell service.

The privacy implications are significant. When AI processing happens on-device, user photos never leave the phone. This is particularly important for apps like ours where users might be photographing valuable collections — their data stays private by default.

The challenge is model size. Cloud models can be enormous, but on-device models need to be compact enough to fit in a phone's limited memory. Techniques like quantization, pruning, and knowledge distillation allow us to shrink models by 90% while retaining 95% of accuracy.

Looking ahead, we expect on-device AI to enable entirely new categories of applications. Real-time AR overlays, continuous health monitoring, and persistent environmental awareness — all without sending a single byte to the cloud.

The future of mobile AI is private, fast, and always available. And it's already here.`,
    date: 'Jan 8, 2026',
    readTime: '10 min',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=500&fit=crop',
    author: 'Trackzio Team',
    slug: 'future-mobile-ai',
  },
];

function getArticle(slug: string) {
  return articles.find(a => a.slug === slug);
}

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

export default function BlogArticle() {
  const { slug } = useParams<{ slug: string }>();
  const article = getArticle(slug || '');
  usePageAnalytics(`blog_${slug}`, `blog_article_view`);

  if (!article) return <Navigate to="/blog" replace />;

  const paragraphs = article.body.split('\n\n').filter(Boolean);

  return (
    <div>
      <section className="pt-8 pb-12">
        <div className="container-site max-w-3xl">
          <motion.div {...fadeUp}>
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:opacity-80 transition-opacity mb-8"
            >
              <ArrowLeft size={14} /> Back to Blog
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-primary">
                {article.category}
              </span>
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Clock size={11} /> {article.readTime}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-foreground leading-tight mb-6">
              {article.title}
            </h1>

            <div className="flex items-center gap-3 mb-8 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{article.author}</span>
              <span>·</span>
              <span>{article.date}</span>
            </div>

            <div className="rounded-xl overflow-hidden mb-10">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-auto object-cover"
                style={{ maxHeight: '420px' }}
                loading="eager"
              />
            </div>

            <div className="prose prose-lg max-w-none">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-foreground/85 leading-relaxed mb-5 text-base">
                  {p}
                </p>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-border">
              <Link
                to="/blog"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:opacity-80 transition-opacity"
              >
                <ArrowLeft size={14} /> Back to all articles
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
