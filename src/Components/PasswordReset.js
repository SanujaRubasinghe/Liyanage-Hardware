'use client';
import React, { useState } from 'react';
import API from '../api';
import { useSearchParams, useNavigate } from '../router-compat';
import styles from './PasswordResetForm.module.css';

const PasswordReset = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    number: false,
    specialChar: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Check password requirements when password field changes
    if (name === 'password') {
      setPasswordRequirements({
        length: value.length >= 8,
        number: /\d/.test(value),
        specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setMessage({ text: 'Passwords do not match', type: 'error' });
      return;
    }

    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      await API.post('/user/reset-password', {
        token,
        newPassword: formData.password
      });
      
      setMessage({ 
        text: 'Password reset successfully! Redirecting to login...', 
        type: 'success' 
      });
      
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || 'Failed to reset password', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Reset Your Password</h2>
        <p className={styles.subtitle}>Create a new password for your account</p>

        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              New Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={styles.input}
              required
              minLength="8"
            />
            <div className={styles.passwordRequirements}>
              <span className={passwordRequirements.length ? styles.valid : styles.invalid}>
                • At least 8 characters
              </span>
              <span className={passwordRequirements.number ? styles.valid : styles.invalid}>
                • Contains a number
              </span>
              <span className={passwordRequirements.specialChar ? styles.valid : styles.invalid}>
                • Contains a special character
              </span>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={styles.input}
              required
              minLength="8"
            />
          </div>

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isLoading || 
              !passwordRequirements.length || 
              !passwordRequirements.number || 
              !passwordRequirements.specialChar}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className={styles.footer}>
          Remember your password? <a href="/login" className={styles.link}>Log in</a>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;