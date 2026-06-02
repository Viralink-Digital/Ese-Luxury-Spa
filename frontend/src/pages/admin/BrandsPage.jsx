// src/pages/admin/BrandsPage.jsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { brandApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminBrandsPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ name: '', description: '', website: '' });
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const { data: brands } = useQuery({ queryKey: ['brands'], queryFn: () => brandApi.list(), select: (r) => r.data.data.brands });
  const saveMutation = useMutation({
    mutationFn: (data) => editing ? brandApi.update(editing, data) : brandApi.create(data),
    onSuccess: () => { toast.success('Brand saved'); qc.invalidateQueries(['brands']); setShowForm(false); setEditing(null); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });
  const deleteMutation = useMutation({ mutationFn: brandApi.delete, onSuccess: () => { toast.success('Brand deleted'); qc.invalidateQueries(['brands']); } });

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">Brands</h1>
        <button className="btn btn--primary" onClick={() => { setShowForm(true); setEditing(null); setForm({ name: '', description: '', website: '' }); }}><Plus size={16} /> Add Brand</button>
      </div>
      {showForm && (
        <div className="admin-card" style={{ marginBottom: 24 }}>
          <h3 className="admin-card__title">{editing ? 'Edit' : 'New'} Brand</h3>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Name *</label><input type="text" className="form-input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></div>
            <div className="form-group"><label className="form-label">Website</label><input type="url" className="form-input" placeholder="https://" value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} /></div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn--primary" onClick={() => saveMutation.mutate(form)} disabled={!form.name || saveMutation.isPending}>{saveMutation.isPending ? <Loader2 size={14} className="spin" /> : 'Save'}</button>
            <button className="btn btn--outline" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}
      <div className="admin-table-card">
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Website</th><th>Actions</th></tr></thead>
          <tbody>
            {brands?.map((b) => (
              <tr key={b.id}>
                <td>{b.name}</td>
                <td>{b.website ? <a href={b.website} target="_blank" rel="noopener noreferrer" className="admin-link">{b.website}</a> : '—'}</td>
                <td>
                  <div className="admin-actions">
                    <button className="admin-action-btn admin-action-btn--edit" onClick={() => { setEditing(b.id); setForm({ name: b.name, description: b.description || '', website: b.website || '' }); setShowForm(true); }}><Edit size={14} /></button>
                    <button className="admin-action-btn admin-action-btn--delete" onClick={() => deleteMutation.mutate(b.id)}><Trash2 size={14} /></button>
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
