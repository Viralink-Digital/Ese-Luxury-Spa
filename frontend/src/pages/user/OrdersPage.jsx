// src/pages/user/OrdersPage.jsx
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';
import { orderApi } from '@/lib/api';

const STATUS_COLORS = { PENDING: '#f59e0b', CONFIRMED: '#3b82f6', PROCESSING: '#8b5cf6', SHIPPED: '#06b6d4', DELIVERED: '#10b981', CANCELLED: '#ef4444' };

export default function OrdersPage() {
  const { data, isLoading } = useQuery({ queryKey: ['orders'], queryFn: () => orderApi.list({ limit: 20 }), select: (r) => r.data.data });

  return (
    <div className="user-page">
      <div className="container" style={{ maxWidth: 800 }}>
        <h1 className="user-page__title">My Orders</h1>
        {isLoading ? (
          <div>{Array(4).fill(0).map((_, i) => <div key={i} className="skeleton-block" style={{ height: 100, marginBottom: 12, borderRadius: 12 }} />)}</div>
        ) : data?.orders?.length === 0 ? (
          <div className="user-empty"><Package size={48} /><h3>No orders yet</h3><p>Your orders will appear here once you make a purchase.</p><Link to="/shop" className="btn btn--primary">Start Shopping</Link></div>
        ) : (
          data?.orders?.map((o) => (
            <Link key={o.id} to={`/account/orders/${o.id}`} className="order-card">
              <div className="order-card__header">
                <span className="order-card__number">{o.orderNumber}</span>
                <span className="order-status-badge" style={{ background: STATUS_COLORS[o.status] + '22', color: STATUS_COLORS[o.status] }}>{o.status}</span>
              </div>
              <div className="order-card__items">
                {o.items?.slice(0, 3).map((item, i) => (
                  <div key={i} className="order-card__item">
                    <img src={item.image} alt={item.name} className="order-card__item-img" />
                    <span>{item.name}</span>
                  </div>
                ))}
                {o.items?.length > 3 && <span className="order-card__more">+{o.items.length - 3} more</span>}
              </div>
              <div className="order-card__footer">
                <span>GH₵{parseFloat(o.total).toLocaleString()}</span>
                <span>{new Date(o.createdAt).toLocaleDateString()}</span>
                <ChevronRight size={16} />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
