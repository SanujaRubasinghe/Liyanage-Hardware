// src/Components/ShippingPolicy.jsx
import React from "react";
import "./TermsAndConditions.css";

export default function ShippingPolicy() {
  return (
    <div className="tc-page" style={{ backgroundImage: `url(/images/view.jpg)` }}>
      <div className="tc-container">
        <div className="tc-header">
          <h1 className="tc-title">Shipping & Delivery Policy</h1>
          <img
            src="/images/l1.png"
            alt="Liyanage Hardware Logo"
            className="tc-logo"
          />
        </div>
        <p className="tc-last-updated">
          <strong>Effective Date:</strong> [Insert Date]
        </p>

        <section className="tc-section">
          <h2>1. Shipping Areas and Eligibility</h2>
          <ul>
            <li><strong>Colombo District:</strong> Exclusive delivery zone.</li>
            <li><strong>Islandwide Delivery:</strong> All other regions.</li>
            <li><strong>Non-Deliverable Items:</strong> Pickup or special arrangements required.</li>
          </ul>
        </section>

        <section className="tc-section">
          <h2>2. Order Processing and Dispatch</h2>
          <ul>
            <li><strong>Order Confirmation:</strong> You’ll receive details & charges via email/SMS.</li>
            <li><strong>Processing Time:</strong> [Insert Processing Time, e.g., 24–48 hours].</li>
            <li><strong>Dispatch Notification:</strong> Tracking information when your order ships.</li>
          </ul>
        </section>

        <section className="tc-section">
          <h2>3. Shipping Charges and Delivery Timeframes</h2>
          <ul>
            <li>
              <strong>Fees:</strong> Calculated based on location, weight, and dimensions.
            </li>
            <li>
              <strong>Colombo:</strong> [1–2 business days]; <strong>Islandwide:</strong> [2–5 business days].
            </li>
          </ul>
        </section>

        <section className="tc-section">
          <h2>4. Customer Responsibilities</h2>
          <ul>
            <li>Provide <strong>accurate shipping details</strong>.</li>
            <li>Ensure someone is available to receive delivery.</li>
          </ul>
        </section>

        <section className="tc-section">
          <h2>5. Delivery Issues and Disclaimers</h2>
          <ul>
            <li>Not liable for delays due to <strong>weather</strong>, disasters, or carriers.</li>
            <li>Report <strong>damaged or lost shipments</strong> immediately; claims handled case-by-case.</li>
          </ul>
        </section>

        <section className="tc-section">
          <h2>6. Amendments and Updates</h2>
          <p>
            We may update this policy at any time; changes take effect immediately.
          </p>
        </section>

        <section className="tc-section">
          <h2>7. Contact Us</h2>
          <p>Email: [Insert Email Address]</p>
          <p>Phone: [Insert Phone Number]</p>
          <p>Address: [Insert Business Address]</p>
        </section>
      </div>
    </div>
  );
}
