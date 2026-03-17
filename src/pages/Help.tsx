import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';
import { Mail, Phone, Send, ChevronDown } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger } from
'@/components/ui/accordion';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const }
};

interface FaqItem { q: string; a: string; }

const faqCategories: { label: string; id: string; faqs: FaqItem[] }[] = [
  {
    label: 'Habit Eazy', id: 'habiteazy', faqs: [
      { q: 'How do I create a new habit?', a: 'Tap the "+" button on the home screen, enter your habit name, choose a category, set a schedule and reminder time, then save. Your habit will appear on the dashboard immediately.' },
      { q: 'How does streak tracking work?', a: 'Complete your habit each day to build a streak. The app tracks consecutive days and rewards you with badges and visual progress indicators. Missing a day resets your streak, but your overall history is preserved.' },
      { q: 'Can I track tasks as well as habits?', a: 'Yes! Habiteazy supports both habits (recurring) and tasks (one-time to-dos). You can manage them from the same dashboard.' },
      { q: 'What is the difference between Free and Premium?', a: 'Free users can track up to 3 habits with basic stats. Premium unlocks unlimited habits, advanced analytics, widgets, watch support, and an ad-free experience.' },
      { q: 'How do I use the widget?', a: 'After adding habits, long-press your home screen, select Widgets, find Habiteazy, and add it. The widget lets you mark habits complete without opening the app.' },
      { q: 'Can I see detailed statistics and reports?', a: 'Yes! Go to the Stats tab to view daily, weekly, and monthly completion rates, streak history, heat maps, and trend charts.' },
      { q: 'How do reminders work?', a: 'Set custom reminder times for each habit. You can choose specific days, multiple times per day, and the app will send push notifications at those times.' },
      { q: 'Does the app support smartwatch?', a: 'Yes, Premium users can view and complete habits from their Apple Watch or Wear OS device.' },
      { q: 'How do I reorder or organize my habits?', a: 'Long-press a habit on the dashboard and drag to reorder. You can also group habits by category for better organization.' },
      { q: 'Can I set habits for specific days only?', a: 'Yes! When creating or editing a habit, choose which days of the week it should be active. It will only appear on those days.' },
      { q: 'How do I delete or archive a habit?', a: 'Swipe left on a habit or go to its edit screen and tap Delete. You can also archive habits to keep their history without cluttering your dashboard.' },
      { q: 'Is my data synced across devices?', a: 'Yes, once you sign in with your account, all habits, streaks, and stats sync automatically across your devices.' },
      { q: 'How do I reset my streak?', a: 'Streaks reset automatically if you miss a day. There is no manual reset option to ensure accurate tracking.' },
      { q: 'Can I export my habit data?', a: 'Premium users can export their habit history and statistics as CSV or PDF from the Settings screen.' },
      { q: 'How do I provide feedback or report a bug?', a: 'Go to Settings → Help & Feedback. You can send us a message directly from within the app and our team will respond promptly.' },
      { q: 'How do I cancel my subscription?', a: 'Cancel through the App Store (iOS) or Google Play Store (Android) subscription management page.' },
      { q: 'How do I delete my account?', a: 'Go to Settings → Account Actions → Delete Account. This will permanently remove all your data.' },
      { q: 'What happens to my data if I uninstall the app?', a: 'If you have an account, your data remains saved in the cloud. Reinstall and sign in to restore everything. Without an account, local data will be lost.' },
    ]
  },
  {
    label: 'Coinzy', id: 'coinzy', faqs: [
      { q: 'How do I identify a coin?', a: 'Tap the Scan button on the home screen, point your camera at the coin or upload a photo from your gallery. The AI will identify it and show detailed information including country, year, denomination, and estimated value.' },
      { q: 'How accurate is the coin identification?', a: 'Coinzy uses advanced AI trained on millions of coin images, achieving high accuracy for most commonly circulated coins worldwide. Results include a confidence score and possible alternative matches.' },
      { q: 'What is the Marketplace?', a: 'The Marketplace lets you buy and sell coins with other collectors. You can list coins for sale, browse listings, and connect with buyers and sellers in a trusted community.' },
      { q: 'How does the Global Catalogue work?', a: 'The Global Catalogue is a comprehensive database of coins from around the world. Browse by country, era, or denomination to explore coins and learn about their history and value.' },
      { q: 'How do I create and manage collections?', a: 'After identifying a coin, tap "Add to Collection." You can create multiple named collections, organize coins by theme, and track your collection\'s completeness and estimated value.' },
      { q: 'What is the Feed feature?', a: 'The Feed is a social feature where you can share your coin finds, see what other collectors are discovering, and interact with the community through likes and comments.' },
      { q: 'What is Coin of the Day?', a: 'Every day, a featured coin is highlighted with detailed history, fun facts, and rarity information. Premium users can refresh to see additional featured coins.' },
      { q: 'What is the difference between Free and Premium?', a: 'Free users can scan a limited number of coins per day with basic details. Premium unlocks unlimited scans, full coin details, unlimited collections, unlimited feed posts, and an ad-free experience.' },
      { q: 'Can I use the app offline?', a: 'Your saved collections and basic browsing work offline. Coin scanning, marketplace, and feed features require an internet connection.' },
      { q: 'How do I share a coin I identified?', a: 'Use the Share icon from the coin result screen to share via social media, messaging apps, or copy a link.' },
      { q: 'How do I sell a coin on the Marketplace?', a: 'Go to Marketplace → Sell, upload photos of your coin, add a description and price, and publish your listing. Interested buyers can contact you through the app.' },
      { q: 'Is my payment information secure?', a: 'Yes, all payment processing is handled through secure, encrypted channels via the App Store or Google Play. We never store your payment details.' },
      { q: 'How do I delete my account?', a: 'Go to Settings → Account Actions → Delete Account. This will permanently remove all your data and collections.' },
      { q: 'How do I cancel my subscription?', a: 'Cancel through the App Store (iOS) or Google Play Store (Android) subscription management page.' },
      { q: 'Why can\'t I scan more coins?', a: 'Free users have a daily scan limit. Upgrade to Premium for unlimited coin identifications.' },
      { q: 'Why can\'t I create more posts?', a: 'Free users can create a limited number of posts per day. Premium users have unlimited posting.' },
      { q: 'How do I report a bug or incorrect identification?', a: 'Go to Settings → Help & Feedback. Describe the issue and our team will review it. Your feedback helps improve our AI.' },
      { q: 'What should I do if the app cannot identify a coin?', a: 'Try uploading a clearer photo with better lighting, ensuring both sides of the coin are visible. You can also try the manual search in the Global Catalogue.' },
    ]
  },
  {
    label: 'Banknote', id: 'banknotes', faqs: [
      { q: 'How do I identify a banknote?', a: 'Tap the Scan button on the home screen, point your camera at the banknote or upload a photo. The AI will identify the country, denomination, year, and provide detailed information.' },
      { q: 'How accurate is the banknote identification?', a: 'Our AI is trained on banknotes from over 150 countries and achieves high accuracy. Results include confidence scores and alternative matches for similar-looking notes.' },
      { q: 'How do I create and manage collections?', a: 'After identifying a banknote, tap "Add to Collection." Create multiple collections, organize by country or theme, and track your collection progress.' },
      { q: 'What is the Marketplace?', a: 'The Marketplace connects banknote collectors for buying and selling. List your notes, browse others\' listings, and communicate securely within the app.' },
      { q: 'How does the Global Catalogue work?', a: 'Browse a comprehensive database of banknotes from around the world. Filter by country, era, or denomination to explore and learn about banknotes.' },
      { q: 'What is the Feed feature?', a: 'Share your banknote finds with the community, see other collectors\' discoveries, and interact through likes and comments.' },
      { q: 'What is Banknote of the Day?', a: 'A daily featured banknote with detailed history, design information, and fun facts. Premium users can refresh for more featured notes.' },
      { q: 'What is the difference between Free and Premium?', a: 'Free users can scan a limited number of banknotes per day with basic info. Premium unlocks unlimited scans, full details, unlimited collections, unlimited feed posts, and an ad-free experience.' },
      { q: 'Can I check if a banknote is counterfeit?', a: 'While the AI can identify banknotes and highlight security features, we recommend professional verification for authenticity confirmation.' },
      { q: 'Does it show exchange rates?', a: 'Yes, the app displays current exchange rates for identified currencies, updated regularly to reflect market conditions.' },
      { q: 'Can I use the app offline?', a: 'Your saved collections and basic browsing work offline. Scanning, marketplace, and feed features require an internet connection.' },
      { q: 'How do I share a banknote I identified?', a: 'Use the Share icon from the result screen to share via social media, messaging apps, or copy a link.' },
      { q: 'How do I sell a banknote on the Marketplace?', a: 'Go to Marketplace → Sell, upload photos, add description and price, and publish. Buyers can contact you through the app.' },
      { q: 'Is my payment information secure?', a: 'Yes, all payment processing is handled through secure, encrypted channels via the App Store or Google Play. We never store your payment details.' },
      { q: 'How do I delete my account?', a: 'Go to Settings → Account Actions → Delete Account. This permanently removes all your data.' },
      { q: 'How do I cancel my subscription?', a: 'Cancel through the App Store (iOS) or Google Play Store (Android) subscription management page.' },
      { q: 'How do I report a bug or incorrect identification?', a: 'Go to Settings → Help & Feedback. Describe the issue and our team will review it promptly.' },
      { q: 'What should I do if the app cannot identify a banknote?', a: 'Try uploading a clearer photo with better lighting. Ensure the full banknote is visible. You can also search manually in the Global Catalogue.' },
    ]
  },
  {
    label: 'Insecto', id: 'insecto', faqs: [
      { q: 'How do I use the insect identification feature?', a: 'To identify an insect, tap the Identify button on the home screen. You can either capture a new photo or upload one from your gallery. Crop or adjust the image if needed, then submit it to get the result. You\'ll see a primary result, along with a horizontally scrollable section showing all matches and a View All button to see the full list. You can then save the result to your collection or explore more details.' },
      { q: 'How do I use the "Something bit me" feature?', a: 'If you\'ve been bitten, go to What to do → Something bit me. Upload a picture of the bite mark and a photo of the insect. The app cannot identify the insect from the bite mark alone, so the insect photo is needed to provide bite-related information such as venom risk, symptoms, and suggested treatments.' },
      { q: 'Why am I not getting a proper response from the AI?', a: 'AI answers depend on the quality of your question and the available insect data. If the response seems unclear: Try rephrasing your question, provide context, and ensure you\'re connected to the internet.' },
      { q: 'How can I chat better with Ask AI?', a: 'Be specific and clear. Free users get 5 questions per day, while Premium users have unlimited conversations.' },
      { q: 'What is the "Which insect are you?" feature?', a: 'This is a fun feature that lets you discover your insect personality.' },
      { q: 'What do I get as a Premium user?', a: 'Premium unlocks: Unlimited identifications, unlimited collections, full insect details, unlimited Ask AI questions, unlimited feed posts, and an ad-free experience.' },
      { q: 'Can I use the app offline?', a: 'No. The app currently requires an internet connection.' },
      { q: 'Why am I not able to identify more insects?', a: 'Free users can identify 2 insects per day.' },
      { q: 'Why can\'t I ask more questions in Ask AI?', a: 'Free users can ask 5 questions per day.' },
      { q: 'How accurate is the insect identification?', a: 'The AI is trained on thousands of species and shows a primary result plus possible matches.' },
      { q: 'How do I create and manage insect collections?', a: 'Tap Add to Collection after identification. Premium users get unlimited collections.' },
      { q: 'How do I share an insect I identified?', a: 'Use the Share icon from the result screen.' },
      { q: 'How do I delete my account?', a: 'Go to Settings → Account Actions → Delete Account.' },
      { q: 'How do I cancel my subscription?', a: 'Cancel through Google Play subscriptions page.' },
      { q: 'Why can\'t I create more posts?', a: 'Free users can create 1 post per day.' },
      { q: 'Why can\'t I refresh Insect of the Day again?', a: 'Free users see it once per day, Premium can refresh multiple times.' },
      { q: 'What should I do if the app cannot identify an insect?', a: 'Try uploading a clearer photo with better lighting and angle.' },
    ]
  },
];

