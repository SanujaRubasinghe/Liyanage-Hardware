import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../api"
import "./BuyingPage.css";

const BuyingPage = () => {
  const location = useLocation();
  const product = location.state || {};

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    country: "Sri Lanka",
    city: "",
    streetAddress: "",
    apartment: "",
    postcode: "",
    phone: "",
    email: "",
    orderNotes: "",
    paymentMethod: "bankTransfer",
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agreeTerms) {
      alert("You must agree to the terms and conditions.");
      return;
    } else {
      try {
        const res = await API.post("/products/purchase", formData)
        alert(res.data.message)
        window.location.href = '/products'
      } catch(err) {
        console.error(err)
      }
    }
    
  };

  const subtotal = product.productPrice * product.quantity;
  const shippingCost = 450;
  const total = subtotal + shippingCost;

  return (
    <div className="buying-page">
      <form className="billing-details" onSubmit={handleSubmit}>
        <h2>Billing Details</h2>
        <div className="form-group">
          <input type="text" name="firstName" placeholder="First name *" required onChange={handleChange} />
          <input type="text" name="lastName" placeholder="Last name *" required onChange={handleChange} />
        </div>
        <input type="text" name="companyName" placeholder="Company name (optional)" onChange={handleChange} />
        <input type="text" name="country" value="Sri Lanka" readOnly />
        <select name="city" required onChange={handleChange}>
          <option value="">Select a city *</option>
          <option value="Colombo">Colombo</option>
          <option value="Kandy">Kandy</option>
        </select>
        <input type="text" name="streetAddress" placeholder="Street address *" required onChange={handleChange} />
        <input type="text" name="apartment" placeholder="Apartment, suite, etc. (optional)" onChange={handleChange} />
        <input type="text" name="postcode" placeholder="Postcode / ZIP (optional)" onChange={handleChange} />
        <input type="tel" name="phone" placeholder="Phone *" required onChange={handleChange} />
        <input type="email" name="email" placeholder="Email address *" required onChange={handleChange} />
        <textarea name="orderNotes" placeholder="Order notes (optional)" onChange={handleChange}></textarea>

        <h2>Your Order</h2>
        <div className="order-summary">
          <p>
            {product.productName} ({product.selectedSize}, {product.selectedColor}) x {product.quantity}
          </p>
          <p>Subtotal: Rs. {subtotal.toLocaleString()}</p>
          <p>Shipping: Rs. {shippingCost.toLocaleString()}</p>
          <p><strong>Total: Rs. {total.toLocaleString()}</strong></p>
        </div>

        <div className="payment-options">
          <label>
            <input type="radio" name="paymentMethod" value="bankTransfer" checked={formData.paymentMethod === "bankTransfer"} onChange={handleChange} />
            Bank Transfer / QR Code
          </label>
          <label>
            <input type="radio" name="paymentMethod" value="cardPayment" checked={formData.paymentMethod === "cardPayment"} onChange={handleChange} />
            Pay with Visa / MasterCard / AMEX
          </label>
        </div>

        <label className="terms">
          <input type="checkbox" name="agreeTerms" onChange={handleChange} />
          I have read and agree to the website Terms and Conditions *
        </label>
        
        <button type="submit" onClick={handleSubmit}>Place Order</button>
      </form>
    </div>
  );
};

export default BuyingPage;
