// src/components/shop/SearchModal.jsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, TrendingUp, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/lib/api';
import { useCurrencyStore } from '@/store/currency.store';
import { useUiStore } from '@/store/cart.store';
import { formatDualPrice } from '@/lib/price';

const TRENDING = ['Rose Serum', 'Lip Gloss', 'Sunscreen', 'Body Butter', 'Face Mask'];

export default function SearchModal() {
  const { searchOpen, setSearchOpen } = useUiStore();
  const ghanaNairaRate = useCurrencyStore((state) => state.ghanaNairaRate);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  const { data: results, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () => productApi.list({ search: query, limit: 5 }),
    enabled: query.length >= 2,
    select: (r) => r.data.data.products,
  });

  useEffect(() => {
    if (searchOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setSearchOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  if (!searchOpen) return null;

  return (
    <div className="search-modal" role="dialog" aria-label="Search">
      <div className="search-modal__backdrop" onClick={() => setSearchOpen(false)} />
      <div className="search-modal__box">
        <div className="search-modal__input-wrap">
          <Search size={20} className="search-modal__icon" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for products, brands, categories..."
            className="search-modal__input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button className="search-modal__clear" onClick={() => setQuery('')}>
              <X size={16} />
            </button>
          )}
          <button className="search-modal__close-btn" onClick={() => setSearchOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="search-modal__content">
          {query.length < 2 ? (
            <div className="search-trending">
              <p className="search-trending__label">
                <TrendingUp size={14} /> Trending Searches
              </p>
              <div className="search-trending__tags">
                {TRENDING.map((t) => (
                  <button
                    key={t}
                    className="search-trending__tag"
                    onClick={() => setQuery(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          ) : isLoading ? (
            <div className="search-results">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="search-result-skeleton">
                  <div className="skeleton-block" style={{ width: 48, height: 48, borderRadius: 8 }} />
                  <div>
                    <div className="skeleton-line" style={{ width: 150, height: 14, marginBottom: 6 }} />
                    <div className="skeleton-line" style={{ width: 80, height: 12 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : results?.length === 0 ? (
            <div className="search-empty">
              <p>No results for "<strong>{query}</strong>"</p>
              <p className="search-empty__sub">Try different keywords or browse our shop</p>
            </div>
          ) : (
            <div className="search-results">
              {results?.map((p) => (
                <Link
                  key={p.id}
                  to={`/products/${p.slug}`}
                  className="search-result"
                  onClick={() => setSearchOpen(false)}
                >
                  <img
                    src={p.primaryImage || 'https://via.placeholder.com/48'}
                    alt={p.name}
                    className="search-result__img"
                  />
                  <div className="search-result__info">
                    <p className="search-result__name">{p.name}</p>
                    <p className="search-result__cat">{p.category?.name}</p>
                  </div>
                  <span className="search-result__price">{formatDualPrice(p.basePrice, ghanaNairaRate).cedi}</span>
                  <ArrowRight size={14} className="search-result__arrow" />
                </Link>
              ))}

              <Link
                to={`/shop?search=${encodeURIComponent(query)}`}
                className="search-view-all"
                onClick={() => setSearchOpen(false)}
              >
                View all results for "{query}" <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
