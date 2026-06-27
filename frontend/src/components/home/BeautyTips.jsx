// src/components/home/BeautyTips.jsx
import { Link } from 'react-router-dom';
import { ChevronRight, Clock, Tag } from 'lucide-react';
import aboutUsImage from '@/styles/about us image.jpg';

const TIPS = [
  {
    id: '1',
    category: 'Skincare',
    title: 'The Ultimate Morning Skincare Routine for Glowing Skin',
    excerpt: 'Start your day right with these 5 essential steps that will transform your complexion and give you that enviable glow.',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=250&fit=crop',
    readTime: '5 min read',
    href: '/blogs/morning-skincare-routine',
  },
  {
    id: '2',
    category: 'Makeup',
    title: 'How to Choose the Right Foundation for Your Skin Tone',
    excerpt: 'Finding your perfect foundation match can be tricky. Here\'s a foolproof guide to nailing your skin tone every single time.',
    image: aboutUsImage,
    readTime: '7 min read',
    href: '/blogs/foundation-guide',
  },
  {
    id: '3',
    category: 'Hair Care',
    title: 'Deep Conditioning Treatments That Actually Work',
    excerpt: 'Give your hair the love it deserves. These deep conditioning techniques will leave your locks silky smooth and manageable.',
    image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&h=250&fit=crop',
    readTime: '4 min read',
    href: '/blogs/deep-conditioning',
  },
];

export default function BeautyTips() {
  return (
    <section className="section beauty-tips">
      <div className="container">
        <div className="section-header">
          <div>
            <p className="section-eyebrow">From Our Experts</p>
            <h2 className="section-title">Beauty <em>Tips & Tricks</em></h2>
          </div>
          <Link to="/blogs" className="section-link">
            All Articles <ChevronRight size={16} />
          </Link>
        </div>

        <div className="beauty-tips__grid">
          {TIPS.map((tip, i) => (
            <Link key={tip.id} to={tip.href} className={`beauty-tip-card ${i === 0 ? 'beauty-tip-card--featured' : ''}`}>
              <div className="beauty-tip-card__img-wrap">
                <img src={tip.image} alt={tip.title} loading="lazy" />
                <span className="beauty-tip-card__category">
                  <Tag size={10} /> {tip.category}
                </span>
              </div>
              <div className="beauty-tip-card__body">
                <h3 className="beauty-tip-card__title">{tip.title}</h3>
                <p className="beauty-tip-card__excerpt">{tip.excerpt}</p>
                <div className="beauty-tip-card__meta">
                  <span><Clock size={12} /> {tip.readTime}</span>
                  <span className="beauty-tip-card__read-more">Read More <ChevronRight size={12} /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
