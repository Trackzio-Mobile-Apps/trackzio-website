import coinzyLogo from '@/assets/coinzy-logo.png';
import banknotesLogo from '@/assets/banknotes-logo.png';
import insectoLogo from '@/assets/insecto-logo.png';
import habiteazyLogo from '@/assets/habiteazy-logo.png';
import rockzyLogo from '@/assets/rockzy-logo.png';

// Screenshots
import banknotes1 from '@/assets/screenshots/banknotes-1.png';
import banknotes2 from '@/assets/screenshots/banknotes-2.png';
import banknotes3 from '@/assets/screenshots/banknotes-3.png';
import coinzy1 from '@/assets/screenshots/coinzy-1.png';
import coinzy2 from '@/assets/screenshots/coinzy-2.png';
import coinzy3 from '@/assets/screenshots/coinzy-3.png';
import insecto1 from '@/assets/screenshots/insecto-1.png';
import insecto2 from '@/assets/screenshots/insecto-2.jpg';
import insecto3 from '@/assets/screenshots/insecto-3.png';
import habiteazy1 from '@/assets/screenshots/habiteazy-1.jpg';

export interface AppFeature {
  icon: string;
  title: string;
  description: string;
}

export interface AppInfo {
  id: string;
  name: string;
  tagline: string;
  description: string;
  color: string;
  accentHsl: string;
  iosUrl: string | null;
  androidUrl: string | null;
  icon: string;
  logo: string;
  screenshots: string[];
  features: AppFeature[];
  stats: { downloads: string; rating: string; dau: string };
}

export const apps: AppInfo[] = [
  {
    id: 'coinzy',
    name: 'Coinzy',
    tagline: 'Identify coins instantly with AI',
    description: 'Coinzy uses advanced AI to identify coins from around the world. Scan any coin, explore its history, rarity, and estimated value. Build your collection and trade on the marketplace.',
    color: 'hsl(174, 60%, 35%)',
    accentHsl: '174 60% 35%',
    iosUrl: null,
    androidUrl: 'https://play.google.com/store/apps/details?id=com.coinzy.trackzio',
    icon: '🪙',
    logo: coinzyLogo,
    screenshots: [coinzy1, coinzy2, coinzy3],
    features: [
      { icon: '📸', title: 'AI Coin Scanner', description: 'Point your camera at any coin for instant identification.' },
      { icon: '📚', title: 'Rich History', description: 'Explore detailed historical data, minting info, and rarity.' },
      { icon: '🛒', title: 'Marketplace', description: 'Buy and sell coins in a trusted community marketplace.' },
      { icon: '💎', title: 'Rarity Analysis', description: 'Get estimated value and rarity classification instantly.' },
    ],
    stats: { downloads: '120K+', rating: '4.5+', dau: '30K+' },
  },
  {
    id: 'banknotes',
    name: 'Banknotes',
    tagline: 'Scan and identify banknotes from around the world',
    description: 'Banknotes uses advanced image recognition to identify banknotes from around the world. Learn about currency history, security features, and exchange rates instantly.',
    color: 'hsl(152, 55%, 32%)',
    accentHsl: '152 55% 32%',
    iosUrl: 'https://apps.apple.com/in/app/banknote-identification-ai/id6747063766',
    androidUrl: 'https://play.google.com/store/apps/details?id=com.trackzio.banknote',
    icon: '💵',
    logo: banknotesLogo,
    screenshots: [banknotes1, banknotes2, banknotes3],
    features: [
      { icon: '🔍', title: 'AI Banknote Scanner', description: 'Scan any banknote and get instant identification results.' },
      { icon: '🌍', title: 'Global Coverage', description: 'Supports banknotes from countries across the world.' },
      { icon: '📊', title: 'Rarity & Value', description: 'Discover rarity, estimated price, and circulation status.' },
      { icon: '🏛️', title: 'History & Design', description: 'Explore detailed history, design elements, and materials.' },
    ],
    stats: { downloads: '40K+', rating: '4.3+', dau: '7K+' },
  },
  {
    id: 'insecto',
    name: 'Insecto',
    tagline: 'Discover insects and learn about them instantly',
    description: 'Point your camera at any insect and Insecto will identify it instantly. Get detailed information about species, habitat, behavior, and whether they are beneficial or harmful.',
    color: 'hsl(78, 45%, 42%)',
    accentHsl: '78 45% 42%',
    iosUrl: null,
    androidUrl: 'https://play.google.com/store/apps/details?id=com.insect.trackzio',
    icon: '🐛',
    logo: insectoLogo,
    screenshots: [insecto1, insecto2, insecto3],
    features: [
      { icon: '📷', title: 'AI Identification', description: 'Instantly identify any insect with your camera.' },
      { icon: '🗂️', title: 'Explore by Category', description: 'Browse popular, toxic, pests, and location-specific insects.' },
      { icon: '📝', title: 'Detailed Profiles', description: 'Get toxicity info, bite photos, and behavioral data.' },
      { icon: '📦', title: 'Build Collection', description: 'Save identified insects and build your personal catalogue.' },
    ],
    stats: { downloads: '', rating: '4.5+', dau: '' },
  },
  {
    id: 'habiteazy',
    name: 'Habiteazy',
    tagline: 'Build positive habits and stay consistent',
    description: 'Habiteazy makes habit building simple and rewarding. Track your streaks, set reminders, and visualize your progress with beautiful charts and motivational insights.',
    color: 'hsl(270, 55%, 50%)',
    accentHsl: '270 55% 50%',
    iosUrl: 'https://apps.apple.com/in/app/habit-eazy-habit-to-do-pal/id6738790392',
    androidUrl: 'https://play.google.com/store/apps/details?id=com.progresspal',
    icon: '✅',
    logo: habiteazyLogo,
    screenshots: [habiteazy1, habiteazy1, habiteazy1],
    features: [
      { icon: '🔥', title: 'Streak Tracking', description: 'Stay motivated with daily streak counts and fire badges.' },
      { icon: '📅', title: 'Smart Scheduling', description: 'Set flexible reminders and weekly habit plans.' },
      { icon: '📈', title: 'Visual Progress', description: 'See your journey with beautiful charts and statistics.' },
      { icon: '🦊', title: 'Fun Companion', description: 'Your virtual pet grows as you build better habits.' },
    ],
    stats: { downloads: '250K+', rating: '4.4+', dau: '30K+' },
  },
];

export function getApp(id: string): AppInfo | undefined {
  return apps.find(a => a.id === id);
}
