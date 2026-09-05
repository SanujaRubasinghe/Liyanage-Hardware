'use client';
import dynamic from 'next/dynamic';

const BuyingPage = dynamic(() => import('../../src/Components/BuyingPage'), {
  ssr: false,
  loading: () => <div style={{ padding: '40px', textAlign: 'center' }}>Loading checkout...</div>,
});

export default function CheckoutPage() {
  return <BuyingPage />;
}
