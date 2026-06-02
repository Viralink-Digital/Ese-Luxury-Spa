// src/pages/admin/CategoriesPage.jsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { categoryApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminCategoriesPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ name: '', description: '', sortOrder: 0 });
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.list(),
    select: (r) => r.data.data.categories,
  });

  const saveMutation = useMutation({
    mutationFn: (data) => editing ? categoryApi.update(editing, data) : categoryApi.create(data),
    onSuccess: () => { toast.success(`Category ${editing ? 'updated' : 'created'}`); qc.invalidateQueries(['categories']); setShowForm(false); setEditing(null); setForm({ name: '', description: '', sortOrder: 0 }); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => categoryApi.delete(id),
    onSuccess: () => { toast.success('Category deleted'); qc.invalidateQueries(['categories']); },
  });

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">Categories</h1>
        <button className="btn btn--primary" onClick={() => { setShowForm(true); setEditing(null); setForm({ name: '', description: '', sortOrder: 0 }); }}>
          <Plus size={16} /> Add Category
        </button>
      </div>
      {showForm && (
        <div className="admin-card" style={{ marginBottom: 24 }}>
          <h3 className="admin-card__title">{editing ? 'Edit' : 'New'} Category</h3>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Name *</label><input type="text" className="form-input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></div>
            <div className="form-group"><label className="form-label">Sort Order</label><input type="number" className="form-input" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))} /></div>
          </div>
          <div className="form-group"><label className="form-label">Description</label><textarea className="form-input form-textarea" rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} /></div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn--primary" onClick={() => saveMutation.mutate(form)} disabled={!form.name || saveMutation.isPending}>
              {saveMutation.isPending ? <Loader2 size={14} className="spin" /> : 'Save'}
            </button>
            <button className="btn btn--outline" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}
      <div className="admin-table-card">
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Slug</th><th>Products</th><th>Sort</th><th>Actions</th></tr></thead>
          <tbody>
            {categories?.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td className="mono">{c.slug}</td>
                <td>{c._count?.products || 0}</td>
                <td>{c.sortOrder}</td>
                <td>
                  <div className="admin-actions">
                    <button className="admin-action-btn admin-action-btn--edit" onClick={() => { setEditing(c.id); setForm({ name: c.name, description: c.description || '', sortOrder: c.sortOrder }); setShowForm(true); }}><Edit size={14} /></button>
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
