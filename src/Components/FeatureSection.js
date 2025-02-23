import React from "react";
import "./FeatureSection.css";

const FeatureSection = () => {
  return (
    <div className="feature-container">
      <div className="feature">
        <h3>A GREAT CUSTOMER SERVICE TEAM</h3>
        <p>Our dedicated customer service team are always happy to help with any enquiry.</p>
      </div>
      <div className="divider"></div>
      <div className="feature">
        <h3>TREAT YOURSELF TO A Rs.1000 DISCOUNT ON ORDERS OVER Rs.25 000</h3>
        <p>Spend over Rs.25 000 today and receive an automatic Rs.1000 discount at checkout.</p>
      </div>
      <div className="divider"></div>
      <div className="feature">
        <h3>EXCELLENT REVIEWS – "GREAT QUALITY & PRICE."</h3>
        <p>Happy customers and fantastic products result in excellent reviews, and we have plenty of them!</p>
      </div>
    </div>
  );
};

export default FeatureSection;
