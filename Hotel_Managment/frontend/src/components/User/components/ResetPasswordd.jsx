
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaLock, FaEnvelope, FaKey, FaSave } from "react-icons/fa";

const ResetPasswordUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const baseURL = "http://localhost:6969";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await axios.post(
        `${baseURL}/user/resetPassword`,
        formData
      );
      setSuccess(response.data.message);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error("handleSubmit - Error:", err);
      setError(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 text-gray-800 font-sans flex items-center justify-center py-12">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-blue-600 mb-6 flex items-center">
          <FaLock className="mr-2" /> Reset Password
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-6">
            <p className="text-green-700">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Email
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <FaEnvelope className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600" />
            </div>
          </div>

          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              OTP
            </label>
            <div className="relative">
              <input
                id="otp"
                name="otp"
                type="text"
                value={formData.otp}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <FaKey className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600" />
            </div>
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <FaLock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md disabled:opacity-50"
          >
            <FaSave className="mr-2" />{" "}
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordUser;
