// src/pages/LogInPage.jsx
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import styles from "./LogInPage.module.css";
import { toast } from "react-toastify";
import API from "../api";

function LogInPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate()

  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    address: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isRegistering) {
      setRegisterData({ ...registerData, [name]: value });
    } else {
      setUser({ ...user, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegistering) {
      const { password, confirmPassword } = registerData;

      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }

      try {
        await API.post("/auth/register", registerData);
        toast.success("Registration successful! Please log in.");
        setIsRegistering(false);
        setRegisterData({
          firstname: "",
          lastname: "",
          email: "",
          phone: "",
          username: "",
          password: "",
          confirmPassword: "",
        });
      } catch (err) {
        toast.error(err.response?.data?.error || "Registration failed");
      }
    } else {
      try {
        const res = await login(user);
        if(res.data.success) navigate('/profile')
      } catch (err) {
        toast.error("Login failed! Username or Password Incorrect.");
      }
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.authCard}>
        <div className={styles.logoContainer}>
          <img src="/images/l1.png" alt="Logo" className={styles.loginLogo} />
        </div>
        <div className={styles.authTabs}>
          <button
            className={`${styles.tabButton} ${!isRegistering ? styles.active : ""}`}
            onClick={() => setIsRegistering(false)}
          >
            Sign In
          </button>
          <button
            className={`${styles.tabButton} ${isRegistering ? styles.active : ""}`}
            onClick={() => setIsRegistering(true)}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.authForm}>
          <h2 className={styles.authTitle}>
            {isRegistering ? "Create Account" : "Welcome Back"}
          </h2>

          <div className={styles.inputGroup}>
            <input
              name="username"
              placeholder="Username"
              required
              value={isRegistering ? registerData.username : user.username}
              onChange={handleChange}
              className={styles.authInput}
            />
          </div>

          {isRegistering && (
            <div className={styles.inputGroup}>
              <input
                name="firstname"
                placeholder="First Name"
                required
                value={registerData.firstname}
                onChange={handleChange}
                className={styles.authInput}
              />
            </div>
          )}

          {isRegistering && (
            <div className={styles.inputGroup}>
              <input
                name="lastname"
                placeholder="Last Name"
                required
                value={registerData.lastname}
                onChange={handleChange}
                className={styles.authInput}
              />
            </div>
          )}

          {isRegistering && (
            <div className={styles.inputGroup}>
              <input
                name="email"
                type="email"
                placeholder="Email"
                required
                value={registerData.email}
                onChange={handleChange}
                className={styles.authInput}
              />
            </div>
          )}

          {isRegistering && (
            <div className={styles.inputGroup}>
              <input
                name="phone"
                placeholder="Phone"
                required
                value={registerData.phone}
                onChange={handleChange}
                className={styles.authInput}
              />
            </div>
          )}

          {isRegistering && (
            <div className={styles.inputGroup}>
              <textarea
                name="address"
                placeholder="Address"
                required
                value={registerData.address}
                onChange={handleChange}
                className={styles.authInput}
              />
            </div>
          )}

          <div className={styles.inputGroup}>
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              value={isRegistering ? registerData.password : user.password}
              onChange={handleChange}
              className={styles.authInput}
            />
            {!isRegistering && (
              <Link to="/reset-password-link" className={styles.forgotPassword}>
                Forgot password?
              </Link>
            )}
          </div>

          {isRegistering && (
            <div className={styles.inputGroup} style={{position: "relative"}}>
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                required
                value={registerData.confirmPassword}
                onChange={handleChange}
                className={styles.authInput}
                style={{
                  borderColor:
                    registerData.confirmPassword.length > 0
                      ? registerData.password === registerData.confirmPassword
                        ? "green"
                        : "red"
                      : undefined,
                }}
              />
              {registerData.confirmPassword.length > 0 && (
                <span
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "1.2rem",
                    color:
                      registerData.password === registerData.confirmPassword
                        ? "green"
                        : "red",
                  }}
                >
                  {registerData.password === registerData.confirmPassword ? "✅" : "❌"}
                </span>
              )}
              
            </div>
          )}

          <button type="submit" className={styles.authButton}>
            {isRegistering ? "Register" : "Sign In"}
          </button>
        </form>

        <div className={styles.authFooter}>
          {isRegistering ? (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => setIsRegistering(false)}
                className={styles.authLink}
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{" "}
              <button
                onClick={() => setIsRegistering(true)}
                className={styles.authLink}
              >
                Register
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default LogInPage;
