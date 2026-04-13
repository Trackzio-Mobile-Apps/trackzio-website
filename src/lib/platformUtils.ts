export function getPlatform(): 'ios' | 'android' | 'desktop' {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent || navigator.vendor || '';
  if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
  if (/android/i.test(ua)) return 'android';
  return 'desktop';
}

export function getDownloadUrl(iosUrl: string | null, androidUrl: string | null): string | null {
  const platform = getPlatform();
  if (platform === 'ios' && iosUrl) return iosUrl;
  if (platform === 'android' && androidUrl) return androidUrl;
  // Fallback: prefer android
  return androidUrl || iosUrl;
}
