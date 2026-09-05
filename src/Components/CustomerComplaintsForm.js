'use client';
import React, { useState, useRef } from "react";
import "./CustomerComplaintsForm.css";
import API from "../api";
import ConfirmationModal from "./ConfirmationModal";
import { FaTimes, FaUpload } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";

import { Helmet } from "react-helmet";

const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY

const CustomerComplaintsForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    invoiceNumber: "",
    contactNumber: "",
    message: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token)
  };

  const sendComplaintConfirmation = async (toEmail, message) => {
    try {
      await API.post('/messages/send-complaint-email', {
        toEmail: toEmail,
        message: message
      })
    } catch (err) {
      console.log(err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await API.post('/verify-captcha', {
      token: captchaToken
    })

    if (!res.data.success) {
      alert("Captcha Failed");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    if (image) data.append("image", image);

    const emailData = {
      customerName: `${formData.firstName} ${formData.lastName}`,
      message: formData.message
    }

    try {
      const res = await API.post("/feedback/create-complaint", data);
      sendComplaintConfirmation(formData.email, emailData)
      if (res.status === 201) {
        setModalMessage(res.data.message);
        setShowModal(true);
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          invoiceNumber: "",
          contactNumber: "",
          message: "",
        });
        removeImage();
      }
    } catch (error) {
      setModalMessage("Failed to submit complaint. Please try again.");
      setShowModal(true);
    }
  };


  return (
    <>
    <Helmet>
      <title>Customer Complaint Form | New Liyanage Hardware</title>
      <meta name="description" content="Submit complaints or feedback for faster resolution and better service." />
      <link rel="canonical" href="https://newliyanagehardware.lk/complaint" />
    </Helmet>
    <div className="ccf-container">
      <div className="ccf-logo-circle">
        <img src="/images/l1.png" alt="Logo" className="ccf-logo" />
      </div>

      <div className="ccf-card">
        <div className="ccf-header">
          <h2 className="ccf-title">Customer Complaints</h2>
        </div>

        <form onSubmit={handleSubmit} className="ccf-form">
          <div className="ccf-grid">
            <div className="ccf-group">
              <label>First Name*</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                required
                onChange={handleChange}
              />
            </div>
            <div className="ccf-group">
              <label>Last Name*</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                required
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="ccf-grid">
            <div className="ccf-group">
              <label>Email Address*</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                required
                onChange={handleChange}
              />
            </div>
            <div className="ccf-group">
              <label>Contact Number*</label>
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                required
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="ccf-group">
            <label>Invoice Number*</label>
            <input
              type="text"
              name="invoiceNumber"
              value={formData.invoiceNumber}
              required
              onChange={handleChange}
            />
          </div>

          <div className="ccf-group">
            <label>Message*</label>
            <textarea
              name="message"
              value={formData.message}
              required
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="ccf-group">
            <label>Upload Receipt (JPEG,JPG,PNG,WEBP)*</label>
            <div className="ccf-image-upload-container">
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="ccf-file-btn"
              >
                <FaUpload /> {image ? "Change Image" : "Upload Image"}
              </button>
              <input
                ref={fileInputRef}
                id="ccf-file"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="ccf-hidden-input"
                required
              />
              {imagePreview && (
                <div className="ccf-image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="ccf-remove-image"
                    aria-label="Remove image"
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
            </div>
          </div>
          <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={handleCaptchaChange} />
          <div className="ccf-group">
            <button type="submit" className="ccf-submit-btn">
              Submit
            </button>
          </div>
        </form>
      </div>

      <ConfirmationModal
        isOpen={showModal}
        message={modalMessage}
        onClose={() => setShowModal(false)}
      />
    </div>
    </>
  );
};

export default CustomerComplaintsForm;