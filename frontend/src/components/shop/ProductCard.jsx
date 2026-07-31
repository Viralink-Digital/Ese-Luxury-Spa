// src/components/shop/ProductCard.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi, wishlistApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import { useUiStore } from '@/store/cart.store';
import { useCurrencyStore } from '@/store/currency.store';
import toast from 'react-hot-toast';
import { formatDualPrice } from '@/lib/price';

export default function ProductCard({ product, delay = 0, listView = false }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const { addItem } = useCartStore();
  const { setCartOpen } = useUiStore();
  const ghanaNairaRate = useCurrencyStore((state) => state.ghanaNairaRate);
  const queryClient = useQueryClient();

  const addToCartMutation = useMutation({
    mutationFn: (data) => cartApi.add(data),
    onSuccess: (res) => {
      addItem(res.data.data.item);
      toast.success('Added to cart!');
      setCartOpen(true);
      queryClient.invalidateQueries(['cart']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to add'),
  });

  const wishlistMutation = useMutation({
    mutationFn: () => wishlistApi.toggle(product.id),
    onSuccess: (res) => {
      setWishlisted(res.data.data.wishlisted);
      toast.success(res.data.data.wishlisted ? '❤️ Added to wishlist' : 'Removed from wishlist');
      queryClient.invalidateQueries(['wishlist']);
    },
  });

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please login to add to cart'); return; }
    addToCartMutation.mutate({ productId: product.id, quantity: 1 });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please login to save to wishlist'); return; }
    wishlistMutation.mutate();
  };

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.basePrice) / product.comparePrice) * 100)
    : 0;
  const currentPrice = formatDualPrice(product.basePrice, ghanaNairaRate);
  const originalPrice = formatDualPrice(product.comparePrice, ghanaNairaRate);

  if (listView) {
    return (
      <Link to={`/products/${product.slug}`} className="product-card product-card--list">
        <div className="product-card__img-wrap">
          <img src={product.primaryImage || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop'} alt={product.name} className="product-card__img" loading="lazy" />
        </div>
        <div className="product-card__body">
          {product.brand && <span className="product-card__brand">{product.brand.name}</span>}
          <h3 className="product-card__name">{product.name}</h3>
          <div className="product-card__rating">
            <Star size={12} fill="#B76E79" stroke="#B76E79" />
            <span>{product.avgRating?.toFixed(1) || '0.0'}</span>
            <span className="product-card__reviews">({product.reviewCount})</span>
          </div>
          <div className="product-card__price">
            <div className="product-card__price-stack">
              <span className="product-card__price-current">{currentPrice.cedi}</span>
              <span className="product-card__price-naira">{currentPrice.naira}</span>
            </div>
            {product.comparePrice && <span className="product-card__price-original">{originalPrice.cedi}</span>}
          </div>
        </div>
        <div className="product-card__actions">
          <button className="product-card__action-btn" onClick={handleWishlist}><Heart size={16} fill={wishlisted ? '#B76E79' : 'none'} stroke="#B76E79" /></button>
          <button className="product-card__action-btn product-card__action-btn--cart" onClick={handleAddToCart}><ShoppingBag size={16} /></button>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/products/${product.slug}`}
      className="product-card"
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="product-card__img-wrap">
        <img
          src={product.primaryImage || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=360&fit=crop'}
          alt={product.name}
          className="product-card__img"
          loading="lazy"
        />

        {/* Badges */}
        <div className="product-card__badges">
          {product.isLimitedEdition && <span className="product-badge product-badge--limited">Limited</span>}
          {product.isBestSeller && <span className="product-badge product-badge--bestseller">Best Seller</span>}
          {product.isNewArrival && <span className="product-badge product-badge--new">New</span>}
          {discount > 0 && <span className="product-badge product-badge--sale">-{discount}%</span>}
        </div>

        {/* Hover Actions */}
        <div className={`product-card__overlay ${hovered ? 'product-card__overlay--visible' : ''}`}>
          <button
            className="product-card__hover-btn product-card__hover-btn--wish"
            onClick={handleWishlist}
            title="Add to Wishlist"
          >
            <Heart size={16} fill={wishlisted ? '#fff' : 'none'} />
          </button>
          <button
            className="product-card__hover-btn product-card__hover-btn--cart"
            onClick={handleAddToCart}
            title="Add to Cart"
            disabled={addToCartMutation.isPending}
          >
            <ShoppingBag size={16} />
            <span>{addToCartMutation.isPending ? 'Adding…' : 'Add to Cart'}</span>
          </button>
          <Link
            to={`/products/${product.slug}`}
            className="product-card__hover-btn product-card__hover-btn--view"
            onClick={(e) => e.stopPropagation()}
            title="Quick View"
          >
            <Eye size={16} />
          </Link>
        </div>
      </div>

      <div className="product-card__body">
        {product.brand && <span className="product-card__brand">{product.brand.name}</span>}
        <h3 className="product-card__name">{product.name}</h3>

        <div className="product-card__rating">
          <div className="product-card__stars">
            {Array(5).fill(0).map((_, i) => (
              <Star key={i} size={11} fill={i < Math.round(product.avgRating || 0) ? '#B76E79' : 'none'} stroke="#B76E79" />
            ))}
          </div>
          <span className="product-card__reviews">({product.reviewCount || 0})</span>
        </div>

        <div className="product-card__price">
          <div className="product-card__price-stack">
            <span className="product-card__price-current">{currentPrice.cedi}</span>
            <span className="product-card__price-naira">{currentPrice.naira}</span>
          </div>
          {product.comparePrice && (
            <span className="product-card__price-original">{originalPrice.cedi}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
