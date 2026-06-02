// src/pages/user/WishlistPage.jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import { wishlistApi } from '@/lib/api';
import ProductCard from '@/components/shop/ProductCard';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['wishlist'], queryFn: () => wishlistApi.get(), select: (r) => r.data.data.items });
  return (
    <div className="user-page">
      <div className="container">
        <h1 className="user-page__title">My Wishlist <span className="user-page__count">({data?.length || 0})</span></h1>
        {data?.length === 0 ? (
          <div className="user-empty"><Heart size={48} /><h3>Your wishlist is empty</h3><p>Save products you love to buy later.</p></div>
        ) : (
          <div className="product-grid">{data?.map((item) => <ProductCard key={item.id} product={item.product} />)}</div>
        )}
      </div>
    </div>
  );
}
