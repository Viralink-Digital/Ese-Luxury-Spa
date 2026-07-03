// src/pages/ProductPage.jsx
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Heart, ShoppingBag, Star, Minus, Plus, ChevronRight,
  ZoomIn, Share2, Package, RotateCcw, Loader2, Check,
} from 'lucide-react';
import { productApi, cartApi, wishlistApi, reviewApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import { useUiStore } from '@/store/cart.store';
import ProductCard from '@/components/shop/ProductCard';
import toast from 'react-hot-toast';

export default function ProductPage() {
  const { slug } = useParams();
  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const { addItem } = useCartStore();
  const { setCartOpen } = useUiStore();
  const queryClient = useQueryClient();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productApi.get(slug),
    select: (r) => r.data.data.product,
  });

  const { data: related } = useQuery({
    queryKey: ['related', product?.id],
    queryFn: () => productApi.related(product.id),
    enabled: !!product?.id,
    select: (r) => r.data.data.products,
  });

  const { data: reviews } = useQuery({
    queryKey: ['reviews', product?.id],
    queryFn: () => reviewApi.list(product.id, { limit: 5 }),
    enabled: !!product?.id,
    select: (r) => r.data.data,
  });

  const addToCartMutation = useMutation({
    mutationFn: (data) => cartApi.add(data),
    onSuccess: (res) => {
      addItem(res.data.data.item);
      toast.success('Added to cart!');
      setCartOpen(true);
      queryClient.invalidateQueries(['cart']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to add to cart'),
  });

  const wishlistMutation = useMutation({
    mutationFn: () => wishlistApi.toggle(product.id),
    onSuccess: (res) => {
      toast.success(res.data.data.wishlisted ? 'Added to wishlist!' : 'Removed from wishlist');
    },
  });

  if (isLoading) return <ProductPageSkeleton />;
  if (!product) return <div className="not-found">Product not found</div>;

  const price = selectedVariant?.price || product.basePrice;
  const comparePrice = product.comparePrice;
  const discount = comparePrice
    ? Math.round(((comparePrice - price) / comparePrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to cart');
      return;
    }
    addToCartMutation.mutate({
      productId: product.id,
      variantId: selectedVariant?.id || null,
      quantity: qty,
    });
  };

  // Group variants by type
  const variantGroups = product.variants?.reduce((acc, v) => {
    if (!acc[v.type]) acc[v.type] = [];
    acc[v.type].push(v);
    return acc;
  }, {});

  const images = product.images?.length ? product.images : [{ url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=700&fit=crop', altText: product.name }];

  return (
    <div className="product-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={12} />
          <Link to="/shop">Shop</Link>
          <ChevronRight size={12} />
          {product.category && <><Link to={`/shop/${product.category.slug}`}>{product.category.name}</Link><ChevronRight size={12} /></>}
          <span>{product.name}</span>
        </nav>

        {/* Main Section */}
        <div className="product-detail">
          {/* Gallery */}
          <div className="product-gallery">
            <div className="product-gallery__thumbnails">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`product-gallery__thumb ${selectedImg === i ? 'active' : ''}`}
                  onClick={() => setSelectedImg(i)}
                >
                  <img src={img.url} alt={img.altText || product.name} loading="lazy" />
                </button>
              ))}
            </div>
            <div className="product-gallery__main">
              <img
                src={images[selectedImg]?.url}
                alt={images[selectedImg]?.altText || product.name}
                className="product-gallery__main-img"
              />
              <button className="product-gallery__zoom" onClick={() => setLightboxOpen(true)}>
                <ZoomIn size={18} />
              </button>
              {product.isLimitedEdition && (
                <span className="product-badge product-badge--limited">Limited Edition</span>
              )}
              {discount > 0 && (
                <span className="product-badge product-badge--sale">-{discount}%</span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="product-info">
            {product.brand && (
              <Link to={`/shop?brand=${product.brand.id}`} className="product-brand-link">
                {product.brand.name}
              </Link>
            )}
            <h1 className="product-name">{product.name}</h1>

            {/* Rating */}
            <div className="product-rating">
              <div className="product-stars">
                {Array(5).fill(0).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < Math.round(product.avgRating) ? '#B76E79' : 'none'}
                    stroke="#B76E79"
                  />
                ))}
              </div>
              <span className="product-rating__score">{product.avgRating?.toFixed(1)}</span>
              <span className="product-rating__count">({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="product-price">
              <span className="product-price__current">
                ₦{parseFloat(price).toLocaleString()}
              </span>
              {comparePrice && (
                <span className="product-price__original">
                  ₦{parseFloat(comparePrice).toLocaleString()}
                </span>
              )}
              {discount > 0 && (
                <span className="product-price__badge">{discount}% OFF</span>
              )}
            </div>

            {/* Variants */}
            {variantGroups && Object.entries(variantGroups).map(([type, variants]) => (
              <div key={type} className="product-variants">
                <div className="product-variants__label">
                  {type.charAt(0).toUpperCase() + type.slice(1)}:
                  {selectedVariant?.type === type && <strong> {selectedVariant.value}</strong>}
                </div>
                <div className="product-variants__options">
                  {variants.map((v) => (
                    <button
                      key={v.id}
                      className={`variant-btn ${selectedVariant?.id === v.id ? 'variant-btn--active' : ''} ${v.stockQty === 0 ? 'variant-btn--oos' : ''}`}
                      onClick={() => setSelectedVariant(v.id === selectedVariant?.id ? null : v)}
                      disabled={v.stockQty === 0}
                      title={v.stockQty === 0 ? 'Out of stock' : v.value}
                      style={type === 'color' ? { background: v.value } : {}}
                    >
                      {type !== 'color' && v.value}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity */}
            <div className="product-qty">
              <div className="product-qty__label">Quantity:</div>
              <div className="qty-control">
                <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}><Minus size={14} /></button>
                <span className="qty-value">{qty}</span>
                <button className="qty-btn" onClick={() => setQty(qty + 1)}><Plus size={14} /></button>
              </div>
            </div>

            {/* CTAs */}
            <div className="product-ctas">
              <button
                className="btn btn--primary btn--lg product-cta-main"
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending}
              >
                {addToCartMutation.isPending
                  ? <><Loader2 size={18} className="spin" /> Adding…</>
                  : <><ShoppingBag size={18} /> Add to Cart</>
                }
              </button>
              <button
                className="btn btn--outline btn--lg product-cta-wish"
                onClick={() => wishlistMutation.mutate()}
                disabled={!isAuthenticated}
              >
                <Heart size={18} />
              </button>
            </div>

            {/* Buy Now */}
            <button
              className="btn btn--dark btn--full product-cta-buy"
              onClick={() => {
                handleAddToCart();
                setTimeout(() => window.location.href = '/checkout', 600);
              }}
            >
              Buy Now — ₦{(parseFloat(price) * qty).toLocaleString()}
            </button>

            {/* Trust Badges */}
            <div className="product-trust">
              {[
                { Icon: Package, text: 'Free delivery over ₦15,000' },
                { Icon: RotateCcw, text: '14-day easy returns' },
                { Icon: Check, text: '100% authentic product' },
              ].map(({ Icon, text }) => (
                <div key={text} className="product-trust__item">
                  <Icon size={14} />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Share */}
            <button className="product-share">
              <Share2 size={14} /> Share this product
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="product-tabs">
          <div className="product-tabs__nav">
            {['description', 'ingredients', 'how-to-use', 'reviews'].map((tab) => (
              <button
                key={tab}
                className={`product-tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'how-to-use' ? 'How to Use' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'reviews' && ` (${product.reviewCount})`}
              </button>
            ))}
          </div>

          <div className="product-tabs__content">
            {activeTab === 'description' && (
              <div className="tab-prose" dangerouslySetInnerHTML={{ __html: product.description || '<p>No description available.</p>' }} />
            )}
            {activeTab === 'ingredients' && (
              <div className="tab-prose">
                {product.ingredients
                  ? <p>{product.ingredients}</p>
                  : <p>Ingredients information not available.</p>
                }
              </div>
            )}
            {activeTab === 'how-to-use' && (
              <div className="tab-prose">
                {product.usageInstructions
                  ? <p>{product.usageInstructions}</p>
                  : <p>Usage instructions not available.</p>
                }
              </div>
            )}
            {activeTab === 'reviews' && (
              <ReviewsTab productId={product.id} reviews={reviews} />
            )}
          </div>
        </div>

        {/* Related Products */}
        {related?.length > 0 && (
          <div className="related-products">
            <h2 className="section-title">You May Also <em>Like</em></h2>
            <div className="product-grid">
              {related.slice(0, 4).map((p, i) => <ProductCard key={p.id} product={p} delay={i * 80} />)}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="lightbox" onClick={() => setLightboxOpen(false)}>
          <img src={images[selectedImg]?.url} alt={product.name} className="lightbox__img" />
          <button className="lightbox__close"><X size={24} /></button>
        </div>
      )}
    </div>
  );
}

function ReviewsTab({ productId, reviews }) {
  const [form, setForm] = useState({ rating: 5, title: '', body: '' });
  const [submitting, setSubmitting] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const submitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.error('Please login to leave a review');
    setSubmitting(true);
    try {
      await reviewApi.create({ productId, ...form });
      toast.success('Review submitted for approval!');
      setForm({ rating: 5, title: '', body: '' });
      queryClient.invalidateQueries(['reviews', productId]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="reviews-tab">
      {reviews?.reviews?.length === 0 ? (
        <p className="reviews-empty">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="reviews-list">
          {reviews?.reviews?.map((r) => (
            <div key={r.id} className="review-item">
              <div className="review-item__header">
                <div className="review-item__avatar">
                  {(r.user?.firstName?.[0] || '?').toUpperCase()}
                </div>
                <div>
                  <div className="review-item__name">{r.user?.firstName} {r.user?.lastName}</div>
                  <div className="review-item__stars">
                    {Array(5).fill(0).map((_, i) => (
                      <Star key={i} size={12} fill={i < r.rating ? '#B76E79' : 'none'} stroke="#B76E79" />
                    ))}
                  </div>
                </div>
                <span className="review-item__date">
                  {new Date(r.createdAt).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              {r.title && <h4 className="review-item__title">{r.title}</h4>}
              <p className="review-item__body">{r.body}</p>
            </div>
          ))}
        </div>
      )}

      {/* Review form */}
      {isAuthenticated && (
        <form className="review-form" onSubmit={submitReview}>
          <h4 className="review-form__title">Write a Review</h4>
          <div className="review-form__stars">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} type="button" onClick={() => setForm((f) => ({ ...f, rating: s }))}>
                <Star size={24} fill={s <= form.rating ? '#B76E79' : 'none'} stroke="#B76E79" />
              </button>
            ))}
          </div>
          <input
            type="text"
            className="form-input"
            placeholder="Review title (optional)"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          <textarea
            className="form-input form-textarea"
            placeholder="Share your experience with this product..."
            rows={4}
            value={form.body}
            onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            required
          />
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? <Loader2 size={16} className="spin" /> : 'Submit Review'}
          </button>
        </form>
      )}
    </div>
  );
}

function ProductPageSkeleton() {
  return (
    <div className="product-page">
      <div className="container">
        <div className="product-detail">
          <div className="skeleton-block" style={{ height: 500, borderRadius: 16 }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton-line" style={{ width: 120, height: 14 }} />
            <div className="skeleton-line" style={{ width: '80%', height: 32, marginTop: 12 }} />
            <div className="skeleton-line" style={{ width: 160, height: 24, marginTop: 16 }} />
            <div className="skeleton-line" style={{ width: 200, height: 20, marginTop: 20 }} />
            <div className="skeleton-block" style={{ height: 52, marginTop: 24, borderRadius: 50 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
