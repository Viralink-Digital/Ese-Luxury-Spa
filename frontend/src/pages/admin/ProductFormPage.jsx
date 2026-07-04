// src/pages/admin/ProductFormPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload, X, Plus, Loader2, Save, ArrowLeft } from 'lucide-react';
import { productApi, categoryApi, brandApi, uploadApi, refreshAccessToken } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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
  const [imagesModified, setImagesModified] = useState(false);
  const [variantsModified, setVariantsModified] = useState(false);
  const [tagsModified, setTagsModified] = useState(false);

  const { data: product, isLoading: productLoading, error: productError } = useQuery({
    queryKey: ['product-edit', id],
    queryFn: () => productApi.get(id),
    enabled: isEdit,
    select: (r) => r.data.data.product,
  });

  // Update form when product data is loaded
  useEffect(() => {
    if (product && isEdit) {
      setForm({
        name: product.name || '', description: product.description || '',
        ingredients: product.ingredients || '', benefits: product.benefits || '',
        usageInstructions: product.usageInstructions || '',
        basePrice: product.basePrice !== undefined ? product.basePrice : '', 
        comparePrice: product.comparePrice !== undefined ? product.comparePrice : '',
        sku: product.sku || '', barcode: product.barcode || '', 
        weight: product.weight !== undefined ? product.weight : '',
        categoryId: product.categoryId || '', brandId: product.brandId || '',
        isFeatured: product.isFeatured, isBestSeller: product.isBestSeller,
        isNewArrival: product.isNewArrival, isLimitedEdition: product.isLimitedEdition,
        metaTitle: product.metaTitle || '', metaDesc: product.metaDesc || '', 
        metaKeywords: product.metaKeywords || '',
        images: product.images?.map((img) => ({ url: img.url, altText: img.altText })) || [],
        variants: product.variants || [], tags: product.tags?.map((t) => t.tag) || [],
      });
      setImagesModified(false); // Reset images modified flag when loading product
      setVariantsModified(false); // Reset variants modified flag when loading product
      setTagsModified(false); // Reset tags modified flag when loading product
    }
  }, [product, isEdit]);

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
    mutationFn: (data) => {
      // When editing, only send arrays if they were modified
      const submissionData = isEdit 
        ? {
            ...data,
            images: imagesModified ? data.images : undefined,
            variants: variantsModified ? data.variants : undefined,
            tags: tagsModified ? data.tags : undefined,
          }
        : data;
      return isEdit ? productApi.update(id, submissionData) : productApi.create(submissionData);
    },
    onSuccess: () => {
      toast.success(`Product ${isEdit ? 'updated' : 'created'} successfully!`);
      // Invalidate all product-related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product-edit', id] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'inventory'] });
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

    const formData = new FormData();
    files.forEach((f) => formData.append('images', f));

    setUploading(true);
    try {
      const res = await uploadApi.products(formData);
      const newImages = res.data.data.images;
      setForm((f) => ({ ...f, images: [...f.images, ...newImages] }));
      setImagesModified(true);
      toast.success(`${newImages.length} image(s) uploaded`);
    } catch (err) {
      if (err?.response?.status === 401) {
        try {
          await refreshAccessToken();
          const res = await uploadApi.products(formData);
          const newImages = res.data.data.images;
          setForm((f) => ({ ...f, images: [...f.images, ...newImages] }));
          setImagesModified(true);
          toast.success(`${newImages.length} image(s) uploaded`);
        } catch (retryErr) {
          toast.error(retryErr.response?.data?.message || 'Image upload failed');
        }
      } else {
        toast.error(err.response?.data?.message || 'Image upload failed');
      }
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (i) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));
    setImagesModified(true);
  };

  const addTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase();
      if (!form.tags.includes(tag)) {
        setForm((f) => ({ ...f, tags: [...f.tags, tag] }));
        setTagsModified(true);
      }
      setTagInput('');
    }
  };

  const addVariant = () => {
    setForm((f) => ({
      ...f,
      variants: [...f.variants, { name: 'Shade', value: '', type: 'shade', price: '', stockQty: 0 }],
    }));
    setVariantsModified(true);
  };

  const updateVariant = (i, field, val) => {
    setForm((f) => ({
      ...f,
      variants: f.variants.map((v, idx) => idx === i ? { ...v, [field]: val } : v),
    }));
    setVariantsModified(true);
  };

  const TABS = ['basic', 'details', 'variants', 'images', 'seo'];

  // Show loading state while fetching product data
  if (isEdit && productLoading) {
    return (
      <div className="admin-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Loader2 size={32} className="spin" />
      </div>
    );
  }

  // Show error state if product fetch fails
  if (isEdit && productError) {
    return (
      <div className="admin-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'red', marginBottom: '16px' }}>Failed to load product data</p>
          <button className="btn btn--primary" onClick={() => navigate('/admin/products')}>Back to Products</button>
        </div>
      </div>
    );
  }

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
          disabled={saveMutation.isPending || !form.name || form.basePrice === '' || !form.categoryId}
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
                  <label className="form-label">Base Price (₵) <span className="form-required">*</span></label>
                  <input type="number" className="form-input" placeholder="0.00" value={form.basePrice} onChange={set('basePrice')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Compare Price (₵)</label>
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
                      <button onClick={() => {
                        setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));
                        setTagsModified(true);
                      }}><X size={10} /></button>
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
                      <input type="number" className="form-input form-input--sm" placeholder="Price (₵)" value={v.price} onChange={(e) => updateVariant(i, 'price', e.target.value)} />
                      <input type="number" className="form-input form-input--sm" placeholder="Stock" value={v.stockQty} onChange={(e) => updateVariant(i, 'stockQty', e.target.value)} />
                      <button className="admin-action-btn admin-action-btn--delete" onClick={() => {
                        setForm((f) => ({ ...f, variants: f.variants.filter((_, idx) => idx !== i) }));
                        setVariantsModified(true);
                      }}>
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
                  <><Upload size={32} /><p>Click to upload or drag & drop</p><p className="image-upload-zone__sub">PNG, JPG, WebP up to 10MB each</p></>
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
