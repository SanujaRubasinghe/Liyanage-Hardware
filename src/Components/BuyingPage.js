import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import API from "../api";
import styles from "./BuyingPage.module.css";
import { useCart } from "./CartContext";
import { checkConsent } from "../services/checkConsent";

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

  const handleCodPayment = () => {
    handleSubmit('COD')
  }

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

    const trackCheckout = async (checkoutData) => {
      const hasConsent = checkConsent()
      if (!hasConsent) return

      try {
        await API.post('/analytics/user/checkout', checkoutData)
      } catch (error) {
        console.log('Checkout tracking failed: ', error)
      }
    }

    function convertToInternationalFormat(phoneNumber) {
      const digitsOnly = phoneNumber.replace(/\D/g, '');
    
      if (digitsOnly.startsWith('0') && digitsOnly.length === 10) {
        return `+94${digitsOnly.substring(1)}`;
      }
      return phoneNumber;
    }

    const sendCustomerSMSMessage = async (to, message) => {
      try {
        await API.post('/messages/send-sms-message', {
          to: to,
          message: message
        })
      } catch (error) {
        console.log('Failed to send sms message')
      }
    }


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
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          email: formData.email,
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
        
        const checkoutData = {
          amount: total,
          items_count: orderItems.length,
          status: 'pending'
        }

        const res = await API.post('/products/purchase', orderData);
        trackCheckout(checkoutData)

        const message = `
        Order Confirmation
        Thank you for shopping at New Liyanage Hardware!

        Order ID: NLOD-${res.data.order_id}
        Total: LKR ${Number(total).toFixed(2)}
        Contact: 072211324 / 0754232212
        `

        // sendCustomerSMSMessage(convertToInternationalFormat(formData.phone), message)

        clearCart()
        navigate('/order-confirmation', { 
          state: { 
            orderId: `${res.data.order_id}`,
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
            <h2 className={styles.h2}>Contact Information</h2>
            <div className={styles.formGroup}>
              <input
                type="email"
                className={styles.input}
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            
            <h2>Shipping Address</h2>
            <div className={styles.formRow}>
              <input
                className={styles.input}
                type="text"
                placeholder="First name"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                required
              />
              <input
                className={styles.input}
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
                className={styles.input}
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
                className={styles.input}
                type="text"
                placeholder="Apartment No"
                value={formData.apartment}
                onChange={(e) => setFormData({...formData, apartment: e.target.value})}
              />
              <input
                className={styles.input}
                type="text"
                placeholder="Postal code"
                value={formData.postalCode}
                onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
              />
            </div>
            
            <input
              className={styles.input}
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
            />
            
            <textarea
              className={styles.textarea}
              placeholder="Order notes (optional)"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </section>

          {/* Order Summary Section */}
          <section className={styles.orderSummary}>
            <h2 className={styles.h2}>Your Order</h2>
            
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
                  className={`${styles.button} ${activePaymentTab === "card" ? styles.activeTab : ""}`}
                  onClick={() => setActivePaymentTab("card")}
                >
                  Credit/Debit Card
                </button>
                <button
                  className={`${styles.button} ${activePaymentTab === "installment" ? styles.activeTab : ""}`}
                  onClick={() => setActivePaymentTab("installment")}
                >
                  Installments
                </button>
                <button
                  className={`${styles.button} ${activePaymentTab === "cod" ? styles.activeTab : ""}`}
                  onClick={() => setActivePaymentTab("cod")}
                >
                  Cash on Delivery
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
                      className={styles.button}
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
                      className={styles.button}
                      onClick={handleKokoPayment}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processing..." : "Pay with KoKo"}
                    </button>
                  </div>
                </div>
              )}
              {activePaymentTab === "cod" && (
                <div className={styles.paymentContent}>
                  <div className={styles.kokoPlaceholder}>
                    <h3>Cash on Delivery</h3>
                    <p>Order Now, Pay on Delivery!</p>
                    <br/>
                    <button 
                      className={styles.button}
                      onClick={handleCodPayment}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processing..." : "Cash On Delivery"}
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