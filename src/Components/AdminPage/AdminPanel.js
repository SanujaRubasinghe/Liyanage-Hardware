import React from "react";
import "./AdminPanel.css";

const AdminPanel = () => {
  return (
    <div className="container">
      <div className="panel">
        <h2 className="title">Products <span className="subtitle">Add New Product</span></h2>
        <div className="grid-container">
          <input type="text" placeholder="Product name" className="input" />
          <input type="text" placeholder="SKU" className="input" />
          <select className="input"><option>Code 128 (C128)</option></select>
          <select className="input"><option>Select Unit</option></select>
          <select className="input"><option>Select Brand</option></select>
          <select className="input"><option>Select Category</option></select>
          <select className="input"><option>Select Sub Categories</option></select>
          <select className="input"><option>Select Business Location</option></select>
          <input type="text" placeholder="Manage Stock" className="input" />
          <input type="text" placeholder="Alert Quantity" className="input" />
          <input type="text" placeholder="Weight" className="input" />
          <input type="checkbox" className="checkbox" />
          <input type="text" placeholder="Short Description" className="input description" />
          <button className="upload-btn">Upload Product Image</button>
          <select className="input"><option>None</option></select>
          <select className="input"><option>Exclusive</option></select>
          <select className="input"><option>Single</option></select>
          <input type="text" placeholder="Exc. Tax" className="input" />
          <select className="input"><option>Inc. Tax</option></select>
          <input type="text" placeholder="Margin %" className="input" />
          <input type="text" placeholder="Default Selling Price (Exc. tax)" className="input" />
          <input type="text" placeholder="Default Selling Price (Inc. tax)" className="input" />
        </div>
        <div className="button-group">
          <button className="add-btn">Add</button>
          <button className="close-btn">Close</button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;