// src/pages/admin/OrdersPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Eye, Filter } from 'lucide-react';
import { orderApi } from '@/lib/api';

const STATUS_OPTS = ['', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];
const STATUS_COLORS = {
  PENDING: '#f59e0b', CONFIRMED: '#3b82f6', PROCESSING: '#8b5cf6',
  SHIPPED: '#06b6d4', DELIVERED: '#10b981', CANCELLED: '#ef4444', REFUNDED: '#f97316',
};

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', page, status, search],
    queryFn: () => orderApi.adminList({ page, limit: 20, status: status || undefined, search: search || undefined }),
    select: (r) => r.data.data,
    keepPreviousData: true,
  });

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Orders</h1>
          <p className="admin-page__sub">{data?.pagination?.total || 0} total orders</p>
        </div>
      </div>
      <div className="admin-filters">
        <div className="admin-search">
          <Search size={15} className="admin-search__icon" />
          <input type="text" placeholder="Order #, phone, name..." className="admin-search__input" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <select className="admin-select" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          {STATUS_OPTS.map((s) => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
        </select>
      </div>
      <div className="admin-table-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Order #</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {isLoading
                ? Array(10).fill(0).map((_, i) => <tr key={i}>{Array(8).fill(0).map((_, j) => <td key={j}><div className="skeleton-line" style={{ height: 14 }} /></td>)}</tr>)
                : data?.orders?.map((o) => (
                  <tr key={o.id}>
                    <td className="admin-table__order-num">{o.orderNumber}</td>
                    <td>
                      <div>{o.user?.firstName} {o.user?.lastName}</div>
                      <div className="admin-table__sub">{o.user?.phone}</div>
                    </td>
                    <td>{o.items?.length || 0} item(s)</td>
                    <td>GH₵{parseFloat(o.total).toLocaleString()}</td>
                    <td>
                      <span className={`badge badge--${o.paymentStatus === 'PAID' ? 'green' : o.paymentStatus === 'FAILED' ? 'red' : 'yellow'}`}>
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <span className="order-status-badge" style={{ background: STATUS_COLORS[o.status] + '22', color: STATUS_COLORS[o.status] }}>
                        {o.status}
                      </span>
                    </td>
                    <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Link to={`/admin/orders/${o.id}`} className="admin-action-btn"><Eye size={14} /></Link>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
