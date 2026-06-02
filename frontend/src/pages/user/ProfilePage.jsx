// src/pages/user/ProfilePage.jsx
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Loader2, Save } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { userApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState({ firstName: user?.firstName || '', lastName: user?.lastName || '', email: user?.email || '' });
  const set = (f) => (e) => setForm((s) => ({ ...s, [f]: e.target.value }));
  const mutation = useMutation({
    mutationFn: (data) => userApi.updateProfile(data),
    onSuccess: (res) => { updateUser(res.data.data.user); toast.success('Profile updated!'); },
    onError: () => toast.error('Failed to update profile'),
  });
  return (
    <div className="user-page">
      <div className="container" style={{ maxWidth: 600 }}>
        <h1 className="user-page__title">Profile Settings</h1>
        <div className="form-card">
          <div className="form-row">
            <div className="form-group"><label className="form-label">First Name</label><input type="text" className="form-input" value={form.firstName} onChange={set('firstName')} /></div>
            <div className="form-group"><label className="form-label">Last Name</label><input type="text" className="form-input" value={form.lastName} onChange={set('lastName')} /></div>
          </div>
          <div className="form-group"><label className="form-label">Email</label><input type="email" className="form-input" value={form.email} onChange={set('email')} /></div>
          <div className="form-group"><label className="form-label">Phone Number</label><input type="text" className="form-input" value={user?.phone || ''} disabled /></div>
          <button className="btn btn--primary" onClick={() => mutation.mutate(form)} disabled={mutation.isPending}>
            {mutation.isPending ? <Loader2 size={16} className="spin" /> : <Save size={16} />} Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
