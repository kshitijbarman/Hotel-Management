import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const SignUp = () => {
  const baseURL = "http://localhost:6969";

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    gender: "",
    age: "",
  });
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.firstname ||
      !formData.lastname ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      setError(
        "Please fill in all required fields (First Name, Last Name, Email, Phone, Password)."
      );
      return;
    }

    const dataToSend = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      gender: formData.gender || undefined,
      age: formData.age ? parseInt(formData.age) : undefined,
    };

    try {
      setIsLoading(true);
      setError(null);
      console.log("handleSubmit - Sending signup data:", dataToSend);
      await axios.post(`${baseURL}/user/signup`, dataToSend);
      localStorage.setItem("otpEmail", formData.email);
      setShowOtpInput(true);
    } catch (error) {
      console.error("handleSubmit - Error submitting data:", error);
      setError(
        error.response?.data?.message || "Something went wrong during signup."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log(
        "handleOtpSubmit - Verifying OTP for email:",
        formData.email,
        "OTP:",
        otp
      );
      const response = await axios.post(`${baseURL}/user/verifyOtp`, {
        email: formData.email,
        otp,
      });
      console.log(
        "handleOtpSubmit - OTP verification response:",
        response.data
      );
      localStorage.setItem("token", response.data.token);
      localStorage.removeItem("otpEmail");
      navigate("/");
    } catch (error) {
      console.error("handleOtpSubmit - OTP verification failed:", error);
      setError(error.response?.data?.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = () => {
    navigate("/");
  };

  // return (
  //   <div className="min-h-screen flex items-center justify-center bg-white overflow-hidden">
  //     <div className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-300">
  //       {/* Decorative Background Elements */}
  //       <div className="absolute inset-0 overflow-hidden rounded-2xl">
  //         <div className="absolute w-96 h-96 bg-indigo-500/20 rounded-full -top-48 -left-48 blur-3xl"></div>
  //         <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full -bottom-48 -right-48 blur-3xl"></div>
  //       </div>

  //       {/* Form Content */}
  //       <div className="relative z-10">
  //         <h2 className="text-3xl font-extrabold text-black mb-6 flex items-center justify-center gap-2">
  //           {showOtpInput ? (
  //             <>
  //               <svg
  //                 className="w-8 h-8 text-indigo-400"
  //                 fill="none"
  //                 stroke="currentColor"
  //                 viewBox="0 0 24 24"
  //                 xmlns="http://www.w3.org/2000/svg"
  //               >
  //                 <path
  //                   strokeLinecap="round"
  //                   strokeLinejoin="round"
  //                   strokeWidth="2"
  //                   d="M12 11c0-1.1-.9-2-2-2s-2 .9-2 2 1 2 2 2 2-.9 2-2zm0 0c0-2.2-1.8-4-4-4s-4 1.8-4 4 2 4 4 4 4-1.8 4-4zm8-4c0-2.2-1.8-4-4-4s-4 1.8-4 4 2 4 4 4 4-1.8 4-4zm0 0c0-1.1-.9-2-2-2s-2 .9-2 2 1 2 2 2 2-.9 2-2z"
  //                 ></path>
  //               </svg>
  //               Verify OTP
  //             </>
  //           ) : (
  //             <>
  //               <svg
  //                 className="w-8 h-8 text-indigo-400"
  //                 fill="none"
  //                 stroke="currentColor"
  //                 viewBox="0 0 24 24"
  //                 xmlns="http://www.w3.org/2000/svg"
  //               >
  //                 <path
  //                   strokeLinecap="round"
  //                   strokeLinejoin="round"
  //                   strokeWidth="2"
  //                   d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
  //                 ></path>
  //               </svg>
  //               Create Account
  //             </>
  //           )}
  //         </h2>

  //         {error && (
  //           <div className="mb-6 text-center text-sm text-red-400 font-medium bg-red-500/10 border border-red-500/30 rounded-lg p-3">
  //             {error}
  //           </div>
  //         )}

  //         {!showOtpInput ? (
  //           <form onSubmit={handleSubmit} className="space-y-6">
  //             <div>
  //               <label
  //                 htmlFor="firstname"
  //                 className="block text-sm font-medium text-black mb-1"
  //               >
  //                 First Name <span className="text-red-400">*</span>
  //               </label>
  //               <input
  //                 type="text"
  //                 name="firstname"
  //                 value={formData.firstname}
  //                 onChange={handleChange}
  //                 className="w-full px-4 py-2.5 bg-gray-200 border border-gray-400 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
  //                 placeholder="Enter your first name"
  //                 required
  //               />
  //             </div>
  //             <div>
  //               <label
  //                 htmlFor="lastname"
  //                 className="block text-sm font-medium text-black mb-1"
  //               >
  //                 Last Name <span className="text-red-400">*</span>
  //               </label>
  //               <input
  //                 type="text"
  //                 name="lastname"
  //                 value={formData.lastname}
  //                 onChange={handleChange}
  //                 className="w-full px-4 py-2.5 bg-gray-200 border border-gray-400 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
  //                 placeholder="Enter your last name"
  //                 required
  //               />
  //             </div>
  //             <div>
  //               <label
  //                 htmlFor="email"
  //                 className="block text-sm font-medium text-black mb-1"
  //               >
  //                 Email <span className="text-red-400">*</span>
  //               </label>
  //               <input
  //                 type="email"
  //                 name="email"
  //                 value={formData.email}
  //                 onChange={handleChange}
  //                 className="w-full px-4 py-2.5 bg-gray-200 border border-gray-400 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
  //                 placeholder="Enter your email"
  //                 required
  //               />
  //             </div>
  //             <div>
  //               <label
  //                 htmlFor="phone"
  //                 className="block text-sm font-medium text-black mb-1"
  //               >
  //                 Phone Number <span className="text-red-400">*</span>
  //               </label>
  //               <input
  //                 type="tel"
  //                 name="phone"
  //                 value={formData.phone}
  //                 onChange={handleChange}
  //                 className="w-full px-4 py-2.5 bg-gray-200 border border-gray-400 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
  //                 placeholder="Enter your phone number"
  //                 required
  //               />
  //             </div>
  //             <div>
  //               <label
  //                 htmlFor="password"
  //                 className="block text-sm font-medium text-black mb-1"
  //               >
  //                 Password <span className="text-red-400">*</span>
  //               </label>
  //               <input
  //                 type="password"
  //                 name="password"
  //                 value={formData.password}
  //                 onChange={handleChange}
  //                 className="w-full px-4 py-2.5 bg-gray-200 border border-gray-400 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
  //                 placeholder="Enter your password"
  //                 required
  //               />
  //             </div>
  //             <div>
  //               <label
  //                 htmlFor="gender"
  //                 className="block text-sm font-medium text-black mb-1"
  //               >
  //                 Gender (Optional)
  //               </label>
  //               <select
  //                 name="gender"
  //                 value={formData.gender}
  //                 onChange={handleChange}
  //                 className="w-full px-4 py-2.5 bg-gray-200 border border-gray-400 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
  //               >
  //                 <option value="">Select Gender</option>
  //                 <option value="male">male</option>
  //                 <option value="female">female</option>
  //                 <option value="other">other</option>
  //               </select>
  //             </div>
  //             <div>
  //               <label
  //                 htmlFor="age"
  //                 className="block text-sm font-medium text-black mb-1"
  //               >
  //                 Age (Optional)
  //               </label>
  //               <input
  //                 type="number"
  //                 name="age"
  //                 value={formData.age}
  //                 onChange={handleChange}
  //                 min="1"
  //                 className="w-full px-4 py-2.5 bg-gray-200 border border-gray-400 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
  //                 placeholder="Enter your age"
  //               />
  //             </div>
  //             <button
  //               type="submit"
  //               className="w-full flex justify-center items-center py-2.5 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
  //               disabled={isLoading}
  //             >
  //               {isLoading ? (
  //                 <div className="flex items-center gap-2">
  //                   <svg
  //                     className="animate-spin h-5 w-5 text-white"
  //                     viewBox="0 0 24 24"
  //                   >
  //                     <circle
  //                       className="opacity-25"
  //                       cx="12"
  //                       cy="12"
  //                       r="10"
  //                       stroke="currentColor"
  //                       strokeWidth="4"
  //                     ></circle>
  //                     <path
  //                       className="opacity-75"
  //                       fill="currentColor"
  //                       d="M4 12a8 8 0 0115.449-4.527l1.499-1.118A10 10 0 003 12h1z"
  //                     ></path>
  //                   </svg>
  //                   Signing up...
  //                 </div>
  //               ) : (
  //                 "Create Account"
  //               )}
  //             </button>
  //           </form>
  //         ) : (
  //           <form onSubmit={handleOtpSubmit} className="space-y-6">
  //             <div>
  //               <label
  //                 htmlFor="otp"
  //                 className="block text-sm font-medium text-black mb-1"
  //               >
  //                 Enter OTP sent to {formData.email}
  //               </label>
  //               <input
  //                 type="text"
  //                 name="otp"
  //                 value={otp}
  //                 onChange={handleOtpChange}
  //                 className="w-full px-4 py-2.5 bg-gray-200 border border-gray-400 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
  //                 placeholder="Enter OTP"
  //                 required
  //               />
  //             </div>
  //             <button
  //               type="submit"
  //               className="w-full flex justify-center items-center py-2.5 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
  //               disabled={isLoading}
  //             >
  //               {isLoading ? (
  //                 <div className="flex items-center gap-2">
  //                   <svg
  //                     className="animate-spin h-5 w-5 text-white"
  //                     viewBox="0 0 24 24"
  //                   >
  //                     <circle
  //                       className="opacity-25"
  //                       cx="12"
  //                       cy="12"
  //                       r="10"
  //                       stroke="currentColor"
  //                       strokeWidth="4"
  //                     ></circle>
  //                     <path
  //                       className="opacity-75"
  //                       fill="currentColor"
  //                       d="M4 12a8 8 0 0115.449-4.527l1.499-1.118A10 10 0 003 12h1z"
  //                     ></path>
  //                   </svg>
  //                   Verifying OTP...
  //                 </div>
  //               ) : (
  //                 "Verify OTP"
  //               )}
  //             </button>
  //           </form>
  //         )}

  //         <p className="mt-6 text-center text-sm text-black">
  //           Already have an account?{" "}
  //           <button
  //             onClick={handleNavigate}
  //             className="font-semibold text-indigo-600 hover:text-indigo-700"
  //           >
  //             Sign In
  //           </button>
  //         </p>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="bg-white border border-gray-300 rounded-xl shadow-md p-6 w-full max-w-sm">
        {/* Removed decorative background elements */}

        <div>
          <h2 className="text-2xl font-bold text-black mb-4 flex items-center justify-center gap-2">
            {showOtpInput ? (
              <>
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 11c0-1.1-.9-2-2-2s-2 .9-2 2 1 2 2 2 2-.9 2-2zm0 0c0-2.2-1.8-4-4-4s-4 1.8-4 4 2 4 4 4 4-1.8 4-4zm8-4c0-2.2-1.8-4-4-4s-4 1.8-4 4 2 4 4 4 4-1.8 4-4zm0 0c0-1.1-.9-2-2-2s-2 .9-2 2 1 2 2 2 2-.9 2-2z"
                  ></path>
                </svg>
                {showOtpInput ? "Verify OTP" : "Create Account"}
              </>
            ) : (
              <>
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  ></path>
                </svg>
                Create Account
              </>
            )}
          </h2>

          {error && (
            <div className="mb-4 text-center text-sm text-red-600 font-medium bg-red-100 border border-red-300 rounded p-2">
              {error}
            </div>
          )}

          {!showOtpInput ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="firstname"
                  className="block text-sm font-medium text-black mb-1"
                >
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-gray-400 rounded text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  placeholder="Enter your first name"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="lastname"
                  className="block text-sm font-medium text-black mb-1"
                >
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-gray-400 rounded text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  placeholder="Enter your last name"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-black mb-1"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-gray-400 rounded text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-black mb-1"
                >
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-gray-400 rounded text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-black mb-1"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-gray-400 rounded text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-black mb-1"
                >
                  Gender (Optional)
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-gray-400 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                >
                  <option value="">Select Gender</option>
                  <option value="male">male</option>
                  <option value="female">female</option>
                  <option value="other">other</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="age"
                  className="block text-sm font-medium text-black mb-1"
                >
                  Age (Optional)
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-3 py-2 bg-white border border-gray-400 rounded text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  placeholder="Enter your age"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                disabled={isLoading}
              >
                {isLoading && (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                  >
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
                      d="M4 12a8 8 0 0115.449-4.527l1.499-1.118A10 10 0 003 12h1z"
                    ></path>
                  </svg>
                )}
                {isLoading ? "Signing up..." : "Create Account"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-black mb-1"
                >
                  Enter OTP sent to {formData.email}
                </label>
                <input
                  type="text"
                  name="otp"
                  value={otp}
                  onChange={handleOtpChange}
                  className="w-full px-3 py-2 bg-white border border-gray-400 rounded text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  placeholder="Enter OTP"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                disabled={isLoading}
              >
                {isLoading && (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                  >
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
                      d="M4 12a8 8 0 0115.449-4.527l1.499-1.118A10 10 0 003 12h1z"
                    ></path>
                  </svg>
                )}
                {isLoading ? "Verifying OTP..." : "Verify OTP"}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-xs text-gray-500">
            Already have an account?{" "}
            <a href="/" className="text-blue-600 hover:underline">
              Log in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
