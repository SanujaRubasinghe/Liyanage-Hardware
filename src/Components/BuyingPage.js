import React, { useState, useEffect, useRef, useContext, use } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import API from "../api";
import styles from "./BuyingPage.module.css";
import { useCart } from "./CartContext";
import { checkConsent } from "../services/checkConsent";
import { useAuthContext } from "../context/AuthContext";
import {format} from 'date-fns'

const libraries = ["places"];
const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const BuyingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { product, cartItems } = location.state || {};
  const {clearCart} = useCart()

  const {user} = useAuthContext()
  
  // Order items from cart or single product
  const orderItems = product ? [product] : (cartItems || []);
  
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [coordinates, setCoordinates] = useState({})
  const [distance, setDistance] = useState(null);
  const [deliveryAvailable, setDeliveryAvailable] = useState(true)
  const [isOnlyCod, setIsOnlyCod] = useState(false)
  const [isOutOfRange, setIsOutOfRange] = useState(false)
  const [isOnlyColombo, setIsOnlyColombo] = useState(false)
  const [isFreeDelivery, setIsFreeDelivery] = useState(false)
  const [colomboOnlyNames, setColomboOnlyNames] = useState([])
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activePaymentTab, setActivePaymentTab] = useState("card");
  const streetAutocompleteRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    apartment: "",
    streetAddress: user?.address || "",
    postalCode: "",
    notes: "",
    agreeTerms: false,
  });

  useEffect(() => {
    if (product) {
      setDeliveryAvailable(product.delivery_available === 1);
      setIsOnlyCod(product.cod_only === 1);
      setIsOnlyColombo(product.colombo_only === 1);
      setActivePaymentTab(product.cod_only === 1 ? "cod" : "card");
    } else if (cartItems && cartItems.length > 0) {

      const deliveryAvailableForAll = cartItems.every(item => item.delivery_available === 1);
      const allCodOnly = cartItems.some(item => item.cod_only === 1);
      const anyColomboOnly = cartItems.some(item => item.colombo_only === 1);
      const colomboOnlyItems = cartItems.filter(item => item.colombo_only === 1);
      const colomboOnlyNames = colomboOnlyItems.map(item => item.name);

      setDeliveryAvailable(deliveryAvailableForAll);
      setIsOnlyCod(allCodOnly);
      setIsOnlyColombo(anyColomboOnly);
      setColomboOnlyNames(colomboOnlyNames)
      setActivePaymentTab(allCodOnly ? "cod" : "card");
    }
  }, [product, cartItems]);

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

    const address = { streetAddress: "", city: "", country: "" };

    place.address_components.forEach((c) => {
      const t = c.types;
      if (t.includes("street_number")) {
        address.streetAddress = c.long_name + " " + address.streetAddress;
      }
      if (t.includes("route")) {
        address.streetAddress += `${c.long_name}`;
      }

      if (t.includes("locality")) {
        address.streetAddress += `,${c.long_name}`;
      }

      if (t.includes("country")) {
        address.streetAddress += `,${c.long_name}`;
      }
      
    });

    setFormData((prev) => ({
      ...prev,
      ...address,
    }));
  };

  useEffect(() => {
  if (!formData.streetAddress) return;

  const debounceTimeout = setTimeout(() => {
    const handleCalculate = async () => {
      try {
        const userAddress = buildFullAddress(formData);
        const response = await API.post('/location/delivery-charges', { userAddress });
        
        const distance = Number(response.data.distanceInKm);
        const shippingCost = Number(response.data.shippingCost);
        const coordinates = response.data.location
        
        setDeliveryCharge(subtotal > 6000 ? 0 : shippingCost);
        setDistance(distance);
        setCoordinates(coordinates)
        setIsOutOfRange(distance > 20);
        setIsFreeDelivery(subtotal > 6000);
        setErrorMessage(response.data?.message);
      } catch (error) {
        console.error(error);
        setErrorMessage('Failed to calculate shipping. Please check the address.');
      }
    };

    handleCalculate();
  }, 800); // ⏱️ debounce delay (800ms)

  return () => clearTimeout(debounceTimeout); // 🧹 cleanup on unmount or input change
}, [formData.streetAddress, formData.postcode, subtotal]);


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

    const sendWhatsAppMessage = async (message) => {
      try {
        await API.post('/messages/send-wa-message', {
          message: message
        })
      } catch (err) {
        console.log(err)
      }
    }

    const sendCustomerEmail = async (toEmail, message) => {
      try {
        await API.post('/messages/send-order-email', {
          toEmail: toEmail,
          message: message
        })
      } catch (err) {
        console.log(err)
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
          userId: user?.user_id || null,
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
          })),
          latitude: coordinates.lat,
          longitude: coordinates.lng
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

        const emailData = {
          name: `${formData.firstName} ${formData.lastName}`,
          orderId: res.data.order_id,
          items: orderItems.map(item => ({
            name: item.name,
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.price,
          })),
          total: total,
          shipping_fee: deliveryCharge,
          date: format(new Date(), "dd/MM/yyyy")
        }

        // sendCustomerSMSMessage(convertToInternationalFormat(formData.phone), message)
        sendWhatsAppMessage(message)
        sendCustomerEmail(formData.email, emailData)

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
                placeholder="Email *"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />

              <input
                className={styles.input}
                type="tel"
                placeholder="Phone *"
                value={formData.phone}
                onChange={(e) => {
                  const newPhone = e.target.value;
                  if (/^\d{0,10}$/.test(newPhone)) { // Limit input to 10 digits
                    setFormData({ ...formData, phone: newPhone });
                  }
                }}
                required
              />
              {formData.phone && !/^0\d{9}$/.test(formData.phone) && (
                <p style={{ color: 'red' }}>Phone number must be 10 digits and start with 0</p>
              )}
            </div>

            <h2>Shipping Address</h2>
            <div className={styles.formRow}>
              <input
                className={styles.input}
                type="text"
                placeholder="First name *"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                required
              />
              <input
                className={styles.input}
                type="text"
                placeholder="Last name *"
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
                <div
                  key={index}
                  className={`${styles.orderItem} ${Boolean(item.colombo_only) ? styles.colomboOnlyItem : ''}`}
                >
                  <div className={styles.itemImage}>
                    <img
                      src={`${process.env.REACT_APP_API_BASE_URL}/${item.image}`}
                      alt={item.name}
                    />
                  </div>
                  <div className={styles.itemDetails}>
                    <h4>{item.name}</h4>
                    <p>{item.unit}</p>
                    <p>Qty: {item.quantity}</p>
                    {Boolean(item.colombo_only) && (
                      <p className={styles.colomboOnlyTag}>📍 Only deliverable within Colombo</p>
                    )}
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

            {/* {isOnlyColombo && (
              <div className={styles.deliveryOnlyColomboNotice}>
                🚫 Sorry! We currently do not deliver to addresses outside Colombo.
              </div>
            )} */}

            {isOnlyCod && (
              <div className={styles.codOnlyNotice}>
                💰 Only **Cash on Delivery** is available for this product(s).
              </div>
            )}

            {(!deliveryAvailable || (isOutOfRange && isOnlyColombo)) && (
              <div className={styles.noDeliveryNotice}>
                🚫 Delivery is not available to your location.
              </div>
            )}

            {deliveryAvailable && !isOutOfRange && isFreeDelivery && (
              <div className={styles.freeDeliveryNotice}>
                🎉 Good news! Free delivery is available to your location.
              </div>
            )}

            {/* Payment Methods */}
            {deliveryAvailable && !(isOutOfRange && isOnlyColombo) &&
            (<div className={styles.paymentMethods}>
              <div className={styles.paymentTabs}>
                {!isOnlyCod && (
                <button
                  className={`${styles.button} ${activePaymentTab === "card" ? styles.activeTab : ""}`}
                  onClick={() => setActivePaymentTab("card")}
                >
                  Credit/Debit Card
                </button>
                )}
                {!isOnlyCod && (
                <button
                  className={`${styles.button} ${activePaymentTab === "installment" ? styles.activeTab : ""}`}
                  onClick={() => setActivePaymentTab("installment")}
                >
                  Installments
                </button>
                )}
                <button
                  className={`${styles.button} ${activePaymentTab === "cod" ? styles.activeTab : ""}`}
                  onClick={() => setActivePaymentTab("cod")}
                >
                  Cash on Delivery
                </button>
                
              </div>
              
              {!isOnlyCod && activePaymentTab === "card" && (
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
              
              {!isOnlyCod && activePaymentTab === "installment" && (
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
            )}
            
            {deliveryAvailable && !isOutOfRange && (
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
            )}
          </section>
        </div>
      </LoadScript>
    </div>
  );
};

export default BuyingPage;