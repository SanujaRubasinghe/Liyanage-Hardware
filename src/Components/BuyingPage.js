// BuyingPage.jsx
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
  const product = location.state || {};

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
    if (!formData.streetAddress) return;

    const calc = async () => {
      try {
        const userAddress = buildFullAddress(formData);
        const res = await API.post("/location/delivery-charges", {
          userAddress,
        });
        setDeliveryCharge(res.data.shippingCost);
        setDistance(res.data.distanceInKm);
        setErrorMessage("");
      } catch {
        setErrorMessage(
          "Failed to calculate shipping. Please check the address."
        );
      }
    };
    calc();
  }, [formData.streetAddress]);

  const sendMessage = async (to, text) => {
    try {
      await API.post("/messages/send-message", { to, message: text });
    } catch (err) {
      console.error("Message error:", err.response?.data || err);
    }
  };

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
      return alert("You must agree to the terms and conditions.");
    }
    try {
      const orderText = `Product: ${product.productName}\nQuantity: ${product.quantity}\nName: ${formData.firstName} ${formData.lastName}\nPhone: ${formData.phone}`;
      await API.post("/products/purchase", formData);
      sendMessage(formData.phone, orderText);
      alert("Order placed successfully!");
      navigate("/products");
    } catch (err) {
      console.error(err);
      alert("Failed to place order.");
    }
  };

  const subtotal = product.productPrice * product.quantity;
  const total = subtotal + deliveryCharge;

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
              onChange={handleChange}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last name *"
              required
              onChange={handleChange}
            />
          </div>
          <input
            type="text"
            name="companyName"
            placeholder="Company name (optional)"
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
              onChange={handleChange}
            />
          </Autocomplete>
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
          />
          <input
            type="text"
            name="apartment"
            placeholder="Apartment, suite, etc. (optional)"
            onChange={handleChange}
          />
          <input
            type="text"
            name="postcode"
            placeholder="Postcode / ZIP (optional)"
            value={formData.postcode}
            onChange={handleChange}
          />
          <input type="text" name="country" value="Sri Lanka" readOnly />
          <input
            type="tel"
            name="phone"
            placeholder="Phone *"
            required
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email address *"
            required
            onChange={handleChange}
          />
          <textarea
            name="orderNotes"
            placeholder="Order notes (optional)"
            onChange={handleChange}
          ></textarea>

          <h2>Your Order</h2>
          <div className={styles.orderSummary}>
            <p>
              {product.productName} ({product.selectedSize},{" "}
              {product.selectedColor}) × {product.quantity}
            </p>
            <p>Subtotal: Rs. {subtotal.toLocaleString()}</p>
            <p>Shipping: Rs. {deliveryCharge.toLocaleString()}</p>
            <p>
              <strong>Total: Rs. {total.toLocaleString()}</strong>
            </p>
          </div>

          <div className={styles.paymentOptions}>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="bankTransfer"
                checked={formData.paymentMethod === "bankTransfer"}
                onChange={handleChange}
              />
              Bank Transfer / QR Code
            </label>
            <label>
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
              onChange={handleChange}
            />
            I have read and agree to the website Terms and Conditions *
          </label>

          <button type="submit" className={styles.placeOrderButton}>
            Place Order
          </button>
        </form>
      </LoadScript>
    </div>
  );
};

export default BuyingPage;
