// src/lib/api.js
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/auth.store';

const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - attach access token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor - handle 401 + token refresh
let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(token) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

export const refreshAccessToken = async () => {
  const { refreshToken, setTokens, logout } = useAuthStore.getState();
  if (!refreshToken) throw new Error('No refresh token');

  const res = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
  const { accessToken: newAccess, refreshToken: newRefresh } = res.data.data;
  setTokens(newAccess, newRefresh);
  return newAccess;
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(api(original));
          });
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const newAccess = await refreshAccessToken();
        onRefreshed(newAccess);
        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original);
      } catch {
        useAuthStore.getState().logout();
        toast.error('Session expired. Please login again.');
      } finally {
        isRefreshing = false;
      }
    }

    const message = error.response?.data?.message || 'Something went wrong';
    if (error.response?.status !== 401) {
      // Let callers decide whether to show toast
    }
    return Promise.reject(error);
  }
);

// ─── API HELPERS ─────────────────────────────────────────────

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  verifyRegistration: (data) => api.post('/auth/verify-registration', data),
  login: (data) => api.post('/auth/login', data),
  verifyLogin: (data) => api.post('/auth/verify-login', data),
  refresh: (data) => api.post('/auth/refresh', data),
  logout: (data) => api.post('/auth/logout', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  resendOtp: (data) => api.post('/auth/resend-otp', data),
  me: () => api.get('/auth/me'),
};

export const productApi = {
  list: (params) => api.get('/products', { params }),
  get: (slug) => api.get(`/products/${slug}`),
  related: (id) => api.get(`/products/${id}/related`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

export const currencyApi = {
  rate: () => api.get('/currency/rate'),
};

export const categoryApi = {
  list: () => api.get('/categories'),
  get: (slug) => api.get(`/categories/${slug}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const brandApi = {
  list: () => api.get('/brands'),
  create: (data) => api.post('/brands', data),
  update: (id, data) => api.put(`/brands/${id}`, data),
  delete: (id) => api.delete(`/brands/${id}`),
};

export const cartApi = {
  get: () => api.get('/cart'),
  add: (data) => api.post('/cart/add', data),
  update: (id, data) => api.patch(`/cart/${id}`, data),
  remove: (id) => api.delete(`/cart/${id}`),
  clear: () => api.delete('/cart'),
};

export const orderApi = {
  create: (data) => api.post('/orders', data),
  verify: (reference) => api.get(`/orders/verify/${reference}`),
  list: (params) => api.get('/orders', { params }),
  get: (id) => api.get(`/orders/${id}`),
  cancel: (id, data) => api.post(`/orders/${id}/cancel`, data),
  adminList: (params) => api.get('/orders/admin/all', { params }),
  updateStatus: (id, data) => api.patch(`/orders/admin/${id}/status`, data),
};

export const wishlistApi = {
  get: () => api.get('/wishlist'),
  toggle: (productId) => api.post('/wishlist/toggle', { productId }),
};

export const reviewApi = {
  list: (productId, params) => api.get(`/reviews/product/${productId}`, { params }),
  create: (data) => api.post('/reviews', data),
  updateStatus: (id, data) => api.patch(`/reviews/admin/${id}/status`, data),
};

export const couponApi = {
  validate: (data) => api.post('/coupons/validate', data),
  adminList: () => api.get('/coupons/admin'),
  create: (data) => api.post('/coupons/admin', data),
  update: (id, data) => api.put(`/coupons/admin/${id}`, data),
  delete: (id) => api.delete(`/coupons/admin/${id}`),
};

export const userApi = {
  profile: () => api.get('/users/profile'),
  updateProfile: (data) => api.patch('/users/profile', data),
  addresses: () => api.get('/users/addresses'),
  addAddress: (data) => api.post('/users/addresses', data),
  updateAddress: (id, data) => api.put(`/users/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/users/addresses/${id}`),
  recentlyViewed: () => api.get('/users/recently-viewed'),
  loyalty: () => api.get('/users/loyalty'),
};

export const adminApi = {
  dashboard: (params) => api.get('/admin/dashboard', { params }),
  customers: (params) => api.get('/admin/customers', { params }),
  updateCustomerStatus: (id, data) => api.patch(`/admin/customers/${id}/status`, data),
  inventory: (params) => api.get('/admin/inventory', { params }),
  updateInventory: (variantId, data) => api.patch(`/admin/inventory/${variantId}`, data),
};

export const cmsApi = {
  banners: (params) => api.get('/cms/banners', { params }),
  createBanner: (data) => api.post('/cms/banners', data),
  updateBanner: (id, data) => api.put(`/cms/banners/${id}`, data),
  deleteBanner: (id) => api.delete(`/cms/banners/${id}`),
  testimonials: () => api.get('/cms/testimonials'),
  settings: () => api.get('/cms/settings'),
  updateSettings: (data) => api.put('/cms/settings', data),
  subscribe: (data) => api.post('/cms/newsletter/subscribe', data),
};

export const uploadApi = {
  products: (formData) => api.post('/upload/product', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  avatar: (formData) => api.post('/upload/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  banner: (formData) => api.post('/upload/banner', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  logo: (formData) => api.post('/upload/logo', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};
