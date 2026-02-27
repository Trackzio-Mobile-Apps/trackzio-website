export interface AppInfo {
  id: string;
  name: string;
  tagline: string;
  description: string;
  color: string;
  iosUrl: string;
  androidUrl: string;
  qrUrl: string;
  icon: string;
}

export const apps: AppInfo[] = [
  {
    id: 'coinzy',
    name: 'Coinzy',
    tagline: 'Smart expense tracking powered by AI',
    description: 'Coinzy helps you track expenses effortlessly with AI-powered categorization, insightful analytics, and smart budgeting tools. Take control of your finances with clarity.',
    color: 'hsl(45, 90%, 55%)',
    iosUrl: 'TBD_IOS_URL_COINZY',
    androidUrl: 'TBD_ANDROID_URL_COINZY',
    qrUrl: 'TBD_QR_DYNAMIC_LINK_COINZY',
    icon: '💰',
  },
  {
    id: 'banknotes',
    name: 'Banknotes',
    tagline: 'Identify and learn about world currencies',
    description: 'Banknotes uses advanced image recognition to identify banknotes from around the world. Learn about currency history, security features, and exchange rates instantly.',
    color: 'hsl(140, 60%, 45%)',
    iosUrl: 'TBD_IOS_URL_BANKNOTES',
    androidUrl: 'TBD_ANDROID_URL_BANKNOTES',
    qrUrl: 'TBD_QR_DYNAMIC_LINK_BANKNOTES',
    icon: '💵',
  },
  {
    id: 'insecto',
    name: 'Insecto',
    tagline: 'Discover the insect world with AI',
    description: 'Point your camera at any insect and Insecto will identify it instantly. Get detailed information about species, habitat, behavior, and whether they are beneficial or harmful.',
    color: 'hsl(90, 55%, 50%)',
    iosUrl: 'TBD_IOS_URL_INSECTO',
    androidUrl: 'TBD_ANDROID_URL_INSECTO',
    qrUrl: 'TBD_QR_DYNAMIC_LINK_INSECTO',
    icon: '🐛',
  },
  {
    id: 'habiteazy',
    name: 'Habiteazy',
    tagline: 'Build better habits, one day at a time',
    description: 'Habiteazy makes habit building simple and rewarding. Track your streaks, set reminders, and visualize your progress with beautiful charts and motivational insights.',
    color: 'hsl(270, 60%, 55%)',
    iosUrl: 'TBD_IOS_URL_HABITEAZY',
    androidUrl: 'TBD_ANDROID_URL_HABITEAZY',
    qrUrl: 'TBD_QR_DYNAMIC_LINK_HABITEAZY',
    icon: '✅',
  },
];

export function getApp(id: string): AppInfo | undefined {
  return apps.find(a => a.id === id);
}
