// src/components/home/HeroSection.jsx
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';

const FALLBACK_HERO = {
  title: 'Luxury Beauty',
  subtitle: 'Redefined For You',
  description: 'Discover premium cosmetic products crafted for the modern woman who deserves the very best.',
  badgeText: 'New Arrivals 2025',
  ctaLabel: 'Shop Now',
  ctaUrl: '/shop',
  image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=700&h=800&fit=crop&crop=face,top',
};

export default function HeroSection({ heroBanner, siteSettings = {} }) {
  const data = heroBanner || FALLBACK_HERO;

  return (
    <section className="hero hero--background">
      <div className="hero__inner">
        {/* Content */}
        <div className="hero__content">
          {/* {data.badgeText && (
            <div className="hero__badge">
              {data.badgeText}
            </div>
          )} */}
          <h1 className="hero__title">
            {data.title}
            {data.subtitle && <><br /><em>{data.subtitle}</em></>}
          </h1>
          {data.description && <p className="hero__desc">{data.description}</p>}

          <div className="hero__ctas">
            <Link to={data.ctaUrl || '/shop'} className="btn btn--primary btn--lg">
              {data.ctaLabel || 'Shop Now'} <ArrowRight size={18} />
            </Link>
            <Link to="/about" className="btn btn--ghost btn--lg">
              Our Story <ChevronRight size={18} />
            </Link>
          </div>

          <div className="hero__stats">
            {[['2500+', 'Products'], ['50K+', 'Happy Clients'], ['99%', 'Authentic']].map(([n, l]) => (
              <div key={l} className="hero__stat">
                <span className="hero__stat-num">{n}</span>
                <span className="hero__stat-label">{l}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Scroll indicator */}
      <div className="hero__scroll">
        <div className="hero__scroll-dot" />
      </div>
    </section>
  );
}
