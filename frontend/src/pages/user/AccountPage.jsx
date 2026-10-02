// src/pages/user/AccountPage.jsx
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ShoppingBag, Heart, MapPin, Star, Gift, User, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { userApi } from '@/lib/api';
import ApiImage from '@/components/ui/ApiImage';

export default function AccountPage() {
  const { user } = useAuthStore();
  const { data: profile } = useQuery({ queryKey: ['profile'], queryFn: () => userApi.profile(), select: (r) => r.data.data.user });

  const MENU_ITEMS = [
    { icon: ShoppingBag, label: 'My Orders', sub: `${profile?._count?.orders || 0} orders`, href: '/account/orders' },
    { icon: Heart, label: 'Wishlist', sub: `${profile?._count?.wishlistItems || 0} items`, href: '/account/wishlist' },
    { icon: MapPin, label: 'Addresses', sub: 'Manage delivery addresses', href: '/account/addresses' },
    { icon: Gift, label: 'Loyalty Points', sub: `${profile?.loyaltyPoints?.toLocaleString() || 0} points`, href: '/account/loyalty' },
    { icon: User, label: 'Profile Settings', sub: 'Update your information', href: '/account/profile' },
  ];

  return (
    <div className="account-page">
      <div className="container">
        <div className="account-header">
          <div className="account-avatar">
            {user?.avatar
              ? <ApiImage src={user.avatar} alt="avatar" />
              : <span>{(user?.firstName?.[0] || 'U').toUpperCase()}</span>
            }
          </div>
          <div>
            <h1>Welcome, {user?.firstName || 'Customer'}!</h1>
            <p>{user?.phone}</p>
          </div>
        </div>
        <div className="account-menu">
          {MENU_ITEMS.map(({ icon: Icon, label, sub, href }) => (
            <Link key={href} to={href} className="account-menu-item">
              <div className="account-menu-item__icon"><Icon size={20} /></div>
              <div className="account-menu-item__info"><span className="account-menu-item__label">{label}</span><span className="account-menu-item__sub">{sub}</span></div>
              <ChevronRight size={16} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
