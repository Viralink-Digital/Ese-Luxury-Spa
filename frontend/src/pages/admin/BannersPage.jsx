// src/pages/admin/BannersPage.jsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { cmsApi, uploadApi } from '@/lib/api';
import toast from 'react-hot-toast';

const POSITIONS = ['HERO', 'PROMO_LEFT', 'PROMO_RIGHT', 'CATEGORY_TOP', 'SIDEBAR'];

export default function AdminBannersPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ title: '', subtitle: '', description: '', image: '', badgeText: '', ctaLabel: '', ctaUrl: '', position: 'HERO', sortOrder: 0, isActive: true });
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data: banners } = useQuery({ queryKey: ['admin-banners'], queryFn: () => cmsApi.banners(), select: (r) => r.data.data.banners });
  const saveMutation = useMutation({
    mutationFn: (data) => editing ? cmsApi.updateBanner(editing, data) : cmsApi.createBanner(data),
    onSuccess: () => { toast.success('Banner saved'); qc.invalidateQueries(['admin-banners']); setShowForm(false); setEditing(null); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });
  const deleteMutation = useMutation({ mutationFn: cmsApi.deleteBanner, onSuccess: () => { toast.success('Banner deleted'); qc.invalidateQueries(['admin-banners']); } });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData(); fd.append('image', file);
      const res = await uploadApi.banner(fd);
      setForm((f) => ({ ...f, image: res.data.data.url }));
      toast.success('Image uploaded');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const set = (f) => (e) => setForm((s) => ({ ...s, [f]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">Banners</h1>
        <button className="btn btn--primary" onClick={() => { setShowForm(true); setEditing(null); setForm({ title: '', subtitle: '', description: '', image: '', badgeText: '', ctaLabel: '', ctaUrl: '', position: 'HERO', sortOrder: 0, isActive: true }); }}><Plus size={16} /> Add Banner</button>
      </div>
      {showForm && (
        <div className="admin-card" style={{ marginBottom: 24 }}>
          <h3 className="admin-card__title">{editing ? 'Edit' : 'New'} Banner</h3>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Title *</label><input type="text" className="form-input" value={form.title} onChange={set('title')} /></div>
            <div className="form-group"><label className="form-label">Position</label>
              <select className="form-input" value={form.position} onChange={set('position')}>
                {POSITIONS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Subtitle</label><input type="text" className="form-input" value={form.subtitle} onChange={set('subtitle')} /></div>
            <div className="form-group"><label className="form-label">Badge Text</label><input type="text" className="form-input" placeholder="e.g. Flat 25% Discount" value={form.badgeText} onChange={set('badgeText')} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">CTA Label</label><input type="text" className="form-input" placeholder="Shop Now" value={form.ctaLabel} onChange={set('ctaLabel')} /></div>
            <div className="form-group"><label className="form-label">CTA URL</label><input type="text" className="form-input" placeholder="/shop" value={form.ctaUrl} onChange={set('ctaUrl')} /></div>
          </div>
          <div className="form-group">
            <label className="form-label">Banner Image</label>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ flex: 1 }} />
              {uploading && <Loader2 size={16} className="spin" />}
              {form.image && <img src={form.image} alt="" style={{ width: 80, height: 50, objectFit: 'cover', borderRadius: 8 }} />}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn--primary" onClick={() => saveMutation.mutate(form)} disabled={!form.title || !form.image || saveMutation.isPending}>{saveMutation.isPending ? <Loader2 size={14} className="spin" /> : 'Save'}</button>
            <button className="btn btn--outline" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}
      <div className="admin-table-card">
        <table className="admin-table">
          <thead><tr><th>Preview</th><th>Title</th><th>Position</th><th>CTA</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {banners?.map((b) => (
              <tr key={b.id}>
                <td><img src={b.image} alt={b.title} style={{ width: 80, height: 45, objectFit: 'cover', borderRadius: 6 }} /></td>
                <td><div>{b.title}</div>{b.badgeText && <div className="admin-table__sub">{b.badgeText}</div>}</td>
                <td><span className="badge badge--purple">{b.position}</span></td>
                <td>{b.ctaLabel ? <a href={b.ctaUrl} className="admin-link">{b.ctaLabel}</a> : '—'}</td>
                <td><span className={`badge badge--${b.isActive ? 'green' : 'red'}`}>{b.isActive ? 'Active' : 'Hidden'}</span></td>
                <td>
                  <div className="admin-actions">
                    <button className="admin-action-btn admin-action-btn--edit" onClick={() => { setEditing(b.id); setForm({ title: b.title, subtitle: b.subtitle || '', description: b.description || '', image: b.image, badgeText: b.badgeText || '', ctaLabel: b.ctaLabel || '', ctaUrl: b.ctaUrl || '', position: b.position, sortOrder: b.sortOrder, isActive: b.isActive }); setShowForm(true); }}><Edit size={14} /></button>
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
