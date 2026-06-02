// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { QueryClientProvider as QCP } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Layouts
import MainLayout from '@/components/layout/MainLayout';
import AdminLayout from '@/components/layout/AdminLayout';
import AuthLayout from '@/components/layout/AuthLayout';

// Public pages
import HomePage from '@/pages/HomePage';
import ShopPage from '@/pages/ShopPage';
import ProductPage from '@/pages/ProductPage';
import AboutPage from '@/pages/AboutPage';
import BlogPage from '@/pages/BlogPage';
import ContactPage from '@/pages/ContactPage';

// Auth pages
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import OtpPage from '@/pages/auth/OtpPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';

// User pages
import AccountPage from '@/pages/user/AccountPage';
import OrdersPage from '@/pages/user/OrdersPage';
import OrderDetailPage from '@/pages/user/OrderDetailPage';
import WishlistPage from '@/pages/user/WishlistPage';
import ProfilePage from '@/pages/user/ProfilePage';
import AddressesPage from '@/pages/user/AddressesPage';
import LoyaltyPage from '@/pages/user/LoyaltyPage';

// Checkout
import CheckoutPage from '@/pages/CheckoutPage';
import OrderConfirmationPage from '@/pages/OrderConfirmationPage';

// Admin pages
import AdminDashboard from '@/pages/admin/DashboardPage';
import AdminProducts from '@/pages/admin/ProductsPage';
import AdminProductForm from '@/pages/admin/ProductFormPage';
import AdminOrders from '@/pages/admin/OrdersPage';
import AdminOrderDetail from '@/pages/admin/OrderDetailPage';
import AdminCustomers from '@/pages/admin/CustomersPage';
import AdminCategories from '@/pages/admin/CategoriesPage';
import AdminBrands from '@/pages/admin/BrandsPage';
import AdminCoupons from '@/pages/admin/CouponsPage';
import AdminReviews from '@/pages/admin/ReviewsPage';
import AdminBanners from '@/pages/admin/BannersPage';
import AdminSettings from '@/pages/admin/SettingsPage';
import AdminInventory from '@/pages/admin/InventoryPage';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminRoute from '@/components/auth/AdminRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              background: '#111',
              color: '#fff',
              borderRadius: '12px',
              padding: '12px 18px',
            },
            success: { iconTheme: { primary: '#B76E79', secondary: '#fff' } },
            error: { iconTheme: { primary: '#e74c3c', secondary: '#fff' } },
          }}
        />

        <Routes>
          {/* Public Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/shop/:category" element={<ShopPage />} />
            <Route path="/products/:slug" element={<ProductPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/blogs" element={<BlogPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-otp" element={<OtpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          {/* Protected User Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/account" element={<AccountPage />} />
              <Route path="/account/orders" element={<OrdersPage />} />
              <Route path="/account/orders/:id" element={<OrderDetailPage />} />
              <Route path="/account/wishlist" element={<WishlistPage />} />
              <Route path="/account/profile" element={<ProfilePage />} />
              <Route path="/account/addresses" element={<AddressesPage />} />
              <Route path="/account/loyalty" element={<LoyaltyPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders/:id/confirmation" element={<OrderConfirmationPage />} />
            </Route>
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/products/new" element={<AdminProductForm />} />
              <Route path="/admin/products/:id/edit" element={<AdminProductForm />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
              <Route path="/admin/customers" element={<AdminCustomers />} />
              <Route path="/admin/categories" element={<AdminCategories />} />
              <Route path="/admin/brands" element={<AdminBrands />} />
              <Route path="/admin/coupons" element={<AdminCoupons />} />
              <Route path="/admin/reviews" element={<AdminReviews />} />
              <Route path="/admin/banners" element={<AdminBanners />} />
              <Route path="/admin/inventory" element={<AdminInventory />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
