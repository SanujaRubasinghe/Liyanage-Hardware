import React, { useState } from "react";
import "./CustomerComplaintsForm.css";
import API from "../api"
import ConfirmationModal from "./ConfirmationModal";



const CustomerComplaintsForm = () => {
  
  const [showModal, setShowModal] = useState(false)
  const [modalMessage, setModalMessage] = useState("")

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

  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaText] = useState("A7X9B2"); // In a real implementation, this would be generated randomly
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [image, setImage] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    setImage(e.target.files[0])
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

    const data = new FormData()

    for (const key in formData) {
      data.append(key, formData[key])
    }

    if (image) {
      data.append("image", image)
    }
  
    const res = await API.post('/feedback/create-complaint', data)
    
    if (res.status === 201) {
      setShowModal(true)
      setModalMessage(res.data.message)
    }
    
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <h2>CUSTOMER COMPLAINTS</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name*</label>
              <input 
                type="text" 
                name="fullName" 
                required 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-group">
              <label>Email Address*</label>
              <input 
                type="email" 
                name="email" 
                required 
                onChange={handleChange} 
              />
            </div>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Invoice Number*</label>
              <input 
                type="text" 
                name="invoiceNumber" 
                required 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-group">
              <label>Rep Code</label>
              <input 
                type="text" 
                name="repCode" 
                onChange={handleChange} 
              />
            </div>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Contact Number*</label>
              <input 
                type="text" 
                name="contactNumber" 
                required 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-group">
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
          
          <div className="form-group">
            <label>Message*</label>
            <textarea 
              name="message" 
              required 
              onChange={handleChange}
            ></textarea>
          </div>
          
          <div className="form-group">
            <button
              type="button"
              onClick={() => document.getElementById('file-upload').click()}
              className="file-upload-btn"
            >
              Upload Image
            </button>
            <input 
              id="file-upload"
              type="file" 
              name="image"
              accept="image/*" 
              onChange={handleImageUpload}
              className="hidden-input" 
            />
          </div>
          
          {/* Simple captcha implementation */}
          <div className="captcha-container">
            <label>Verification*</label>
            <div className="captcha-wrapper">
              <div className="captcha-text">
                {captchaText}
              </div>
              <input
                type="text"
                placeholder="Enter the code"
                value={captchaInput}
                onChange={handleCaptchaChange}
                required
              />
            </div>
            {captchaInput && !captchaVerified && (
              <p className="captcha-error">Incorrect code, please try again</p>
            )}
          </div>
          
          <div className="form-group">
            <button 
              type="submit"
              className="submit-btn"
            >
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