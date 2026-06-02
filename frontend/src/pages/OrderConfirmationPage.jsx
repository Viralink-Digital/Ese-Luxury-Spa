// src/pages/OrderConfirmationPage.jsx
import { useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { CheckCircle, Package, ArrowRight, Loader2 } from 'lucide-react';
import { orderApi } from '@/lib/api';

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');

  // Verify payment if reference present
  const { data: verifyData, isLoading: verifying } = useQuery({
    queryKey: ['verify-payment', reference],
    queryFn: () => orderApi.verify(reference),
    enabled: !!reference,
    select: (r) => r.data.data,
  });

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderApi.get(id),
    enabled: !!id,
    select: (r) => r.data.data.order,
  });

  if (isLoading || verifying) {
    return (
      <div className="confirmation-page">
        <div className="container">
          <div className="confirmation-loading">
            <Loader2 size={40} className="spin" />
            <p>Processing your order…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="confirmation-page">
      <div className="container" style={{ maxWidth: 600 }}>
        <div className="confirmation-card">
          <div className="confirmation-icon">
            <CheckCircle size={64} className="confirmation-check" />
          </div>
          <h1 className="confirmation-title">Order Confirmed! 🎉</h1>
          <p className="confirmation-sub">
            Thank you for shopping with Ese Luxury Cosmetics!<br />
            Your order has been placed successfully.
          </p>

          {order && (
            <div className="confirmation-details">
              <div className="confirmation-row">
                <span>Order Number</span>
                <strong>{order.orderNumber}</strong>
              </div>
              <div className="confirmation-row">
                <span>Total Amount</span>
                <strong>GH₵{parseFloat(order.total).toLocaleString()}</strong>
              </div>
              <div className="confirmation-row">
                <span>Payment Status</span>
                <span className={`badge badge--${order.paymentStatus === 'PAID' ? 'green' : 'yellow'}`}>
                  {order.paymentStatus}
                </span>
              </div>
              <div className="confirmation-row">
                <span>Order Status</span>
                <span className="badge badge--blue">{order.status}</span>
              </div>
            </div>
          )}

          <div className="confirmation-info">
            <Package size={18} />
            <p>We'll send you an SMS update when your order ships. Expected delivery: 3–5 business days.</p>
          </div>

          <div className="confirmation-actions">
            <Link to={`/account/orders/${id}`} className="btn btn--primary">
              Track Order <ArrowRight size={16} />
            </Link>
            <Link to="/shop" className="btn btn--outline">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
