export const config = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1',
};

export function getApiOrigin() {
  try {
    return new URL(config.API_BASE_URL).origin;
  } catch {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return 'http://localhost:3000';
  }
}

export function toBackendUrl(url?: string | null) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;

  const origin = getApiOrigin();
  if (!origin) return url;

  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${origin}${cleanPath}`;
}
