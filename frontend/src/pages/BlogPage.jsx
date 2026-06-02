// src/pages/BlogPage.jsx
import { Link } from 'react-router-dom';
import { Clock, Tag } from 'lucide-react';

const POSTS = [
  { id: '1', category: 'Skincare', title: 'The Ultimate Morning Skincare Routine', excerpt: 'Start your day right with these 5 essential steps that will transform your complexion.', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=250&fit=crop', readTime: '5 min', slug: 'morning-skincare-routine' },
  { id: '2', category: 'Makeup', title: 'How to Find Your Perfect Foundation Shade', excerpt: 'A foolproof guide to finding the foundation that matches your skin tone perfectly.', image: 'https://images.unsplash.com/photo-1583241800698-e8ab01830a74?w=400&h=250&fit=crop', readTime: '7 min', slug: 'foundation-guide' },
  { id: '3', category: 'Hair Care', title: 'Deep Conditioning Treatments That Work', excerpt: 'Give your hair the hydration it craves with these expert-approved techniques.', image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&h=250&fit=crop', readTime: '4 min', slug: 'deep-conditioning' },
  { id: '4', category: 'Lifestyle', title: '10 Beauty Hacks Every Woman Should Know', excerpt: 'Insider tips and tricks from professional makeup artists that will change your beauty game.', image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=250&fit=crop', readTime: '6 min', slug: 'beauty-hacks' },
  { id: '5', category: 'Skincare', title: 'Understanding Your Skin Type', excerpt: 'Learn how to identify your skin type and choose the right products for your unique needs.', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=250&fit=crop', readTime: '5 min', slug: 'skin-type-guide' },
  { id: '6', category: 'Fragrance', title: 'How to Layer Fragrances Like a Pro', excerpt: 'Create your unique signature scent by mastering the art of fragrance layering.', image: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&h=250&fit=crop', readTime: '3 min', slug: 'fragrance-layering' },
];

export default function BlogPage() {
  return (
    <div className="blog-page">
      <div className="blog-hero">
        <div className="container">
          <p className="section-eyebrow">Ese Beauty Journal</p>
          <h1 className="blog-hero__title">Beauty Tips, <em>Trends & Insights</em></h1>
          <p className="blog-hero__sub">Expert advice from beauty professionals to help you glow every day.</p>
        </div>
      </div>
      <div className="container section">
        <div className="blog-grid">
          {POSTS.map((post) => (
            <Link key={post.id} to={`/blogs/${post.slug}`} className="blog-card">
              <div className="blog-card__img-wrap">
                <img src={post.image} alt={post.title} loading="lazy" />
                <span className="blog-card__cat"><Tag size={11} /> {post.category}</span>
              </div>
              <div className="blog-card__body">
                <h3 className="blog-card__title">{post.title}</h3>
                <p className="blog-card__excerpt">{post.excerpt}</p>
                <div className="blog-card__meta"><Clock size={12} /> {post.readTime} read</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
