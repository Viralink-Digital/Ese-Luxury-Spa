// src/pages/admin/CustomersPage.jsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, UserCheck, UserX } from 'lucide-react';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminCustomersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-customers', page, search],
    queryFn: () => adminApi.customers({ page, limit: 20, search: search || undefined }),
    select: (r) => r.data.data,
    keepPreviousData: true,
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }) => adminApi.updateCustomerStatus(id, { isActive }),
    onSuccess: () => { toast.success('Customer status updated'); qc.invalidateQueries(['admin-customers']); },
  });

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">Customers</h1>
      </div>
      <div className="admin-filters">
        <div className="admin-search">
          <Search size={15} className="admin-search__icon" />
          <input type="text" placeholder="Search by name, phone, email..." className="admin-search__input" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
      </div>
      <div className="admin-table-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>Orders</th><th>Loyalty Pts</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {isLoading
                ? Array(10).fill(0).map((_, i) => <tr key={i}>{Array(8).fill(0).map((_, j) => <td key={j}><div className="skeleton-line" style={{ height: 14 }} /></td>)}</tr>)
                : data?.customers?.map((c) => (
                  <tr key={c.id}>
                    <td><div className="admin-user-cell"><div className="admin-user-avatar">{(c.firstName?.[0] || '?').toUpperCase()}</div><span>{c.firstName} {c.lastName}</span></div></td>
                    <td>{c.phone}</td>
                    <td>{c.email || '—'}</td>
                    <td>{c._count?.orders || 0}</td>
                    <td>{c.loyaltyPoints?.toLocaleString()}</td>
                    <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td><span className={`badge badge--${c.isActive ? 'green' : 'red'}`}>{c.isActive ? 'Active' : 'Suspended'}</span></td>
                    <td>
                      <button
                        className={`admin-action-btn ${c.isActive ? 'admin-action-btn--delete' : 'admin-action-btn--edit'}`}
                        onClick={() => toggleMutation.mutate({ id: c.id, isActive: !c.isActive })}
                        title={c.isActive ? 'Suspend' : 'Activate'}
                      >
                        {c.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                      </button>
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
