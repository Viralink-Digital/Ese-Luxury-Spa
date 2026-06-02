// src/pages/auth/LoginPage.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Phone, ArrowRight, Loader2 } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone.trim()) return toast.error('Enter your phone number');
    setLoading(true);
    try {
      const res = await authApi.login({ phone });
      navigate('/verify-otp', {
        state: {
          userId: res.data.data.userId,
          phone,
          type: 'LOGIN',
          from: location.state?.from?.pathname || '/',
        },
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__header">
        <h1>Welcome Back</h1>
        <p>Enter your phone number to receive a login code</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <div className="form-input-wrap">
            <Phone size={16} className="form-input-icon" />
            <input
              type="tel"
              className="form-input form-input--icon"
              placeholder="+233 801 234 5678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoFocus
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
          {loading ? <Loader2 size={18} className="spin" /> : <>Send Login Code <ArrowRight size={16} /></>}
        </button>
      </form>

      <div className="auth-page__footer">
        <p>Don't have an account? <Link to="/register" className="auth-link">Sign up</Link></p>
        <p style={{ marginTop: 8 }}>
          <Link to="/forgot-password" className="auth-link">Forgot password?</Link>
        </p>
      </div>
    </div>
  );
}
