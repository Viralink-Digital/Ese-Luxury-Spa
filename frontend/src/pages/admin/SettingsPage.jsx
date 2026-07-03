// src/pages/admin/SettingsPage.jsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Save, Loader2, Upload } from 'lucide-react';
import { cmsApi, uploadApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    site_name: 'Ese Luxury Cosmetics',
    site_tagline: 'Premium Beauty Marketplace',
    site_logo_url: '',
    contact_phone: '+233 800 ESE LUXE',
    contact_email: 'hello@eseluxury.com',
    contact_address: 'Victoria Island, Lagos, Nigeria',
    instagram_url: '',
    facebook_url: '',
    twitter_url: '',
    free_shipping_threshold: '15000',
    default_shipping_fee: '1500',
    loyalty_points_per_naira: '1',
    loyalty_naira_per_point: '0.5',
    referral_bonus_points: '500',
    whatsapp_number: '+2338001234567',
    maintenance_mode: 'false',
  });
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const { data } = useQuery({
    queryKey: ['site-settings'],
    queryFn: () => cmsApi.settings(),
    select: (r) => r.data.data.settings,
    onSuccess: (data) => setSettings((prev) => ({ ...prev, ...data })),
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      await cmsApi.updateSettings({ settings });
      toast.success('Settings saved!');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const set = (key) => (e) => setSettings((s) => ({ ...s, [key]: e.target.value }));

  const handleLogoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('logo', file);
      const { data } = await uploadApi.logo(formData);
      setSettings((prev) => ({ ...prev, site_logo_url: data.data.url }));
      toast.success('Logo uploaded successfully.');
    } catch {
      toast.error('Failed to upload logo.');
    } finally {
      setUploadingLogo(false);
      event.target.value = '';
    }
  };

  const SettingGroup = ({ title, children }) => (
    <div className="settings-group">
      <h3 className="settings-group__title">{title}</h3>
      <div className="settings-group__body">{children}</div>
    </div>
  );

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Site Settings</h1>
          <p className="admin-page__sub">Manage your store configuration</p>
        </div>
        <button className="btn btn--primary" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
          Save Settings
        </button>
      </div>

      <div className="settings-layout">
        <SettingGroup title="General">
          {[
            { key: 'site_name', label: 'Site Name' },
            { key: 'site_tagline', label: 'Tagline' },
            { key: 'site_logo_url', label: 'Logo URL' },
          ].map(({ key, label }) => (
            <div key={key} className="form-group">
              <label className="form-label">{label}</label>
              <input type="text" className="form-input" value={settings[key] || ''} onChange={set(key)} />
            </div>
          ))}

          <div className="form-group">
            <label className="form-label">Upload Logo</label>
            <label className="form-upload">
              <input type="file" accept="image/*" onChange={handleLogoUpload} hidden />
              <Upload size={16} />
              {uploadingLogo ? 'Uploading...' : 'Choose image from device'}
            </label>
            <p className="form-hint">This image is used in the admin sidebar and the home hero section.</p>
          </div>
        </SettingGroup>

        <SettingGroup title="Contact Information">
          {[
            { key: 'contact_phone', label: 'Phone Number' },
            { key: 'contact_email', label: 'Email Address' },
            { key: 'contact_address', label: 'Address' },
            { key: 'whatsapp_number', label: 'WhatsApp Number' },
          ].map(({ key, label }) => (
            <div key={key} className="form-group">
              <label className="form-label">{label}</label>
              <input type="text" className="form-input" value={settings[key]} onChange={set(key)} />
            </div>
          ))}
        </SettingGroup>

        <SettingGroup title="Social Media">
          {[
            { key: 'instagram_url', label: 'Instagram URL' },
            { key: 'facebook_url', label: 'Facebook URL' },
            { key: 'twitter_url', label: 'Twitter URL' },
          ].map(({ key, label }) => (
            <div key={key} className="form-group">
              <label className="form-label">{label}</label>
              <input type="url" className="form-input" placeholder="https://" value={settings[key]} onChange={set(key)} />
            </div>
          ))}
        </SettingGroup>

        <SettingGroup title="Shipping & Payments">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Free Shipping Threshold (₦)</label>
              <input type="number" className="form-input" value={settings.free_shipping_threshold} onChange={set('free_shipping_threshold')} />
            </div>
            <div className="form-group">
              <label className="form-label">Default Shipping Fee (₦)</label>
              <input type="number" className="form-input" value={settings.default_shipping_fee} onChange={set('default_shipping_fee')} />
            </div>
          </div>
        </SettingGroup>

        <SettingGroup title="Loyalty Program">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Points per ₦1 Spent</label>
              <input type="number" className="form-input" value={settings.loyalty_points_per_naira} onChange={set('loyalty_points_per_naira')} />
            </div>
            <div className="form-group">
              <label className="form-label">₦ Value per Point</label>
              <input type="number" className="form-input" step="0.1" value={settings.loyalty_naira_per_point} onChange={set('loyalty_naira_per_point')} />
            </div>
            <div className="form-group">
              <label className="form-label">Referral Bonus Points</label>
              <input type="number" className="form-input" value={settings.referral_bonus_points} onChange={set('referral_bonus_points')} />
            </div>
          </div>
        </SettingGroup>

        <SettingGroup title="Maintenance">
          <div className="form-group">
            <label className="form-toggle">
              <input
                type="checkbox"
                checked={settings.maintenance_mode === 'true'}
                onChange={(e) => setSettings((s) => ({ ...s, maintenance_mode: e.target.checked ? 'true' : 'false' }))}
              />
              <span className="form-toggle__track" />
              <span className="form-toggle__label">Enable Maintenance Mode</span>
            </label>
            <p className="form-hint">When enabled, only admins can access the site.</p>
          </div>
        </SettingGroup>
      </div>
    </div>
  );
}
