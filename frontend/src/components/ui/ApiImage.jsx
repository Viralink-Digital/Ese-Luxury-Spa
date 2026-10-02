import { getImageUrl } from '@/lib/image';

const FALLBACK_IMAGE = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#f5f2f0"/><path d="M20 72 42 45l13 15 10-12 18 24z" fill="#d8c8c4"/><circle cx="65" cy="34" r="7" fill="#d8c8c4"/></svg>'
)}`;

export default function ApiImage({ src, onError, ...props }) {
  const handleError = (event) => {
    if (event.currentTarget.dataset.fallbackApplied !== 'true') {
      event.currentTarget.dataset.fallbackApplied = 'true';
      event.currentTarget.src = FALLBACK_IMAGE;
    }

    onError?.(event);
  };

  return (
    <img
      {...props}
      src={getImageUrl(src) || FALLBACK_IMAGE}
      onError={handleError}
    />
  );
}