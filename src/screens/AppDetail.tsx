import { useState, useRef, useEffect } from 'react';
import { useRouter } from "next/router";
import { motion } from 'framer-motion';
import { getApp } from '@/lib/appData';
import { trackEvent } from '@/lib/analytics';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';
import { useIsMobile } from '@/hooks/use-mobile';
import { getPlatform, getDownloadUrl } from "@/lib/platformUtils";
import { imageSrc } from "@/lib/imageSrc";
import type { StaticImageData } from "next/image";
import { QRCodeSVG } from 'qrcode.react';
import { ArrowRight, Quote, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import PlatformDownloadButtons from '@/components/PlatformDownloadButtons';
import FeatureShowcase from '@/components/FeatureShowcase';
import OtherAppsCarousel from '@/components/OtherAppsCarousel';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

const pageViewEvents: Record<string, string> = {
  coinzy: 'coinzy_page_view',
  banknotes: 'banknotes_page_view',
  insecto: 'insecto_page_view',
  habiteazy: 'habiteazy_page_view',
  rockzy: 'rockzy_page_view',
};

const downloadEvents: Record<string, { ios: string; android: string }> = {
  coinzy: { ios: 'coinzy_ios_download', android: 'coinzy_android_download' },
  banknotes: { ios: 'banknotes_ios_download', android: 'banknotes_android_download' },
  insecto: { ios: 'insecto_ios_download', android: 'insecto_android_download' },
  habiteazy: { ios: 'habiteazy_ios_download', android: 'habiteazy_android_download' },
  rockzy: { ios: 'rockzy_ios_download', android: 'rockzy_android_download' },
};

const appReviews: Record<string, { quote: string; author: string }[]> = {
  habiteazy: [
    { quote: "This app makes building good habits fun and rewarding. It gamifies daily chores, turning routine tasks into small achievements that keep me motivated.", author: "Kunal" },
    { quote: "I've used a lot of habit trackers and games, and I really like this one. It's easy to add tasks and habits and configure them to meet my needs. It doesn't have a ton of ads, and right now the premium is only about $2/month so it's affordable. I work a flexible schedule of 50hr/week with my schedule changing with less than a day's notice, regularly. This app makes it much easier to organize my life despite the chaos and lack of time.", author: "Amanda" },
    { quote: "I love this app. Much easier to use than other apps like it. The UI is simple, making it easier to do what you want. The widget is perfect. I can't find anything wrong with it. Looking forward to future updates. Try this app. You won't be sorry.", author: "Koni" },
    { quote: "Guys this is super cute and fantastic!", author: "Myat" },
  ],
  banknotes: [
    { quote: "I make money in various currencies and this app is very very helpful in identifying the money that I have made in the different currencies. Good community.", author: "Kirti" },
    { quote: "Best banknote identifier with good accuracy. A must for casual users and collectors.", author: "Chitvan" },
    { quote: "Nice application for identification.", author: "Jaya" },
  ],
  coinzy: [
    { quote: "As an avid collector of US coins and currency for over 20 years, I can say I love the concept of the app and the fact that there's an included community within the app that allows us to interact amongst each other.", author: "Jaylin" },
    { quote: "Good coin scanner.", author: "Naing" },
    { quote: "It's very good and helps a lot.", author: "Colete" },
    { quote: "This is a great app for coin collectors. It's helpful in cataloging the collection virtually. Also, it provides visibility on the coins that have not been collected by me yet.", author: "Ankit" },
    { quote: "Accurate and awesome tool utility.", author: "Pierre" },
  ],
  insecto: [
    { quote: "The app has a great UI with quick turnaround time to satisfy my curiosity.", author: "Aanish" },
    { quote: "Decent repertoire of insects available for identifying them.", author: "Pintu" },
    { quote: "Amazing app with such a vast library of readily available insects.", author: "Pallav" },
    { quote: "Best app to identify insects!!!", author: "Jay" },
  ],
  rockzy: [
    { quote: "I could easily identify some rocks in the wild with this app. Waiting for an offline version to happen soon!", author: "Pintu Bodat" },
    { quote: "Good app. I like my hobby to collect rocks and minerals and this app certainly helps identify them!", author: "Umesh Barot" },
    { quote: "Great app with brilliant UI to identify rocks and minerals just by a click of the camera!", author: "Aanish Aggarwal" },
    { quote: "Great for geology lovers! It's so simple to identify rocks by photo and then track your rock collection as it grows. Best rock identifier on the play store by far. Highly recommend!", author: "Chitvan Singhal" },
    { quote: "If you enjoy collecting minerals, this rock identifier is a must have. You can identify rocks by photo within seconds and track your collection easily.", author: "Ijaaz Ahamed" },
    { quote: "Really nice app, smooth ui and great scanning accuracy of gems, useful to identify rocks or gems using camera.", author: "Aishik Kirtaniya" },
  ],
};

const appFaqs: Record<string, { q: string; a: string }[]> = {
  insecto: [
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
  ],
  habiteazy: [
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
  ],
  coinzy: [
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
  ],
  banknotes: [
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
  ],
  rockzy: [
    { q: 'What is Rockzy?', a: 'Rockzy is a comprehensive rocks and minerals app that helps you identify, collect, and organize rocks and minerals using AI.' },
    { q: 'Why can\'t I identify more rocks?', a: 'Free users have a daily limit of 2 identifications. This resets every 24 hours. Upgrade to Premium for unlimited use.' },
    { q: 'How does identification work?', a: 'Take a clear photo → AI analyzes → returns name, type, and details.' },
    { q: 'Do I need an account?', a: 'You can use as guest, but account is required for saving collections.' },
    { q: 'What happens if I delete the app?', a: 'Guest data is lost. Account data is restored on login.' },
    { q: 'Free vs Premium?', a: 'Free: Limited identifications and collections. Premium: Unlimited identifications, unlimited collections, and full AI chat access.' },
    { q: 'Can I cancel the subscription?', a: 'Yes, via Play Store / App Store settings.' },
    { q: 'How to organise a collection?', a: 'Use Owned, Identified, Wishlist categories.' },
    { q: 'What is "Which Rock Are You"?', a: 'A personality quiz that matches you with a rock.' },
    { q: 'What are Zodiac Stones?', a: 'Crystals linked to zodiac signs and energies.' },
    { q: 'How does AI Chat work?', a: 'Ask questions about rocks and minerals. Free has limits, Premium is unlimited.' },
    { q: 'What is Global Catalogue?', a: 'A database of rocks and minerals worldwide.' },
    { q: 'What is Rock of the Day?', a: 'A daily featured mineral with details and insights.' },
    { q: 'How accurate is identification?', a: 'Depends on image quality. AI gives multiple possible matches.' },
    { q: 'Is my data safe?', a: 'Yes, securely stored with encryption.' },
    { q: 'How to report content?', a: 'Use the report option in the app.' },
  ],
};

const appLegalLinks: Record<string, { privacy: string; terms: string }> = {
  coinzy: { privacy: "/coinzy/privacy-policy", terms: "/coinzy/terms" },
  banknotes: { privacy: "/banknote-ai/privacy-policy", terms: "/banknote-ai/terms" },
  insecto: { privacy: "/insecto-ai/privacy-policy", terms: "/insecto-ai/terms" },
  habiteazy: { privacy: "/habit-eazy/privacy-policy", terms: "/habit-eazy/terms" },
  rockzy: { privacy: "/rockzy/privacy-policy", terms: "/rockzy/terms" },
};

// Feature bullet points per app
const featureBullets: Record<string, Record<string, string[]>> = {
  coinzy: {
    'AI Coin Scanner': ['Supports 10,000+ coin varieties', 'Works in low light conditions', 'Results in under 2 seconds'],
    'Rich History': ['Minting year and country details', 'Historical context and significance', 'Metal composition breakdown'],
    'Marketplace': ['Verified seller profiles', 'Secure in-app messaging', 'Price comparison tools'],
    'Rarity Analysis': ['Market value estimation', 'Condition grading assistance', 'Collection completeness tracking'],
  },
  banknotes: {
    'AI Banknote Scanner': ['Supports 150+ countries', 'Front and back recognition', 'Instant denomination detection'],
    'Global Coverage': ['Modern and historical notes', 'Commemorative editions', 'Regional variants included'],
    'Rarity & Value': ['Live market pricing', 'Condition-based valuation', 'Collector demand indicators'],
    'History & Design': ['Design symbolism explained', 'Security feature guide', 'Material and printing details'],
  },
  insecto: {
    'AI Identification': ['Works from safe distances', 'Photo library scanning', 'Real-time camera mode'],
    'Explore by Category': ['Filter by region', 'Toxicity level sorting', 'Seasonal availability info'],
    'Detailed Profiles': ['Habitat and diet info', 'Life cycle illustrations', 'Safety precautions listed'],
    'Build Collection': ['Personal discovery log', 'Location-tagged entries', 'Share with community'],
  },
  habiteazy: {
    'Streak Tracking': ['Fire badges for milestones', 'Weekly and monthly streaks', 'Recovery day options'],
    'Smart Scheduling': ['Custom repeat patterns', 'Time-of-day reminders', 'Weekend/weekday modes'],
    'Visual Progress': ['Heat map calendar view', 'Completion rate charts', 'Trend analysis over time'],
    'Fun Companion': ['Virtual pet evolution', 'Achievement unlocks', 'Motivational notifications'],
  },
  rockzy: {
    'AI Rock Identification': ['Supports 8,000+ rock varieties', 'Works from any angle', 'Results in under 2 seconds'],
    'AI Chat Assistant': ['Ask anything about geology', 'Crystal healing properties', 'Mineral composition details'],
    'Collection Tracking': ['Owned, Identified, Wishlist', 'Location-tagged entries', 'Share with community'],
    'Global Mineral Catalogue': ['Searchable worldwide database', 'Filter by type and region', 'Detailed mineral profiles'],
  },
};

// Showcase features per app — maps features to screenshots with benefit descriptions
const showcaseFeatures: Record<string, { screenshot: string | StaticImageData; title: string; description: string }[]> = {};

// Dynamically build showcase from app data
import coinzy1 from '@/assets/screenshots/coinzy-1.png';
import coinzy2 from '@/assets/screenshots/coinzy-2.png';
import coinzy3 from '@/assets/screenshots/coinzy-3.png';
import coinzy4 from '@/assets/screenshots/coinzy-4.png';
import coinzy5 from '@/assets/screenshots/coinzy-5.png';
import coinzy6 from '@/assets/screenshots/coinzy-6.png';
import banknotes4 from '@/assets/screenshots/banknotes-4.webp';
import banknotes5 from '@/assets/screenshots/banknotes-5.webp';
import banknotes6 from '@/assets/screenshots/banknotes-6.webp';
import banknotes7 from '@/assets/screenshots/banknotes-7.webp';
import banknotes8 from '@/assets/screenshots/banknotes-8.webp';
import banknotes9 from '@/assets/screenshots/banknotes-9.webp';
import insecto1 from '@/assets/screenshots/insecto-1.png';
import insecto2 from '@/assets/screenshots/insecto-2.webp';
import insecto3 from '@/assets/screenshots/insecto-3.webp';
import insecto4 from '@/assets/screenshots/insecto-4.webp';
import insecto5 from '@/assets/screenshots/insecto-5.webp';
import insecto6 from '@/assets/screenshots/insecto-6.webp';
import habiteazy1 from '@/assets/screenshots/habiteazy-1.jpg';
import habiteazy2 from '@/assets/screenshots/habiteazy-2.webp';
import habiteazy4 from '@/assets/screenshots/habiteazy-4.jpg';
import habiteazy5 from '@/assets/screenshots/habiteazy-5.jpg';
import rockzy1 from '@/assets/screenshots/rockzy-1.webp';
import rockzy2 from '@/assets/screenshots/rockzy-2.png';
import rockzy3 from '@/assets/screenshots/rockzy-3.webp';
import rockzy4 from '@/assets/screenshots/rockzy-4.webp';
import rockzy5 from '@/assets/screenshots/rockzy-5.png';
import rockzy6 from '@/assets/screenshots/rockzy-6.webp';
import rockzy7 from '@/assets/screenshots/rockzy-7.webp';

showcaseFeatures['coinzy'] = [
  { screenshot: coinzy1, title: 'AI Coin Scan', description: 'Identify coins instantly using AI' },
  { screenshot: coinzy2, title: 'Marketplace', description: 'Buy and sell coins with collectors' },
  { screenshot: coinzy3, title: 'Collection Tracking', description: 'Organize and manage your coin collection' },
  { screenshot: coinzy4, title: 'Community Feed', description: 'Share and explore coin discoveries' },
  { screenshot: coinzy5, title: 'Coin Value Insights', description: 'Know the real value of your coins' },
  { screenshot: coinzy6, title: '250K+ Coins Database', description: 'Explore a massive global coin catalog' },
];

showcaseFeatures['banknotes'] = [
  { screenshot: banknotes4, title: 'AI Banknote Scan', description: 'Scan and identify banknotes instantly' },
  { screenshot: banknotes5, title: 'Marketplace', description: 'Connect with buyers and sellers' },
  { screenshot: banknotes6, title: 'Collection Tracking', description: 'Manage your banknote collection' },
  { screenshot: banknotes7, title: 'Community Feed', description: 'Discover and share banknotes' },
  { screenshot: banknotes8, title: 'Value Insights', description: 'Understand banknote worth' },
  { screenshot: banknotes9, title: '50K+ Banknotes', description: 'Access a global banknote database' },
];

showcaseFeatures['insecto'] = [
  { screenshot: insecto1, title: 'AI Insect Scan', description: 'Identify insects using AI' },
  { screenshot: insecto2, title: 'AI Chat Assistant', description: 'Ask questions about insects' },
  { screenshot: insecto3, title: 'Collection Tracking', description: 'Save and organize discoveries' },
  { screenshot: insecto6, title: 'Community Feed', description: 'Share findings with others' },
  { screenshot: insecto4, title: 'Danger Identification', description: 'Learn about harmful insects' },
  { screenshot: insecto5, title: '400K+ Insects Database', description: 'Explore a vast insect catalog' },
];

showcaseFeatures['habiteazy'] = [
  { screenshot: habiteazy1, title: 'Habit Tracking', description: 'Track your daily habits and stay consistent' },
  { screenshot: habiteazy2, title: 'Task Management', description: 'Manage your daily to-do tasks efficiently' },
  { screenshot: habiteazy4, title: 'Statistics & Reports', description: 'View colorful graphs and progress insights' },
  { screenshot: habiteazy5, title: 'Your Personal Pal', description: 'Stay motivated with your companion throughout the journey' },
];

showcaseFeatures['rockzy'] = [
  { screenshot: rockzy1, title: 'AI Rock Scan', description: 'Identify rocks and minerals instantly' },
  { screenshot: rockzy3, title: 'Collection & Mineral Care', description: 'Track and maintain your mineral collection' },
  { screenshot: rockzy4, title: 'Community Feed', description: 'Share discoveries with enthusiasts' },
  { screenshot: rockzy6, title: '8K+ Minerals Database', description: 'Explore a global mineral catalog' },
  { screenshot: rockzy7, title: 'Zodiac Stones', description: 'Discover crystals linked to your zodiac' },
];

export default function AppDetail() {
  const router = useRouter();
  const appId = typeof router.query.appId === "string" ? router.query.appId : "";
  const app = getApp(appId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [appId]);
  const isMobile = useIsMobile();
  const [showAllFaqs, setShowAllFaqs] = useState(false);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const [canScrollReviewLeft, setCanScrollReviewLeft] = useState(false);
  const [canScrollReviewRight, setCanScrollReviewRight] = useState(true);

  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const appId2 = app?.id || '';
  usePageAnalytics(appId2, pageViewEvents[appId2] || 'page_view');

  useEffect(() => {
    const el = reviewsRef.current;
    if (!el) return;
    const update = () => {
      setCanScrollReviewLeft(el.scrollLeft > 10);
      setCanScrollReviewRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    };
    update();
    el.addEventListener('scroll', update);

    const startAutoScroll = () => {
      autoScrollRef.current = setInterval(() => {
        if (!el) return;
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 10) {
          el.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          el.scrollBy({ left: el.clientWidth * 0.8, behavior: 'smooth' });
        }
      }, 4000);
    };
    startAutoScroll();

    const pause = () => { if (autoScrollRef.current) clearInterval(autoScrollRef.current); };
    const resume = () => { pause(); startAutoScroll(); };
    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', resume);

    return () => {
      el.removeEventListener('scroll', update);
      el.removeEventListener('mouseenter', pause);
      el.removeEventListener('mouseleave', resume);
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, []);

  useEffect(() => {
    if (!router.isReady) return;
    if (!getApp(appId)) void router.replace("/");
  }, [router.isReady, router, appId]);

  if (!router.isReady || !app) return null;

  const platform = getPlatform();
  const faqs = appFaqs[app.id] || [];
  const reviews = appReviews[app.id] || [];
  const visibleFaqs = showAllFaqs ? faqs : faqs.slice(0, 3);
  const bullets = featureBullets[app.id] || {};

  const handleDownload = () => {
    const url = getDownloadUrl(app.iosUrl, app.androidUrl);
    if (url) {
      const p = getPlatform();
      const eventKey = p === 'ios' ? 'ios' : 'android';
      trackEvent(downloadEvents[app.id]?.[eventKey], { app_name: app.name });
      window.open(url, '_blank');
    }
  };

  const qrUrl = (() => {
    if (platform === 'ios' && app.iosUrl) return app.iosUrl;
    if (platform === 'android' && app.androidUrl) return app.androidUrl;
    return app.androidUrl || app.iosUrl;
  })();

  const scrollReviews = (dir: 'left' | 'right') => {
    const el = reviewsRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <div style={{ '--app-accent': app.accentHsl } as React.CSSProperties}>
      {/* ── 1. Hero ── */}
      <section className="min-h-[40vh] flex items-center justify-center pt-8 pb-12 snap-start">
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at top, hsl(${app.accentHsl} / 0.08), transparent 60%)` }} />
        <div className="container-site relative">
          <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center">
            <img
              src={imageSrc(app.logo)}
              alt={`${app.name} logo`}
              className="w-20 h-20 rounded-2xl mx-auto mb-5"
              style={{ boxShadow: `0 8px 30px -8px hsl(${app.accentHsl} / 0.35)` }}
            />
            <h1 className="text-4xl sm:text-5xl font-bold font-display" style={{ color: `hsl(${app.accentHsl})` }}>
              {app.name}
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">{app.description}</p>

            {/* Download section */}
            <div className="mt-6 flex flex-col items-center gap-4">
              <PlatformDownloadButtons
                iosUrl={app.iosUrl}
                androidUrl={app.androidUrl}
                appName={app.name}
                appId={app.id}
                accentHsl={app.accentHsl}
              />

              {!isMobile && qrUrl && (
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 rounded-xl bg-card border border-border/40" style={{ borderColor: `hsl(${app.accentHsl} / 0.2)` }}>
                    <QRCodeSVG value={qrUrl} size={80} level="M" />
                  </div>
                  <span className="text-xs text-muted-foreground">Scan to download</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 2. Feature Showcase — Premium Phone Mockup Carousel ── */}
      {showcaseFeatures[app.id] && showcaseFeatures[app.id].length > 0 && (
        <FeatureShowcase features={showcaseFeatures[app.id]} accentHsl={app.accentHsl} />
      )}




      {/* ── 4. Reviews — Horizontal Carousel with 4 cards ── */}
      <section className="py-20 sm:py-24 snap-start">
        <div className="container-site w-full">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">Reviews</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">What users say</h2>
          </motion.div>

          <div className="relative max-w-5xl mx-auto">
            {canScrollReviewLeft && (
              <button
                onClick={() => scrollReviews('left')}
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                style={{ boxShadow: 'var(--shadow-card)' }}
              >
                <ChevronLeft size={18} />
              </button>
            )}
            {canScrollReviewRight && (
              <button
                onClick={() => scrollReviews('right')}
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                style={{ boxShadow: 'var(--shadow-card)' }}
              >
                <ChevronRight size={18} />
              </button>
            )}

            <div
              ref={reviewsRef}
              className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {reviews.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(i * 0.08, 0.4) }}
                  className="flex-shrink-0 snap-start"
                  style={{ width: 'calc(25% - 15px)', minWidth: '260px' }}
                >
                  <div className="p-6 rounded-3xl bg-card h-full flex flex-col" style={{ boxShadow: 'var(--shadow-card)' }}>
                    <Quote size={22} className="mb-3" style={{ color: `hsl(${app.accentHsl} / 0.25)` }} />
                    <div className="flex gap-0.5 mb-3 text-sm" style={{ color: `hsl(${app.accentHsl})` }}>
                      {'★★★★★'}
                    </div>
                    <p className="text-sm leading-relaxed text-foreground flex-1 font-medium">"{r.quote}"</p>
                    <div className="mt-5 flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm"
                        style={{ color: `hsl(${app.accentHsl})`, background: `hsl(${app.accentHsl} / 0.1)` }}
                      >
                        {r.author.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-sm">— {r.author}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. App Stats ── */}
      <section className="min-h-[60vh] flex items-center py-20 sm:py-24 snap-start">
        <div className="container-site w-full">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">By the Numbers</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">{app.name} in numbers</h2>
          </motion.div>

          <div className={`grid gap-8 max-w-3xl mx-auto ${[app.stats.downloads, app.stats.rating, app.stats.dau].filter(Boolean).length === 1 ? 'grid-cols-1 max-w-md' : 'grid-cols-3'}`}>
            {[
              { value: app.stats.downloads, label: 'Total Downloads' },
              { value: app.stats.rating, label: 'Average Rating' },
              { value: app.stats.dau, label: 'Total Active Users' },
            ].filter(stat => stat.value).map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display text-gradient mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. FAQs — Show first 3 with "More" toggle ── */}
      {faqs.length > 0 && (
        <section className="min-h-[60vh] flex items-center py-20 sm:py-24 snap-start">
          <div className="container-site w-full flex justify-center">
            <div className="w-full max-w-xl">
              <motion.div {...fadeUp} className="text-center mb-16">
                <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">FAQ</p>
                <h2 className="text-3xl sm:text-4xl font-bold font-display">Frequently asked questions</h2>
              </motion.div>

              <Accordion type="single" collapsible className="space-y-3">
                {visibleFaqs.map((faq, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: Math.min(i * 0.06, 0.3) }}
                  >
                    <AccordionItem value={`faq-${i}`} className="rounded-2xl bg-card px-6" style={{ boxShadow: 'var(--shadow-card)' }}>
                      <AccordionTrigger className="text-foreground font-medium text-left text-sm">{faq.q}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-sm leading-relaxed">{faq.a}</AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>

              {faqs.length > 3 && (
                <div className="text-center mt-6">
                  <button
                    onClick={() => setShowAllFaqs(!showAllFaqs)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:opacity-80 transition-opacity"
                  >
                    {showAllFaqs ? 'Show Less' : 'More'}
                    <ChevronDown size={16} className={`transition-transform ${showAllFaqs ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <OtherAppsCarousel excludeAppId={app.id} accentHsl={app.accentHsl} />

    </div>
  );
}
