// src/Components/Disclaimer.jsx
import React from "react";
import "./TermsAndConditions.css";

export default function Disclaimer() {
  return (
    <div className="tc-page" style={{ backgroundImage: `url(/images/view.jpg)` }}>
      <div className="tc-container">
        <div className="tc-header">
          <h1 className="tc-title">Disclaimer</h1>
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
          <p>
            The information on our site is for <strong>general informational</strong> and business purposes only.
          </p>
        </section>

        <section className="tc-section">
          <h2>1. General Information</h2>
          <ul>
            <li>Content—descriptions, images, pricing—is for reference only; accuracy not guaranteed.</li>
            <li>We may update details, prices, and policies <strong>without notice</strong>.</li>
          </ul>
        </section>

        <section className="tc-section">
          <h2>2. Product Availability & Pricing</h2>
          <ul>
            <li>Availability subject to stock and supplier conditions.</li>
            <li>Prices may differ in-store and <strong>change without notice</strong>.</li>
            <li>Offers are time-limited and subject to terms.</li>
          </ul>
        </section>

        <section className="tc-section">
          <h2>3. Limitation of Liability</h2>
          <ul>
            <li>
              Not liable for direct—incidental or consequential—damages from:
              <ul>
                <li>Website errors or interruptions.</li>
                <li>Inaccurate descriptions or pricing.</li>
                <li>Product misuse.</li>
                <li>Third-party delivery issues.</li>
              </ul>
            </li>
            <li>Please <strong>verify product details</strong> before purchase.</li>
          </ul>
        </section>

        <section className="tc-section">
          <h2>4. External Links & Third-Party Services</h2>
          <ul>
            <li>We don’t control or endorse external sites linked here.</li>
            <li>Not responsible for losses from third-party interactions.</li>
          </ul>
        </section>

        <section className="tc-section">
          <h2>5. Payment & Security Disclaimer</h2>
          <ul>
            <li>We take measures to secure transactions but can’t <strong>guarantee</strong> against cyber threats.</li>
            <li>Customers must enter payment details securely and avoid sharing them over unsecured channels.</li>
          </ul>
        </section>

        <section className="tc-section">
          <h2>6. Changes to This Disclaimer</h2>
          <p>
            We reserve the right to modify this Disclaimer at any time. Continued use signifies acceptance.
          </p>
        </section>

        {/* <section className="tc-section">
          <h2>7. Contact Us</h2>
          <p>Email: [Insert Email]</p>
          <p>Phone: [Insert Phone Number]</p>
          <p>Address: [Insert Business Address]</p>
        </section> */}
      </div>
    </div>
  );
}
