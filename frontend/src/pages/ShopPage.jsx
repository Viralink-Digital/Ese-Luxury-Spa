// src/pages/ShopPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { SlidersHorizontal, X, ChevronDown, ChevronUp, Search, LayoutGrid, List } from 'lucide-react';
import { productApi, categoryApi, brandApi } from '@/lib/api';
import ProductCard from '@/components/shop/ProductCard';
import ProductCardSkeleton from '@/components/ui/ProductCardSkeleton';
import Pagination from '@/components/ui/Pagination';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

const PRICE_RANGES = [
  { label: 'Under GH₵5,000', min: 0, max: 5000 },
  { label: 'GH₵5,000 – GH₵15,000', min: 5000, max: 15000 },
  { label: 'GH₵15,000 – GH₵30,000', min: 15000, max: 30000 },
  { label: 'GH₵30,000 – GH₵50,000', min: 30000, max: 50000 },
  { label: 'Over GH₵50,000', min: 50000, max: undefined },
];

export default function ShopPage() {
  const { category: categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [openSections, setOpenSections] = useState({ categories: true, brands: true, price: true, ratings: false });

  const params = {
    page: searchParams.get('page') || 1,
    limit: 20,
    sort: searchParams.get('sort') || 'newest',
    search: searchParams.get('search') || undefined,
    category: categorySlug || searchParams.get('category') || undefined,
    brand: searchParams.get('brand') || undefined,
    minPrice: searchParams.get('minPrice') || undefined,
    maxPrice: searchParams.get('maxPrice') || undefined,
    bestSeller: searchParams.get('bestSeller') || undefined,
    newArrival: searchParams.get('newArrival') || undefined,
    featured: searchParams.get('featured') || undefined,
    rating: searchParams.get('rating') || undefined,
  };

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['products', params],
    queryFn: () => productApi.list(params),
    select: (r) => r.data.data,
    keepPreviousData: true,
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

  const updateParam = useCallback((key, value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value);
      else next.delete(key);
      next.set('page', '1');
      return next;
    });
  }, [setSearchParams]);

  const toggleSection = (key) => setOpenSections((s) => ({ ...s, [key]: !s[key] }));

  const activeFiltersCount = ['category', 'brand', 'minPrice', 'rating', 'bestSeller', 'newArrival']
    .filter((k) => searchParams.get(k)).length;

  const clearAllFilters = () => {
    setSearchParams({ page: '1', sort: params.sort });
  };

  const FilterSection = ({ title, sectionKey, children }) => (
    <div className="filter-section">
      <button className="filter-section__header" onClick={() => toggleSection(sectionKey)}>
        <span>{title}</span>
        {openSections[sectionKey] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {openSections[sectionKey] && <div className="filter-section__body">{children}</div>}
    </div>
  );

  return (
    <div className="shop-page">
      <div className="container">
        {/* Header */}
        <div className="shop-header">
          <div>
            <p className="section-eyebrow">{categorySlug ? categorySlug.replace(/-/g, ' ') : 'All Products'}</p>
            <h1 className="shop-header__title">
              {data?.pagination?.total || 0} Products
            </h1>
          </div>
          <div className="shop-controls">
            <div className="shop-search">
              <Search size={15} className="shop-search__icon" />
              <input
                type="text"
                placeholder="Search products..."
                className="shop-search__input"
                defaultValue={params.search}
                onChange={(e) => {
                  const v = e.target.value;
                  clearTimeout(window._shopSearchTimer);
                  window._shopSearchTimer = setTimeout(() => updateParam('search', v), 400);
                }}
              />
            </div>
            <select
              className="shop-sort"
              value={params.sort}
              onChange={(e) => updateParam('sort', e.target.value)}
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <div className="shop-view-toggle">
              <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}><LayoutGrid size={16} /></button>
              <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}><List size={16} /></button>
            </div>
            <button className="btn btn--outline btn--sm" onClick={() => setFiltersOpen(!filtersOpen)}>
              <SlidersHorizontal size={15} /> Filters
              {activeFiltersCount > 0 && <span className="filter-count">{activeFiltersCount}</span>}
            </button>
          </div>
        </div>

        {/* Active filter chips */}
        {activeFiltersCount > 0 && (
          <div className="active-filters">
            {['category', 'brand', 'minPrice', 'rating', 'bestSeller', 'newArrival'].map((k) => {
              const v = searchParams.get(k);
              if (!v) return null;
              return (
                <span key={k} className="filter-chip">
                  {k}: {v} <button onClick={() => updateParam(k, '')}><X size={11} /></button>
                </span>
              );
            })}
            <button className="filter-chip filter-chip--clear" onClick={clearAllFilters}>Clear All</button>
          </div>
        )}

        <div className="shop-layout">
          {/* Sidebar Filters */}
          <aside className={`shop-filters ${filtersOpen ? 'shop-filters--open' : ''}`}>
            <div className="shop-filters__header">
              <h3>Filters</h3>
              {activeFiltersCount > 0 && (
                <button className="filter-clear-btn" onClick={clearAllFilters}>Clear all</button>
              )}
              <button className="shop-filters__close" onClick={() => setFiltersOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {/* Categories */}
            <FilterSection title="Categories" sectionKey="categories">
              {categories?.map((cat) => (
                <label key={cat.id} className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    checked={params.category === cat.slug}
                    onChange={() => updateParam('category', cat.slug)}
                  />
                  <span>{cat.name}</span>
                  <span className="filter-option__count">{cat._count?.products || 0}</span>
                </label>
              ))}
            </FilterSection>

            {/* Brands */}
            <FilterSection title="Brands" sectionKey="brands">
              {brands?.map((brand) => (
                <label key={brand.id} className="filter-option">
                  <input
                    type="checkbox"
                    checked={params.brand === brand.id}
                    onChange={(e) => updateParam('brand', e.target.checked ? brand.id : '')}
                  />
                  <span>{brand.name}</span>
                </label>
              ))}
            </FilterSection>

            {/* Price */}
            <FilterSection title="Price Range" sectionKey="price">
              {PRICE_RANGES.map((range) => (
                <label key={range.label} className="filter-option">
                  <input
                    type="radio"
                    name="price"
                    checked={params.minPrice == range.min && params.maxPrice == range.max}
                    onChange={() => {
                      updateParam('minPrice', range.min);
                      updateParam('maxPrice', range.max || '');
                    }}
                  />
                  <span>{range.label}</span>
                </label>
              ))}
            </FilterSection>

            {/* Ratings */}
            <FilterSection title="Minimum Rating" sectionKey="ratings">
              {[4, 3, 2].map((r) => (
                <label key={r} className="filter-option">
                  <input
                    type="radio"
                    name="rating"
                    checked={params.rating == r}
                    onChange={() => updateParam('rating', r)}
                  />
                  <span className="filter-stars">
                    {Array(5).fill(0).map((_, i) => (
                      <span key={i} style={{ color: i < r ? '#B76E79' : '#ddd' }}>★</span>
                    ))}
                    <span> & Up</span>
                  </span>
                </label>
              ))}
            </FilterSection>

            {/* Quick Filters */}
            <FilterSection title="Collection" sectionKey="collection">
              {[
                { label: 'Best Sellers', key: 'bestSeller' },
                { label: 'New Arrivals', key: 'newArrival' },
                { label: 'Featured', key: 'featured' },
                { label: 'Limited Edition', key: 'limitedEdition' },
              ].map(({ label, key }) => (
                <label key={key} className="filter-option">
                  <input
                    type="checkbox"
                    checked={searchParams.get(key) === 'true'}
                    onChange={(e) => updateParam(key, e.target.checked ? 'true' : '')}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </FilterSection>
          </aside>

          {/* Products Grid */}
          <div className="shop-products">
            {isLoading || isFetching ? (
              <div className={`product-grid ${viewMode === 'list' ? 'product-grid--list' : ''}`}>
                {Array(12).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : data?.products?.length === 0 ? (
              <div className="shop-empty">
                <div className="shop-empty__icon">🔍</div>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search term</p>
                <button className="btn btn--primary" onClick={clearAllFilters}>Clear Filters</button>
              </div>
            ) : (
              <>
                <div className={`product-grid ${viewMode === 'list' ? 'product-grid--list' : ''}`}>
                  {data?.products?.map((p, i) => <ProductCard key={p.id} product={p} delay={i * 40} listView={viewMode === 'list'} />)}
                </div>
                {data?.pagination && (
                  <Pagination
                    currentPage={parseInt(params.page)}
                    totalPages={data.pagination.totalPages}
                    onPageChange={(p) => updateParam('page', p)}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
