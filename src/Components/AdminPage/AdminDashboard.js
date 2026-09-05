import React, { useState } from 'react';
import AdminPanel from './AdminPanel';
import AddCategoryForm from './AddCategoryForm';
import AddBannerForm from './AddBannerForm';
import AddBrandForm from './AddBrandForm';
import SubCategoryTable from './SubCategoryTable';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('product');

  return (
    <div className="admin-dashboard-container">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <h2>🛠️ Liyanage Admin</h2>
        </div>
        <nav className="admin-nav">
          <button
            className={`nav-item ${activeTab === 'product' ? 'active' : ''}`}
            onClick={() => setActiveTab('product')}
          >
            📦 Add Product
          </button>
          <button
            className={`nav-item ${activeTab === 'category' ? 'active' : ''}`}
            onClick={() => setActiveTab('category')}
          >
            🗂️ Add Categories (1st/2nd/3rd)
          </button>
          <button
            className={`nav-item ${activeTab === 'banner' ? 'active' : ''}`}
            onClick={() => setActiveTab('banner')}
          >
            🖼️ Add Banner Images
          </button>
          <button
            className={`nav-item ${activeTab === 'brand' ? 'active' : ''}`}
            onClick={() => setActiveTab('brand')}
          >
            🏷️ Add Brand Logos
          </button>
          <button
            className={`nav-item ${activeTab === 'subcategories' ? 'active' : ''}`}
            onClick={() => setActiveTab('subcategories')}
          >
            📋 Manage Categories Table
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main-content">
        {activeTab === 'product' && <AdminPanel />}
        {activeTab === 'category' && <AddCategoryForm />}
        {activeTab === 'banner' && <AddBannerForm />}
        {activeTab === 'brand' && <AddBrandForm />}
        {activeTab === 'subcategories' && <SubCategoryTable />}
      </main>
    </div>
  );
};

export default AdminDashboard;
