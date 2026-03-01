import coinzyLogo from '@/assets/coinzy-logo.png';
import banknotesLogo from '@/assets/banknotes-logo.png';
import insectoLogo from '@/assets/insecto-logo.png';
import habiteazyLogo from '@/assets/habiteazy-logo.png';

export interface AppInfo {
  id: string;
  name: string;
  tagline: string;
  description: string;
  color: string;
  accentHsl: string; // HSL values for CSS variable e.g. "174 72% 52%"
  iosUrl: string | null;
  androidUrl: string | null;
  icon: string;
  logo: string;
}

export const apps: AppInfo[] = [
  {
    id: 'coinzy',
    name: 'Coinzy',
    tagline: 'Smart expense tracking powered by AI',
    description: 'Coinzy helps you track expenses effortlessly with AI-powered categorization, insightful analytics, and smart budgeting tools. Take control of your finances with clarity.',
    color: 'hsl(174, 60%, 35%)',
    accentHsl: '174 60% 35%',
    iosUrl: null,
    androidUrl: 'https://play.google.com/store/apps/details?id=com.coinzy.trackzio',
    icon: '💰',
    logo: coinzyLogo,
  },
  {
    id: 'banknotes',
    name: 'Banknotes',
    tagline: 'Identify and learn about world currencies',
    description: 'Banknotes uses advanced image recognition to identify banknotes from around the world. Learn about currency history, security features, and exchange rates instantly.',
    color: 'hsl(152, 55%, 32%)',
    accentHsl: '152 55% 32%',
    iosUrl: 'https://apps.apple.com/in/app/banknote-identification-ai/id6747063766',
    androidUrl: 'https://play.google.com/store/apps/details?id=com.trackzio.banknote',
    icon: '💵',
    logo: banknotesLogo,
  },
  {
    id: 'insecto',
    name: 'Insecto',
    tagline: 'Discover the insect world with AI',
    description: 'Point your camera at any insect and Insecto will identify it instantly. Get detailed information about species, habitat, behavior, and whether they are beneficial or harmful.',
    color: 'hsl(78, 45%, 42%)',
    accentHsl: '78 45% 42%',
    iosUrl: null,
    androidUrl: 'https://play.google.com/store/apps/details?id=com.insect.trackzio',
    icon: '🐛',
    logo: insectoLogo,
  },
  {
    id: 'habiteazy',
    name: 'Habiteazy',
    tagline: 'Build better habits, one day at a time',
    description: 'Habiteazy makes habit building simple and rewarding. Track your streaks, set reminders, and visualize your progress with beautiful charts and motivational insights.',
    color: 'hsl(270, 55%, 50%)',
    accentHsl: '270 55% 50%',
    iosUrl: 'https://apps.apple.com/in/app/habit-eazy-habit-to-do-pal/id6738790392',
    androidUrl: 'https://play.google.com/store/apps/details?id=com.progresspal',
    icon: '✅',
    logo: habiteazyLogo,
  },
];

export function getApp(id: string): AppInfo | undefined {
  return apps.find(a => a.id === id);
}
