// src/pages/AboutPage.jsx
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Shield, Star, Leaf } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="container">
          <div className="about-hero__inner">
            <div className="about-hero__content">
              <p className="section-eyebrow">Our Story</p>
              <h1 className="about-hero__title">Born from a Passion <br />for <em>Luxury Beauty</em></h1>
              <p className="about-hero__desc">
                Ese Luxury Cosmetics was founded with a singular vision: to bring world-class beauty
                products to every Nigerian woman who deserves to feel extraordinary. We believe luxury
                should be accessible, authentic, and transformative.
              </p>
              <Link to="/shop" className="btn btn--primary">Explore Our Collection <ArrowRight size={16} /></Link>
            </div>
            <div className="about-hero__image">
              <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&h=600&fit=crop" alt="About Ese Luxury" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container">
          <div className="section-header section-header--center">
            <h2 className="section-title">Our <em>Core Values</em></h2>
          </div>
          <div className="values-grid">
            {[
              { Icon: Heart, title: 'Customer First', desc: 'Every decision we make starts with our customers. Your satisfaction is our ultimate goal.' },
              { Icon: Shield, title: '100% Authentic', desc: 'We source only genuine luxury products, verified for quality and authenticity.' },
              { Icon: Star, title: 'Premium Quality', desc: 'Only the finest formulations make it onto our shelves. We never compromise on quality.' },
              { Icon: Leaf, title: 'Conscious Beauty', desc: 'We\'re committed to offering more eco-friendly and cruelty-free options across our range.' },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="value-card">
                <div className="value-card__icon"><Icon size={24} /></div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="about-stats">
        <div className="container">
          <div className="about-stats__grid">
            {[['2019', 'Founded'], ['50,000+', 'Happy Customers'], ['2,500+', 'Products'], ['99%', 'Satisfaction Rate']].map(([n, l]) => (
              <div key={l} className="about-stat-card">
                <span className="about-stat-card__num">{n}</span>
                <span className="about-stat-card__label">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
