// src/pages/admin/CouponsPage.jsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { couponApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminCouponsPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ code: '', type: 'PERCENTAGE', value: '', minOrderAmount: '', maxUses: '', perUserLimit: 1, isActive: true });
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const { data: coupons, isLoading } = useQuery({ queryKey: ['admin-coupons'], queryFn: () => couponApi.adminList(), select: (r) => r.data.data.coupons });
  const saveMutation = useMutation({
    mutationFn: (data) => editing ? couponApi.update(editing, data) : couponApi.create(data),
    onSuccess: () => { toast.success('Coupon saved'); qc.invalidateQueries(['admin-coupons']); setShowForm(false); setEditing(null); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });
  const deleteMutation = useMutation({ mutationFn: couponApi.delete, onSuccess: () => { toast.success('Coupon deleted'); qc.invalidateQueries(['admin-coupons']); } });
  const set = (f) => (e) => setForm((s) => ({ ...s, [f]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">Coupons</h1>
        <button className="btn btn--primary" onClick={() => { setShowForm(true); setEditing(null); setForm({ code: '', type: 'PERCENTAGE', value: '', minOrderAmount: '', maxUses: '', perUserLimit: 1, isActive: true }); }}><Plus size={16} /> Create Coupon</button>
      </div>
      {showForm && (
        <div className="admin-card" style={{ marginBottom: 24 }}>
          <h3 className="admin-card__title">{editing ? 'Edit' : 'New'} Coupon</h3>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Code *</label><input type="text" className="form-input" placeholder="SAVE20" value={form.code} onChange={set('code')} style={{ textTransform: 'uppercase' }} /></div>
            <div className="form-group"><label className="form-label">Type</label>
              <select className="form-input" value={form.type} onChange={set('type')}>
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED_AMOUNT">Fixed Amount (₦)</option>
                <option value="FREE_SHIPPING">Free Shipping</option>
              </select>
            </div>
            <div className="form-group"><label className="form-label">Value</label><input type="number" className="form-input" placeholder={form.type === 'PERCENTAGE' ? '20' : '5000'} value={form.value} onChange={set('value')} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Min Order (₦)</label><input type="number" className="form-input" value={form.minOrderAmount} onChange={set('minOrderAmount')} /></div>
            <div className="form-group"><label className="form-label">Max Uses</label><input type="number" className="form-input" value={form.maxUses} onChange={set('maxUses')} /></div>
            <div className="form-group"><label className="form-label">Per User Limit</label><input type="number" className="form-input" value={form.perUserLimit} onChange={set('perUserLimit')} /></div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button className="btn btn--primary" onClick={() => saveMutation.mutate(form)} disabled={!form.code || !form.value || saveMutation.isPending}>{saveMutation.isPending ? <Loader2 size={14} className="spin" /> : 'Save'}</button>
            <button className="btn btn--outline" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}
      <div className="admin-table-card">
        <table className="admin-table">
          <thead><tr><th>Code</th><th>Type</th><th>Value</th><th>Min Order</th><th>Used / Max</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {coupons?.map((c) => (
              <tr key={c.id}>
                <td className="mono"><strong>{c.code}</strong></td>
                <td>{c.type}</td>
                <td>{c.type === 'PERCENTAGE' ? `${c.value}%` : `₦${parseFloat(c.value).toLocaleString()}`}</td>
                <td>{c.minOrderAmount ? `₦${parseFloat(c.minOrderAmount).toLocaleString()}` : '—'}</td>
                <td>{c.usedCount} / {c.maxUses || '∞'}</td>
                <td><span className={`badge badge--${c.isActive ? 'green' : 'red'}`}>{c.isActive ? 'Active' : 'Inactive'}</span></td>
                <td>
                  <div className="admin-actions">
                    <button className="admin-action-btn admin-action-btn--edit" onClick={() => { setEditing(c.id); setForm({ code: c.code, type: c.type, value: c.value, minOrderAmount: c.minOrderAmount || '', maxUses: c.maxUses || '', perUserLimit: c.perUserLimit, isActive: c.isActive }); setShowForm(true); }}><Edit size={14} /></button>
                    <button className="admin-action-btn admin-action-btn--delete" onClick={() => deleteMutation.mutate(c.id)}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
