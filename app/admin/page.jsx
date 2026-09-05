'use client';

import dynamic from 'next/dynamic';

const AdminDashboard = dynamic(() => import('../../src/Components/AdminPage/AdminDashboard'), {
  ssr: false,
});

export default function AdminPage() {
  return <AdminDashboard />;
}
