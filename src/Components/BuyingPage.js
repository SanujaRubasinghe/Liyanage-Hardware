import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import API from "../api";
import styles from "./BuyingPage.module.css";
import { useCart } from "./CartContext";

const libraries = ["places"];
const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const BuyingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { product, cartItems } = location.state || {};
  const {clearCart} = useCart()
  
  // Order items from cart or single product
  const orderItems = product ? [product] : (cartItems || []);
  
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [distance, setDistance] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activePaymentTab, setActivePaymentTab] = useState("card");
  const streetAutocompleteRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    apartment: "",
    address: "",
    postalCode: "",
    notes: "",
    agreeTerms: false,
  });

  // Calculate order totals
  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + deliveryCharge;

  // Payment handlers
  const handlePayHerePayment = async () => {
    setIsProcessing(true);
    try {
      console.log("Initiating PayHere payment...");
      await new Promise(resolve => setTimeout(resolve, 1500));
      handleSubmit('payhere')
    } catch (error) {
      console.error("PayHere payment failed:", error);
      setErrorMessage("Payment processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKokoPayment = async () => {
    setIsProcessing(true);
    try {
      // KoKo Pay integration placeholder
      console.log("Initiating KoKo Pay installment payment...");
      // In a real implementation, this would redirect to KoKo Pay
      await new Promise(resolve => setTimeout(resolve, 1500));
      handleSubmit('kokoPay')
    } catch (error) {
      console.error("KoKo Pay payment failed:", error);
      setErrorMessage("Payment processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  function buildFullAddress(data) {
    return [
      data.apartment,
      data.streetAddress,
      data.postcode,
    ]
      .filter(Boolean)
      .join(", ");
  }

  const handleStreetPlaceChanged = () => {
    const place = streetAutocompleteRef.current.getPlace();
    if (!place.address_components) return;

    const address = { streetAddress: "", postcode: "" };

    place.address_components.forEach((c) => {
      const t = c.types;
      if (t.includes("street_number")) {
        address.streetAddress = c.long_name + " " + address.streetAddress;
      }
      if (t.includes("route")) {
        address.streetAddress += c.long_name;
      }
     
      if (t.includes("postal_code")) {
        address.postcode = c.long_name;
      }
      
    });

    setFormData((prev) => ({
      ...prev,
      ...address,
    }));
  };

  useEffect(() => {
      if (!formData.streetAddress) return;
  
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
    }, [formData.streetAddress, formData.postcode]);

  const handleSubmit = async (paymentMethod) => {  
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
          payment_method: paymentMethod,
          payment_status: 'pending',
          shipping_cost: deliveryCharge,
          shipping_address: buildFullAddress(formData),
          billing_address: buildFullAddress(formData),
          tracking_number: null,
          notes: formData.orderNotes,
          items: orderItems.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.price,
            size: item.selectedSize,
            color: item.selectedColor
          }))
        };
  
        console.log(orderData)
        const res = await API.post('/products/purchase', orderData);
        
        alert('Order placed successfully!');
        clearCart()
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
    <div className={styles.checkoutContainer}>
      <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={libraries}>
        <div className={styles.checkoutGrid}>
          {/* Customer Information Section */}
          <section className={styles.customerInfo}>
            <h2>Contact Information</h2>
            <div className={styles.formGroup}>
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            
            <h2>Shipping Address</h2>
            <div className={styles.formRow}>
              <input
                type="text"
                placeholder="First name"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Last name"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                required
              />
            </div>
            
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
                onChange={(e) => setFormData({...formData, streetAddress: e.target.value})}
              />
            </Autocomplete>
            
            <div className={styles.formRow}>
              <input
                type="text"
                placeholder="Apartment No"
                value={formData.apartment}
                onChange={(e) => setFormData({...formData, apartment: e.target.value})}
              />
              <input
                type="text"
                placeholder="Postal code"
                value={formData.postalCode}
                onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
              />
            </div>
            
            <input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
            />
            
            <textarea
              placeholder="Order notes (optional)"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </section>

          {/* Order Summary Section */}
          <section className={styles.orderSummary}>
            <h2>Your Order</h2>
            
            <div className={styles.orderItems}>
              {orderItems.map((item, index) => (
                <div key={index} className={styles.orderItem}>
                  <div className={styles.itemImage}>
                    <img src={`${process.env.REACT_APP_API_BASE_URL}/${item.image}`} alt={item.name} />
                  </div>
                  <div className={styles.itemDetails}>
                    <h4>{item.name}</h4>
                    <p>{item.selectedSize}, {item.selectedColor}</p>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <div className={styles.itemPrice}>
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            
            <div className={styles.orderTotals}>
              <div className={styles.totalRow}>
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Shipping</span>
                <span>Rs. {deliveryCharge.toLocaleString()}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Tax</span>
                <span>Rs. 0.00</span>
              </div>
              <div className={styles.grandTotal}>
                <span>Total</span>
                <span>Rs. {total.toLocaleString()}</span>
              </div>
            </div>
            
            {/* Payment Methods */}
            <div className={styles.paymentMethods}>
              <div className={styles.paymentTabs}>
                <button
                  className={activePaymentTab === "card" ? styles.activeTab : ""}
                  onClick={() => setActivePaymentTab("card")}
                >
                  Credit/Debit Card
                </button>
                <button
                  className={activePaymentTab === "installment" ? styles.activeTab : ""}
                  onClick={() => setActivePaymentTab("installment")}
                >
                  Installments
                </button>
              </div>
              
              {activePaymentTab === "card" && (
                <div className={styles.paymentContent}>
                  <div className={styles.payherePlaceholder}>
                    <h3>PayHere Payment Gateway</h3>
                    <p>Secure credit/debit card payments</p>
                    <div className={styles.cardIcons}>
                      <span>VISA</span>
                      <span>MasterCard</span>
                      <span>AMEX</span>
                    </div>
                    <button 
                      onClick={handlePayHerePayment}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processing..." : "Pay with PayHere"}
                    </button>
                  </div>
                </div>
              )}
              
              {activePaymentTab === "installment" && (
                <div className={styles.paymentContent}>
                  <div className={styles.kokoPlaceholder}>
                    <h3>KoKo Pay Installments</h3>
                    <p>Flexible payment plans available</p>
                    <div className={styles.installmentOptions}>
                      <label>
                        <input type="radio" name="installment" defaultChecked />
                        3 Months - Rs. {(total / 3).toFixed(2)}/month
                      </label>
                      <label>
                        <input type="radio" name="installment" />
                        6 Months - Rs. {(total / 6).toFixed(2)}/month
                      </label>
                    </div>
                    <button 
                      onClick={handleKokoPayment}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processing..." : "Pay with KoKo"}
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className={styles.termsAgreement}>
              <label>
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({...formData, agreeTerms: e.target.checked})}
                  required
                />
                I agree to the terms and conditions
              </label>
            </div>
          </section>
        </div>
      </LoadScript>
    </div>
  );
};

export default BuyingPage;