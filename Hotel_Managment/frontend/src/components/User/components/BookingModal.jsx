
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTimes, FaListAlt, FaFilter, FaCheck, FaBan, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import useDarkMode from "../hooks/useDarkMode"; // Import the useDarkMode hook


const BookingsModal = ({ showBookingsModal, setShowBookingsModal, setError }) => {
  const [bookings, setBookings] = useState([]);
  const [bookingFilter, setBookingFilter] = useState("all");
  const [checkInFilter, setCheckInFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [hotelNames, setHotelNames] = useState({});
  const baseURL = "https://hotel-management-backend-zitt.onrender.com";
  const [isDarkMode] = useDarkMode();  

  const fetchUserBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/api/bookings/my-bookings`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const fetchedBookings = Array.isArray(response.data) ? response.data : [];
      console.log("Fetched Bookings:", fetchedBookings);
      setBookings(fetchedBookings);
    } catch (err) {
      console.error("fetchUserBookings - Error:", err);
      setError(err.response?.data?.message || "Failed to fetch your bookings.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchHotelName = async (roomId) => {
    if (!roomId) return "N/A";
    if (hotelNames[roomId]) return hotelNames[roomId];

    try {
      const response = await axios.get(`${baseURL}/api/rooms/${roomId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const hotelName = response.data.hotel?.name || "Hotel Not Found";
      setHotelNames((prev) => ({ ...prev, [roomId]: hotelName }));
      return hotelName;
    } catch (err) {
      console.error(`fetchHotelName for room ${roomId} - Error:`, err);
      setHotelNames((prev) => ({ ...prev, [roomId]: "Hotel Not Found" }));
      return "Hotel Not Found";
    }
  };

  useEffect(() => {
    const fetchAllHotelNames = async () => {
      const hotelNamePromises = bookings.map(async (booking) => {
        if (booking.roomId?._id && !booking.roomId?.hotelId?.name) {
          const name = await fetchHotelName(booking.roomId._id);
          return { roomId: booking.roomId._id, name };
        }
        return null;
      });

      const results = await Promise.all(hotelNamePromises);
      const newHotelNames = results.reduce((acc, result) => {
        if (result) acc[result.roomId] = result.name;
        return acc;
      }, {});

      setHotelNames((prev) => ({ ...prev, ...newHotelNames }));
    };

    if (bookings.length > 0) {
      fetchAllHotelNames();
    }
  }, [bookings]);

  const handleCheckIn = async (bookingId) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`${baseURL}/api/bookings/${bookingId}/checkin`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert(response.data.message);
      await fetchUserBookings();
    } catch (err) {
      console.error("handleCheckIn - Error:", err);
      setError(err.response?.data?.message || "Failed to check in.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`${baseURL}/api/bookings/${bookingId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert(response.data.message);
      await fetchUserBookings();
    } catch (err) {
      console.error("handleCancelBooking - Error:", err);
      setError(err.response?.data?.message || "Failed to cancel booking.");
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = (Array.isArray(bookings) ? bookings : []).filter((booking) => {
    const statusMatch =
      bookingFilter === "all" ||
      (bookingFilter === "pending" && booking.status === "pending" && !booking.checkedIn && booking.status !== "cancelled") ||
      (bookingFilter === "checkedIn" && booking.checkedIn) ||
      (bookingFilter === "cancelled" && booking.status === "cancelled");

    const checkInMatch =
      checkInFilter === "all" ||
      (checkInFilter === "checkedIn" && booking.checkedIn) ||
      (checkInFilter === "notCheckedIn" && !booking.checkedIn);

    return statusMatch && checkInMatch;
  });

  useEffect(() => {
    if (showBookingsModal) {
      fetchUserBookings();
    }
  }, [showBookingsModal]);

  return (
    <>
      {showBookingsModal && (
        <div
          className={`fixed inset-0 bg-opacity-70 flex items-center justify-center z-50 ${
            isDarkMode ? "bg-black" : "bg-gray-900"
          }`}
        >
          <div
            className={`rounded-xl shadow-2xl w-11/12 max-w-5xl p-6 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center mb-6">
              <h3
                className={`text-2xl font-semibold ${
                  isDarkMode ? "text-blue-300" : "text-blue-600"
                }`}
              >
                My Bookings
              </h3>
              <button
                onClick={() => setShowBookingsModal(false)}
                className={`transition-colors duration-200 ${
                  isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FaTimes size={24} />
              </button>
            </div>
            <div className="mb-6 flex flex-wrap gap-3">
              <button
                onClick={() => setBookingFilter("all")}
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                  bookingFilter === "all"
                    ? isDarkMode
                      ? "bg-blue-600 text-white"
                      : "bg-blue-500 text-white"
                    : isDarkMode
                    ? "bg-gray-700/80 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <FaListAlt className="mr-2" /> All
              </button>
              <button
                onClick={() => setBookingFilter("pending")}
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                  bookingFilter === "pending"
                    ? isDarkMode
                      ? "bg-yellow-600 text-white"
                      : "bg-yellow-500 text-white"
                    : isDarkMode
                    ? "bg-gray-700/80 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <FaFilter className="mr-2" /> Pending
              </button>
              <button
                onClick={() => setBookingFilter("cancelled")}
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                  bookingFilter === "cancelled"
                    ? isDarkMode
                      ? "bg-red-600 text-white"
                      : "bg-red-500 text-white"
                    : isDarkMode
                    ? "bg-gray-700/80 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <FaBan className="mr-2" /> Cancelled
              </button>
              <button
                onClick={() => setCheckInFilter("checkedIn")}
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                  checkInFilter === "checkedIn"
                    ? isDarkMode
                      ? "bg-green-600 text-white"
                      : "bg-green-500 text-white"
                    : isDarkMode
                    ? "bg-gray-700/80 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <FaSignInAlt className="mr-2" /> Checked In
              </button>
              <button
                onClick={() => setCheckInFilter("notCheckedIn")}
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                  checkInFilter === "notCheckedIn"
                    ? isDarkMode
                      ? "bg-orange-600 text-white"
                      : "bg-orange-500 text-white"
                    : isDarkMode
                    ? "bg-gray-700/80 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <FaSignOutAlt className="mr-2" /> Not Checked In
              </button>
            </div>
            {loading ? (
              <div className="flex justify-center py-12">
                <div
                  className={`animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 ${
                    isDarkMode ? "border-blue-400" : "border-blue-600"
                  }`}
                ></div>
              </div>
            ) : filteredBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table
                  className={`w-full rounded-lg shadow-lg table-auto ${
                    isDarkMode ? "bg-gray-800/90" : "bg-white"
                  }`}
                >
                  <thead>
                    <tr
                      className={`text-left ${
                        isDarkMode ? "bg-blue-900/50 text-blue-200" : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      <th className="p-4 w-[15%]">Hotel</th>
                      <th className="p-4 w-[15%]">Room</th>
                      <th className="p-4 w-[10%]">Check-In</th>
                      <th className="p-4 w-[10%]">Check-Out</th>
                      <th className="p-4 w-[8%]">Members</th>
                      <th className="p-4 w-[8%]">Status</th>
                      <th className="p-4 w-[8%]">Total Price</th>
                      <th className="p-4 w-[10%]">Discount</th>
                      <th className="p-4 w-[10%]">Check-In Action</th>
                      <th className="p-4 w-[6%]">Cancel</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => {
                      const hotelName =
                        booking.roomId?.hotelId?.name ||
                        hotelNames[booking.roomId?._id] ||
                        "No Hotel Name...";

                      return (
                        <tr
                          key={booking._id}
                          className={`border-t hover:bg-opacity-50 transition-all duration-200 ${
                            isDarkMode ? "border-gray-700/50 hover:bg-gray-700/50" : "border-gray-200 hover:bg-gray-100"
                          }`}
                        >
                          <td className="p-4">
                            {hotelName === "Hotel Not Found" ? (
                              <span className={`${isDarkMode ? "text-yellow-400" : "text-yellow-600"}`}>
                                Hotel Not Found
                              </span>
                            ) : (
                              <span className={`${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                                {hotelName}
                              </span>
                            )}
                          </td>
                          <td className={`p-4 ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                            {booking.roomId ? `Room ${booking.roomId.roomNumber} (${booking.roomId.type})` : "N/A"}
                          </td>
                          <td className={`p-4 ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                            {new Date(booking.checkIn).toLocaleDateString()}
                          </td>
                          <td className={`p-4 ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                            {new Date(booking.checkOut).toLocaleDateString()}
                          </td>
                          <td className={`p-4 text-center ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                            {booking.members}
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold inline-block text-center w-full ${
                                booking.status === "approved"
                                  ? isDarkMode
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-green-100 text-green-600"
                                  : booking.status === "rejected"
                                  ? isDarkMode
                                    ? "bg-red-500/20 text-red-400"
                                    : "bg-red-100 text-red-600"
                                  : booking.status === "cancelled"
                                  ? isDarkMode
                                    ? "bg-red-500/20 text-red-400"
                                    : "bg-red-100 text-red-600"
                                  : isDarkMode
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-yellow-100 text-yellow-600"
                              }`}
                            >
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </td>
                          <td className={`p-4 text-center ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                            ₹{booking.totalPrice.toFixed(2)}
                          </td>
                          <td className={`p-4 text-center ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                            {booking.discountApplied}% ({booking.couponCode || "N/A"})
                          </td>
                          <td className="p-4">
                            {booking.status === "approved" && !booking.checkedIn && booking.status !== "cancelled" ? (
                              <button
                                onClick={() => handleCheckIn(booking._id)}
                                className={`flex items-center justify-center mx-auto px-3 py-1 rounded-full text-xs font-semibold text-white transition-all duration-200 ${
                                  isDarkMode
                                    ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500"
                                    : "bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600"
                                }`}
                              >
                                <FaCheck className="mr-2" /> Check-In
                              </button>
                            ) : booking.checkedIn ? (
                              <span
                                className={`block px-3 py-1 rounded-full text-xs font-semibold text-center ${
                                  isDarkMode
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-green-100 text-green-600"
                                }`}
                              >
                                Checked In
                              </span>
                            ) : (
                              <span className={`block text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                N/A
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            {booking.status !== "cancelled" && !booking.checkedIn ? (
                              <button
                                onClick={() => handleCancelBooking(booking._id)}
                                className={`flex items-center justify-center mx-auto px-3 py-1 rounded-full text-xs font-semibold text-white transition-all duration-200 ${
                                  isDarkMode
                                    ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500"
                                    : "bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600"
                                }`}
                              >
                                <FaBan className="mr-2" /> Cancel
                              </button>
                            ) : (
                              <span className={`block text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                N/A
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div
                className={`rounded-xl p-12 text-center shadow-lg border ${
                  isDarkMode ? "bg-gray-800/70 border-gray-700/30" : "bg-gray-100 border-gray-200"
                }`}
              >
                <FaListAlt
                  className={`text-5xl mx-auto mb-4 ${
                    isDarkMode ? "text-blue-400/50" : "text-blue-600/50"
                  }`}
                />
                <p className={`text-xl mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  No bookings found for the selected filter.
                </p>
                <p className={`${isDarkMode ? "text-blue-300/70" : "text-blue-600/70"}`}>
                  Try a different filter or book a room to see your reservations here.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default BookingsModal;