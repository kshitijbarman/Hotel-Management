import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaSignOutAlt, FaUsers, FaHotel, FaBed, FaMapMarkerAlt,
  FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaUser,
  FaPhone, FaChild
} from "react-icons/fa";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const baseURL = "http://localhost:6969";

  //----------------------------------- Fetch all bookings -----------------------------------
  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${baseURL}/api/bookings`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log('this is checked in',response.data.bookings);
      
      setBookings(response.data.bookings);
    } catch (err) {
      console.error("fetchBookings - Error:", err);
      setError(err.response?.data?.message || "Failed to fetch bookings.");
    } finally {
      setLoading(false); 
    }
  };

  //----------------------------------- Handle booking status -----------------------------------
  const handleUpdateStatus = async (bookingId, status) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.put(
        `${baseURL}/api/bookings/${bookingId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert(response.data.message);
      fetchBookings();
    } catch (err) {
      console.error("handleUpdateStatus - Error:", err);
      setError(err.response?.data?.message || `Failed to ${status} booking.`);
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    setLoading(true);
    setError("");
    try {
      localStorage.removeItem("token");
      navigate("/");
    } catch (err) {
      console.error("handleLogout - Error:", err);
      setError(err.response?.data?.message || "Failed to log out.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    // Initial fetch
    fetchBookings();

    // Set up polling every 30 seconds
    const interval = setInterval(() => {
      fetchBookings();
    }, 30000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 text-gray-100 font-sans">
      <header className="bg-slate-800/90 backdrop-blur-md shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 flex items-center">
            <FaHotel className="mr-2 text-blue-400" /> Admin Panel
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-300 hover:text-white bg-red-600/90 hover:bg-red-600 px-4 py-2 rounded-lg transition-all duration-200 shadow-md"
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 pb-16">
        <section className="bg-gradient-to-r from-slate-800/90 to-blue-900/90 rounded-2xl p-8 shadow-xl mb-10 backdrop-blur-md">
          <h2 className="text-2xl font-semibold text-blue-300 mb-6 flex items-center">
            <FaCalendarAlt className="mr-2" /> Manage Bookings
          </h2>

          {error && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-8">
              <p className="text-red-400 text-center">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
          ) : bookings.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-gradient-to-r from-slate-800/80 to-slate-800/60 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-slate-700/50 transition-all duration-200 hover:shadow-blue-900/30"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-blue-300">
                      Booking for {booking.name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        booking.status === "approved"
                          ? "bg-green-600/80 text-white"
                          : booking.status === "rejected"
                          ? "bg-red-600/80 text-white"
                          : "bg-yellow-600/80 text-white"
                      }`}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-200">
                    <div>
                      <p className="flex items-center mb-2">
                        <FaUser className="mr-2 text-blue-400" />
                        <strong>User:</strong> {booking.userId?.firstname} {booking.userId?.lastname} ({booking.userId?.email})
                      </p>
                      <p className="flex items-center mb-2">
                        <FaBed className="mr-2 text-blue-400" />
                        <strong>Room:</strong> {booking.roomId?.roomNumber} ({booking.roomId?.type})
                      </p>
                      <p className="flex items-center mb-2">
                        <FaPhone className="mr-2 text-blue-400" />
                        <strong>Phone:</strong> {booking.phone}
                      </p>
                      <p className="flex items-center mb-2">
                        <FaUsers className="mr-2 text-blue-400" />
                        <strong>Members:</strong> {booking.members}
                      </p>
                      <p className="flex items-center">
                        <FaChild className="mr-2 text-blue-400" />
                        <strong>Children Included:</strong> {booking.hasChild ? "Yes" : "No"}
                      </p>
                    </div>
                    <div>
                      <p className="flex items-center mb-2">
                        <FaCalendarAlt className="mr-2 text-blue-400" />
                        <strong>Check-In:</strong> {new Date(booking.checkIn).toLocaleDateString()}
                      </p>
                      <p className="flex items-center mb-2">
                        <FaCalendarAlt className="mr-2 text-blue-400" />
                        <strong>Check-Out:</strong> {new Date(booking.checkOut).toLocaleDateString()}
                      </p>
                      <p className="flex items-center mb-2">
                        <FaMapMarkerAlt className="mr-2 text-blue-400" />
                        <strong>Price:</strong> ₹{booking.roomId?.price || "N/A"} per night
                      </p>
                      <p className="flex items-center">
                        <FaCheckCircle className="mr-2 text-blue-400" />
                        <strong>Checked In:</strong>{" "}
                        <span
                          className={`${
                            booking.checkedIn ? "text-green-400" : "text-gray-400"
                          }`}
                        >
                          {booking.checkedIn ? "Yes" : "No"}
                        </span>
                      </p>
                    </div>
                  </div>
                  {booking.status === "pending" && (
                    <div className="mt-4 flex space-x-4">
                      <button
                        onClick={() => handleUpdateStatus(booking._id, "approved")}
                        className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-all duration-200 shadow-md"
                        disabled={loading}
                      >
                        <FaCheckCircle className="mr-2" /> Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(booking._id, "rejected")}
                        className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all duration-200 shadow-md"
                        disabled={loading}
                      >
                        <FaTimesCircle className="mr-2" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-800/70 rounded-xl p-12 text-center shadow-lg border border-slate-700/30">
              <FaCalendarAlt className="text-5xl text-blue-400/50 mx-auto mb-4" />
              <p className="text-gray-300 text-xl mb-2">No bookings found.</p>
              <p className="text-blue-300/70">Check back later for new bookings.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminPanel;