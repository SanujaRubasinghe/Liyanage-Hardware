import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import "./CustomerComplaintsForm.css";

const CustomerComplaintsForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    invoiceNumber: "",
    repCode: "",
    contactNumber: "",
    branch: "",
    message: "",
    image: null,
  });

  const [captchaVerified, setCaptchaVerified] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
  };

  const handleCaptcha = (value) => {
    if (value) {
      setCaptchaVerified(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!captchaVerified) {
      alert("Please verify the reCAPTCHA before submitting.");
      return;
    }
    alert("Form submitted successfully!");
    console.log("Form Data:", formData);
  };

  return (
    <div className="customer-complaints-form">
      <h2>CUSTOMER COMPLAINTS</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="fullName" placeholder="Full Name*" required onChange={handleChange} />
        <input type="email" name="email" placeholder="Email Address*" required onChange={handleChange} />
        <input type="text" name="invoiceNumber" placeholder="Invoice Number*" required onChange={handleChange} />
        <input type="text" name="repCode" placeholder="Rep Code (Sales Representative)" onChange={handleChange} />
        <input type="text" name="contactNumber" placeholder="Contact Number*" required onChange={handleChange} />
        <select name="branch" required onChange={handleChange}>
          <option value="">Please Select</option>
          <option value="Branch A">Branch A</option>
          <option value="Branch B">Branch B</option>
          <option value="Branch C">Branch C</option>
        </select>
        <textarea name="message" placeholder="Message*" required onChange={handleChange}></textarea>

        <label className="file-upload">
          Upload Image
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </label>

        <ReCAPTCHA sitekey="YOUR_RECAPTCHA_SITE_KEY" onChange={handleCaptcha} />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CustomerComplaintsForm;
