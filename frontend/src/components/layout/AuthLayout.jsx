// src/components/layout/AuthLayout.jsx
import { Outlet, Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';

export default function AuthLayout() {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div className="auth-layout">
      <div className="auth-layout__brand">
        <div className="auth-brand-inner">
          <Link to="/" className="auth-logo">
            {/* <div className="auth-logo-mark">E</div> */}
            <div>
              {/* <div className="auth-logo-name">Ese Luxury</div>
              <div className="auth-logo-tagline">Cosmetics</div> */}
            </div>
          </Link>
          <h2 className="auth-brand-headline">Your Beauty Journey Starts Here</h2>
          <p className="auth-brand-sub">
            Discover premium luxury cosmetics curated for the modern woman.
            Glow with confidence, shop with trust.
          </p>
          <div className="auth-brand-stats">
            {[['2500+', 'Premium Products'], ['99%', 'Satisfied Clients'], ['24+', 'Categories']].map(([num, label]) => (
              <div key={label} className="auth-brand-stat">
                <span className="auth-brand-stat-num">{num}</span>
                <span className="auth-brand-stat-label">{label}</span>
              </div>
            ))}
          </div>
          {/* <img
            src="https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=500&h=600&fit=crop&crop=face,top"
            alt="Beauty model"
            className="auth-brand-img"
            loading="lazy"
          /> */}
        </div>
      </div>
      <div className="auth-layout__form">
        <div className="auth-form-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
