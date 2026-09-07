import { useEffect, useState } from "react";
import API from "../api";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  const [resetStep, setResetStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otpForm, setOtpForm] = useState({ email: "", otp: "", newPassword: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/users/profile");
        setProfile(res.data);
        setForm(res.data);
        setEmail(res.data.email);
        setOtpForm(prev => ({ ...prev, email: res.data.email }));
      } catch (err) {
        toast.error("Failed to fetch profile");
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await API.put(`/users/${profile.user_id}`, form);
      setEditing(false);
      setProfile({ ...profile, ...form });
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error("Error updating profile");
    }
  };

  const requestOTP = async () => {
    try {
      await API.post("/users/request-reset", { email });
      setResetStep(2);
      toast.success("OTP sent to your email");
    } catch (err) {
      toast.error(err.response?.data?.error || "Error sending OTP");
    }
  };

  const handleOtpChange = (e) => {
    setOtpForm({ ...otpForm, [e.target.name]: e.target.value });
  };

  const resetPassword = async () => {
    try {
      await API.post("/users/reset-password", otpForm);
      setResetStep(1);
      setOtpForm({ email, otp: "", newPassword: "" });
      toast.success("Password reset successfully");
    } catch (err) {
      toast.error(err.response?.data?.error || "Error resetting password");
    }
  };

  if (!profile) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow border border-gray-200">
      <ToastContainer />
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Admin Profile</h2>
        <span className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">● Active</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {['first_name', 'last_name', 'phone', 'address'].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field.replace('_', ' ')}:</label>
            <input
              type="text"
              name={field}
              disabled={!editing}
              value={form[field] || ''}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded text-sm ${editing ? 'bg-white' : 'bg-gray-100'}`}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        {editing ? (
          <>
            <button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
            <button onClick={() => setEditing(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          </>
        ) : (
          <button onClick={() => setEditing(true)} className="bg-blue-600 text-white px-4 py-2 rounded">Edit Profile</button>
        )}
      </div>

      {/* Password Reset Section */}
      <div className="mt-10 border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Reset Password</h3>
        {resetStep === 1 ? (
          <>
            <input
              type="email"
              className="w-full border px-3 py-2 mb-3 rounded"
              value={email}
              disabled
            />
            <button
              onClick={requestOTP}
              className="bg-orange-500 text-white px-4 py-2 rounded"
            >
              Send OTP
            </button>
          </>
        ) : (
          <>
            <input
              name="otp"
              placeholder="Enter OTP"
              value={otpForm.otp}
              onChange={handleOtpChange}
              className="w-full border px-3 py-2 mb-3 rounded"
            />
            <input
              name="newPassword"
              type="password"
              placeholder="New Password"
              value={otpForm.newPassword}
              onChange={handleOtpChange}
              className="w-full border px-3 py-2 mb-4 rounded"
            />
            <div className="flex gap-3">
              <button
                onClick={resetPassword}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Reset Password
              </button>
              <button
                onClick={() => setResetStep(1)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;
