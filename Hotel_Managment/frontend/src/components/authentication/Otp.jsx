import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Otp = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const baseURL = "https://hotel-management-backend-zitt.onrender.com";


  useEffect(() => {
 
    const storedEmail = localStorage.getItem("otpEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
  
      alert("Please sign up first");
    }
  }, []);

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp) {
      alert("Please enter the OTP");
      return;
    }

    try {
      const res = await axios.post(`${baseURL}/user/verifyOtp`, {
        email,
        otp,
      });
      alert("OTP Verified Successfully!");
      navigate("/login");
    } catch (error) {
      console.error("OTP verification failed:", error);
      alert(error.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-blue-100 to-purple-100">
      <div className="max-w-sm w-full p-8 bg-white rounded-3xl shadow-2xl">
        <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-6">
          Verify OTP
        </h2>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Please enter the OTP sent to your email/phone.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="otp"
            maxLength="6"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg text-center tracking-widest"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition duration-300"
          >
            Verify OTP
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">Didn’t receive the code?</p>
          <button className="text-sm text-blue-600 hover:underline mt-1">
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default Otp;
