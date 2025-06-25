import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import API from "../api";
import styles from "./BuyingPage.module.css";

const libraries = ["places"];
const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const BuyingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { product, cartItems } = location.state || {};
  
  // Convert to array of items - either single product or cart items
  const orderItems = product ? [product] : (cartItems || []);
  
  console.log(orderItems)

  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [distance, setDistance] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
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

  const streetAutocompleteRef = useRef(null);

  // Calculate order totals
  const subtotal = orderItems.reduce(
    (sum, item) => sum + (item.price * item.quantity), 
    0
  );
  const total = subtotal + deliveryCharge;

  function buildFullAddress(data) {
    return [
      data.streetAddress,
      data.apartment,
      data.city,
      data.postcode,
      data.country,
    ]
      .filter(Boolean)
      .join(", ");
  }

  const handleStreetPlaceChanged = () => {
    const place = streetAutocompleteRef.current.getPlace();
    if (!place.address_components) return;

    const address = { streetAddress: "", city: "", country: "", postcode: "" };

    place.address_components.forEach((c) => {
      const t = c.types;
      if (t.includes("street_number")) {
        address.streetAddress = c.long_name + " " + address.streetAddress;
      }
      if (t.includes("route")) {
        address.streetAddress += c.long_name;
      }
      if (t.includes("locality")) {
        address.city = c.long_name;
      }
      if (t.includes("postal_code")) {
        address.postcode = c.long_name;
      }
      if (t.includes("country")) {
        address.country = c.long_name;
      }
    });

    setFormData((prev) => ({
      ...prev,
      ...address,
    }));
  };

  useEffect(() => {
    if (!formData.streetAddress || !formData.city) return;

    const handleCalculate = async () => {
      try {
        const userAddress = buildFullAddress(formData);
        const response = await API.post('/location/delivery-charges', { userAddress });
        setDeliveryCharge(Number(response.data.shippingCost));
        setDistance(response.data.distanceInKm);
        setErrorMessage('');
      } catch (error) {
        console.error(error);
        setErrorMessage('Failed to calculate shipping. Please check the address.');
      }
    };

    handleCalculate();
  }, [formData.streetAddress, formData.city, formData.postcode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agreeTerms) {
      alert("You must agree to the terms and conditions.");
      return;
    }

    if (orderItems.length === 0) {
      alert("No items in your order.");
      return;
    }

    try {
      const orderData = {
        user_id: 1, // Should come from auth context
        phone: formData.phone,
        total_amount: total,
        status: 'pending',
        payment_method: formData.paymentMethod,
        payment_status: 'pending',
        shipping_address: buildFullAddress(formData),
        billing_address: buildFullAddress(formData),
        tracking_number: null,
        notes: formData.orderNotes,
        items: orderItems.map(item => ({
          product_id: item.productId,
          quantity: item.quantity,
          unit_price: item.productPrice,
          size: item.selectedSize,
          color: item.selectedColor
        }))
      };

      const res = await API.post('/products/purchase', orderData);
      
      alert('Order placed successfully!');
      navigate('/order-confirmation', { 
        state: { 
          orderId: res.data.id,
          orderTotal: total,
          shippingAddress: buildFullAddress(formData)
        } 
      });
    } catch (err) {
      console.error('Order submission failed:', err);
      alert('Order submission failed. Please try again.');
    }
  };

  return (
    <div className={styles.buyingPage}>
      <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={libraries}>
        <form className={styles.billingDetails} onSubmit={handleSubmit}>
          <h2>Billing Details</h2>
          
          <div className={styles.formGroup}>
            <input
              type="text"
              name="firstName"
              placeholder="First name *"
              required
              value={formData.firstName}
              onChange={handleChange}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last name *"
              required
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          
          <input
            type="text"
            name="companyName"
            placeholder="Company name (optional)"
            value={formData.companyName}
            onChange={handleChange}
          />

          <Autocomplete
            onLoad={(autoC) => (streetAutocompleteRef.current = autoC)}
            onPlaceChanged={handleStreetPlaceChanged}
            options={{
              types: ["address"],
              componentRestrictions: { country: "lk" },
            }}
          >
            <input
              type="text"
              name="streetAddress"
              placeholder="Street address *"
              required
              value={formData.streetAddress}
              onChange={handleChange}
            />
          </Autocomplete>
          
          <input
            type="text"
            name="city"
            placeholder="City *"
            required
            value={formData.city}
            onChange={handleChange}
          />
          
          <input
            type="text"
            name="apartment"
            placeholder="Apartment, suite, etc. (optional)"
            value={formData.apartment}
            onChange={handleChange}
          />
          
          <input
            type="text"
            name="postcode"
            placeholder="Postcode / ZIP (optional)"
            value={formData.postcode}
            onChange={handleChange}
          />
          
          <input 
            type="text" 
            name="country" 
            value="Sri Lanka" 
            readOnly 
          />
          
          <input
            type="tel"
            name="phone"
            placeholder="Phone *"
            required
            value={formData.phone}
            onChange={handleChange}
          />
          
          <input
            type="email"
            name="email"
            placeholder="Email address *"
            required
            value={formData.email}
            onChange={handleChange}
          />
          
          <textarea
            name="orderNotes"
            placeholder="Order notes (optional)"
            value={formData.orderNotes}
            onChange={handleChange}
          ></textarea>

          <h2>Your Order</h2>
          <div className={styles.orderSummary}>
            <div className={styles.orderItems}>
              {orderItems.map((item, index) => (
                <div key={index} className={styles.orderItem}>
                  <p>
                    {item.name} ({item.selectedSize}, {item.selectedColor}) × {item.quantity}
                    <span className={styles.itemPrice}>
                      Rs. {(Number(item.price) * item.quantity).toLocaleString()}
                    </span>
                  </p>
                </div>
              ))}
            </div>
            
            <div className={styles.orderTotals}>
              <p>Subtotal: Rs. {subtotal.toLocaleString()}</p>
              <p>Shipping: Rs. {deliveryCharge.toLocaleString()}</p>
              <p className={styles.orderTotal}>
                <strong>Total: Rs. {total.toLocaleString()}</strong>
              </p>
            </div>
          </div>

          <div className={styles.paymentOptions}>
            <h3>Payment Method</h3>
            <label className={styles.paymentMethod}>
              <input
                type="radio"
                name="paymentMethod"
                value="bankTransfer"
                checked={formData.paymentMethod === "bankTransfer"}
                onChange={handleChange}
              />
              Bank Transfer / QR Code
            </label>
            <label className={styles.paymentMethod}>
              <input
                type="radio"
                name="paymentMethod"
                value="cardPayment"
                checked={formData.paymentMethod === "cardPayment"}
                onChange={handleChange}
              />
              Pay with Visa / MasterCard / AMEX
            </label>
          </div>

          <label className={styles.terms}>
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              required
            />
            I have read and agree to the website Terms and Conditions *
          </label>

          {errorMessage && <p className={styles.error}>{errorMessage}</p>}

          <button type="submit" className={styles.placeOrderButton}>
            Place Order
          </button>
        </form>
      </LoadScript>
    </div>
  );
};

export default BuyingPage;
