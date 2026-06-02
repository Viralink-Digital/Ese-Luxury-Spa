// src/pages/user/AddressesPage.jsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, MapPin, Loader2 } from 'lucide-react';
import { userApi } from '@/lib/api';
import toast from 'react-hot-toast';

const BLANK = { label: 'Home', fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', country: 'Nigeria', isDefault: false };

export default function AddressesPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState(BLANK);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { data: addresses, isLoading } = useQuery({ queryKey: ['addresses'], queryFn: () => userApi.addresses(), select: (r) => r.data.data.addresses });
  const saveMutation = useMutation({
    mutationFn: (data) => editing ? userApi.updateAddress(editing, data) : userApi.addAddress(data),
    onSuccess: () => { toast.success('Address saved'); qc.invalidateQueries(['addresses']); setShowForm(false); setEditing(null); setForm(BLANK); },
    onError: () => toast.error('Failed to save address'),
  });
  const deleteMutation = useMutation({ mutationFn: userApi.deleteAddress, onSuccess: () => { toast.success('Address deleted'); qc.invalidateQueries(['addresses']); } });
  const set = (f) => (e) => setForm((s) => ({ ...s, [f]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  return (
    <div className="user-page">
      <div className="container" style={{ maxWidth: 700 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 className="user-page__title" style={{ margin: 0 }}>My Addresses</h1>
          <button className="btn btn--primary btn--sm" onClick={() => { setShowForm(true); setEditing(null); setForm(BLANK); }}><Plus size={14} /> Add Address</button>
        </div>
        {showForm && (
          <div className="form-card" style={{ marginBottom: 24 }}>
            <h3 className="form-card__title">{editing ? 'Edit' : 'New'} Address</h3>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Label</label><select className="form-input" value={form.label} onChange={set('label')}>{['Home', 'Work', 'Other'].map((l) => <option key={l}>{l}</option>)}</select></div>
              <div className="form-group"><label className="form-label">Full Name *</label><input type="text" className="form-input" value={form.fullName} onChange={set('fullName')} /></div>
            </div>
            <div className="form-group"><label className="form-label">Phone *</label><input type="tel" className="form-input" value={form.phone} onChange={set('phone')} /></div>
            <div className="form-group"><label className="form-label">Address Line 1 *</label><input type="text" className="form-input" value={form.addressLine1} onChange={set('addressLine1')} /></div>
            <div className="form-group"><label className="form-label">Address Line 2</label><input type="text" className="form-input" value={form.addressLine2} onChange={set('addressLine2')} /></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">City *</label><input type="text" className="form-input" value={form.city} onChange={set('city')} /></div>
              <div className="form-group"><label className="form-label">State *</label><input type="text" className="form-input" value={form.state} onChange={set('state')} /></div>
            </div>
            <label className="form-toggle"><input type="checkbox" checked={form.isDefault} onChange={set('isDefault')} /><span className="form-toggle__track" /><span className="form-toggle__label">Set as default address</span></label>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button className="btn btn--primary" onClick={() => saveMutation.mutate(form)} disabled={!form.fullName || !form.addressLine1 || saveMutation.isPending}>{saveMutation.isPending ? <Loader2 size={14} className="spin" /> : 'Save'}</button>
              <button className="btn btn--outline" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        )}
        {isLoading ? <div className="skeleton-block" style={{ height: 150, borderRadius: 12 }} /> : addresses?.length === 0 ? (
          <div className="user-empty"><MapPin size={40} /><h3>No addresses yet</h3><p>Add a delivery address to checkout faster.</p></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {addresses?.map((addr) => (
              <div key={addr.id} className={`address-card ${addr.isDefault ? 'address-card--default' : ''}`}>
                {addr.isDefault && <span className="badge badge--rose" style={{ marginBottom: 8 }}>Default</span>}
                <div className="address-card__body">
                  <strong>{addr.fullName}</strong> · {addr.label}
                  <p>{addr.addressLine1}{addr.addressLine2 ? ', ' + addr.addressLine2 : ''}</p>
                  <p>{addr.city}, {addr.state}, {addr.country}</p>
                  <p>{addr.phone}</p>
                </div>
                <div className="admin-actions" style={{ marginTop: 12 }}>
                  <button className="admin-action-btn admin-action-btn--edit" onClick={() => { setEditing(addr.id); setForm({ ...addr }); setShowForm(true); }}><Edit size={14} /> Edit</button>
                  <button className="admin-action-btn admin-action-btn--delete" onClick={() => deleteMutation.mutate(addr.id)}><Trash2 size={14} /> Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
