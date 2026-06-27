// src/pages/HomePage.jsx
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Star, Truck, Shield, RotateCcw, Headphones } from 'lucide-react';
import { productApi, categoryApi, cmsApi } from '@/lib/api';
import ProductCard from '@/components/shop/ProductCard';
import ProductCardSkeleton from '@/components/ui/ProductCardSkeleton';
import HeroSection from '@/components/home/HeroSection';
import CategoryBar from '@/components/home/CategoryBar';
import PromoBanners from '@/components/home/PromoBanners';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import InstagramGrid from '@/components/home/InstagramGrid';
import BeautyTips from '@/components/home/BeautyTips';
import aboutUsImage from '@/styles/about us image.jpg';
import ecoFriendlyImage from '@/styles/eco-friendly.jpg';
import pinkStampImage from '@/styles/pink-stamp.jpg';

const TRUST_BADGES = [
  { Icon: Truck, title: 'Free Delivery', sub: 'Orders over GH₵15,000' },
  { Icon: Shield, title: '100% Authentic', sub: 'Certified products only' },
  { Icon: RotateCcw, title: 'Easy Returns', sub: '14-day return policy' },
  { Icon: Headphones, title: '24/7 Support', sub: 'Always here for you' },
];

const HIGHLIGHT_CARDS = [
  { title: 'Curated Luxury Picks', sub: 'Hand-selected formulas and iconic beauty essentials.' },
  { title: 'Fast, Elegant Delivery', sub: 'Smooth checkout and trusted dispatch for every order.' },
  { title: 'Beauty Expert Favorites', sub: 'Trending products our customers revisit again and again.' },
];

