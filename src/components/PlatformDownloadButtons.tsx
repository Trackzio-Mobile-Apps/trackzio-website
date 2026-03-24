import { trackEvent } from '@/lib/analytics';

interface PlatformDownloadButtonsProps {
  iosUrl: string | null;
  androidUrl: string | null;
  appName: string;
  appId: string;
  accentHsl?: string;
}

export default function PlatformDownloadButtons({ iosUrl, androidUrl, appName, appId }: PlatformDownloadButtonsProps) {
  const handleClick = (platform: 'ios' | 'android', url: string) => {
    trackEvent(`${appId}_${platform}_download`, { app_name: appName, platform });
    window.open(url, '_blank');
  };

  const btnStyle = { backgroundColor: '#064e3b', color: '#ffffff' };

  return (
    <div className="flex items-center justify-center gap-3 flex-wrap">
      {androidUrl && (
        <button
          onClick={() => handleClick('android', androidUrl)}
          className="inline-flex items-center gap-2.5 h-12 px-5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
          style={btnStyle}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M17.523 2.228a.667.667 0 0 0-.917.244L15.31 4.7A8.276 8.276 0 0 0 12 4.039a8.277 8.277 0 0 0-3.311.66L7.394 2.473a.667.667 0 1 0-1.16.66L7.47 5.28A8.327 8.327 0 0 0 3.667 12h16.666A8.327 8.327 0 0 0 16.53 5.28l1.237-2.148a.667.667 0 0 0-.244-.904zM8.667 9.333a.667.667 0 1 1 0-1.333.667.667 0 0 1 0 1.333zm6.666 0a.667.667 0 1 1 0-1.333.667.667 0 0 1 0 1.333zM3.667 13.333A1.333 1.333 0 0 0 2.333 14.667v4a1.333 1.333 0 0 0 2.667 0v-4a1.334 1.334 0 0 0-1.333-1.334zm1.666 0v7.334A1.334 1.334 0 0 0 6.667 22h1.333v2.667a1.333 1.333 0 0 0 2.667 0V22h2.666v2.667a1.334 1.334 0 0 0 2.667 0V22h1.333a1.334 1.334 0 0 0 1.334-1.333v-7.334H5.333zm15 0a1.333 1.333 0 0 0-1.333 1.334v4a1.333 1.333 0 0 0 2.667 0v-4a1.334 1.334 0 0 0-1.334-1.334z" />
          </svg>
          Google Play
        </button>
      )}
      {iosUrl && (
        <button
          onClick={() => handleClick('ios', iosUrl)}
          className="inline-flex items-center gap-2.5 h-12 px-5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
          style={btnStyle}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          App Store
        </button>
      )}
    </div>
  );
}
