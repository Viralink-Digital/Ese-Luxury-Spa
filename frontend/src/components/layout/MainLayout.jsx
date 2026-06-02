// src/components/layout/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from '@/components/shop/CartDrawer';
import SearchModal from '@/components/shop/SearchModal';
import WhatsAppButton from '@/components/ui/WhatsAppButton';

export default function MainLayout() {
  return (
    <div className="main-layout">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <SearchModal />
      <WhatsAppButton />
    </div>
  );
}
