'use client';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import { CartProvider } from './Components/CartContext';
import { AuthProvider } from './context/AuthContext';
import { RouterCompatProvider } from './router-compat';
import Navbar from './Navbar';
import ScrollToTop from './Components/ScrollToTop';

export default function ClientLayout({ children }) {
  return (
    <RouterCompatProvider>
      <CartProvider>
        <AuthProvider>
          <ToastContainer position="top-right" autoClose={3000} />
          <Navbar />
          <ScrollToTop />
          <main>{children}</main>
        </AuthProvider>
      </CartProvider>
    </RouterCompatProvider>
  );
}
