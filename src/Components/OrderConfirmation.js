'use client';
import React from 'react';
import { useLocation, useNavigate } from '../router-compat';
import { FaCheckCircle, FaBox, FaCreditCard, FaMapMarkerAlt } from 'react-icons/fa';
import styles from './OrderConfirmation.module.css';

const OrderConfirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  // Default values if coming directly to this page
  const orderId = state?.orderId || 'N/A';
  const orderTotal = state?.orderTotal || 0;
  const shippingAddress = state?.shippingAddress || 'No address provided';

  const handleContinueShopping = () => {
    navigate('/products');
  };

  return (
    <div className={styles.container}>
      <div className={styles.confirmationCard}>
        <div className={styles.header}>
          <FaCheckCircle className={styles.successIcon} />
          <h1 className={styles.orderH1}>Order Confirmed!</h1>
          <p className={`${styles.subtitle} ${styles.orderP}`}>Thank you for your purchase</p>
        </div>

        <div className={styles.orderSummary}>
          <div className={styles.summaryItem}>
            <div className={styles.iconBox}>
              <FaBox className={styles.icon} />
            </div>
            <div>
              <h3 className={styles.orderH3}>Order Number</h3>
              <p className={styles.orderP}>{orderId}</p>
            </div>
          </div>

          <div className={styles.summaryItem}>
            <div className={styles.iconBox}>
              <FaCreditCard className={styles.icon} />
            </div>
            <div>
              <h3 className={styles.orderH3}>Total Paid</h3>
              <p className={styles.orderP}>Rs. {orderTotal.toLocaleString()}</p>
            </div>
          </div>

          <div className={styles.summaryItem}>
            <div className={styles.iconBox}>
              <FaMapMarkerAlt className={styles.icon} />
            </div>
            <div>
              <h3 className={styles.orderH3}>Shipping To</h3>
              <p className={styles.orderP}>{shippingAddress}</p>
            </div>
          </div>
        </div>

        <div className={styles.nextSteps}>
          <h2 >What's Next?</h2>
          <ol className={styles.stepsList}>
            <li>You'll receive an order confirmation EMAIL shortly</li>
            <li>We'll process your order within 24 hours</li>
            <li>You'll get a shipping notification when your items are dispatched</li>
          </ol>
        </div>

        <button 
          onClick={handleContinueShopping}
          className={styles.continueButton}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;