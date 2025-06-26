// src/pages/CustomerComplaintsForm.js
import React, { useState } from "react";
import "./CustomerComplaintsForm.css";
import API from "../api";
import ConfirmationModal from "./ConfirmationModal";

const CustomerComplaintsForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    invoiceNumber: "",
    repCode: "",
    contactNumber: "",
    branch: "",
    message: "",
  });
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaText] = useState("A7X9B2");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleCaptchaChange = (e) => {
    setCaptchaInput(e.target.value);
    setCaptchaVerified(e.target.value === captchaText);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaVerified) {
      alert("Please enter the correct captcha before submitting.");
      return;
    }
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    if (image) data.append("image", image);

    const res = await API.post("/feedback/create-complaint", data);
    if (res.status === 201) {
      setModalMessage(res.data.message);
      setShowModal(true);
    }
  };

  return (
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
              <label>Full Name*</label>
              <input
                type="text"
                name="fullName"
                required
                onChange={handleChange}
              />
            </div>
            <div className="ccf-group">
              <label>Email Address*</label>
              <input
                type="email"
                name="email"
                required
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="ccf-grid">
            <div className="ccf-group">
              <label>Invoice Number*</label>
              <input
                type="text"
                name="invoiceNumber"
                required
                onChange={handleChange}
              />
            </div>
            <div className="ccf-group">
              <label>Rep Code</label>
              <input
                type="text"
                name="repCode"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="ccf-grid">
            <div className="ccf-group">
              <label>Contact Number*</label>
              <input
                type="text"
                name="contactNumber"
                required
                onChange={handleChange}
              />
            </div>
            <div className="ccf-group">
              <label>Branch*</label>
              <select
                name="branch"
                required
                onChange={handleChange}
              >
                <option value="">Please Select</option>
                <option value="Branch A">Branch A</option>
                <option value="Branch B">Branch B</option>
                <option value="Branch C">Branch C</option>
              </select>
            </div>
          </div>

          <div className="ccf-group">
            <label>Message*</label>
            <textarea
              name="message"
              required
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="ccf-group">
            <button
              type="button"
              onClick={() => document.getElementById("ccf-file").click()}
              className="ccf-file-btn"
            >
              Upload Image
            </button>
            <input
              id="ccf-file"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="ccf-hidden-input"
            />
          </div>

          <div className="ccf-captcha">
            <label>Verification*</label>
            <div className="ccf-captcha-wrap">
              <div className="ccf-captcha-text">{captchaText}</div>
              <input
                type="text"
                placeholder="Enter code"
                value={captchaInput}
                onChange={handleCaptchaChange}
                required
              />
            </div>
            {captchaInput && !captchaVerified && (
              <p className="ccf-captcha-error">
                Incorrect code, please try again
              </p>
            )}
          </div>

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
  );
};

export default CustomerComplaintsForm;