import React, { useState } from "react";
import API from "../../api";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [productData, setProductData] = useState({
    productName: "",
    productId: "",
    sku: "",
    code: "",
    unit: "",
    brand: "",
    category: "",
    subcategory: "",
    deliveryStatus: "",
    deliveryAllowed: "",
    stock: "",
    alertQuantity: "",
    weight: "",
    desc: "",
    price: ""
  })

  const handleChange = (e) => {
    const {name, value} = e.target
    setProductData({...productData, [name]: value})
  }

  const handleSubmit = async () => {
    try {
        const res = await API.post("/products/addproduct", productData)
        alert(res.data.message)
    } catch(err) {
      console.error("Error adding new product: ", err)
    }
  }
  return (
    <div className="container">
      <div className="panel">
        <h2 className="title">Products <span className="subtitle">Add New Product</span></h2>
        <div className="grid-container">

          <input type="text" name="productName" placeholder="Product name" className="input" onChange={handleChange} />
          
          <input type="text" name="productId" placeholder="Product Id" className="input" onChange={handleChange} />

          <input type="text" name="sku" placeholder="SKU" className="input" onChange={handleChange} />

          <select className="input" name="code" onChange={handleChange}><option>Code 128 (C128)</option></select>

          <select className="input" name="unit" onChange={handleChange}>
            <option value="">Select Unit</option>
            <option value="1 pack">1 pack</option>
            <option value="1 unit">1 unit</option>
          </select>

          <select className="input" name="brand" onChange={handleChange}>
            <option value=''>Select Brand</option>
            <option value='test'>Test Brand</option>
          </select>

          <select className="input" name="category" onChange={handleChange}>
            <option value="">Select Category</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>

          <select className="input" name="subcategory" onChange={handleChange}>
            <option value="">Select Sub Categories</option>
            <option value="st001">st001</option>
            <option value="st002">st002</option>
            <option value="st003">st003</option>
            <option value="st004">st004</option>
          </select>
          
          <select className="input" name="deliveryStatus" onChange={handleChange}>
            <option value="">Delivery Status</option>
            <option value="cl001">Withing Colombo</option>
            <option value="ai001">Region 01</option>
            <option value="ai002">Region 02</option>
            <option value="ai003">Region 03</option>
          </select>
          
          <select className="input" name="deliveryAllowed" onChange={handleChange}>
            <option value=''>Delivery Allowed</option>
            <option value='Y'>Yes</option>
            <option value='N'>No</option>
          </select>

          <input type="text" name="stock" placeholder="Manage Stock" className="input" onChange={handleChange} />

          <input type="text" name="alertQuantity" placeholder="Alert Quantity" className="input" onChange={handleChange} />

          <input type="text" name="weight" placeholder="Weight" className="input" onChange={handleChange}/>

          <input type="text" name="desc" placeholder="Short Description" className="input description" onChange={handleChange}/>

          <input type="text" name="price" placeholder="Default Selling Price (Inc. tax)" className="input" onChange={handleChange}/>
        </div>
        <div className="button-group">
          <button className="add-btn" onClick={handleSubmit}>Add</button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;