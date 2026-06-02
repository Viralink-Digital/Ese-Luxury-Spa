// src/pages/admin/ProductFormPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Upload, X, Plus, Loader2, Save, ArrowLeft } from 'lucide-react';
import { productApi, categoryApi, brandApi, uploadApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    name: '', description: '', ingredients: '', benefits: '', usageInstructions: '',
    basePrice: '', comparePrice: '', sku: '', barcode: '', weight: '',
    categoryId: '', brandId: '',
    isFeatured: false, isBestSeller: false, isNewArrival: true, isLimitedEdition: false,
    metaTitle: '', metaDesc: '', metaKeywords: '',
    images: [], variants: [], tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const { data: product } = useQuery({
    queryKey: ['product-edit', id],
    queryFn: () => productApi.get(id),
    enabled: isEdit,
    select: (r) => r.data.data.product,
    onSuccess: (p) => setForm({
      name: p.name || '', description: p.description || '',
      ingredients: p.ingredients || '', benefits: p.benefits || '',
      usageInstructions: p.usageInstructions || '',
      basePrice: p.basePrice || '', comparePrice: p.comparePrice || '',
      sku: p.sku || '', barcode: p.barcode || '', weight: p.weight || '',
      categoryId: p.categoryId || '', brandId: p.brandId || '',
      isFeatured: p.isFeatured, isBestSeller: p.isBestSeller,
      isNewArrival: p.isNewArrival, isLimitedEdition: p.isLimitedEdition,
      metaTitle: p.metaTitle || '', metaDesc: p.metaDesc || '', metaKeywords: p.metaKeywords || '',
      images: p.images?.map((img) => ({ url: img.url, altText: img.altText })) || [],
      variants: p.variants || [], tags: p.tags?.map((t) => t.tag) || [],
    }),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.list(),
    select: (r) => r.data.data.categories,
  });

  const { data: brands } = useQuery({
    queryKey: ['brands'],
    queryFn: () => brandApi.list(),
    select: (r) => r.data.data.brands,
  });

  const saveMutation = useMutation({
    mutationFn: (data) => isEdit ? productApi.update(id, data) : productApi.create(data),
    onSuccess: () => {
      toast.success(`Product ${isEdit ? 'updated' : 'created'} successfully!`);
      navigate('/admin/products');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to save product'),
  });

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: val }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append('images', f));
      const res = await uploadApi.products(formData);
      const newImages = res.data.data.images;
      setForm((f) => ({ ...f, images: [...f.images, ...newImages] }));
      toast.success(`${newImages.length} image(s) uploaded`);
    } catch {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (i) => setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));

  const addTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase();
      if (!form.tags.includes(tag)) setForm((f) => ({ ...f, tags: [...f.tags, tag] }));
      setTagInput('');
    }
  };

  const addVariant = () => {
    setForm((f) => ({
      ...f,
      variants: [...f.variants, { name: 'Shade', value: '', type: 'shade', price: '', stockQty: 0 }],
    }));
  };

  const updateVariant = (i, field, val) => {
    setForm((f) => ({
      ...f,
      variants: f.variants.map((v, idx) => idx === i ? { ...v, [field]: val } : v),
    }));
  };

  const TABS = ['basic', 'details', 'variants', 'images', 'seo'];

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn--ghost btn--sm" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="admin-page__title">{isEdit ? 'Edit Product' : 'New Product'}</h1>
            <p className="admin-page__sub">{form.name || 'Untitled product'}</p>
          </div>
        </div>
        <button
          className="btn btn--primary"
          onClick={() => saveMutation.mutate(form)}
          disabled={saveMutation.isPending || !form.name || !form.basePrice || !form.categoryId}
        >
          {saveMutation.isPending ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
          {isEdit ? 'Save Changes' : 'Create Product'}
        </button>
      </div>

      {/* Tab Nav */}
      <div className="form-tabs">
        {TABS.map((t) => (
          <button key={t} className={`form-tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="admin-form-layout">
        <div className="admin-form-main">
          {/* Basic Info */}
          {activeTab === 'basic' && (
            <div className="form-card">
              <h3 className="form-card__title">Basic Information</h3>
              <div className="form-group">
                <label className="form-label">Product Name <span className="form-required">*</span></label>
                <input type="text" className="form-input" placeholder="e.g. Rose Glow Serum" value={form.name} onChange={set('name')} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category <span className="form-required">*</span></label>
                  <select className="form-input" value={form.categoryId} onChange={set('categoryId')}>
                    <option value="">Select category</option>
                    {categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Brand</label>
                  <select className="form-input" value={form.brandId} onChange={set('brandId')}>
                    <option value="">Select brand</option>
                    {brands?.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Base Price (GH₵) <span className="form-required">*</span></label>
                  <input type="number" className="form-input" placeholder="0.00" value={form.basePrice} onChange={set('basePrice')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Compare Price (GH₵)</label>
                  <input type="number" className="form-input" placeholder="Original price" value={form.comparePrice} onChange={set('comparePrice')} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">SKU</label>
                  <input type="text" className="form-input" placeholder="ESE-001" value={form.sku} onChange={set('sku')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Weight (g)</label>
                  <input type="number" className="form-input" placeholder="50" value={form.weight} onChange={set('weight')} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input form-textarea" rows={5} placeholder="Product description..." value={form.description} onChange={set('description')} />
              </div>

              {/* Flags */}
              <div className="form-flags">
                {[
                  { field: 'isFeatured', label: 'Featured' },
                  { field: 'isBestSeller', label: 'Best Seller' },
                  { field: 'isNewArrival', label: 'New Arrival' },
                  { field: 'isLimitedEdition', label: 'Limited Edition' },
                ].map(({ field, label }) => (
                  <label key={field} className="form-toggle">
                    <input type="checkbox" checked={form[field]} onChange={set(field)} />
                    <span className="form-toggle__track" />
                    <span className="form-toggle__label">{label}</span>
                  </label>
                ))}
              </div>

              {/* Tags */}
              <div className="form-group">
                <label className="form-label">Tags</label>
                <div className="form-tags">
                  {form.tags.map((tag) => (
                    <span key={tag} className="form-tag">
                      {tag}
                      <button onClick={() => setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }))}><X size={10} /></button>
                    </span>
                  ))}
                  <input
                    type="text"
                    className="form-tag-input"
                    placeholder="Add tag, press Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={addTag}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Product Details */}
          {activeTab === 'details' && (
            <div className="form-card">
              <h3 className="form-card__title">Product Details</h3>
              {[
                { field: 'ingredients', label: 'Ingredients', placeholder: 'List all ingredients...' },
                { field: 'benefits', label: 'Key Benefits', placeholder: 'Product benefits...' },
                { field: 'usageInstructions', label: 'How to Use', placeholder: 'Usage instructions...' },
              ].map(({ field, label, placeholder }) => (
                <div key={field} className="form-group">
                  <label className="form-label">{label}</label>
                  <textarea className="form-input form-textarea" rows={4} placeholder={placeholder} value={form[field]} onChange={set(field)} />
                </div>
              ))}
            </div>
          )}

          {/* Variants */}
          {activeTab === 'variants' && (
            <div className="form-card">
              <div className="form-card__header">
                <h3 className="form-card__title">Product Variants</h3>
                <button className="btn btn--outline btn--sm" onClick={addVariant}><Plus size={14} /> Add Variant</button>
              </div>
              {form.variants.length === 0 ? (
                <p className="form-empty">No variants yet. Add shades, sizes, or other options.</p>
              ) : (
                <div className="variants-list">
                  {form.variants.map((v, i) => (
                    <div key={i} className="variant-row">
                      <select className="form-input form-input--sm" value={v.type} onChange={(e) => updateVariant(i, 'type', e.target.value)}>
                        {['shade', 'color', 'size', 'volume', 'scent'].map((t) => <option key={t}>{t}</option>)}
                      </select>
                      <input type="text" className="form-input form-input--sm" placeholder="Value" value={v.value} onChange={(e) => updateVariant(i, 'value', e.target.value)} />
                      <input type="number" className="form-input form-input--sm" placeholder="Price (GH₵)" value={v.price} onChange={(e) => updateVariant(i, 'price', e.target.value)} />
                      <input type="number" className="form-input form-input--sm" placeholder="Stock" value={v.stockQty} onChange={(e) => updateVariant(i, 'stockQty', e.target.value)} />
                      <button className="admin-action-btn admin-action-btn--delete" onClick={() => setForm((f) => ({ ...f, variants: f.variants.filter((_, idx) => idx !== i) }))}>
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Images */}
          {activeTab === 'images' && (
            <div className="form-card">
              <h3 className="form-card__title">Product Images</h3>
              <label className="image-upload-zone">
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: 'none' }} />
                {uploading ? (
                  <><Loader2 size={32} className="spin" /><p>Uploading...</p></>
                ) : (
                  <><Upload size={32} /><p>Click to upload or drag & drop</p><p className="image-upload-zone__sub">PNG, JPG, WebP up to 5MB each</p></>
                )}
              </label>
              {form.images.length > 0 && (
                <div className="image-grid">
                  {form.images.map((img, i) => (
                    <div key={i} className="image-thumb">
                      <img src={img.url} alt={img.altText || `Image ${i + 1}`} />
                      {i === 0 && <span className="image-thumb__primary">Primary</span>}
                      <button className="image-thumb__remove" onClick={() => removeImage(i)}><X size={12} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SEO */}
          {activeTab === 'seo' && (
            <div className="form-card">
              <h3 className="form-card__title">SEO Settings</h3>
              <div className="form-group">
                <label className="form-label">Meta Title</label>
                <input type="text" className="form-input" placeholder="SEO title" value={form.metaTitle} onChange={set('metaTitle')} />
                <span className="form-hint">{form.metaTitle.length}/60 characters</span>
              </div>
              <div className="form-group">
                <label className="form-label">Meta Description</label>
                <textarea className="form-input form-textarea" rows={3} placeholder="SEO description (max 160 chars)" value={form.metaDesc} onChange={set('metaDesc')} maxLength={160} />
                <span className="form-hint">{form.metaDesc.length}/160 characters</span>
              </div>
              <div className="form-group">
                <label className="form-label">Meta Keywords</label>
                <input type="text" className="form-input" placeholder="keyword1, keyword2, keyword3" value={form.metaKeywords} onChange={set('metaKeywords')} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
