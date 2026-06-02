// src/pages/admin/ReviewsPage.jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, X, Star } from 'lucide-react';
import { reviewApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminReviewsPage() {
  const qc = useQueryClient();
  // Reviews without productId to get all pending (extend API if needed)
  const { data, isLoading } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: () => reviewApi.list('all', { status: 'PENDING', limit: 50 }),
    select: (r) => r.data.data,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => reviewApi.updateStatus(id, { status }),
    onSuccess: () => { toast.success('Review updated'); qc.invalidateQueries(['admin-reviews']); },
  });

  return (
    <div className="admin-page">
      <div className="admin-page__header"><h1 className="admin-page__title">Reviews Moderation</h1></div>
      <div className="admin-table-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Product</th><th>Customer</th><th>Rating</th><th>Review</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {isLoading
                ? Array(8).fill(0).map((_, i) => <tr key={i}>{Array(6).fill(0).map((_, j) => <td key={j}><div className="skeleton-line" style={{ height: 14 }} /></td>)}</tr>)
                : data?.reviews?.map((r) => (
                  <tr key={r.id}>
                    <td>{r.product?.name || '—'}</td>
                    <td>{r.user?.firstName} {r.user?.lastName}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 2 }}>
                        {Array(5).fill(0).map((_, i) => <Star key={i} size={12} fill={i < r.rating ? '#B76E79' : 'none'} stroke="#B76E79" />)}
                      </div>
                    </td>
                    <td className="admin-table__review-body">{r.body}</td>
                    <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="admin-actions">
                        <button className="admin-action-btn admin-action-btn--edit" title="Approve" onClick={() => updateMutation.mutate({ id: r.id, status: 'APPROVED' })}><Check size={14} /></button>
                        <button className="admin-action-btn admin-action-btn--delete" title="Reject" onClick={() => updateMutation.mutate({ id: r.id, status: 'REJECTED' })}><X size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
