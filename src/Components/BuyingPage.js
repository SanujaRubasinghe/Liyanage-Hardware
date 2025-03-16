import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../api"
import "./BuyingPage.css";

const BuyingPage = () => {
  const location = useLocation();
  const product = location.state || {};

  const [deliveryCharge, setDeliveryCharge] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')

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

  useEffect(() => {
    const getDeliveryCharges = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords
            
            try {
              const response = await API.post('/location/delivery-charges', {latitude, longitude})
  
              if (response.data.success) {
                setDeliveryCharge(response.data.charge)
                setErrorMessage('')
              } else {
                setDeliveryCharge(null)
                setErrorMessage('Delivery not available to your locaion')
              }
            } catch (err) {
              console.error("Error calculating delivery charges: ", err)
              setErrorMessage("Failed to calculate delivery charges. Please try again")
            } 
          },
          (error) => {
            switch (error) {
              case error.PERMISSION_DENIED:
                setErrorMessage('Location access denied. Please enable location or enter your address manually.');
                break;
              case error.POSITION_UNAVAILABLE:
                setErrorMessage('Location information is unavailable. Please check your device settings.');
                break;
              case error.TIMEOUT:
                setErrorMessage('Location request timed out. Please try again.');
                break;
              default:
                setErrorMessage('An unknown error occurred while retrieving your location.');
                break;
            }
          }
        )
      } else {
        setErrorMessage("Geolocation is not supported by your browser")
      }
      console.log(errorMessage)
    }

    getDeliveryCharges()
  }, [])

  

  const sendMessage = async (number, text) => {
    try {
      const response = await API.post("/messages/send-message", {
        to: number,
        message: text
      })
      console.log("Message sent: ", response.data)
    } catch (err) {
      console.error("Failed to send message: ", err.response.data)
    }
  }

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
        const order = `Product: ${product.productName}.
                       Product quantity: ${product.quantity}
                       Customer Name: ${formData.firstName} ${formData.lastName}
                       Phone number: ${formData.phone}`
                       
        const res = await API.post("/products/purchase", formData)
        sendMessage("+94707181470", order)
        alert(res.data.message)
        window.location.href = '/products'
      } catch(err) {
        console.error(err)
      }
    }
    
  };

  const subtotal = product.productPrice * product.quantity;
  const shippingCost = deliveryCharge || "Calculating..."
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
