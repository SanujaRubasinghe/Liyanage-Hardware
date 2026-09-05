'use client';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import { CartProvider } from './Components/CartContext';
import { AuthProvider } from './context/AuthContext';
import { RouterCompatProvider } from './router-compat';
import Navbar from './Navbar';
import Footer from './Components/Footer';
import ScrollToTop from './Components/ScrollToTop';

export default function ClientLayout({ children }) {
  return (
    <RouterCompatProvider>
      <CartProvider>
        <AuthProvider>
          <ToastContainer position="top-right" autoClose={3000} />
          <Navbar />
          <ScrollToTop />
          <main style={{ minHeight: 'calc(100vh - 400px)' }}>{children}</main>
          <Footer />
        </AuthProvider>
      </CartProvider>
    </RouterCompatProvider>
  );
}
