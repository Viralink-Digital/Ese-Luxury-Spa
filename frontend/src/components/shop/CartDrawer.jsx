// src/components/shop/CartDrawer.jsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/lib/api';
import { useCartStore } from '@/store/cart.store';
import { useUiStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';

export default function CartDrawer() {
  const { cartOpen, setCartOpen } = useUiStore();
  const { setCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: cart, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartApi.get(),
    enabled: isAuthenticated && cartOpen,
    select: (r) => r.data.data,
    onSuccess: (data) => setCart(data.items, data.total),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, quantity }) => cartApi.update(id, { quantity }),
    onSuccess: () => queryClient.invalidateQueries(['cart']),
    onError: () => toast.error('Update failed'),
  });

  const removeMutation = useMutation({
    mutationFn: (id) => cartApi.remove(id),
    onSuccess: () => { queryClient.invalidateQueries(['cart']); toast.success('Item removed'); },
    onError: () => toast.error('Remove failed'),
  });

  // Close on escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setCartOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = cartOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [cartOpen]);

  const freeShippingThreshold = 15000;
  const total = cart?.total || 0;
  const remaining = Math.max(0, freeShippingThreshold - total);
  const progress = Math.min(100, (total / freeShippingThreshold) * 100);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`cart-backdrop ${cartOpen ? 'cart-backdrop--visible' : ''}`}
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer */}
      <div className={`cart-drawer ${cartOpen ? 'cart-drawer--open' : ''}`} role="dialog" aria-label="Shopping Cart">
        {/* Header */}
        <div className="cart-drawer__header">
          <div className="cart-drawer__title">
            <ShoppingBag size={20} />
            <span>My Cart</span>
            {cart?.count > 0 && <span className="cart-drawer__count">{cart.count}</span>}
          </div>
          <button className="cart-drawer__close" onClick={() => setCartOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Free shipping progress */}
        {total > 0 && (
          <div className="cart-shipping-bar">
            {remaining === 0 ? (
              <p className="cart-shipping-bar__msg cart-shipping-bar__msg--free">
                🎉 You qualify for <strong>free shipping!</strong>
              </p>
            ) : (
              <p className="cart-shipping-bar__msg">
                Add <strong>GH₵{remaining.toLocaleString()}</strong> more for free shipping
              </p>
            )}
            <div className="cart-shipping-bar__track">
              <div className="cart-shipping-bar__fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* Items */}
        <div className="cart-drawer__items">
          {!isAuthenticated ? (
            <div className="cart-empty">
              <ShoppingBag size={48} className="cart-empty__icon" />
              <p>Login to see your cart</p>
              <Link to="/login" className="btn btn--primary" onClick={() => setCartOpen(false)}>
                Login
              </Link>
            </div>
          ) : isLoading ? (
            <div className="cart-items-skeleton">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="cart-item-skeleton">
                  <div className="skeleton-block" style={{ width: 70, height: 70, borderRadius: 10 }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton-line" style={{ width: '80%', height: 14, marginBottom: 8 }} />
                    <div className="skeleton-line" style={{ width: '50%', height: 12 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : cart?.items?.length === 0 ? (
            <div className="cart-empty">
              <ShoppingBag size={56} className="cart-empty__icon" />
              <h3>Your cart is empty</h3>
              <p>Discover our luxury collection and find something beautiful.</p>
              <Link to="/shop" className="btn btn--primary" onClick={() => setCartOpen(false)}>
                Browse Shop
              </Link>
            </div>
          ) : (
            cart?.items?.map((item) => {
              const price = parseFloat(item.variant?.price || item.product?.basePrice);
              return (
                <div key={item.id} className="cart-item">
                  <Link to={`/products/${item.product?.slug}`} onClick={() => setCartOpen(false)}>
                    <img
                      src={item.product?.images?.[0]?.url || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=80&h=80&fit=crop'}
                      alt={item.product?.name}
                      className="cart-item__img"
                    />
                  </Link>

                  <div className="cart-item__info">
                    <Link to={`/products/${item.product?.slug}`} className="cart-item__name" onClick={() => setCartOpen(false)}>
                      {item.product?.name}
                    </Link>
                    {item.variant && (
                      <p className="cart-item__variant">{item.variant.name}: {item.variant.value}</p>
                    )}
                    <div className="cart-item__bottom">
                      <div className="cart-item__qty">
                        <button
                          className="cart-item__qty-btn"
                          onClick={() => item.quantity > 1
                            ? updateMutation.mutate({ id: item.id, quantity: item.quantity - 1 })
                            : removeMutation.mutate(item.id)
                          }
                        >
                          <Minus size={12} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          className="cart-item__qty-btn"
                          onClick={() => updateMutation.mutate({ id: item.id, quantity: item.quantity + 1 })}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="cart-item__price">GH₵{(price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    className="cart-item__remove"
                    onClick={() => removeMutation.mutate(item.id)}
                    title="Remove item"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cart?.items?.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-subtotal">
              <span>Subtotal</span>
              <span className="cart-subtotal__amount">GH₵{parseFloat(total).toLocaleString()}</span>
            </div>
            <p className="cart-tax-note">Shipping calculated at checkout</p>
            <Link
              to="/checkout"
              className="btn btn--primary btn--full btn--lg"
              onClick={() => setCartOpen(false)}
            >
              Checkout <ArrowRight size={16} />
            </Link>
            <button
              className="cart-continue-btn"
              onClick={() => setCartOpen(false)}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
