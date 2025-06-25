import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import SearchHotels from "./components/SearchHotel";
import HotelList from "./components/HotelList";
import BookingsModal from "./components/BookingModal";
import BookingFormModal from "./components/BookingshistoryModal";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import useDarkMode from "./hooks/useDarkMode";

const UserPanel = () => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [filterRating, setFilterRating] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showBookingsModal, setShowBookingsModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDarkMode] = useDarkMode();
  const baseURL = "http://localhost:6969";

  const getUserId = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      return decoded._id;
    }
    return null;
  };

  const fetchUserDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");
      const response = await axios.get(`${baseURL}/user/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserDetails(response.data);
    } catch (err) {
      console.error("fetchUserDetails - Error:", err);
      setError(err.response?.data?.message || "Failed to fetch user details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStates = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/states`);
      const activeStates = Array.isArray(response.data)
        ? response.data.filter((s) => s.isActive)
        : [];
      setStates(activeStates);
    } catch (err) {
      console.error("fetchStates - Error:", err);
      setError(err.response?.data?.message || "Failed to fetch states.");
      setStates([]);
    }
  };

  const fetchCities = async (stateId) => {
    if (!stateId) {
      setCities([]);
      setHotels([]);
      return;
    }
    try {
      const response = await axios.get(
        `${baseURL}/api/states/${stateId}/cities`
      );
      const activeCities = Array.isArray(response.data)
        ? response.data.filter((c) => c.isActive)
        : [];
      setCities(activeCities);
    } catch (err) {
      console.error("fetchCities - Error:", err);
      setError(err.response?.data?.message || "Failed to fetch cities.");
      setCities([]);
    }
  };

  const fetchHotels = async (cityId) => {
    if (!cityId) {
      setHotels([]);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseURL}/api/cities/${cityId}/hotels`
      );
      const activeHotels = Array.isArray(response.data)
        ? response.data.filter((h) => h.isActive)
        : [];
      setHotels(activeHotels);
    } catch (err) {
      console.error("fetchHotels - Error:", err);
      setError(err.response?.data?.message || "Failed to fetch hotels.");
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllHotels = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/api/hotels`);
      const activeHotels = Array.isArray(response.data)
        ? response.data.filter((h) => h.isActive)
        : [];
      setHotels(activeHotels);
    } catch (err) {
      console.error("fetchAllHotels - Error:", err);
      setError(err.response?.data?.message || "Failed to fetch hotels.");
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStateChange = async (stateId) => {
    setSelectedState(stateId);
    setSelectedCity("");
    setHotels([]);
    if (stateId) {
      await fetchCities(stateId);
    } else {
      await fetchAllHotels();
      setFilterRating(0);
      setSearchTerm("");
      setSortOrder("");
    }
  };

  const handleCityChange = async (cityId) => {
    setSelectedCity(cityId);
    if (cityId) {
      await fetchHotels(cityId);
    } else {
      await fetchAllHotels();
      setFilterRating(0);
      setSearchTerm("");
      setSortOrder("");
    }
  };

  const handleOpenBookingModal = (room) => {
    setSelectedRoom(room);
    setShowBookingModal(true);
  };

  const handleCloseBookingModal = () => {
    setShowBookingModal(false);
    setSelectedRoom(null);
  };

  useEffect(() => {
    fetchUserDetails();
    fetchStates();
    fetchAllHotels();
  }, []);

  return (
    <div
      className={`h-screen ${
        isDarkMode
          ? "bg-black text-white"
          : "bg-white text-black"
      } ${isDarkMode ? "text-gray-100" : "text-gray-800"} font-sans`}
    >
      <Header
        userDetails={userDetails}
        setShowBookingsModal={setShowBookingsModal}
        loading={loading}
        setLoading={setLoading}
        setError={setError}
      />

      {/* Hero Section with Search Box */}
      <section className="relative overflow-hidden mb-8 rounded-2xl shadow-lg">
        <div
          className="bg-cover bg-center h-[400px] lg:h-[650px]"
          style={{
            backgroundImage: userDetails?.backgroundImage
              ? `url(${userDetails.backgroundImage})`
              : `url('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa')`,
          }}
        >
          <div
            className={`absolute inset-0 ${
              isDarkMode ? "bg-blue-900/30" : "bg-blue-200/30"
            }`}
          ></div>

          {/* Hero Text and Search */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 lg:px-20 text-center">
            <h1
              className={`text-4xl lg:text-5xl font-extrabold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              } drop-shadow`}
            >
              Find the Best Hotels in Jaipur
            </h1>
            <p
              className={`text-lg lg:text-xl mb-6 ${
                isDarkMode ? "text-blue-100" : "text-white bg-transparent"
              } p-2 rounded-xl drop-shadow`}
            >
             Search low prices on hotels, homes and much more...
            </p>

            {/* Search Box */}
            <div className="w-full max-w-2xl flex bg-white rounded-full shadow-lg overflow-hidden">
              <input
                type="text"
                placeholder="Search hotels, locations, or amenities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-3 text-gray-700 focus:outline-none"
              />
              <button className="bg-blue-600 text-white px-6 py-3 font-semibold hover:bg-blue-700 transition">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className={`w-full mx-auto px-10   pb-16 ${
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      }`}>
        <SearchHotels
          states={states}
          cities={cities}
          selectedState={selectedState}
          selectedCity={selectedCity}
          filterRating={filterRating}
          searchTerm={searchTerm}
          sortOrder={sortOrder}
          handleStateChange={handleStateChange}
          handleCityChange={handleCityChange}
          setFilterRating={setFilterRating}
          setSearchTerm={setSearchTerm}
          setSortOrder={setSortOrder}
        />

        <HotelList
          hotels={hotels}
          filterRating={filterRating}
          searchTerm={searchTerm}
          sortOrder={sortOrder}
          onBookNow={handleOpenBookingModal}
          selectedState={selectedState}
          selectedCity={selectedCity}
          loading={loading}
          error={error}
          setError={setError}
        />

        <BookingFormModal
          showBookingModal={showBookingModal}
          selectedRoom={selectedRoom}
          onClose={handleCloseBookingModal}
        />

        <BookingsModal
          showBookingsModal={showBookingsModal}
          setShowBookingsModal={setShowBookingsModal}
          setError={setError}
        />
      </main>
    </div>
  );
};

export default UserPanel;
