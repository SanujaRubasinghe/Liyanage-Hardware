import { useState, useEffect, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import styles from './PasswordResetForm.module.css';

const PasswordResetForm = () => {
  const { user } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Auto-fill email if user is logged in
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      await API.post('/user/request-password-reset', { email });
      setMessage({ 
        text: 'Password reset link sent to your email', 
        type: 'success' 
      });
      setIsSubmitted(true);
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || 'Failed to send reset link', 
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
        <p className={styles.subtitle}>
          Enter your email address and we'll send you a link to reset your password
        </p>

        {isSubmitted ? (
          <div className={`${styles.message} ${styles.success}`}>
            <p>{message.text}</p>
            <p className={styles.checkEmail}>
              Please check your inbox and follow the instructions.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            {message.text && (
              <div className={`${styles.message} ${styles[message.type]}`}>
                {message.text}
              </div>
            )}

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className={styles.footer}>
          Remember your password? <a href="/login" className={styles.link}>Log in</a>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetForm;