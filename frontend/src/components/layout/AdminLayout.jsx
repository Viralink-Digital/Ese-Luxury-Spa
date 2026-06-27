// src/components/layout/AdminLayout.jsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag, Star,
  Image, Settings, LogOut, Menu, X, ChevronRight, Layers,
  Percent, Warehouse, TrendingUp,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { cmsApi } from '@/lib/api';
import NotificationPanel from '@/components/admin/NotificationPanel';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Package, label: 'Products', href: '/admin/products' },
  { icon: Warehouse, label: 'Inventory', href: '/admin/inventory' },
  { icon: Layers, label: 'Categories', href: '/admin/categories' },
  { icon: Tag, label: 'Brands', href: '/admin/brands' },
  { icon: ShoppingCart, label: 'Orders', href: '/admin/orders' },
  { icon: Users, label: 'Customers', href: '/admin/customers' },
  { icon: Percent, label: 'Coupons', href: '/admin/coupons' },
  { icon: Star, label: 'Reviews', href: '/admin/reviews' },
  { icon: Image, label: 'Banners', href: '/admin/banners' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const { data: siteSettings = {} } = useQuery({
    queryKey: ['site-settings'],
    queryFn: () => cmsApi.settings(),
    select: (res) => res.data?.data?.settings || {},
  });

  const handleLogout = () => { logout(); navigate('/'); };
  const logoUrl = siteSettings.site_logo_url || siteSettings.logo_url || '';
  const siteName = siteSettings.site_name || 'Ese Admin';

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar--open' : 'admin-sidebar--collapsed'}`}>
        <div className="admin-sidebar__header">
          <Link to="/admin" className="admin-sidebar__logo">
            {logoUrl ? (
              <img src={logoUrl} alt={siteName} className="admin-logo-image" />
            ) : (
              <div className="admin-logo-mark">E</div>
            )}
            {sidebarOpen && <span className="admin-logo-text">{siteName}</span>}
          </Link>
          <button className="admin-sidebar__toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="admin-sidebar__nav">
          {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
            const active = href === '/admin'
              ? location.pathname === '/admin'
              : location.pathname.startsWith(href);
            return (
              <Link
                key={href}
                to={href}
                className={`admin-nav-item ${active ? 'admin-nav-item--active' : ''}`}
                title={!sidebarOpen ? label : undefined}
              >
                <Icon size={18} className="admin-nav-icon" />
                {sidebarOpen && <span className="admin-nav-label">{label}</span>}
                {active && sidebarOpen && <ChevronRight size={14} className="admin-nav-arrow" />}
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar__footer">
          <Link to="/" className="admin-sidebar__view-site" title={!sidebarOpen ? 'View Site' : undefined}>
            <TrendingUp size={16} />
            {sidebarOpen && <span>View Site</span>}
          </Link>
          <button className="admin-sidebar__logout" onClick={handleLogout} title={!sidebarOpen ? 'Logout' : undefined}>
            <LogOut size={16} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`admin-content ${sidebarOpen ? 'admin-content--shifted' : ''}`}>
        {/* Top Bar */}
        <header className="admin-topbar">
          <div className="admin-topbar__left">
            <button className="admin-topbar__menu" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu size={20} />
            </button>
            <div className="admin-breadcrumb">
              {location.pathname.split('/').filter(Boolean).map((seg, i, arr) => (
                <span key={i} className="admin-breadcrumb__item">
                  {i > 0 && <ChevronRight size={12} />}
                  <span className={i === arr.length - 1 ? 'admin-breadcrumb__current' : 'admin-breadcrumb__link'}>
                    {seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' ')}
                  </span>
                </span>
              ))}
            </div>
          </div>
          <div className="admin-topbar__right">
            <NotificationPanel />
            <div className="admin-topbar__user">
              <div className="admin-topbar__avatar">
                {(user?.firstName?.[0] || 'A').toUpperCase()}
              </div>
              <div className="admin-topbar__user-info">
                <span className="admin-topbar__user-name">{user?.firstName || 'Admin'}</span> <br/>
                <span className="admin-topbar__user-role"> {user?.role}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
