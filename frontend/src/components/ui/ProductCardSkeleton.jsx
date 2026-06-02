// src/components/ui/ProductCardSkeleton.jsx
export default function ProductCardSkeleton() {
  return (
    <div className="product-card product-card--skeleton">
      <div className="skeleton-block product-card__img-wrap" style={{ height: 280 }} />
      <div className="product-card__body">
        <div className="skeleton-line" style={{ width: 70, height: 11, marginBottom: 6 }} />
        <div className="skeleton-line" style={{ width: '85%', height: 14, marginBottom: 4 }} />
        <div className="skeleton-line" style={{ width: '60%', height: 14, marginBottom: 10 }} />
        <div className="skeleton-line" style={{ width: 90, height: 12, marginBottom: 8 }} />
        <div className="skeleton-line" style={{ width: 110, height: 18 }} />
      </div>
    </div>
  );
}
