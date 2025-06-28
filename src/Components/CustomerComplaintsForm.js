// src/pages/CustomerComplaintsForm.js
import React, { useState, useRef } from "react";
import "./CustomerComplaintsForm.css";
import API from "../api";
import ConfirmationModal from "./ConfirmationModal";

const CustomerComplaintsForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false)
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "" // Added message field
  });

  const [receipt, setReceipt] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleReceiptUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes =['image/jpg', 'image/jpeg', 'image/png', 'image/webp']
      const maxSize = 5 * 1024 * 1024

      if (!validTypes.includes(file.type)) {
        setModalMessage("Please upload a valid image (JPEG, PNG, or WEBP")
        setShowModal(true)
        return
      }

      if (file.size > maxSize) {
        setModalMessage("Image size must be less than 5MB")
        setShowModal(true)
        return
      }

      setReceipt(file);
      setReceiptPreview(URL.createObjectURL(file));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const removeReceipt = () => {
    setReceipt(null);
    setReceiptPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      if (receipt) data.append("receipt", receipt);

      const res = await API.post("/feedback/create-complaint", data);
      if (res.status === 201) {
        setModalMessage("Your complaint has been submitted successfully! We'll get back to you soon.");
        setShowModal(true);
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: ""
        });
        setReceipt(null);
        setReceiptPreview(null);
      }
    } catch (error) {
      setModalMessage("Failed to submit complaint. Please try again.");
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="complaint-form-container">
      <div className="complaint-form-card">
        <div className="complaint-form-header">
          <h1>Customer Support</h1>
          <p>We're here to help with any issues you've encountered</p>
        </div>

        <form onSubmit={handleSubmit} className="complaint-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="firstName">First Name*</label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name*</label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email*</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number*</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Your Message*</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              placeholder="Please describe your issue in detail..."
              required
            />
          </div>

          <div className="form-group">
            <label>Receipt Upload*</label>
            {receiptPreview ? (
              <div className="receipt-preview-container">
                <img src={receiptPreview} alt="Receipt preview" className="receipt-preview" />
                <button type="button" onClick={removeReceipt} className="remove-receipt-btn">
                  Remove
                </button>
              </div>
            ) : (
              <div className="file-upload-area" onClick={triggerFileInput}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleReceiptUpload}
                  className="hidden-file-input"
                  required
                />
                <div className="upload-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
                    <path d="M17 8l-5-5-5 5"></path>
                    <path d="M12 3v12"></path>
                  </svg>
                </div>
                <p>Click to upload receipt</p>
                <p className="file-requirements">JPG, JPEG, or PNG(Max 5MB)</p>
              </div>
            )}
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      </div>

      <ConfirmationModal
        isOpen={showModal}
        message={modalMessage}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default CustomerComplaintsForm;