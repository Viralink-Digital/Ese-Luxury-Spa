// src/pages/auth/OtpPage.jsx
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2, RefreshCw, CheckCircle } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';

export default function OtpPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const inputsRef = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const { userId, phone, type, from } = location.state || {};

  useEffect(() => {
    if (!userId) navigate('/login', { replace: true });
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) inputsRef.current[i + 1]?.focus();
    if (next.every((d) => d) && next.join('').length === 6) {
      handleVerify(next.join(''));
    }
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (text.length === 6) {
      setOtp(text.split(''));
      handleVerify(text);
    }
  };

  const handleVerify = async (code) => {
    setLoading(true);
    try {
      const verifyFn = type === 'REGISTRATION' ? authApi.verifyRegistration : authApi.verifyLogin;
      const res = await verifyFn({ userId, code });
      const { user, accessToken, refreshToken } = res.data.data;
      login(user, accessToken, refreshToken);
      toast.success(`Welcome${user.firstName ? ', ' + user.firstName : ''}!`);
      navigate(from || '/', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid code');
      setOtp(['', '', '', '', '', '']);
      inputsRef.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await authApi.resendOtp({ userId, type });
      setCooldown(60);
      toast.success('New code sent!');
      setOtp(['', '', '', '', '', '']);
      inputsRef.current[0]?.focus();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__header">
        <div className="otp-icon">
          <CheckCircle size={40} className="otp-icon__check" />
        </div>
        <h1>Verify Your Number</h1>
        <p>
          Enter the 6-digit code sent to<br />
          <strong>{phone?.replace(/(\d{3})\d{5}(\d{4})/, '$1*****$2')}</strong>
        </p>
      </div>

      <div className="otp-inputs" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputsRef.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={`otp-input ${digit ? 'otp-input--filled' : ''}`}
            disabled={loading}
          />
        ))}
      </div>

      <button
        className="btn btn--primary btn--full"
        disabled={loading || otp.join('').length < 6}
        onClick={() => handleVerify(otp.join(''))}
      >
        {loading ? <Loader2 size={18} className="spin" /> : 'Verify Code'}
      </button>

      <div className="otp-resend">
        {cooldown > 0 ? (
          <span className="otp-resend__timer">Resend code in <strong>{cooldown}s</strong></span>
        ) : (
          <button className="otp-resend__btn" onClick={handleResend} disabled={resending}>
            {resending ? <Loader2 size={14} className="spin" /> : <RefreshCw size={14} />}
            Resend Code
          </button>
        )}
      </div>

      <div className="auth-page__footer">
        <p>
          Wrong number?{' '}
          <button className="auth-link" onClick={() => navigate(type === 'REGISTRATION' ? '/register' : '/login')}>
            Go back
          </button>
        </p>
      </div>
    </div>
  );
}
