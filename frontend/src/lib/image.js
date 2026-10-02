const API_URL = import.meta.env.VITE_API_URL;

export function getImageUrl(imagePath) {
  if (typeof imagePath !== 'string' || !imagePath.trim()) return '';

  if (/^https?:\/\//i.test(imagePath)) return imagePath;
  if (!API_URL) return import.meta.env.DEV ? imagePath : '';

  const backendUrl = API_URL.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');
  return `${backendUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
}