export default function Help() {
  usePageAnalytics('help', 'help_page_view');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [activeCategory, setActiveCategory] = useState('habiteazy');
  const [showAllFaqs, setShowAllFaqs] = useState(false);

  const currentCategory = faqCategories.find(c => c.id === activeCategory)!;
  const visibleFaqs = showAllFaqs ? currentCategory.faqs : currentCategory.faqs.slice(0, 3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="snap-y snap-mandatory">
      {/* Hero (compact) */}
      <section className="min-h-[40vh] flex items-center justify-center pt-8 pb-12 snap-start">
        <div className="container-site">
          <motion.div {...fadeUp} className="max-w-2xl mx-auto text-center">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">HOW CAN WE HELP?</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-4">Help <span className="text-primary">Center</span></h1>
            <p className="text-lg text-muted-foreground">Find answers to your questions and get support.</p>
          </motion.div>
        </div>
      </section>

      {/* Get in Touch */}
      <section id="contact-form" className="min-h-screen flex items-center py-16 sm:py-20 snap-start">
        <div className="container-site max-w-4xl w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            <motion.div {...fadeUp}>
              <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">Get in Touch</p>
              <h2 className="text-2xl sm:text-3xl font-bold font-display mb-8">Send us a message</h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Name</label>
                  <input type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  className="w-full h-11 px-4 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    className="w-full h-11 px-4 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="you@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                    placeholder="How can we help?" />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
                  <Send size={16} /> Send Message
                </button>
              </form>
            </motion.div>

            <motion.div {...fadeUp} className="flex flex-col justify-center">
              <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">Contact</p>
              <h2 className="text-2xl sm:text-3xl font-bold font-display mb-8">Reach us directly</h2>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Email</p>
                    <a href="mailto:support@trackzio.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      support@trackzio.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Phone</p>
                    <a href="tel:+919876543210" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      +91 98765 43210
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="flex items-center py-12 sm:py-16 snap-start">
        <div className="container-site w-full flex justify-center">
          <div className="w-full max-w-xl">
            <motion.div {...fadeUp} className="text-center mb-10">
              <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">FAQ</p>
              <h2 className="text-3xl sm:text-4xl font-bold font-display">Frequently asked questions</h2>
            </motion.div>

            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {faqCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setShowAllFaqs(false); }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeCategory === cat.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <Accordion type="single" collapsible className="space-y-3">
              {visibleFaqs.map((faq, i) =>
              <motion.div
                key={`${activeCategory}-${i}`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.04, 0.3) }}>
                  <AccordionItem value={`faq-${i}`} className="rounded-2xl bg-card px-6" style={{ boxShadow: 'var(--shadow-card)' }}>
                    <AccordionTrigger className="text-foreground font-medium text-left text-sm">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed">{faq.a}</AccordionContent>
                  </AccordionItem>
                </motion.div>
              )}
            </Accordion>

            {currentCategory.faqs.length > 3 &&
            <div className="text-center mt-6">
                <button
                onClick={() => setShowAllFaqs(!showAllFaqs)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:opacity-80 transition-opacity">
                  {showAllFaqs ? 'Show Less' : 'More'}
                  <ChevronDown size={16} className={`transition-transform ${showAllFaqs ? 'rotate-180' : ''}`} />
                </button>
              </div>
            }
          </div>
        </div>
      </section>
    </div>);
}
