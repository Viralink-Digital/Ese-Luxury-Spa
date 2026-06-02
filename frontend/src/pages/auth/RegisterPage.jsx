// src/pages/auth/RegisterPage.jsx
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Phone, User, ArrowRight, Loader2 } from 'lucide-react';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({ phone: '', firstName: '', lastName: '', referralCode: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.phone.trim()) return toast.error('Enter your phone number');
    setLoading(true);
    try {
      const res = await authApi.register({
        ...form,
        referralCode: params.get('ref') || form.referralCode || undefined,
      });
      toast.success('Verification code sent!');
      navigate('/verify-otp', {
        state: { userId: res.data.data.userId, phone: form.phone, type: 'REGISTRATION', from: '/' },
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div className="auth-page">
      <div className="auth-page__header">
        <h1>Create Account</h1>
        <p>Join thousands of beauty lovers on Ese Luxury</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">First Name</label>
            <div className="form-input-wrap">
              <User size={16} className="form-input-icon" />
              <input type="text" className="form-input form-input--icon" placeholder="Ada" value={form.firstName} onChange={set('firstName')} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Last Name</label>
            <input type="text" className="form-input" placeholder="Okafor" value={form.lastName} onChange={set('lastName')} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number <span className="form-required">*</span></label>
          <div className="form-input-wrap">
            <Phone size={16} className="form-input-icon" />
            <input type="tel" className="form-input form-input--icon" placeholder="+233 801 234 5678" value={form.phone} onChange={set('phone')} required autoFocus />
          </div>
          <span className="form-hint">We'll send a verification code to this number</span>
        </div>

        {params.get('ref') && (
          <div className="referral-badge">
            Referral code <strong>{params.get('ref')}</strong> applied — you'll get bonus points!
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Referral Code <span className="form-optional">(optional)</span></label>
          <input type="text" className="form-input" placeholder="Enter referral code" value={form.referralCode} onChange={set('referralCode')} />
        </div>

        <div className="auth-terms">
          By registering, you agree to our{' '}
          <Link to="/terms" className="auth-link">Terms of Service</Link> and{' '}
          <Link to="/privacy" className="auth-link">Privacy Policy</Link>.
        </div>

        <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
          {loading ? <Loader2 size={18} className="spin" /> : <>Create Account <ArrowRight size={16} /></>}
        </button>
      </form>

      <div className="auth-page__footer">
        <p>Already have an account? <Link to="/login" className="auth-link">Sign in</Link></p>
      </div>
    </div>
  );
}