export default function HomePage() {
  const { data: bestSellers, isLoading: bsLoading } = useQuery({
    queryKey: ['products', 'best-sellers'],
    queryFn: () => productApi.list({ bestSeller: true, limit: 4 }),
    select: (r) => r.data.data.products,
  });

  const { data: newArrivals, isLoading: naLoading } = useQuery({
    queryKey: ['products', 'new-arrivals'],
    queryFn: () => productApi.list({ newArrival: true, limit: 4 }),
    select: (r) => r.data.data.products,
  });

  const { data: featuredProducts, isLoading: fpLoading } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productApi.list({ featured: true, limit: 8 }),
    select: (r) => r.data.data.products,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.list(),
    select: (r) => r.data.data.categories,
  });

  const { data: banners } = useQuery({
    queryKey: ['banners'],
    queryFn: () => cmsApi.banners(),
    select: (r) => r.data.data.banners,
  });

  const { data: siteSettings = {} } = useQuery({
    queryKey: ['site-settings-home'],
    queryFn: () => cmsApi.settings(),
    select: (r) => r.data?.data?.settings || {},
  });

  const { data: testimonials } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => cmsApi.testimonials(),
    select: (r) => r.data.data.testimonials,
  });

  return (
    <div className="home-page">
      {/* Hero */}
      <HeroSection
        heroBanner={banners?.find((b) => b.position === 'HERO')}
        siteSettings={siteSettings}
      />

      {/* Category Bar */}
      <CategoryBar categories={categories} />

      {/* Highlights */}
      <section className="section section--tinted">
        <div className="container">
          <div className="section-header section-header--center">
            <div>
              <p className="section-eyebrow">Why customers love us</p>
              <h2 className="section-title">A polished shopping experience for every beauty ritual</h2>
              <p className="section-sub">Discover luxury essentials, trusted service, and a storefront designed to feel as elegant as the products themselves.</p>
            </div>
          </div>
          <div className="trust-grid">
            {HIGHLIGHT_CARDS.map(({ title, sub }) => (
              <article key={title} className="trust-item" style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
                <div className="trust-item__icon">
                  <Star size={18} />
                </div>
                <div>
                  <div className="trust-item__title">{title}</div>
                  <div className="trust-item__sub">{sub}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="trust-section">
        <div className="container">
          <div className="trust-grid">
            {TRUST_BADGES.map(({ Icon, title, sub }) => (
              <div key={title} className="trust-item">
                <div className="trust-item__icon">
                  <Icon size={22} />
                </div>
                <div>
                  <div className="trust-item__title">{title}</div>
                  <div className="trust-item__sub">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop By Category */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-eyebrow">Our Categories</p>
              <h2 className="section-title">Shop By <em>Category</em></h2>
              <p className="section-sub">Explore beauty collections arranged for quick browsing and easy discovery.</p>
            </div>
            <Link to="/shop" className="section-link" aria-label="View all categories">View All <ChevronRight size={16} /></Link>
          </div>
          <div className="category-grid">
            {(categories || Array(6).fill(null)).slice(0, 6).map((cat, i) => (
              cat ? (
                <Link key={cat.id} to={`/shop/${cat.slug}`} className="category-card">
                  <div className="category-card__img-wrap">
                    <img src={cat.image || `https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200&h=200&fit=crop&q=80`} alt={cat.name} loading="lazy" />
                  </div>
                  <div className="category-card__name">{cat.name}</div>
                  <div className="category-card__count">{cat._count?.products || 0} Products</div>
                </Link>
              ) : (
                <div key={i} className="category-card category-card--skeleton">
                  <div className="skeleton-circle" />
                  <div className="skeleton-line" style={{ width: 80, height: 14, margin: '8px auto 4px' }} />
                  <div className="skeleton-line" style={{ width: 60, height: 11 }} />
                </div>
              )
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banners */}
      <PromoBanners banners={banners} />

      {/* Best Sellers */}
      <section className="section section--tinted">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-eyebrow">Trending Now</p>
              <h2 className="section-title">Best <em>Sellers</em></h2>
              <p className="section-sub">Our most-loved essentials, chosen for glamour, quality, and repeat comfort.</p>
            </div>
            <Link to="/shop?bestSeller=true" className="section-link" aria-label="View all best sellers">View All <ChevronRight size={16} /></Link>
          </div>
          <div className="product-grid">
            {bsLoading
              ? Array(4).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
              : bestSellers?.map((p, i) => <ProductCard key={p.id} product={p} delay={i * 80} />)}
          </div>
        </div>
      </section>

      {/* About Banner */}
      <section className="about-strip">
        <div className="container">
          <div className="about-strip__inner">
            <div className="about-strip__images">
              {[aboutUsImage, ecoFriendlyImage, pinkStampImage, aboutUsImage].map((src, i) => (
                <img key={i} src={src} alt="" loading="lazy" className={`about-strip__img about-strip__img--${i}`} />
              ))}
              <div className="about-strip__badge">
                <span className="about-strip__badge-num">5★</span>
                <span className="about-strip__badge-label">Rated</span>
              </div>
            </div>
            <div className="about-strip__content">
              <p className="section-eyebrow">About Us</p>
              <h2 className="section-title">Your Journey to<br /><em>Effortless Elegance</em></h2>
              <p className="section-sub">A thoughtfully curated beauty destination built for confidence, glow, and repeat discovery.</p>
              <p className="about-strip__desc">
                Ese Luxury Cosmetics was born from a belief that every woman deserves to feel
                extraordinary. We curate only the finest luxury beauty products, combining
                world-class formulations with the elegance you deserve.
              </p>
              <div className="about-strip__stats">
                {[['24+', 'Categories'], ['2500+', 'Products'], ['99%', 'Satisfaction']].map(([n, l]) => (
                  <div key={l} className="about-stat">
                    <span className="about-stat__num">{n}</span>
                    <span className="about-stat__label">{l}</span>
                  </div>
                ))}
              </div>
              <Link to="/about" className="btn btn--primary">
                Discover Our Story <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-eyebrow">Fresh Drops</p>
              <h2 className="section-title">New <em>Arrivals</em></h2>
              <p className="section-sub">Fresh formulas and seasonal favorites landing in-store and online.</p>
            </div>
            <Link to="/shop?newArrival=true" className="section-link" aria-label="View all new arrivals">View All <ChevronRight size={16} /></Link>
          </div>
          <div className="product-grid">
            {naLoading
              ? Array(4).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
              : newArrivals?.map((p, i) => <ProductCard key={p.id} product={p} delay={i * 80} />)}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts?.length > 0 && (
        <section className="section section--tinted">
          <div className="container">
            <div className="section-header">
              <div>
                <p className="section-eyebrow">Handpicked For You</p>
                <h2 className="section-title">Featured <em>Products</em></h2>
                <p className="section-sub">A refined mix of editor picks, top-rated essentials, and customer favorites.</p>
              </div>
              <Link to="/shop?featured=true" className="section-link" aria-label="View all featured products">View All <ChevronRight size={16} /></Link>
            </div>
            <div className="product-grid product-grid--wide">
              {fpLoading
                ? Array(8).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
                : featuredProducts?.map((p, i) => <ProductCard key={p.id} product={p} delay={i * 60} />)}
            </div>
          </div>
        </section>
      )}

      {/* Beauty Tips */}
      <BeautyTips />

      {/* Testimonials */}
      <TestimonialsSection testimonials={testimonials} />

      {/* Instagram */}
      <InstagramGrid />
    </div>
  );
}
