import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./AdminLayout.css"; // ✅ Make sure the CSS file is imported

const AdminLayout = () => {
  return (
    <div className="admin-container">
      {/* Sidebar */}
      <nav className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li><Link to="/admin/home">Product List</Link></li>
          <li><Link to="/admin/category">Add products</Link></li>
          <li><Link to="/admin/subcategory">tab 3</Link></li>
          <li><Link to="/admin/products">tab 4</Link></li>
          <li><Link to="/admin/orders">Orders</Link></li>
        </ul>
      </nav>

      {/* Main content */}
      <div className="main-content">
        <Outlet /> {/* ✅ Displays the selected route content */}
      </div>
    </div>
  );
};

export default AdminLayout;
