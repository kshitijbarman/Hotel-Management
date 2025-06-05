
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaTimes, FaBed, FaUser, FaUsers, FaChild, FaPhone, FaTicketAlt,
  FaWifi, FaTv, FaSnowflake, FaGlassMartini, FaConciergeBell, FaDoorOpen,
  FaArrowLeft, FaArrowRight,
} from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import useDarkMode from "../hooks/useDarkMode";  

const BookingFormModal = ({ showBookingModal, selectedRoom, onClose }) => {
  const [coupons, setCoupons] = useState([]);
  const [bookingForm, setBookingForm] = useState({
    firstname: "",
    lastname: "",
    members: 1,
    checkIn: "",
    checkOut: "",
    hasChild: false,
    phone: "",
    couponCode: "",
  });
  const [isFirstBooking, setIsFirstBooking] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDarkMode] = useDarkMode();  
  const baseURL = "https://hotel-management-backend-zitt.onrender.com";

  const getUserId = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      return decoded._id;
    }
    return null;
  };

  const fetchUserRole = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/user/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setIsAdmin(response.data.user.role === 'admin');
    } catch (err) {
      console.error("fetchUserRole - Error:", err);
      setError(err.response?.data?.message || "Failed to fetch user details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/api/bookings/my-bookings`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setIsFirstBooking(response.data.length === 0);
    } catch (err) {
      console.error("fetchUserBookings - Error:", err);
      setError(err.response?.data?.message || "Failed to fetch your bookings.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/api/coupons/available`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const activeCoupons = response.data.filter(
        (coupon) =>
          coupon.isActive &&
          new Date(coupon.startDate) <= new Date() &&
          new Date(coupon.endDate) >= new Date()
      );
      setCoupons(activeCoupons);
    } catch (err) {
      console.error("fetchCoupons - Error:", err);
      setError(err.response?.data?.message || "Failed to fetch coupons.");
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!selectedRoom || !bookingForm.checkIn || !bookingForm.checkOut) {
      setTotalPrice(0);
      setDiscountApplied(0);
      setCouponError("");
      return;
    }

    const checkInDate = new Date(bookingForm.checkIn);
    const checkOutDate = new Date(bookingForm.checkOut);
    if (checkOutDate <= checkInDate) {
      setTotalPrice(0);
      setDiscountApplied(0);
      setCouponError("Check-out date must be after check-in date.");
      return;
    }

    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    let price = selectedRoom.price * nights;
    let discount = 0;
    let appliedCouponCode = bookingForm.couponCode;
    let couponErrorMsg = "";

    if (isAdmin && !appliedCouponCode) {
      discount = 20;
      appliedCouponCode = "ADMIN20";
    } else if (isFirstBooking && !appliedCouponCode && !isAdmin) {
      discount = 50;
      appliedCouponCode = "FIRSTBOOKING50";
    } else if (appliedCouponCode && !["FIRSTBOOKING50", "ADMIN20"].includes(appliedCouponCode)) {
      const coupon = coupons.find((c) => c.code === appliedCouponCode);
      if (coupon) {
        discount = coupon.discount;  
      } else {
        couponErrorMsg = "Invalid coupon code.";
        appliedCouponCode = "";  
      }
    }

    setDiscountApplied(discount);
    setCouponError(couponErrorMsg);
    setTotalPrice(discount > 0 ? price * (1 - discount / 100) : price);
    return appliedCouponCode;  
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setCouponError("");
    try {
      const userId = getUserId();
      if (!userId) throw new Error("User not logged in.");
      const checkInDate = new Date(bookingForm.checkIn);
      const checkOutDate = new Date(bookingForm.checkOut);
      if (checkOutDate <= checkInDate) throw new Error("Check-out date must be after check-in date.");

      const appliedCouponCode = calculateTotalPrice();

      const bookingData = {
        userId,
        roomId: selectedRoom._id,
        name: `${bookingForm.firstname} ${bookingForm.lastname}`.trim(),
        members: parseInt(bookingForm.members),
        checkIn: checkInDate,
        checkOut: checkOutDate,
        hasChild: bookingForm.hasChild,
        phone: bookingForm.phone,
        couponCode: appliedCouponCode || null,
        totalPrice,
      };
      const response = await axios.post(`${baseURL}/api/bookings`, bookingData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert(response.data.message);
      onClose();
      setBookingForm({
        firstname: "",
        lastname: "",
        members: 1,
        checkIn: "",
        checkOut: "",
        hasChild: false,
        phone: "",
        couponCode: "",
      });
      setTotalPrice(0);
      setDiscountApplied(0);
      setCouponError("");
    } catch (err) {
      console.error("handleBookingSubmit - Error:", err);
      setError(err.response?.data?.message || "Failed to submit booking.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookingForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? selectedRoom.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === selectedRoom.images.length - 1 ? 0 : prev + 1
    );
  };

  useEffect(() => {
    if (showBookingModal && selectedRoom) {
      fetchUserRole();
      fetchUserBookings();
      fetchCoupons();
      setCurrentImageIndex(0);
    }
  }, [showBookingModal, selectedRoom]);

  useEffect(() => {
    calculateTotalPrice();
  }, [bookingForm.checkIn, bookingForm.checkOut, bookingForm.couponCode, selectedRoom, isFirstBooking, isAdmin, coupons]);

  return (
    <>
      {showBookingModal && selectedRoom && (
        <div className={`fixed inset-0 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} flex items-center justify-center z-50`}>
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-300  '} rounded-xl shadow-2xl w-11/12 max-w-4xl flex overflow-hidden`}>
            <div className={`${isDarkMode ? 'bg-black text-white border border-gray-300' : 'bg-white border text-black'} w-7/12 p-6`}>
              <h3 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-black'} mb-4`}>
                Room {selectedRoom.roomNumber || "N/A"} ({selectedRoom.type || "Standard"})
              </h3>
              {selectedRoom.images && selectedRoom.images.length > 0 ? (
                <div className={`relative mb-4 rounded-lg overflow-hidden shadow-inner ${isDarkMode ? 'shadow-gray-900' : 'shadow-gray-400'}`}>
                  <img
                    src={selectedRoom.images[currentImageIndex]}
                    alt={`Room ${selectedRoom.roomNumber || "N/A"}`}
                    className="w-full h-48 object-cover"
                  />
                  {selectedRoom.images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className={`${isDarkMode ? 'bg-gray-900/70 hover:bg-gray-800' : 'bg-gray-200/70 hover:bg-gray-300'} absolute top-1/2 left-2 transform -translate-y-1/2 text-white p-2 rounded-full transition-colors duration-200`}
                        aria-label="Previous image"
                      >
                        <FaArrowLeft />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className={`${isDarkMode ? 'bg-gray-900/70 hover:bg-gray-800' : 'bg-gray-200/70 hover:bg-gray-300'} absolute top-1/2 right-2 transform -translate-y-1/2 text-white p-2 rounded-full transition-colors duration-200`}
                        aria-label="Next image"
                      >
                        <FaArrowRight />
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className={`${isDarkMode ? 'bg-black text-white ' : 'bg-white text-black '} w-full h-48 rounded-lg flex items-center justify-center shadow-inner mb-4`}>
                  No Images Available
                </div>
              )}
              <div className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                <p className="flex items-center mb-2">
                  <FaBed className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} mr-2`} />
                  <span className={`${isDarkMode ? 'text-green-400' : 'text-green-500'} font-bold`}>₹{selectedRoom.price || "N/A"} per night</span>
                </p>
                <p className="flex items-center mb-2">
                  <strong className={`${isDarkMode ? 'text-blue-200' : 'text-blue-500'} min-w-24`}>Capacity:</strong>
                  <span className="flex items-center">
                    {Array(selectedRoom.capacity || 1)
                      .fill()
                      .map((_, i) => (
                        <FaUser key={i} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mr-1`} />
                      ))}
                    {selectedRoom.capacity || "N/A"} guests
                  </span>
                </p>
                <div className="mb-2">
                  <strong className={`${isDarkMode ? 'text-blue-200' : 'text-blue-500'} block`}>Amenities:</strong>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedRoom.amenities?.length > 0 ? (
                      selectedRoom.amenities.map((amenity, index) => {
                        const iconMap = {
                          WiFi: <FaWifi className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />,
                          TV: <FaTv className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />,
                          "Air Conditioning": <FaSnowflake className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />,
                          "Mini Bar": <FaGlassMartini className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />,
                          "Room Service": <FaConciergeBell className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />,
                          Balcony: <FaDoorOpen className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />,
                        };
                        return (
                          <span
                            key={index}
                            className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} flex items-center gap-1 px-3 py-1 rounded-full text-sm`}
                          >
                            {iconMap[amenity] || null} {amenity}
                          </span>
                        );
                      })
                    ) : (
                      "N/A"
                    )}
                  </div>
                </div>
                <p>
                  <strong className={`${isDarkMode ? 'text-blue-200' : 'text-blue-500'}`}>Description:</strong>{" "}
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} italic`}>
                    {selectedRoom.description || "No description available."}
                  </span>
                </p>
              </div>
            </div>
            <div className={`${isDarkMode ? 'bg-black text-black border' : 'bg-white text-black'} w-5/12 p-6 h-screen overflow-scroll`}>
              <div className="flex justify-between items-center mb-4 ">
                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>Book This Room</h3>
                <button
                  onClick={() => {
                    onClose();
                    setCouponError("");
                  }}
                  className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'} transition-colors duration-200`}
                  aria-label="Close booking modal"
                >
                  <FaTimes size={24} />
                </button>
              </div>
              {error && (
                <div className={`${isDarkMode ? 'bg-red-900/20 border-red-500/50' : 'bg-red-100 border-red-400'} border rounded-lg p-2 mb-4`}>
                  <p className={`${isDarkMode ? 'text-red-400' : 'text-red-600'} text-center`}>{error}</p>
                </div>
              )}
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label htmlFor="firstname" className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                    First Name
                  </label>
                  <input
                    id="firstname"
                    name="firstname"
                    type="text"
                    value={bookingForm.firstname}
                    onChange={handleFormChange}
                    required
                    className={`${isDarkMode ? 'bg-gray-700/80 border-gray-600 text-gray-100 focus:ring-blue-400' : 'bg-gray-200/80 border-gray-300 text-gray-800 focus:ring-blue-500'} w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition-all duration-200`}
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastname" className={`block text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-black'} mb-1`}>
                    Last Name
                  </label>
                  <input
                    id="lastname"
                    name="lastname"
                    type="text"
                    value={bookingForm.lastname}
                    onChange={handleFormChange}
                    required
                    className={`${isDarkMode ? 'bg-gray-700/80 border-gray-600 text-gray-100 focus:ring-blue-400' : 'bg-gray-200/80 border-gray-300 text-gray-800 focus:ring-blue-500'} w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition-all duration-200`}
                    placeholder="Enter your last name"
                  />
                </div>
                <div>
                  <label htmlFor="members" className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                    Number of Members
                  </label>
                  <div className="relative">
                    <input
                      id="members"
                      name="members"
                      type="number"
                      value={bookingForm.members}
                      onChange={handleFormChange}
                      min="1"
                      max={selectedRoom.capacity}
                      required
                      className={`${isDarkMode ? 'bg-gray-700/80 border-gray-600 text-gray-100 focus:ring-blue-400' : 'bg-gray-200/80 border-gray-300 text-gray-800 focus:ring-blue-500'} w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition-all duration-200`}
                    />
                    <FaUsers className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} absolute right-3 top-1/2 transform -translate-y-1/2`} />
                  </div>
                </div>
                <div>
                  <label htmlFor="checkIn" className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                    Check-In Date
                  </label>
                  <input
                    id="checkIn"
                    name="checkIn"
                    type="date"
                    value={bookingForm.checkIn}
                    onChange={handleFormChange}
                    required
                    min={new Date().toISOString().split("T")[0]}
                    className={`${isDarkMode ? 'bg-gray-700/80 border-gray-600 text-gray-100 focus:ring-blue-400' : 'bg-gray-200/80 border-gray-300 text-gray-800 focus:ring-blue-500'} w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition-all duration-200`}
                  />
                </div>
                <div>
                  <label htmlFor="checkOut" className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                    Check-Out Date
                  </label>
                  <input
                    id="checkOut"
                    name="checkOut"
                    type="date"
                    value={bookingForm.checkOut}
                    onChange={handleFormChange}
                    required
                    min={bookingForm.checkIn || new Date().toISOString().split("T")[0]}
                    className={`${isDarkMode ? 'bg-gray-700/80 border-gray-600 text-gray-100 focus:ring-blue-400' : 'bg-gray-200/80 border-gray-300 text-gray-800 focus:ring-blue-500'} w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition-all duration-200`}
                  />
                </div>
                <div>
                  <label htmlFor="couponCode" className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                    Coupon Code
                  </label>
                  <div className="relative">
                    <input
                      id="couponCode"
                      name="couponCode"
                      type="text"
                      value={bookingForm.couponCode}
                      onChange={handleFormChange}
                      disabled={isFirstBooking || isAdmin}
                      className={`${isDarkMode ? 'bg-gray-700/80 border-gray-600 text-gray-100 focus:ring-blue-400 disabled:bg-gray-600/50 disabled:text-gray-400' : 'bg-gray-200/80 border-gray-300 text-gray-800 focus:ring-blue-500 disabled:bg-gray-300/50 disabled:text-gray-600'} w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition-all duration-200 disabled:cursor-not-allowed`}
                      placeholder="Enter coupon code"
                    />
                    <FaTicketAlt className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} absolute right-3 top-1/2 transform -translate-y-1/2`} />
                  </div>
                  {isAdmin && !bookingForm.couponCode && (
                    <p className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-green-500'} mt-2`}>
                      20% discount applied automatically for admin users!
                    </p>
                  )}
                  {isFirstBooking && !isAdmin && !bookingForm.couponCode && (
                    <p className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-green-500'} mt-2`}>
                      50% discount applied automatically for your first booking!
                    </p>
                  )}
                  {couponError && (
                    <p className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'} mt-2`}>{couponError}</p>
                  )}
                </div>
                <div>
                  <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    <strong>Base Price:</strong>{" "}
                    <span className={`${isDarkMode ? 'text-green-400' : 'text-green-500'} font-bold`}>
                      ₹{(bookingForm.checkIn && bookingForm.checkOut
                        ? selectedRoom.price * Math.ceil((new Date(bookingForm.checkOut) - new Date(bookingForm.checkIn)) / (1000 * 60 * 60 * 24))
                        : 0).toFixed(2)}
                    </span>
                  </p>
                  {discountApplied > 0 && (
                    <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      <strong>Discount Applied:</strong>{" "}
                      <span className={`${isDarkMode ? 'text-green-400' : 'text-green-500'}`}>
                        {discountApplied}% ({bookingForm.couponCode || (isAdmin ? "ADMIN20" : "FIRSTBOOKING50")})
                      </span>
                    </p>
                  )}
                  <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    <strong>Total Price:</strong>{" "}
                    <span className={`${isDarkMode ? 'text-green-400' : 'text-green-500'} font-bold`}>₹{totalPrice.toFixed(2)}</span>
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    id="hasChild"
                    name="hasChild"
                    type="checkbox"
                    checked={bookingForm.hasChild}
                    onChange={handleFormChange}
                    className={`${isDarkMode ? 'text-blue-400 bg-gray-700 border-gray-600 focus:ring-blue-400' : 'text-blue-500 bg-gray-200 border-gray-300 focus:ring-blue-500'} mr-2 h-4 w-4 rounded focus:ring-2`}
                  />
                  <label htmlFor="hasChild" className={`text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} flex items-center`}>
                    <FaChild className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} mr-2`} /> Children Included
                  </label>
                </div>
                <div>
                  <label htmlFor="phone" className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={bookingForm.phone}
                      onChange={handleFormChange}
                      required
                      pattern="\d{10}"
                      className={`${isDarkMode ? 'bg-gray-700/80 border-gray-600 text-gray-100 focus:ring-blue-400' : 'bg-gray-200/80 border-gray-300 text-gray-800 focus:ring-blue-500'} w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition-all duration-200`}
                      placeholder="Enter 10-digit phone number"
                    />
                    <FaPhone className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} absolute right-3 top-1/2 transform -translate-y-1/2`} />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading || !!couponError}
                  className={`${isDarkMode ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 hover:shadow-blue-900/50' : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 hover:shadow-blue-500/50'} w-full text-white py-3 rounded-lg transition-all duration-200 shadow-lg font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? "Submitting..." : "Submit Booking"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingFormModal;