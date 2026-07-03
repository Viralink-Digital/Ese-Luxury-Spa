// src/pages/admin/OrderDetailPage.jsx
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Loader2, Package, MapPin, CreditCard, Clock } from 'lucide-react';
import { orderApi } from '@/lib/api';
import toast from 'react-hot-toast';

const STATUS_FLOW = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
const STATUS_COLORS = {
  PENDING: '#f59e0b', CONFIRMED: '#3b82f6', PROCESSING: '#8b5cf6',
  SHIPPED: '#06b6d4', DELIVERED: '#10b981', CANCELLED: '#ef4444',
};

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [note, setNote] = useState('');
  const [tracking, setTracking] = useState('');

  const { data: order, isLoading } = useQuery({
    queryKey: ['admin-order', id],
    queryFn: () => orderApi.get(id),
    select: (r) => r.data.data.order,
  });

  const updateMutation = useMutation({
    mutationFn: (data) => orderApi.updateStatus(id, data),
    onSuccess: () => {
      toast.success('Order status updated');
      queryClient.invalidateQueries(['admin-order', id]);
      setNote('');
      setTracking('');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Update failed'),
  });

  if (isLoading) return <div className="admin-page"><div className="skeleton-block" style={{ height: 300 }} /></div>;
  if (!order) return <div>Order not found</div>;

  const currentIdx = STATUS_FLOW.indexOf(order.status);

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/admin/orders" className="btn btn--ghost btn--sm"><ArrowLeft size={16} /></Link>
          <div>
            <h1 className="admin-page__title">Order {order.orderNumber}</h1>
            <p className="admin-page__sub">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
        </div>
        <span className="order-status-badge order-status-badge--lg" style={{ background: STATUS_COLORS[order.status] + '22', color: STATUS_COLORS[order.status] }}>
          {order.status}
        </span>
      </div>

      {/* Status Timeline */}
      {order.status !== 'CANCELLED' && order.status !== 'REFUNDED' && (
        <div className="order-timeline">
          {STATUS_FLOW.map((s, i) => (
            <div key={s} className={`timeline-step ${i <= currentIdx ? 'timeline-step--done' : ''} ${i === currentIdx ? 'timeline-step--current' : ''}`}>
              <div className="timeline-step__dot" style={{ background: i <= currentIdx ? STATUS_COLORS[s] : '#e5e7eb' }} />
              <span>{s}</span>
              {i < STATUS_FLOW.length - 1 && <div className={`timeline-step__line ${i < currentIdx ? 'timeline-step__line--done' : ''}`} />}
            </div>
          ))}
        </div>
      )}

      <div className="order-detail-grid">
        {/* Items */}
        <div className="admin-card">
          <h3 className="admin-card__title"><Package size={16} /> Order Items</h3>
          {order.items.map((item) => (
            <div key={item.id} className="order-item">
              <img src={item.image} alt={item.name} className="order-item__img" />
              <div className="order-item__info">
                <p className="order-item__name">{item.name}</p>
                <p className="order-item__meta">Qty: {item.quantity} × ₦{parseFloat(item.price).toLocaleString()}</p>
              </div>
              <span className="order-item__total">₦{parseFloat(item.total).toLocaleString()}</span>
            </div>
          ))}
          <div className="order-totals">
            <div className="order-total-row"><span>Subtotal</span><span>₦{parseFloat(order.subtotal).toLocaleString()}</span></div>
            {parseFloat(order.discount) > 0 && <div className="order-total-row order-total-row--discount"><span>Discount</span><span>-₦{parseFloat(order.discount).toLocaleString()}</span></div>}
            <div className="order-total-row"><span>Shipping</span><span>₦{parseFloat(order.shippingFee).toLocaleString()}</span></div>
            <div className="order-total-row order-total-row--total"><span>Total</span><span>₦{parseFloat(order.total).toLocaleString()}</span></div>
          </div>
        </div>

        <div>
          {/* Customer */}
          <div className="admin-card">
            <h3 className="admin-card__title"><MapPin size={16} /> Shipping Address</h3>
            {order.address ? (
              <div className="order-address">
                <p><strong>{order.address.fullName}</strong></p>
                <p>{order.address.addressLine1}</p>
                {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
                <p>{order.address.city}, {order.address.state}</p>
                <p>{order.address.phone}</p>
              </div>
            ) : <p>No address on file</p>}
          </div>

          {/* Payment */}
          <div className="admin-card" style={{ marginTop: 16 }}>
            <h3 className="admin-card__title"><CreditCard size={16} /> Payment</h3>
            <div className="order-payment-info">
              <div className="order-payment-row"><span>Method</span><span>{order.paymentMethod || 'Korapay'}</span></div>
              <div className="order-payment-row"><span>Status</span>
                <span className={`badge badge--${order.paymentStatus === 'PAID' ? 'green' : 'yellow'}`}>{order.paymentStatus}</span>
              </div>
              {order.paymentRef && <div className="order-payment-row"><span>Reference</span><span className="mono">{order.paymentRef}</span></div>}
            </div>
          </div>

          {/* Update Status */}
          <div className="admin-card" style={{ marginTop: 16 }}>
            <h3 className="admin-card__title">Update Status</h3>
            <div className="form-group">
              <select
                className="form-input"
                defaultValue={order.status}
                id="new-status"
              >
                {[...STATUS_FLOW, 'CANCELLED', 'REFUNDED'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <input type="text" className="form-input" placeholder="Tracking number (optional)" value={tracking} onChange={(e) => setTracking(e.target.value)} />
            </div>
            <div className="form-group">
              <input type="text" className="form-input" placeholder="Internal note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
            <button
              className="btn btn--primary btn--full"
              onClick={() => {
                const sel = document.getElementById('new-status').value;
                updateMutation.mutate({ status: sel, note, trackingNumber: tracking });
              }}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? <Loader2 size={16} className="spin" /> : 'Update Order'}
            </button>
          </div>
        </div>
      </div>

      {/* Status History */}
      <div className="admin-card" style={{ marginTop: 24 }}>
        <h3 className="admin-card__title"><Clock size={16} /> Status History</h3>
        <div className="status-history">
          {order.statusHistory?.map((h) => (
            <div key={h.id} className="status-history-item">
              <div className="status-history-dot" style={{ background: STATUS_COLORS[h.status] || '#9ca3af' }} />
              <div>
                <span className="status-history-status">{h.status}</span>
                {h.note && <span className="status-history-note"> — {h.note}</span>}
              </div>
              <span className="status-history-date">{new Date(h.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
