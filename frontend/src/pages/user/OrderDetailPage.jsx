// src/pages/user/OrderDetailPage.jsx
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { orderApi } from '@/lib/api';
import toast from 'react-hot-toast';

const SC = { PENDING: '#f59e0b', CONFIRMED: '#3b82f6', SHIPPED: '#06b6d4', DELIVERED: '#10b981', CANCELLED: '#ef4444' };

export default function OrderDetailPage() {
  const { id } = useParams();
  const qc = useQueryClient();
  const { data: order, isLoading } = useQuery({ queryKey: ['order', id], queryFn: () => orderApi.get(id), select: (r) => r.data.data.order });
  const cancelMutation = useMutation({
    mutationFn: () => orderApi.cancel(id, { reason: 'Customer requested cancellation' }),
    onSuccess: () => { toast.success('Order cancelled'); qc.invalidateQueries(['order', id]); },
    onError: (e) => toast.error(e.response?.data?.message || 'Cannot cancel'),
  });
  if (isLoading) return <div className="user-page"><div className="container"><div className="skeleton-block" style={{ height: 300 }} /></div></div>;
  if (!order) return null;
  return (
    <div className="user-page">
      <div className="container" style={{ maxWidth: 750 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <Link to="/account/orders" className="btn btn--ghost btn--sm"><ArrowLeft size={16} /></Link>
          <h1 className="user-page__title" style={{ margin: 0 }}>Order {order.orderNumber}</h1>
        </div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center' }}>
          <span className="order-status-badge" style={{ background: SC[order.status] + '22', color: SC[order.status] }}>{order.status}</span>
          <span className={`badge badge--${order.paymentStatus === 'PAID' ? 'green' : 'yellow'}`}>{order.paymentStatus}</span>
          <span style={{ marginLeft: 'auto', fontSize: 13, color: '#888' }}>{new Date(order.createdAt).toLocaleString()}</span>
        </div>
        <div className="form-card" style={{ marginBottom: 16 }}>
          <h3 className="form-card__title">Items</h3>
          {order.items?.map((item) => (
            <div key={item.id} className="order-item">
              <img src={item.image} alt={item.name} className="order-item__img" />
              <div className="order-item__info"><p className="order-item__name">{item.name}</p><p className="order-item__meta">Qty: {item.quantity}</p></div>
              <span className="order-item__total">₵{parseFloat(item.total).toLocaleString()}</span>
            </div>
          ))}
          <div className="order-totals">
            <div className="order-total-row"><span>Subtotal</span><span>₵{parseFloat(order.subtotal).toLocaleString()}</span></div>
            {parseFloat(order.discount) > 0 && <div className="order-total-row order-total-row--discount"><span>Discount</span><span>-₵{parseFloat(order.discount).toLocaleString()}</span></div>}
            <div className="order-total-row"><span>Shipping</span><span>₵{parseFloat(order.shippingFee).toLocaleString()}</span></div>
            <div className="order-total-row order-total-row--total"><span>Total</span><span>₵{parseFloat(order.total).toLocaleString()}</span></div>
          </div>
        </div>
        {order.trackingNumber && (
          <div className="form-card" style={{ marginBottom: 16 }}>
            <h3 className="form-card__title">Tracking</h3>
            <p>Tracking #: <strong>{order.trackingNumber}</strong>{order.shippingCarrier ? ` via ${order.shippingCarrier}` : ''}</p>
          </div>
        )}
        {['PENDING', 'CONFIRMED'].includes(order.status) && (
          <button className="btn btn--outline btn--danger" onClick={() => cancelMutation.mutate()} disabled={cancelMutation.isPending}>
            {cancelMutation.isPending ? <Loader2 size={16} className="spin" /> : 'Cancel Order'}
          </button>
        )}
      </div>
    </div>
  );
}
