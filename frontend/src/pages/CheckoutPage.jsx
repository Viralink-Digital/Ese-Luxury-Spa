// src/pages/CheckoutPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { CheckCircle, ChevronRight, Loader2, Tag, MapPin, CreditCard, Package } from 'lucide-react';
import { cartApi, orderApi, userApi, couponApi } from '@/lib/api';
import { useCartStore } from '@/store/cart.store';
import toast from 'react-hot-toast';

const STEPS = ['Cart Review', 'Shipping', 'Payment', 'Confirm'];

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponData, setCouponData] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const { clearCart } = useCartStore();
  const navigate = useNavigate();

  const { data: cart } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartApi.get(),
    select: (r) => r.data.data,
  });

  const { data: addresses } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => userApi.addresses(),
    select: (r) => r.data.data.addresses,
    onSuccess: (data) => {
      const def = data?.find((a) => a.isDefault);
      if (def) setSelectedAddress(def);
    },
  });

  const subtotal = cart?.total || 0;
  const discount = couponData?.discount || 0;
  const shippingFee = (subtotal - discount) >= 15000 ? 0 : 1500;
  const total = subtotal - discount + shippingFee;

  const validateCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const res = await couponApi.validate({ code: couponCode, subtotal });
      setCouponData(res.data.data);
      toast.success(`Coupon applied! You save ₦${res.data.data.discount.toLocaleString()}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
      setCouponData(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const placeOrderMutation = useMutation({
    mutationFn: () => orderApi.create({
      addressId: selectedAddress?.id,
      couponCode: couponData?.coupon?.code,
      notes,
      paymentMethod: 'korapay',
    }),
    onSuccess: (res) => {
      clearCart();
      const { payment } = res.data.data;
      if (payment?.checkoutUrl) {
        window.location.href = payment.checkoutUrl;
      } else {
        navigate(`/orders/${res.data.data.order.id}/confirmation`);
      }
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Order failed'),
  });

  const OrderSummary = () => (
    <div className="checkout-summary">
      <h3 className="checkout-summary__title">Order Summary</h3>
      <div className="checkout-summary__items">
        {cart?.items?.map((item) => (
          <div key={item.id} className="checkout-summary__item">
            <div className="checkout-summary__item-img">
              <img src={item.product?.images?.[0]?.url} alt={item.product?.name} />
              <span className="checkout-summary__item-qty">{item.quantity}</span>
            </div>
            <div className="checkout-summary__item-info">
              <p className="checkout-summary__item-name">{item.product?.name}</p>
              {item.variant && <p className="checkout-summary__item-variant">{item.variant.value}</p>}
            </div>
            <span className="checkout-summary__item-price">
              ₦{(parseFloat(item.variant?.price || item.product?.basePrice) * item.quantity).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Coupon */}
      <div className="checkout-coupon">
        <div className="checkout-coupon__input-wrap">
          <Tag size={14} />
          <input
            type="text"
            placeholder="Coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            className="checkout-coupon__input"
          />
          <button
            className="checkout-coupon__btn"
            onClick={validateCoupon}
            disabled={couponLoading}
          >
            {couponLoading ? <Loader2 size={14} className="spin" /> : 'Apply'}
          </button>
        </div>
        {couponData && (
          <p className="checkout-coupon__success">
            ✓ {couponData.coupon.code} applied — save ₦{parseFloat(couponData.discount).toLocaleString()}
          </p>
        )}
      </div>

      <div className="checkout-totals">
        <div className="checkout-total-row">
          <span>Subtotal</span>
          <span>₦{subtotal.toLocaleString()}</span>
        </div>
        {discount > 0 && (
          <div className="checkout-total-row checkout-total-row--discount">
            <span>Discount</span>
            <span>-₦{parseFloat(discount).toLocaleString()}</span>
          </div>
        )}
        <div className="checkout-total-row">
          <span>Shipping</span>
          <span>{shippingFee === 0 ? 'Free' : `₦${shippingFee.toLocaleString()}`}</span>
        </div>
        <div className="checkout-total-row checkout-total-row--total">
          <span>Total</span>
          <span>₦{total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          {/* Steps indicator */}
          <div className="checkout-steps">
            {STEPS.map((s, i) => (
              <div key={s} className={`checkout-step ${i <= step ? 'checkout-step--done' : ''} ${i === step ? 'checkout-step--active' : ''}`}>
                <div className="checkout-step__circle">
                  {i < step ? <CheckCircle size={16} /> : <span>{i + 1}</span>}
                </div>
                <span className="checkout-step__label">{s}</span>
                {i < STEPS.length - 1 && <ChevronRight size={14} className="checkout-step__arrow" />}
              </div>
            ))}
          </div>
        </div>

        <div className="checkout-layout">
          {/* Left Panel */}
          <div className="checkout-main">
            {/* Step 0: Cart Review */}
            {step === 0 && (
              <div className="checkout-panel">
                <h2 className="checkout-panel__title"><Package size={18} /> Review Your Cart</h2>
                {cart?.items?.length === 0 ? (
                  <p>Your cart is empty.</p>
                ) : (
                  <>
                    <div className="checkout-cart-list">
                      {cart?.items?.map((item) => (
                        <div key={item.id} className="checkout-cart-item">
                          <img src={item.product?.images?.[0]?.url} alt={item.product?.name} className="checkout-cart-item__img" />
                          <div className="checkout-cart-item__info">
                            <p className="checkout-cart-item__name">{item.product?.name}</p>
                            {item.variant && <p className="checkout-cart-item__variant">{item.variant.name}: {item.variant.value}</p>}
                            <p className="checkout-cart-item__price">₦{parseFloat(item.variant?.price || item.product?.basePrice).toLocaleString()} × {item.quantity}</p>
                          </div>
                          <span className="checkout-cart-item__total">
                            ₦{(parseFloat(item.variant?.price || item.product?.basePrice) * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                    <button className="btn btn--primary btn--full" onClick={() => setStep(1)}>
                      Continue to Shipping <ChevronRight size={16} />
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Step 1: Shipping */}
            {step === 1 && (
              <div className="checkout-panel">
                <h2 className="checkout-panel__title"><MapPin size={18} /> Shipping Address</h2>
                {addresses?.length > 0 ? (
                  <div className="address-list">
                    {addresses.map((addr) => (
                      <label key={addr.id} className={`address-card ${selectedAddress?.id === addr.id ? 'address-card--selected' : ''}`}>
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddress?.id === addr.id}
                          onChange={() => setSelectedAddress(addr)}
                        />
                        <div className="address-card__body">
                          <div className="address-card__label">{addr.label}</div>
                          <div className="address-card__name">{addr.fullName}</div>
                          <div className="address-card__line">{addr.addressLine1}{addr.addressLine2 ? ', ' + addr.addressLine2 : ''}</div>
                          <div className="address-card__city">{addr.city}, {addr.state}, {addr.country}</div>
                          <div className="address-card__phone">{addr.phone}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="checkout-no-address">No saved addresses. Please add one in your profile.</p>
                )}

                <div className="checkout-notes">
                  <label className="form-label">Order Notes (optional)</label>
                  <textarea
                    className="form-input form-textarea"
                    placeholder="Any special instructions?"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <div className="checkout-nav">
                  <button className="btn btn--outline" onClick={() => setStep(0)}>Back</button>
                  <button
                    className="btn btn--primary"
                    onClick={() => setStep(2)}
                    disabled={!selectedAddress}
                  >
                    Continue to Payment <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="checkout-panel">
                <h2 className="checkout-panel__title"><CreditCard size={18} /> Payment Method</h2>
                <div className="payment-options">
                  <div className="payment-option payment-option--selected">
                    <div className="payment-option__radio" />
                    <div className="payment-option__info">
                      <div className="payment-option__name">Korapay Secure Checkout</div>
                      <div className="payment-option__sub">Cards, Bank Transfer, Mobile Money</div>
                    </div>
                    <div className="payment-option__logos">
                      {['Visa', 'MC', 'Bank'].map((l) => (
                        <span key={l} className="payment-logo">{l}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="checkout-nav">
                  <button className="btn btn--outline" onClick={() => setStep(1)}>Back</button>
                  <button className="btn btn--primary" onClick={() => setStep(3)}>
                    Review Order <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirm */}
            {step === 3 && (
              <div className="checkout-panel">
                <h2 className="checkout-panel__title"><CheckCircle size={18} /> Confirm Order</h2>
                <div className="order-review">
                  <div className="order-review__section">
                    <h4>Delivery To</h4>
                    <p>{selectedAddress?.fullName}</p>
                    <p>{selectedAddress?.addressLine1}, {selectedAddress?.city}</p>
                    <p>{selectedAddress?.phone}</p>
                  </div>
                  <div className="order-review__section">
                    <h4>Payment</h4>
                    <p>Korapay Secure Checkout</p>
                  </div>
                </div>
                <div className="checkout-nav">
                  <button className="btn btn--outline" onClick={() => setStep(2)}>Back</button>
                  <button
                    className="btn btn--primary btn--lg"
                    onClick={() => placeOrderMutation.mutate()}
                    disabled={placeOrderMutation.isPending}
                  >
                    {placeOrderMutation.isPending
                      ? <><Loader2 size={18} className="spin" /> Processing…</>
                      : <>Place Order — ₦{total.toLocaleString()}</>
                    }
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
