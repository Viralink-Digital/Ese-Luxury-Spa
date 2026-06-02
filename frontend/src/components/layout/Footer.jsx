// src/components/layout/Footer.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter, Youtube, Send } from 'lucide-react';
import { cmsApi } from '@/lib/api';
import toast from 'react-hot-toast';

const FOOTER_LINKS = {
  'Quick Links': [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'About Us', href: '/about' },
    { label: 'Blogs', href: '/blogs' },
    { label: 'Contact Us', href: '/contact' },
  ],
  Categories: [
    { label: 'Skin Care', href: '/shop/skin-care' },
    { label: 'Makeup', href: '/shop/makeup' },
    { label: 'Hair Care', href: '/shop/hair-care' },
    { label: 'Fragrances', href: '/shop/fragrances' },
    { label: 'Nail Care', href: '/shop/nail-care' },
  ],
  Support: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Shipping Policy', href: '/shipping' },
    { label: 'Returns & Refunds', href: '/returns' },
    { label: 'Track Order', href: '/account/orders' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

const SOCIALS = [
  { Icon: Facebook, href: '#', label: 'Facebook' },
  { Icon: Instagram, href: '#', label: 'Instagram' },
  { Icon: Twitter, href: '#', label: 'Twitter' },
  { Icon: Youtube, href: '#', label: 'YouTube' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    try {
      await cmsApi.subscribe({ email });
      toast.success('Successfully subscribed!');
      setEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Subscription failed');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="footer">
      {/* Newsletter Strip */}
      <div className="footer__newsletter">
        <div className="container">
          <div className="footer__newsletter-inner">
            <div className="footer__newsletter-text">
              <h3>Join the Ese Beauty Circle</h3>
              <p>Exclusive offers, beauty tips & new launches delivered to your inbox.</p>
            </div>
            <form className="footer__newsletter-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="footer__newsletter-input"
                required
              />
              <button type="submit" className="footer__newsletter-btn" disabled={subscribing}>
                {subscribing ? 'Subscribing…' : <><Send size={16} /> Subscribe</>}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="footer__main">
        <div className="container">
          <div className="footer__grid">
            {/* Brand Column */}
            <div className="footer__brand">
              <Link to="/" className="footer__logo">
                <div className="footer__logo-mark">E</div>
                <div>
                  <div className="footer__logo-name">Ese Luxury Cosmetics</div>
                  <div className="footer__logo-tagline">Premium Beauty</div>
                </div>
              </Link>
              <p className="footer__brand-desc">
                Redefining beauty standards with premium luxury cosmetics curated for the modern
                woman who deserves the very best.
              </p>
              <div className="footer__contact">
                <div className="footer__contact-item">
                  <MapPin size={14} />
                  <span>Victoria Island, Lagos, Nigeria</span>
                </div>
                <div className="footer__contact-item">
                  <Phone size={14} />
                  <span>+233 800 ESE LUXE</span>
                </div>
                <div className="footer__contact-item">
                  <Mail size={14} />
                  <span>hello@eseluxury.com</span>
                </div>
              </div>
              <div className="footer__socials">
                {SOCIALS.map(({ Icon, href, label }) => (
                  <a key={label} href={href} className="footer__social" aria-label={label} target="_blank" rel="noopener noreferrer">
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div key={title} className="footer__col">
                <h4 className="footer__col-title">{title}</h4>
                <ul className="footer__col-list">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link to={link.href} className="footer__col-link">{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer__bottom">
        <div className="container">
          <div className="footer__bottom-inner">
            <p>© {new Date().getFullYear()} Ese Luxury Cosmetics. All rights reserved.</p>
            <p>Crafted with love in Nigeria 🇳🇬</p>
            <div className="footer__bottom-links">
              {['Privacy', 'Terms', 'Cookies'].map((l) => (
                <Link key={l} to={`/${l.toLowerCase()}`} className="footer__bottom-link">{l}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
