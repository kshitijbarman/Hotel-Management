import React, { useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";

const LogIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const baseURL = "https://hotel-management-backend-rgpk.onrender.com";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please fill in all the fields");
      return;
    }

    try {
      const res = await axios.post(`${baseURL}/user/login`, formData);
      alert("Login successful!");
      localStorage.clear();
      localStorage.setItem("isLogin", JSON.stringify(true));
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("token", res.data.token);

      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Login failed");
    }

    setFormData({
      email: "",
      password: "",
    });
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="w-[27rem] h-[35rem] rounded-3xl shadow-lg flex flex-col items-center justify-center bg-white">
        <form
          onSubmit={handleSubmit}
          className="w-80 flex flex-col items-center justify-center"
        >
          <h2 className="text-4xl text-gray-900 font-semibold">Log in</h2>
          <p className="text-sm text-gray-500 mt-3">
            Welcome back! Please sign in to continue
          </p>

          <button
            type="button"
            className="w-full mt-8 bg-gray-100 flex items-center justify-center h-12 rounded-full"
          >
            <img
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
              alt="googleLogo"
            />
          </button>

          <div className="flex items-center gap-4 w-full my-5">
            <div className="w-full h-px bg-gray-300"></div>
            <p className="text-sm text-gray-500">or sign in with email</p>
            <div className="w-full h-px bg-gray-300"></div>
          </div>

          <div className="flex items-center w-full border border-gray-300 h-12 rounded-full px-4">
            <svg
              width="16"
              height="11"
              viewBox="0 0 16 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
                fill="#6B7280"
              />
            </svg>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="bg-transparent text-sm text-gray-600 placeholder-gray-500 outline-none w-full h-full ml-2"
              required
            />
          </div>

          <div className="flex items-center mt-6 w-full border border-gray-300 h-12 rounded-full px-4">
            <svg
              width="13"
              height="17"
              viewBox="0 0 13 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
                fill="#6B7280"
              />
            </svg>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="bg-transparent text-sm text-gray-600 placeholder-gray-500 outline-none w-full h-full ml-2"
              required
            />
          </div>

          <div className="w-full flex items-center justify-between mt-6 text-gray-500">
            <div className="flex items-center gap-2">
              <input className="h-4 w-4" type="checkbox" id="remember" />
              <label className="text-sm" htmlFor="remember">
                Remember me
              </label>
            </div>
            <a className="text-sm underline" href="/forget-pass">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="mt-8 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity"
          >
            Login
          </button>

          <p className="text-gray-500 text-sm mt-4">
            Don’t have an account?{" "}
            <NavLink to="/sign-up" className="text-indigo-400 hover:underline">
              Sign up
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LogIn;
