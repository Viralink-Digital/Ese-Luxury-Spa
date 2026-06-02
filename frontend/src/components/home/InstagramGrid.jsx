// src/components/home/InstagramGrid.jsx
import { Instagram } from 'lucide-react';

const IG_PHOTOS = [
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=250&h=250&fit=crop',
  'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=250&h=250&fit=crop',
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=250&h=250&fit=crop',
  'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=250&h=250&fit=crop',
  'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=250&h=250&fit=crop',
  'https://images.unsplash.com/photo-1554284126-aa88f22d8b74?w=250&h=250&fit=crop',
];

export default function InstagramGrid() {
  return (
    <section className="instagram-section">
      <div className="container">
        <div className="section-header section-header--center">
          <div className="instagram-handle">
            <Instagram size={18} />
            <span>@eseluxurycosmetics</span>
          </div>
          <h2 className="section-title">Follow Our <em>Beauty Journey</em></h2>
          <p className="section-sub">Tag us in your photos for a chance to be featured</p>
        </div>
        <div className="instagram-grid">
          {IG_PHOTOS.map((src, i) => (
            <a
              key={i}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="instagram-item"
            >
              <img src={src} alt={`Instagram post ${i + 1}`} loading="lazy" />
              <div className="instagram-item__overlay">
                <Instagram size={22} />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
