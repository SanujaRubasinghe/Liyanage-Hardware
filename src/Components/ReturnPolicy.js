// src/Components/ReturnPolicy.jsx
import React from "react";
import "./TermsAndConditions.css";
import Footer from "./Footer";

export default function ReturnPolicy() {
  return (
    <div className="tc-page" style={{ backgroundImage: `url(/images/view.jpg)` }}>
      <div className="tc-container">
        <div className="tc-header">
          <h1 className="tc-title">Return, Refund, and Cancellation Policy</h1>
          <img
            src="/images/l1.png"
            alt="Liyanage Hardware Logo"
            className="tc-logo"
          />
        </div>
        {/* <p className="tc-last-updated">
          <strong>Effective Date:</strong> [Insert Date]
        </p> */}

        <section className="tc-section">
          <h2>1. Order Cancellation Policy</h2>
          <ul>
            <li>
              <strong>Before Dispatch:</strong> Customers can cancel their orders before the item is dispatched. To request a cancellation, please contact us at [Insert Contact Information] as soon as possible.
            </li>
            <li>
              <strong>After Dispatch:</strong> Once an order has been dispatched, it cannot be canceled. Customers may request a <strong>return</strong> (if eligible) after receiving the item.
            </li>
            <li>
              <strong>Cancellation by Us:</strong> We may cancel your order due to <strong>stock unavailability</strong>, pricing errors, payment issues, or logistical difficulties. If we cancel, you’ll receive a <strong>full refund</strong>.
            </li>
          </ul>
        </section>

        <section className="tc-section">
          <h2>2. Return Policy</h2>
          <ul>
            <li>
              <strong>Returns accepted</strong> if item is damaged, defective, or incorrect.
            </li>
            <li>Item must be unused, in original packaging, within [Insert Return Window] days.</li>
            <li>Non-returnable: Installed electronics, misused items, custom/clearance goods, missing packaging.</li>
          </ul>
          <ol>
            <li>Contact us with proof of purchase and photos/videos of the issue.</li>
            <li>Upon approval, follow our return instructions to send the item back.</li>
          </ol>
        </section>

        <section className="tc-section">
          <h2>3. Refund Policy</h2>
          <ul>
            <li>
              <strong>Online payments refunded</strong> to original method within [7–14 business days].
            </li>
            <li>
              Offline/bank payments refunded via bank transfer within [Insert Timeframe].
            </li>
            <li>
              Cash-on-delivery: choose <strong>store credit</strong> or bank refund.
            </li>
            <li>
              Partial/rejected refunds if item shows use, damage, missing parts, or late return.
            </li>
          </ul>
        </section>

        <section className="tc-section">
          <h2>4. Exchange Policy</h2>
          <p>
            If stock permits, <strong>eligible products</strong> can be exchanged instead of refunded.
          </p>
        </section>

        <section className="tc-section">
          <h2>5. Amendments and Updates</h2>
          <p>
            We reserve the right to <strong>modify this policy</strong> at any time. Changes take effect immediately upon posting.
          </p>
        </section>

        {/* <section className="tc-section">
          <h2>6. Contact Us</h2>
          <p>Email: [Insert Email]</p>
          <p>Phone: [Insert Phone Number]</p>
          <p>Address: [Insert Business Address]</p>
        </section> */}
      </div>
      
    </div>
    
  );
}
