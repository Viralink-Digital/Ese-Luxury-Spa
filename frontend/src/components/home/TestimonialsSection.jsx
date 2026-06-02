// src/components/home/TestimonialsSection.jsx
import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const FALLBACK_TESTIMONIALS = [
  { id: '1', name: 'Amaka Okonkwo', location: 'Lagos', rating: 5, body: 'Ese Luxury has completely transformed my skincare routine! The Rose Glow Serum is absolutely divine — my skin has never looked better. The packaging is so elegant too. Truly a luxury experience from start to finish!' },
  { id: '2', name: 'Chidinma Eze', location: 'Abuja', rating: 5, body: 'I\'ve been searching for quality luxury cosmetics that actually work for Nigerian skin tones and Ese Luxury delivers every time. The customer service is outstanding and delivery is always on time.' },
  { id: '3', name: 'Ngozi Adeleke', location: 'Port Harcourt', rating: 5, body: 'Finally a luxury beauty brand that understands us! The Velvet Lip Collection is my absolute favourite. I wear it every day and get so many compliments. Worth every kobo!' },
  { id: '4', name: 'Fatima Bello', location: 'Kano', rating: 5, body: 'The Body Butter left my skin so soft and glowing. I ordered on Monday and it arrived Wednesday — so fast! Will definitely be a returning customer. Highly recommend to everyone!' },
];

export default function TestimonialsSection({ testimonials }) {
  const [current, setCurrent] = useState(0);
  const data = testimonials?.length ? testimonials : FALLBACK_TESTIMONIALS;
  const prev = () => setCurrent((c) => (c === 0 ? data.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === data.length - 1 ? 0 : c + 1));

  return (
    <section className="section testimonials-section">
      <div className="container">
        <div className="section-header section-header--center">
          <p className="section-eyebrow">What Our Customers Say</p>
          <h2 className="section-title">Real Stories, <em>Real Beauty</em></h2>
        </div>

        <div className="testimonials-slider">
          <button className="testimonials-nav testimonials-nav--prev" onClick={prev} aria-label="Previous">
            <ChevronLeft size={20} />
          </button>

          <div className="testimonials-track">
            {data.map((t, i) => (
              <div
                key={t.id}
                className={`testimonial-card ${i === current ? 'testimonial-card--active' : i === (current + 1) % data.length ? 'testimonial-card--next' : ''}`}
                style={{ display: i === current ? 'flex' : 'none' }}
              >
                <Quote size={32} className="testimonial-card__quote-icon" />
                <div className="testimonial-card__stars">
                  {Array(5).fill(0).map((_, si) => (
                    <Star key={si} size={16} fill={si < t.rating ? '#B76E79' : 'none'} stroke="#B76E79" />
                  ))}
                </div>
                <p className="testimonial-card__body">"{t.body}"</p>
                <div className="testimonial-card__author">
                  <div className="testimonial-card__avatar">
                    {t.avatar
                      ? <img src={t.avatar} alt={t.name} />
                      : <span>{t.name[0]}</span>
                    }
                  </div>
                  <div>
                    <div className="testimonial-card__name">{t.name}</div>
                    {t.location && <div className="testimonial-card__location">📍 {t.location}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="testimonials-nav testimonials-nav--next" onClick={next} aria-label="Next">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Dots */}
        <div className="testimonials-dots">
          {data.map((_, i) => (
            <button
              key={i}
              className={`testimonials-dot ${i === current ? 'testimonials-dot--active' : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
