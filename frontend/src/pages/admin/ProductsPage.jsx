// src/pages/admin/ProductsPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Edit, Trash2, Eye, Star, Package, Loader2 } from 'lucide-react';
import { productApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', page, search],
    queryFn: () => productApi.list({ page, limit: 20, search: search || undefined }),
    select: (r) => r.data.data,
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => productApi.delete(id),
    onSuccess: () => {
      toast.success('Product deleted');
      setDeleting(null);
      queryClient.invalidateQueries(['admin-products']);
    },
    onError: () => toast.error('Failed to delete product'),
  });

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Products</h1>
          <p className="admin-page__sub">{data?.pagination?.total || 0} total products</p>
        </div>
        <Link to="/admin/products/new" className="btn btn--primary">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="admin-filters">
        <div className="admin-search">
          <Search size={15} className="admin-search__icon" />
          <input
            type="text"
            placeholder="Search products..."
            className="admin-search__input"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 50 }}>
                  <input type="checkbox" />
                </th>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Sold</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array(10).fill(0).map((_, i) => (
                  <tr key={i}>
                    {Array(8).fill(0).map((_, j) => (
                      <td key={j}><div className="skeleton-line" style={{ height: 14, width: j === 1 ? 180 : 80 }} /></td>
                    ))}
                  </tr>
                ))
                : data?.products?.map((p) => (
                  <tr key={p.id}>
                    <td><input type="checkbox" /></td>
                    <td>
                      <div className="admin-product-cell">
                        <img
                          src={p.primaryImage || 'https://via.placeholder.com/40'}
                          alt={p.name}
                          className="admin-product-img"
                        />
                        <div>
                          <p className="admin-product-name">{p.name}</p>
                          <p className="admin-product-sku">{p.sku || 'No SKU'}</p>
                        </div>
                      </div>
                    </td>
                    <td>{p.category?.name || '—'}</td>
                    <td>
                      <div>
                        <span className="admin-price">GH₵{parseFloat(p.basePrice).toLocaleString()}</span>
                        {p.comparePrice && (
                          <span className="admin-price--compare">GH₵{parseFloat(p.comparePrice).toLocaleString()}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="admin-rating">
                        <Star size={12} fill="#B76E79" stroke="#B76E79" />
                        <span>{p.avgRating?.toFixed(1) || '0.0'}</span>
                        <span className="admin-rating__count">({p.reviewCount})</span>
                      </div>
                    </td>
                    <td>
                      <div className="admin-badges">
                        {p.isFeatured && <span className="badge badge--purple">Featured</span>}
                        {p.isBestSeller && <span className="badge badge--rose">Best Seller</span>}
                        {p.isNewArrival && <span className="badge badge--green">New</span>}
                        {p.isLimitedEdition && <span className="badge badge--gold">Limited</span>}
                      </div>
                    </td>
                    <td>{p.totalSold}</td>
                    <td>
                      <div className="admin-actions">
                        <Link to={`/products/${p.slug}`} className="admin-action-btn" title="View" target="_blank">
                          <Eye size={14} />
                        </Link>
                        <Link to={`/admin/products/${p.id}/edit`} className="admin-action-btn admin-action-btn--edit" title="Edit">
                          <Edit size={14} />
                        </Link>
                        {deleting === p.id ? (
                          <div className="admin-delete-confirm">
                            <button className="admin-action-btn admin-action-btn--danger"
                              onClick={() => deleteMutation.mutate(p.id)}
                              disabled={deleteMutation.isPending}
                            >
                              {deleteMutation.isPending ? <Loader2 size={12} className="spin" /> : 'Confirm'}
                            </button>
                            <button className="admin-action-btn" onClick={() => setDeleting(null)}>Cancel</button>
                          </div>
                        ) : (
                          <button className="admin-action-btn admin-action-btn--delete" title="Delete" onClick={() => setDeleting(p.id)}>
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data?.pagination && (
          <div className="admin-pagination">
            <span className="admin-pagination__info">
              Showing {((page - 1) * 20) + 1}–{Math.min(page * 20, data.pagination.total)} of {data.pagination.total}
            </span>
            <div className="admin-pagination__btns">
              <button className="admin-page-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
              {Array.from({ length: Math.min(5, data.pagination.totalPages) }, (_, i) => {
                const p = i + Math.max(1, page - 2);
                if (p > data.pagination.totalPages) return null;
                return (
                  <button key={p} className={`admin-page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                );
              })}
              <button className="admin-page-btn" disabled={page === data.pagination.totalPages} onClick={() => setPage(page + 1)}>Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
