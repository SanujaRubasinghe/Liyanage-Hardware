// src/pages/LogInPage.jsx
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import styles from "./LogInPage.module.css";

function LogInPage() {
  const [user, setUser] = useState({ username: "", password: "" });
  const { login } = useContext(AuthContext);

  const handleChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(user);
      window.location.href = "/profile";
    } catch (err) {
      alert(err.response.data.error);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.logoCircle}>
        <img
          src="/images/l1.png"
          alt="Logo"
          className={styles.loginLogo}
        />
      </div>

      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <h1 className={styles.loginTitle}>User Login</h1>

        <label className={styles.loginLabel}>Username</label>
        <input
          name="username"
          onChange={handleChange}
          placeholder="Username"
          required
          className={styles.loginInput}
        />

        <label className={styles.loginLabel}>Password</label>
        <input
          name="password"
          type="password"
          onChange={handleChange}
          placeholder="Password"
          required
          className={styles.loginInput}
        />

        <button type="submit" className={styles.loginButton}>
          Login
        </button>
      </form>
    </div>
  );
}

export default LogInPage;
