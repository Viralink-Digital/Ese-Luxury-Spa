// src/pages/auth/ForgotPasswordPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, ArrowRight, Loader2 } from 'lucide-react';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.forgotPassword({ phone });
      toast.success('Reset code sent if number is registered');
      if (res.data.data?.userId) {
        navigate('/verify-otp', { state: { userId: res.data.data.userId, phone, type: 'PASSWORD_RESET', from: '/login' } });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__header">
        <h1>Reset Password</h1>
        <p>Enter your registered phone number to receive a reset code</p>
      </div>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <div className="form-input-wrap">
            <Phone size={16} className="form-input-icon" />
            <input type="tel" className="form-input form-input--icon" placeholder="+233 801 234 5678" value={phone} onChange={(e) => setPhone(e.target.value)} autoFocus required />
          </div>
        </div>
        <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
          {loading ? <Loader2 size={18} className="spin" /> : <>Send Reset Code <ArrowRight size={16} /></>}
        </button>
      </form>
      <div className="auth-page__footer">
        <p><Link to="/login" className="auth-link">← Back to Login</Link></p>
      </div>
    </div>
  );
}
