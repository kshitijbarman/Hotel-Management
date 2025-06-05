
import React, { useState } from "react";
import axios from "axios";
import {
  FaUser,
  FaBed,
  FaPhone,
  FaUsers,
  FaChild,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaTrash,
} from "react-icons/fa";
import { useSelector } from "react-redux";

const BookingManagement = ({
  bookings,
  fetchBookings,
  loading,
  setLoading,
  setError,
  baseURL,
}) => {

  const [bookingFilter, setBookingFilter] = useState("all");
  const [checkInFilter, setCheckInFilter] = useState({ start: "", end: "" });
  const [checkedInFilter, setCheckedInFilter] = useState("all");

  const handleUpdateStatus = async (bookingId, status) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.patch(
        `${baseURL}/api/bookings/${bookingId}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert(response.data.message);
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${status} booking.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (
      !confirm(
        "Are you sure you want to delete this booking? This action cannot be undone."
      )
    )
      return;

    setLoading(true);
    setError("");
    try {
      const response = await axios.delete(
        `${baseURL}/api/bookings/${bookingId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert(response.data.message || "Booking deleted successfully.");
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete booking.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckInFilterChange = (e) => {
    const { name, value } = e.target;
    setCheckInFilter((prev) => ({ ...prev, [name]: value }));
  };

  const filteredBookings = bookings
    .filter((booking) => {
      if (bookingFilter !== "all") {
        return booking.status === bookingFilter;
      }
      return true;
    })
    .filter((booking) => {
      const checkInDate = new Date(booking.checkIn);
      const startDate = checkInFilter.start
        ? new Date(checkInFilter.start)
        : null;
      const endDate = checkInFilter.end ? new Date(checkInFilter.end) : null;

      if (startDate && checkInDate < startDate) return false;
      if (endDate && checkInDate > endDate) return false;
      return true;
    })
    .filter((booking) => {
      if (checkedInFilter === "checkedIn") return booking.checkedIn === true;
      if (checkedInFilter === "notCheckedIn")
        return booking.checkedIn === false;
      return true;
    });

  return (
    <div className="space-y-6 bg-white">
      <h2
        className={`text-2xl font-bold  bg-white text-black tracking-wide`}
      >
        🧾 Booking Management
      </h2>

      {/* Status Filter Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {["all", "pending", "approved", "rejected"].map((filter) => (
          <button
            key={filter}
            onClick={() => setBookingFilter(filter)}
            className={`py-2 rounded-xl shadow-md text-sm font-semibold tracking-wide transition-all duration-200 ${
              bookingFilter === filter
                ? `bg-${
                    filter === "all"
                      ? "blue"
                      : filter === "pending"
                      ? "yellow"
                      : filter === "approved"
                      ? "green"
                      : "red"
                  }-600 text-white`
                : "bg-slate-700 text-gray-300 hover:bg-slate-600"
            }`}
          >
            {filter === "all" && "📋 All"}
            {filter === "pending" && "⏳ Pending"}
            {filter === "approved" && "✅ Approved"}
            {filter === "rejected" && "❌ Rejected"}
          </button>
        ))}
      </div>

      {/* Check-In Status Filter */}
      <div className="grid grid-cols-3 gap-3">
        {["all", "checkedIn", "notCheckedIn"].map((filter) => (
          <button
            key={filter}
            onClick={() => setCheckedInFilter(filter)}
            className={`py-2 rounded-xl shadow-md text-sm font-semibold tracking-wide transition-all duration-200 ${
              checkedInFilter === filter
                ? `bg-${
                    filter === "all"
                      ? "blue"
                      : filter === "checkedIn"
                      ? "green"
                      : "gray"
                  }-600 text-white`
                : "bg-slate-700 text-gray-300 hover:bg-slate-600"
            }`}
          >
            {filter === "all"
              ? "📦 All"
              : filter === "checkedIn"
              ? "🟢 Checked In"
              : "🔘 Not Checked In"}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-b-4"></div>
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white backdrop-blur-md rounded-xl shadow-xl p-6 border border-slate-700 hover:shadow-blue-600/30 transition-all duration-200"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-black">
                  👤 {booking.name}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    booking.status === "approved"
                      ? "bg-green-600 text-white"
                      : booking.status === "rejected"
                      ? "bg-red-600 text-white"
                      : "bg-yellow-600 text-white"
                  }`}
                >
                  {booking.status.toUpperCase()}
                </span>
              </div>

              {/* Booking Details */}
             

              <div className="grid sm:grid-cols-2 gap-2 text-sm text-gray-100">
                <div className="bg-black rounded-xl p-4 shadow-inner space-y-4">
                  <div className="flex items-center">
                    <FaUser className="text-white mr-3" />
                    <span className="font-medium text-blue-200">
                      {booking.userId?.firstname} {booking.userId?.lastname}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaPhone className="text-blue-400 mr-3" />
                    <span className="text-gray-300">{booking.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <FaUsers className="text-blue-400 mr-3" />
                    <span>Members: {booking.members}</span>
                  </div>
                  <div className="flex items-center">
                    <FaChild className="text-blue-400 mr-3" />
                    <span>
                      Child Included:
                      <span
                        className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                          booking.hasChild
                            ? "bg-green-600 text-white"
                            : "bg-gray-500 text-white"
                        }`}
                      >
                        {booking.hasChild ? "Yes" : "No"}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaBed className="text-blue-400 mr-3" />
                    <span>
                      Room #{booking.roomId?.roomNumber} ({booking.roomId?.type}
                      )
                    </span>
                  </div>
                </div>

                <div className="bg-black rounded-xl p-4 shadow-inner space-y-4">
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-blue-400 mr-3" />
                    <span>
                      Check-In: {new Date(booking.checkIn).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-blue-400 mr-3" />
                    <span>
                      Check-Out:{" "}
                      {new Date(booking.checkOut).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="text-blue-400 mr-3" />
                    <span>Price: ₹{booking.roomId?.price}</span>
                  </div>
                  <div className="flex items-center">
                    <FaCheckCircle className="text-blue-400 mr-3" />
                    <span>
                      Checked In:{" "}
                      <span
                        className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                          booking.checkedIn
                            ? "bg-green-600 text-white"
                            : "bg-gray-500 text-white"
                        }`}
                      >
                        {booking.checkedIn ? "Yes" : "No"}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaUser className="text-blue-400 mr-3" />
                    <span className="text-blue-300 text-xs break-all whitespace-normal block w-full max-w-[180px]">
                      {booking.userId?.email}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex flex-wrap gap-4">
                {booking.status === "pending" && (
                  <>
                    <button
                      onClick={() =>
                        handleUpdateStatus(booking._id, "approved")
                      }
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl shadow-sm"
                    >
                      <FaCheckCircle /> Approve
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateStatus(booking._id, "rejected")
                      }
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl shadow-sm"
                    >
                      <FaTimesCircle /> Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDeleteBooking(booking._id)}
                  className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-xl shadow-sm"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 text-center shadow-lg border border-slate-700/30">
          <p className="text-black text-xl mb-2">No bookings found.</p>
          {/* <p className="text-blue-300/70">Check back later for new bookings.</p> */}
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
