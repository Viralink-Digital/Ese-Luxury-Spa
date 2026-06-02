// src/pages/admin/InventoryPage.jsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, AlertTriangle, Save } from 'lucide-react';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminInventoryPage() {
  const [search, setSearch] = useState('');
  const [lowStock, setLowStock] = useState(false);
  const [editing, setEditing] = useState({});
  const qc = useQueryClient();

  const { data: variants, isLoading } = useQuery({
    queryKey: ['inventory', lowStock],
    queryFn: () => adminApi.inventory({ lowStock: lowStock ? 'true' : undefined }),
    select: (r) => r.data.data.variants,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, stockQty }) => adminApi.updateInventory(id, { stockQty }),
    onSuccess: () => { toast.success('Stock updated'); qc.invalidateQueries(['inventory']); setEditing({}); },
    onError: () => toast.error('Update failed'),
  });

  const filtered = variants?.filter((v) => !search || v.product?.name?.toLowerCase().includes(search.toLowerCase()) || v.value?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Inventory</h1>
          <p className="admin-page__sub">Manage product stock levels</p>
        </div>
      </div>
      <div className="admin-filters">
        <div className="admin-search">
          <Search size={15} className="admin-search__icon" />
          <input type="text" placeholder="Search products..." className="admin-search__input" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <label className="form-toggle" style={{ margin: 0 }}>
          <input type="checkbox" checked={lowStock} onChange={(e) => setLowStock(e.target.checked)} />
          <span className="form-toggle__track" />
          <span className="form-toggle__label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><AlertTriangle size={14} style={{ color: '#f59e0b' }} /> Low Stock Only</span>
        </label>
      </div>
      <div className="admin-table-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Product</th><th>Variant</th><th>Type</th><th>SKU</th><th>Stock</th><th>Actions</th></tr></thead>
            <tbody>
              {isLoading
                ? Array(10).fill(0).map((_, i) => <tr key={i}>{Array(6).fill(0).map((_, j) => <td key={j}><div className="skeleton-line" style={{ height: 14 }} /></td>)}</tr>)
                : filtered?.map((v) => (
                  <tr key={v.id} className={v.stockQty <= 5 ? 'table-row--warning' : v.stockQty <= 10 ? 'table-row--caution' : ''}>
                    <td><div className="admin-product-name">{v.product?.name}</div></td>
                    <td>{v.value}</td>
                    <td>{v.type}</td>
                    <td className="mono">{v.sku || '—'}</td>
                    <td>
                      {editing[v.id] !== undefined ? (
                        <input
                          type="number"
                          className="form-input form-input--sm"
                          style={{ width: 80 }}
                          value={editing[v.id]}
                          onChange={(e) => setEditing((s) => ({ ...s, [v.id]: parseInt(e.target.value) || 0 }))}
                          autoFocus
                        />
                      ) : (
                        <span
                          className={`stock-badge ${v.stockQty === 0 ? 'stock-badge--oos' : v.stockQty <= 5 ? 'stock-badge--critical' : v.stockQty <= 10 ? 'stock-badge--low' : 'stock-badge--ok'}`}
                          onClick={() => setEditing({ [v.id]: v.stockQty })}
                          style={{ cursor: 'pointer' }}
                          title="Click to edit"
                        >
                          {v.stockQty === 0 ? 'Out of Stock' : `${v.stockQty} units`}
                        </span>
                      )}
                    </td>
                    <td>
                      {editing[v.id] !== undefined ? (
                        <div className="admin-actions">
                          <button className="admin-action-btn admin-action-btn--edit" onClick={() => updateMutation.mutate({ id: v.id, stockQty: editing[v.id] })}><Save size={14} /></button>
                          <button className="admin-action-btn" onClick={() => setEditing({})}>✕</button>
                        </div>
                      ) : (
                        <button className="admin-action-btn admin-action-btn--edit" onClick={() => setEditing({ [v.id]: v.stockQty })}>Edit</button>
                      )}
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
