'use client';

import dynamic from 'next/dynamic';

const AdminApp = dynamic(() => import('../../src/AdminPanel/App'), {
  ssr: false,
});

export default function AdminPage() {
  return <AdminApp />;
}
