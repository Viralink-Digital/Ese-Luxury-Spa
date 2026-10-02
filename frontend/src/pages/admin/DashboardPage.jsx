// src/pages/admin/DashboardPage.jsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  TrendingUp, ShoppingCart, Users, Package, Star,
  ArrowUpRight, ArrowDownRight, Eye, ChevronRight,
} from 'lucide-react';
import { adminApi } from '@/lib/api';
import ApiImage from '@/components/ui/ApiImage';

const PERIODS = [
  { label: '7 Days', value: '7d' },
  { label: '30 Days', value: '30d' },
  { label: '90 Days', value: '90d' },
];

const STATUS_COLORS = {
  PENDING: '#f59e0b',
  CONFIRMED: '#3b82f6',
  PROCESSING: '#8b5cf6',
  SHIPPED: '#06b6d4',
  DELIVERED: '#10b981',
  CANCELLED: '#ef4444',
  REFUNDED: '#f97316',
};

export default function AdminDashboard() {
  const [period, setPeriod] = useState('30d');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard', period],
    queryFn: () => adminApi.dashboard({ period }),
    select: (r) => r.data.data,
    refetchInterval: 60000,
  });

  const StatCard = ({ icon: Icon, title, value, sub, trend, color = '#B76E79' }) => (
    <div className="stat-card">
      <div className="stat-card__header">
        <div className="stat-card__icon" style={{ background: color + '18', color }}>
          <Icon size={20} />
        </div>
        {trend !== undefined && (
          <div className={`stat-card__trend ${trend >= 0 ? 'stat-card__trend--up' : 'stat-card__trend--down'}`}>
            {trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="stat-card__value">
        {isLoading ? <div className="skeleton-line" style={{ width: 80, height: 28 }} /> : value}
      </div>
      <div className="stat-card__title">{title}</div>
      {sub && <div className="stat-card__sub">{sub}</div>}
    </div>
  );

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Dashboard</h1>
          <p className="admin-page__sub">Welcome back! Here's what's happening.</p>
        </div>
        <div className="period-selector">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              className={`period-btn ${period === p.value ? 'period-btn--active' : ''}`}
              onClick={() => setPeriod(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard
          icon={ShoppingCart}
          title="Total Orders"
          value={data?.stats?.totalOrders?.toLocaleString() || '—'}
          sub={`${data?.stats?.totalOrders || 0} in period`}
          color="#B76E79"
        />
        <StatCard
          icon={TrendingUp}
          title="Revenue"
          value={`₵${parseFloat(data?.stats?.totalRevenue || 0).toLocaleString()}`}
          sub="From paid orders"
          color="#10b981"
        />
        <StatCard
          icon={Users}
          title="New Customers"
          value={data?.stats?.newCustomers?.toLocaleString() || '—'}
          sub="Registered in period"
          color="#3b82f6"
        />
        <StatCard
          icon={Package}
          title="Total Products"
          value={data?.stats?.totalProducts?.toLocaleString() || '—'}
          sub="Active listings"
          color="#8b5cf6"
        />
        <StatCard
          icon={Star}
          title="Pending Reviews"
          value={data?.stats?.pendingReviews?.toLocaleString() || '—'}
          sub="Awaiting moderation"
          color="#f59e0b"
        />
      </div>

      {/* Revenue Chart */}
      <div className="dashboard-row">
        <div className="dashboard-card dashboard-card--wide">
          <div className="dashboard-card__header">
            <h3>Revenue Over Time</h3>
            <Link to="/admin/orders" className="dashboard-card__link">View Orders <ChevronRight size={14} /></Link>
          </div>
          <div className="revenue-chart">
            {data?.revenueByDay?.length > 0 ? (
              <MiniBarChart data={data.revenueByDay} />
            ) : (
              <div className="chart-empty">No revenue data for this period</div>
            )}
          </div>
        </div>

        {/* Orders By Status */}
        <div className="dashboard-card">
          <div className="dashboard-card__header">
            <h3>Orders by Status</h3>
          </div>
          <div className="status-breakdown">
            {data?.ordersByStatus?.map(({ status, _count }) => (
              <div key={status} className="status-bar">
                <div className="status-bar__label">
                  <span className="status-dot" style={{ background: STATUS_COLORS[status] }} />
                  <span>{status}</span>
                </div>
                <div className="status-bar__track">
                  <div
                    className="status-bar__fill"
                    style={{
                      width: `${Math.round((_count / (data?.stats?.totalOrders || 1)) * 100)}%`,
                      background: STATUS_COLORS[status],
                    }}
                  />
                </div>
                <span className="status-bar__count">{_count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="dashboard-row">
        {/* Recent Orders */}
        <div className="dashboard-card dashboard-card--wide">
          <div className="dashboard-card__header">
            <h3>Recent Orders</h3>
            <Link to="/admin/orders" className="dashboard-card__link">View All <ChevronRight size={14} /></Link>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array(5).fill(0).map((_, i) => (
                    <tr key={i}>
                      {Array(6).fill(0).map((_, j) => (
                        <td key={j}><div className="skeleton-line" style={{ height: 14 }} /></td>
                      ))}
                    </tr>
                  ))
                  : data?.recentOrders?.map((order) => (
                    <tr key={order.id}>
                      <td className="admin-table__order-num">{order.orderNumber}</td>
                      <td>{order.user?.firstName} {order.user?.lastName}</td>
                      <td>GH₵{parseFloat(order.total).toLocaleString()}</td>
                      <td>
                        <span className="order-status-badge" style={{ background: STATUS_COLORS[order.status] + '22', color: STATUS_COLORS[order.status] }}>
                          {order.status}
                        </span>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Link to={`/admin/orders/${order.id}`} className="admin-table__action">
                          <Eye size={14} />
                        </Link>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="dashboard-card">
          <div className="dashboard-card__header">
            <h3>Top Products</h3>
            <Link to="/admin/products" className="dashboard-card__link">View All <ChevronRight size={14} /></Link>
          </div>
          <div className="top-products">
            {data?.topProducts?.map((p, i) => (
              <div key={p.id} className="top-product-item">
                <span className="top-product-rank">#{i + 1}</span>
                <ApiImage
                  src={p.images?.[0]?.url}
                  alt={p.name}
                  className="top-product-img"
                />
                <div className="top-product-info">
                  <p className="top-product-name">{p.name}</p>
                  <p className="top-product-sold">{p.totalSold} sold</p>
                </div>
                <span className="top-product-price">GH₵{parseFloat(p.basePrice).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniBarChart({ data }) {
  const maxRevenue = Math.max(...data.map((d) => parseFloat(d.revenue || 0)));
  return (
    <div className="bar-chart">
      {data.slice(-14).map((d, i) => {
        const height = maxRevenue > 0 ? (parseFloat(d.revenue) / maxRevenue) * 100 : 0;
        return (
          <div key={i} className="bar-chart__col" title={`GH₵${parseFloat(d.revenue).toLocaleString()} on ${d.date}`}>
            <div className="bar-chart__bar" style={{ height: `${height}%` }} />
            <span className="bar-chart__label">
              {new Date(d.date).toLocaleDateString('en', { day: 'numeric' })}
            </span>
          </div>
        );
      })}
    </div>
  );
}
