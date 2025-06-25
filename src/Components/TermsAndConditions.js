import React from "react";
import "./TermsAndConditions.css";

function TermsAndConditions() {
  return (
    <div
      className="tc-page"
      style={{ backgroundImage: `url(/images/view.jpg)` }}
    >
      <div className="tc-container">
        <div className="tc-header">
          <h1 className="tc-title">Terms &amp; Conditions</h1>
          <img
            src="/images/l1.png"
            alt="Liyanage Hardware Logo"
            className="tc-logo"
          />
        </div>
        <p className="tc-last-updated">Last Updated: [Insert Date]</p>

        <section className="tc-section">
          <h2>1. Acceptance of Terms</h2>
          <ul>
            <li>
              <strong>Binding Agreement:</strong> Your use of the Website
              constitutes your agreement to these Terms &amp; Conditions.
            </li>
            <li>
              <strong>Updates:</strong> Liyanage Hardware reserves the right to
              modify these Terms at any time. It is your responsibility to
              review the Terms periodically for any changes.
            </li>
          </ul>
        </section>

        <section className="tc-section">
          <h2>2. Product Listings &amp; Order Placement</h2>
          <ul>
            <li>
              <strong>Product Information:</strong> All product listings
              include descriptions, images, pricing, delivery details, and any
              applicable restrictions. It is your responsibility to review the
              product details prior to placing an order.
            </li>
            <li>
              <strong>Order Process:</strong> Orders are placed through our
              Website. For products that require offline payment, our marketing
              team will contact you with the necessary bank details after your
              order submission.
            </li>
            <li>
              <strong>Order Confirmation:</strong> Once your order is placed,
              you will receive an order confirmation via email or SMS outlining
              your selected items and applicable terms.
            </li>
          </ul>
        </section>

        <section className="tc-section">
          <h2>3. Payment Terms</h2>
          <ul>
            <li>
              <strong>Online Payments:</strong> For items that support online
              payment, payment is processed securely at the time of order
              placement.
            </li>
            <li>
              <strong>Offline Payment:</strong> For items that do not support
              online payments, your order will be confirmed and our sales team
              will provide bank details. Your order will be processed upon
              receipt of payment.
            </li>
            <li>
              <strong>Payment Security:</strong> All online payment transactions
              are processed through secure payment gateways. Liyanage Hardware
              is not responsible for issues arising from third-party payment
              providers.
            </li>
          </ul>
        </section>

        <section className="tc-section">
          <h2>4. Delivery Policy</h2>
          <ul>
            <li>
              <strong>Delivery Areas:</strong> Some items are restricted to
              delivery within the Colombo district. Other items are available
              for island-wide delivery. Certain items may not be available for
              delivery and are subject to local pick-up or alternative
              arrangements.
            </li>
            <li>
              <strong>Filtering Mechanism:</strong> Our Website provides
              filtering options so that only items eligible for delivery to
              your specified location are available for purchase.
            </li>
            <li>
              <strong>Delivery Charges &amp; Timeframes:</strong> Delivery
              charges, estimated delivery times, and any additional fees are
              specified on the individual product pages. These details are
              subject to change based on factors such as location, product
              size, and current operational considerations.
            </li>
            <li>
              <strong>Responsibility:</strong> It is the customer's
              responsibility to ensure that the delivery address provided is
              accurate. Liyanage Hardware cannot be held liable for delays or
              delivery failures resulting from incorrect or incomplete address
              details.
            </li>
          </ul>
        </section>

        <section className="tc-section">
          <h2>5. Returns, Refunds, and Order Cancellations</h2>
          <ul>
            <li>
              <strong>Product Returns:</strong> Specific return policies,
              including timeframes and conditions, are provided on each product
              page. Customers should inspect products upon delivery and report
              any issues within the specified period.
            </li>
            <li>
              <strong>Refunds:</strong> Refunds will be processed based on the
              nature of the order and payment method used. For orders requiring
              offline payments, refunds may be issued following our internal
              verification process.
            </li>
            <li>
              <strong>Order Cancellations:</strong> Orders can be cancelled
              before dispatch. Once an order is processed and dispatched,
              cancellations may not be possible. In the case of delayed or
              undeliverable orders, please contact our customer service for
              resolution.
            </li>
          </ul>
        </section>

        <section className="tc-section">
          <h2>6. Customer Responsibilities</h2>
          <ul>
            <li>
              <strong>Accurate Information:</strong> You agree to provide
              accurate and up-to-date contact, billing, and delivery
              information when placing an order.
            </li>
            <li>
              <strong>Compliance:</strong> You are responsible for complying
              with any additional instructions or conditions provided by our
              sales or marketing team.
            </li>
            <li>
              <strong>Communication:</strong> It is your responsibility to
              check your email or contact number for any communications
              regarding your order, including updates, payment confirmations,
              and delivery information.
            </li>
          </ul>
        </section>

        <section className="tc-section">
          <h2>7. Limitation of Liability</h2>
          <ul>
            <li>
              <strong>Service Disclaimer:</strong> Liyanage Hardware makes every
              effort to ensure the accuracy of product details and availability
              on the Website. However, we do not guarantee that the information
              is complete, error-free, or current.
            </li>
            <li>
              <strong>Liability Limit:</strong> In no event shall Liyanage
              Hardware be liable for any direct, indirect, incidental, or
              consequential damages arising out of your use of the Website or
              any products ordered therein.
            </li>
          </ul>
        </section>

        <section className="tc-section">
          <h2>8. Privacy and Data Protection</h2>
          <ul>
            <li>
              <strong>Data Collection:</strong> By using our Website, you
              consent to the collection, use, and disclosure of your personal
              information as described in our Privacy Policy.
            </li>
            <li>
              <strong>Data Security:</strong> We implement reasonable security
              measures to protect your information; however, we cannot guarantee
              complete security.
            </li>
          </ul>
        </section>

        <section className="tc-section">
          <h2>9. Agreement</h2>
          <p>
            By placing an order on our Website, you acknowledge that you have
            read, understood, and agree to be bound by these Terms &amp;
            Conditions, including any future modifications. If you do not agree
            with any part of these Terms, please refrain from using our Website.
          </p>
        </section>

        <section className="tc-section">
          <h2>Contact Information</h2>
          <p>Email: [Insert Email Address]</p>
          <p>WhatsApp: [Insert WhatsApp Number]</p>
          <p>Phone: [Insert Phone Number]</p>
          <p>Address: [Insert Business Address]</p>
        </section>
      </div>
    </div>
  );
}

export default TermsAndConditions;
