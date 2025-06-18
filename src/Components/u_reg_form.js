// src/pages/u_reg_form.js
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "./u_reg_form.css";

function URegForm() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: ""
  });
  const { register } = useContext(AuthContext);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      window.location.href = "/profile";
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="ureg-container">
      <div className="ureg-logo-circle">
        <img src="/images/l1.png" alt="Logo" className="ureg-logo" />
      </div>

      <form onSubmit={handleSubmit} className="ureg-form">
        {/* Title inside the form */}
        <h1 className="ureg-form-title">User Registration Form</h1>

        <label className="ureg-label">Full Name</label>
        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          required
          className="ureg-input"
        />

        <label className="ureg-label">Email Address</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email Address"
          required
          className="ureg-input"
        />

        <label className="ureg-label">Phone Number</label>
        <input
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          required
          className="ureg-input"
        />

        <label className="ureg-label">Shipping Address</label>
        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Shipping Address"
          required
          className="ureg-textarea"
        />

        <button type="submit" className="ureg-button">
          Register
        </button>
      </form>
    </div>
  );
}

export default URegForm;