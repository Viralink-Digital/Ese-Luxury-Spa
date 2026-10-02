// src/components/layout/Navbar.jsx
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown, Instagram } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import { useUiStore } from '@/store/cart.store';
import { cmsApi } from '@/lib/api';
import ApiImage from '@/components/ui/ApiImage';


const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  {
    label: 'Skin Care',
    href: '/shop/skin-care',
    children: ['Serums', 'Moisturizers', 'Cleansers', 'Eye Care', 'Masks'],
  },
  {
    label: 'Makeup',
    href: '/shop/makeup',
    children: ['Foundation', 'Lipstick', 'Eyeshadow', 'Blush', 'Highlighter'],
  },
  { label: 'Hair Care', href: '/shop/hair-care' },
  { label: 'About Us', href: '/about' },
  { label: 'Blogs', href: '/blogs' },
];

export default function Navbar({ siteSettings = {} }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { isAuthenticated, user, isAdmin } = useAuthStore();
  const { count } = useCartStore();
  const { setCartOpen, setSearchOpen } = useUiStore();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: fetchedSiteSettings = {} } = useQuery({
    queryKey: ['site-settings'],
    queryFn: () => cmsApi.settings(),
    select: (r) => r.data?.data?.settings || {},
  });

  const settings = Object.keys(siteSettings).length ? siteSettings : fetchedSiteSettings;
  const logoUrl = settings.site_logo_url || '';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <span>Call Us: 0534533217 / 0500169264</span>
        <span className="announcement-center">
          Sign up and get <strong>20% OFF</strong> your first order.{' '}
          <Link to="/register" className="announcement-link">Sign up now</Link>
        </span>
        <div className="social-icons">
          <Instagram size={18} />
        </div>
      </div>

      {/* Main Nav */}
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="navbar__inner">
          {/* Logo */}
          <Link to="/" className="navbar__logo">
            {logoUrl ? (
              <ApiImage
                src={logoUrl}
                alt={settings.site_name || 'Ese Luxury Cosmetics'}
                className="logo-img"
                loading="eager"
                fetchpriority="high"
              />
            ) : (
              <div>
                <span className="logo-name">Ese Luxury</span>
                <span className="logo-sub">Cosmetics</span>
              </div>
            )}
          </Link>

          {/* Desktop Nav */}
          <div className="navbar__links">
            {NAV_LINKS.map((link) => (
              <div
                key={link.label}
                className="nav-item"
                onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={link.href}
                  className={`nav-link ${location.pathname === link.href ? 'nav-link--active' : ''}`}
                >
                  {link.label}
                  {link.children && <ChevronDown size={12} style={{ marginLeft: 3 }} />}
                </Link>
                {link.children && activeDropdown === link.label && (
                  <div className="dropdown">
                    {link.children.map((child) => (
                      <Link
                        key={child}
                        to={`/shop/${child.toLowerCase().replace(' ', '-')}`}
                        className="dropdown__item"
                      >
                        {child}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="navbar__actions">
            <button className="nav-icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search">
              <Search size={18} />
            </button>
            {isAuthenticated && (
              <Link to="/account/wishlist" className="nav-icon-btn" aria-label="Wishlist">
                <Heart size={18} />
              </Link>
            )}
            <button className="nav-icon-btn nav-icon-btn--cart" onClick={() => setCartOpen(true)} aria-label="Cart">
              <ShoppingBag size={18} />
              {count > 0 && <span className="cart-badge">{count}</span>}
            </button>
            {isAuthenticated ? (
              <div className="nav-item" style={{ position: 'relative' }}
                onMouseEnter={() => setActiveDropdown('user')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="nav-icon-btn user-avatar-btn" aria-label="Account">
                  {user?.avatar ? (
                    <ApiImage src={user.avatar} alt="" className="user-avatar" />
                  ) : (
                    <div className="user-avatar-initials">
                      {(user?.firstName?.[0] || 'U').toUpperCase()}
                    </div>
                  )}
                </button>
                {activeDropdown === 'user' && (
                  <div className="dropdown dropdown--right">
                    <div className="dropdown__header">
                      <span>{user?.firstName || 'My Account'}</span>
                      <small>{user?.phone}</small>
                    </div>
                    {[
                      { label: 'My Orders', href: '/account/orders' },
                      { label: 'Wishlist', href: '/account/wishlist' },
                      { label: 'Profile', href: '/account/profile' },
                      { label: 'Loyalty Points', href: '/account/loyalty' },
                      ...(isAdmin() ? [{ label: 'Admin Panel', href: '/admin' }] : []),
                    ].map((item) => (
                      <Link key={item.label} to={item.href} className="dropdown__item">{item.label}</Link>
                    ))}
                    <button
                      className="dropdown__item dropdown__item--danger"
                      onClick={() => { useAuthStore.getState().logout(); navigate('/'); }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="nav-icon-btn" aria-label="Login">
                <User size={18} />
              </Link>
            )}
            <button className="nav-icon-btn mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="mobile-menu">
          {NAV_LINKS.map((link) => (
            <Link key={link.label} to={link.href} className="mobile-menu__link">
              {link.label}
            </Link>
          ))}
          {!isAuthenticated && (
            <>
              <Link to="/login" className="mobile-menu__link">Login</Link>
              <Link to="/register" className="mobile-menu__btn">Register</Link>
            </>
          )}
        </div>
      )}
    </>
  );
}
