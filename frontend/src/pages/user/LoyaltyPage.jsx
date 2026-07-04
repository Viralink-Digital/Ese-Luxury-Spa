// src/pages/user/LoyaltyPage.jsx
import { useQuery } from '@tanstack/react-query';
import { Gift, Star, TrendingUp } from 'lucide-react';
import { userApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';

export default function LoyaltyPage() {
  const { user } = useAuthStore();
  const { data, isLoading } = useQuery({ queryKey: ['loyalty'], queryFn: () => userApi.loyalty(), select: (r) => r.data.data });
  return (
    <div className="user-page">
      <div className="container" style={{ maxWidth: 700 }}>
        <h1 className="user-page__title">Loyalty Points</h1>
        <div className="loyalty-hero">
          <div className="loyalty-hero__icon"><Star size={32} /></div>
          <div className="loyalty-hero__points">{data?.points?.toLocaleString() || 0}</div>
          <div className="loyalty-hero__label">Total Points</div>
          <div className="loyalty-hero__value">≈ ₵{((data?.points || 0) * 0.5).toLocaleString()} value</div>
        </div>
        <div className="loyalty-info">
          {[{ Icon: TrendingUp, title: 'Earn Points', desc: 'Get 1 point for every ₵1 spent on orders' }, { Icon: Gift, title: 'Redeem Points', desc: '2 points = ₵1 discount on your next order' }].map(({ Icon, title, desc }) => (
            <div key={title} className="loyalty-info-card"><div className="loyalty-info-icon"><Icon size={20} /></div><div><strong>{title}</strong><p>{desc}</p></div></div>
          ))}
        </div>
        {data?.logs?.length > 0 && (
          <div className="loyalty-history">
            <h3>Points History</h3>
            {data.logs.map((log) => (
              <div key={log.id} className="loyalty-log">
                <div><p className="loyalty-log__desc">{log.description}</p><p className="loyalty-log__date">{new Date(log.createdAt).toLocaleDateString()}</p></div>
                <span className={`loyalty-log__points ${log.points > 0 ? 'loyalty-log__points--earn' : 'loyalty-log__points--redeem'}`}>
                  {log.points > 0 ? '+' : ''}{log.points.toLocaleString()} pts
                </span>
              </div>
            ))}
          </div>
        )}
        <div className="loyalty-referral">
          <h3>Refer & Earn</h3>
          <p>Share your referral code and earn 500 points for each friend who signs up!</p>
          <div className="loyalty-referral__code">
            <span>{user?.referralCode || 'N/A'}</span>
            <button className="btn btn--outline btn--sm" onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/register?ref=${user?.referralCode}`); }}>Copy Link</button>
          </div>
        </div>
      </div>
    </div>
  );
}
