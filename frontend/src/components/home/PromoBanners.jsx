// src/components/home/PromoBanners.jsx
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ApiImage from '@/components/ui/ApiImage';

const FALLBACK_BANNERS = [
  {
    id: '1',
    title: 'Glow Up Collection',
    subtitle: 'Radiant Skin Awaits',
    badgeText: 'Up to 30% Off',
    ctaLabel: 'Shop Skin Care',
    ctaUrl: '/shop/skin-care',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=360&fit=crop',
    theme: 'light',
  },
  {
    id: '2',
    title: 'Bold Lips',
    subtitle: 'Express Your Beauty',
    badgeText: 'New Shades',
    ctaLabel: 'Explore Makeup',
    ctaUrl: '/shop/makeup',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=360&fit=crop',
    theme: 'dark',
  },
];

export default function PromoBanners({ banners }) {
  const left = banners?.find((b) => b.position === 'PROMO_LEFT');
  const right = banners?.find((b) => b.position === 'PROMO_RIGHT');
  const displayBanners = [left || FALLBACK_BANNERS[0], right || FALLBACK_BANNERS[1]];

  return (
    <section className="promo-banners section">
      <div className="container">
        <div className="promo-banners__grid">
          {displayBanners.map((banner, i) => (
            <Link
              key={banner.id || i}
              to={banner.ctaUrl || '/shop'}
              className={`promo-banner promo-banner--${banner.theme || (i === 0 ? 'light' : 'dark')}`}
            >
              <ApiImage
                src={banner.image}
                alt={banner.title}
                className="promo-banner__img"
                loading="lazy"
              />
              <div className="promo-banner__overlay" />
              <div className="promo-banner__content">
                {banner.badgeText && (
                  <span className="promo-banner__badge">{banner.badgeText}</span>
                )}
                <h3 className="promo-banner__title">{banner.title}</h3>
                {banner.subtitle && (
                  <p className="promo-banner__sub">{banner.subtitle}</p>
                )}
                {banner.ctaLabel && (
                  <span className="promo-banner__cta">
                    {banner.ctaLabel} <ArrowRight size={14} />
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
