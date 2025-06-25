import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const SignUp = () => {
  const baseURL = "https://hotel-management-backend-rgpk.onrender.com";

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-10">
      <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-8 w-full max-w-md">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center flex items-center justify-center gap-3">
            {showOtpInput ? (
              <>
                <svg
                  className="w-7 h-7 text-blue-600"
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
                Verify OTP
              </>
            ) : (
              <>
                <svg
                  className="w-7 h-7 text-blue-600"
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
            <div className="mb-4 text-sm text-red-700 font-medium bg-red-100 border border-red-300 rounded-lg p-3 text-center">
              {error}
            </div>
          )}

          {!showOtpInput ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {[
                {
                  label: "First Name",
                  name: "firstname",
                  type: "text",
                  required: true,
                },
                {
                  label: "Last Name",
                  name: "lastname",
                  type: "text",
                  required: true,
                },
                {
                  label: "Email",
                  name: "email",
                  type: "email",
                  required: true,
                },
                {
                  label: "Phone Number",
                  name: "phone",
                  type: "tel",
                  required: true,
                },
                {
                  label: "Password",
                  name: "password",
                  type: "password",
                  required: true,
                },
                {
                  label: "Age (Optional)",
                  name: "age",
                  type: "number",
                  required: false,
                },
              ].map(({ label, name, type, required }) => (
                <div key={name}>
                  <label
                    htmlFor={name}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {label}{" "}
                    {required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400 transition"
                    placeholder={`Enter your ${label.toLowerCase()}`}
                    required={required}
                  />
                </div>
              ))}

              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Gender (Optional)
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 transition"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition flex justify-center items-center gap-2"
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
            <form onSubmit={handleOtpSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Enter OTP sent to{" "}
                  <span className="font-semibold">{formData.email}</span>
                </label>
                <input
                  type="text"
                  name="otp"
                  value={otp}
                  onChange={handleOtpChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400 transition"
                  placeholder="Enter OTP"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition flex justify-center items-center gap-2"
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

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <a href="/" className="text-blue-600 font-medium hover:underline">
              Log in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
