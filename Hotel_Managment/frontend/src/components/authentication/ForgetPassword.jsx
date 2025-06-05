import React, { useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUndo, FaKey } from "react-icons/fa";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
  });
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const baseURL = "https://hotel-management-backend-zitt.onrender.com";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage("");
    setError("");
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    setMessage("");
    setError("");
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
    setMessage("");
    setError("");
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${baseURL}/user/forgot`, { email: formData.email });
      setShowOtpForm(true);
      setMessage("OTP sent to your email!");
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send OTP. Please try again."
      );
      setMessage("");
      console.error("Error sending OTP:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !otp || !newPassword) {
      setError("Email, OTP, and new password are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${baseURL}/user/resetPassword`, {
        email: formData.email,
        otp,
        newPassword,
      });
      setMessage(res.data.message || "Password reset successful!");
      setError("");
      setFormData({ email: "" });
      setOtp("");
      setNewPassword("");
      setShowOtpForm(false);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to reset password. Please try again."
      );
      setMessage("");
      console.error("Error resetting password:", err);
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm border border-gray-300">
      <h2 className="text-2xl font-bold text-black mb-6 text-center flex items-center justify-center">
        {showOtpForm ? <FaKey className="mr-2" /> : <FaUndo className="mr-2" />}
        {showOtpForm ? "Verify OTP" : " 🔐forgot  Password"}
      </h2>

      {!showOtpForm ? (
        <form className="space-y-4" onSubmit={handleEmailSubmit}>
          <div>
            <div className="relative rounded-lg">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="email"
                name="email"
                id="email"
                className="w-full pl-10 py-2.5 bg-white border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 text-sm"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-center text-red-600 bg-red-100 border border-red-400 rounded-md p-2 text-sm">
              {error}
            </div>
          )}
          {message && (
            <div className="text-center text-green-600 bg-green-100 border border-green-400 rounded-md p-2 text-sm">
              {message}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full py-2.5 px-4 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending OTP...
                </div>
              ) : (
                "Send OTP"
              )}
            </button>
          </div>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={handleResetSubmit}>
          <div>
            <div className="relative rounded-lg mb-2">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="email"
                name="email"
                id="email"
                className="w-full pl-10 py-2.5 bg-white border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 text-sm"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                readOnly
              />
            </div>
            <div className="relative rounded-lg">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaKey className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                name="otp"
                id="otp"
                maxLength="6"
                className="w-full pl-10 py-2.5 bg-white border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 text-sm"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={handleOtpChange}
                required
              />
            </div>
          </div>

          <div>
            <div className="relative rounded-lg">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="password"
                name="password"
                id="password"
                className="w-full pl-10 py-2.5 bg-white border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 text-sm"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-center text-red-600 bg-red-100 border border-red-400 rounded-md p-2 text-sm">
              {error}
            </div>
          )}
          {message && (
            <div className="text-center text-green-600 bg-green-100 border border-green-400 rounded-md p-2 text-sm">
              {message}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full py-2.5 px-4 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Resetting...
                </div>
              ) : (
                "Reset Password"
              )}
            </button>
          </div>
        </form>
      )}

      <div className="mt-4 text-center space-y-2">
        <NavLink
          to="/"
          className="block text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          Back to Login
        </NavLink>
      </div>
    </div>
  </div>
);


};

export default ForgetPassword;