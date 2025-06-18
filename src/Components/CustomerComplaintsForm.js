import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CustomerComplaintsForm.css';

const CustomerComplaintsForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!content.trim()) newErrors.content = 'Description is required';
    if (!receipt) newErrors.receipt = 'Receipt is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) { // 2MB limit
      setErrors({...errors, receipt: 'File size must be less than 2MB'});
      return;
    }
    setReceipt(file);
    setErrors({...errors, receipt: null});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('type', 'complaint');
      formData.append('title', title);
      formData.append('content', content);
      formData.append('receipt', receipt);
      
      const response = await fetch('/api/feedback', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit complaint');
      }
      
      toast.success('Complaint submitted successfully!');
      // Reset form
      setTitle('');
      setContent('');
      setReceipt(null);
      document.getElementById('receipt-upload').value = '';
    } catch (error) {
      toast.error(error.message || 'Error submitting complaint');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="complaint-form-container">
      <h2 className="complaint-form-title">Submit a Complaint</h2>
      
      <form onSubmit={handleSubmit} className="complaint-form">
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Complaint Title <span className="required-asterisk">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`form-input ${errors.title ? 'input-error' : ''}`}
            placeholder="Brief description of your complaint"
          />
          {errors.title && <p className="error-message">{errors.title}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="content" className="form-label">
            Detailed Description <span className="required-asterisk">*</span>
          </label>
          <textarea
            id="content"
            rows="5"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`form-textarea ${errors.content ? 'input-error' : ''}`}
            placeholder="Please describe your complaint in detail..."
          ></textarea>
          {errors.content && <p className="error-message">{errors.content}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="receipt-upload" className="form-label">
            Upload Receipt (PDF, JPG, PNG) <span className="required-asterisk">*</span>
          </label>
          <div className="file-upload-wrapper">
            <input
              id="receipt-upload"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className={`file-input ${errors.receipt ? 'file-input-error' : ''}`}
            />
          </div>
          {errors.receipt && <p className="error-message">{errors.receipt}</p>}
          {receipt && (
            <p className="file-selected">
              Selected file: {receipt.name} ({(receipt.size / 1024).toFixed(2)} KB)
            </p>
          )}
          <p className="file-hint">
            Max file size: 2MB. Supported formats: PDF, JPG, PNG.
          </p>
        </div>
        
        <div className="form-actions">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
          >
            {isSubmitting ? (
              <>
                <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : 'Submit Complaint'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerComplaintsForm;