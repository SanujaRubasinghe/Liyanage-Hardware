'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import { CartProvider } from './Components/CartContext';
import { AuthProvider } from './context/AuthContext';
import { RouterCompatProvider } from './router-compat';
import Navbar from './Navbar';
import Footer from './Components/Footer';
import ScrollToTop from './Components/ScrollToTop';
import WhatsAppButton from './Components/WhatsAppButton';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return children;
  }

  return (
    <RouterCompatProvider>
      <CartProvider>
        <AuthProvider>
          <ToastContainer position="top-right" autoClose={3000} />
          <Navbar />
          <ScrollToTop />
          <main style={{ minHeight: 'calc(100vh - 400px)' }}>{children}</main>
          <Footer />
          <WhatsAppButton />
        </AuthProvider>
      </CartProvider>
    </RouterCompatProvider>
  );
}
