// src/pages/ContactPage.jsx
import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    setSending(false);
  };

  const set = (f) => (e) => setForm((s) => ({ ...s, [f]: e.target.value }));

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="container">
          <p className="section-eyebrow">Get In Touch</p>
          <h1 className="contact-hero__title">We'd Love to <em>Hear From You</em></h1>
          <p className="contact-hero__sub">Our beauty experts are here to help you with any questions or concerns.</p>
        </div>
      </div>

      <div className="container section">
        <div className="contact-layout">
          {/* Info */}
          <div className="contact-info">
            <h2 className="contact-info__title">Contact Information</h2>
            {[
              { Icon: MapPin, title: 'Visit Us', lines: ['Ese Luxury Cosmetics', 'Victoria Island, Lagos, Nigeria'] },
              { Icon: Phone, title: 'Call Us', lines: ['+233 800 ESE LUXE', 'Mon–Sat: 9am – 6pm WAT'] },
              { Icon: Mail, title: 'Email Us', lines: ['hello@eseluxury.com', 'support@eseluxury.com'] },
              { Icon: Clock, title: 'Business Hours', lines: ['Monday – Saturday: 9:00 AM – 6:00 PM', 'Sunday: 12:00 PM – 4:00 PM'] },
            ].map(({ Icon, title, lines }) => (
              <div key={title} className="contact-info-item">
                <div className="contact-info-item__icon"><Icon size={20} /></div>
                <div>
                  <h4>{title}</h4>
                  {lines.map((l, i) => <p key={i}>{l}</p>)}
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="contact-form-card">
            <h2>Send a Message</h2>
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-row">
                <div className="form-group"><label className="form-label">Full Name *</label><input type="text" className="form-input" value={form.name} onChange={set('name')} required /></div>
                <div className="form-group"><label className="form-label">Email Address</label><input type="email" className="form-input" value={form.email} onChange={set('email')} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Phone Number</label><input type="tel" className="form-input" value={form.phone} onChange={set('phone')} /></div>
                <div className="form-group"><label className="form-label">Subject</label>
                  <select className="form-input" value={form.subject} onChange={set('subject')}>
                    {['', 'Order Inquiry', 'Product Question', 'Returns & Refunds', 'Wholesale', 'Partnership', 'Other'].map((s) => <option key={s} value={s}>{s || 'Select subject'}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group"><label className="form-label">Message *</label><textarea className="form-input form-textarea" rows={5} value={form.message} onChange={set('message')} required placeholder="Tell us how we can help..." /></div>
              <button type="submit" className="btn btn--primary btn--full" disabled={sending}>
                {sending ? <><Loader2 size={16} className="spin" /> Sending…</> : <><Send size={16} /> Send Message</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
