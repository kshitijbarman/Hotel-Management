
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import StateManagement from "./components/StateManagement";
import CityManagement from "./components/CityManagement";
import HotelManagement from "./components/HotelManagement";
import RoomManagement from "./components/RoomManagement";
import BookingManagement from "./components/BookingManagement";
import UserPanel from "../User/UserPanel";
import CouponManagement from "./components/CouponManagement";
import UserDashboard from "../dashboard/NewDashboard";
import NewDashboard from "../dashboard/NewDashboard";

const ADLocation = () => {
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [inactiveStates, setInactiveStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [inactiveCities, setInactiveCities] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [inactiveHotels, setInactiveHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [inactiveRooms, setInactiveRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [inactiveCoupons, setInactiveCoupons] = useState([]);
  const [sidebarTab, setSidebarTab] = useState("states");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [expandedHotels, setExpandedHotels] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const baseURL = "https://hotel-management-backend-rgpk.onrender.com";

  const fetchStates = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/states`);
      setStates(response.data.filter((s) => s.isActive));
      setInactiveStates(response.data.filter((s) => !s.isActive));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch states.");
    }
  };

  const fetchCities = async (stateId) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${baseURL}/api/states/${stateId}/cities`
      );
      const cityData = response.data;

      console.log("Fetched city data:", cityData);
      console.log("Target stateId:", stateId);

      // Adjusted logic for filtering cities by stateId
      const filteredCities = cityData.filter((city) => {
        // Option A: populated as array
        if (Array.isArray(city.state)) {
          return city.state[0]?._id === stateId;
        }
        // Option B: populated as single object
        if (typeof city.state === "object") {
          return city.state._id === stateId;
        }
        // Option C: state is stored as raw ID string
        return city.state === stateId;
      });

      setCities(filteredCities.filter((city) => city.isActive !== false));
      setInactiveCities(
        filteredCities.filter((city) => city.isActive === false)
      );

      setLoading(false);

      if (filteredCities.length === 0) {
        setError("No cities found for this state.");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to fetch cities.";
      setError(errorMessage);
      setCities([]);
      setInactiveCities([]);
      setLoading(false);
    }
  };

  const fetchHotels = async (cityId) => {
    if (!cityId) {
      setHotels([]);
      setInactiveHotels([]);
      setRooms([]);
      setInactiveRooms([]);
      setExpandedHotels({});
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseURL}/api/cities/${cityId}/hotels`
      );
      setHotels(response.data.filter((h) => h.isActive));
      setInactiveHotels(response.data.filter((h) => !h.isActive));
      setExpandedHotels({});
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch hotels.");
    } finally {
      setLoading(false);
    }
  };


    const fetchRooms = async (hotelId) => {
    if (!hotelId) return;

    console.log("Fetching rooms for hotelId:", hotelId);
    setLoading(true);
    try {
      // const response = await axios.get(`${baseURL}/api/hotels/${hotelId}/rooms`);
      const response = await axios.get(`${baseURL}/api/${hotelId}/rooms`);

      console.log(`${baseURL}/api/hotels/${hotelId}/rooms`);
      const rooms = response.data;

      console.log("Rooms received:", rooms);
      setRooms(rooms.filter((r) => r.isActive));
      setInactiveRooms(rooms.filter((r) => !r.isActive));
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to fetch rooms.");
      setRooms([]);
      setInactiveRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/api/bookings`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBookings(response.data.bookings);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch bookings.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/api/coupons`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCoupons(response.data.filter((c) => c.isActive));
      setInactiveCoupons(response.data.filter((c) => !c.isActive));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch coupons.");
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
    fetchStates();
    fetchBookings();
    fetchCoupons();
  }, [navigate]);

  const handleStateChange = async (e) => {
    const stateId = e.target.value;
    setSelectedState(stateId);
    setSelectedCity("");
    setHotels([]);
    setInactiveHotels([]);
    setRooms([]);
    setInactiveRooms([]);
    setExpandedHotels({});
    await fetchCities(stateId);
  };

  const handleCityChange = async (e) => {
    const cityId = e.target.value;
    setSelectedCity(cityId);
    setRooms([]);
    setInactiveRooms([]);
    await fetchHotels(cityId);
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      confirm("Are you sure you want to log out?");
      localStorage.removeItem("token");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to log out.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="h-screen flex bg-white ">
      <Sidebar
        sidebarTab={sidebarTab}
        setSidebarTab={setSidebarTab}
        handleLogout={handleLogout}
      />
      <div className="flex-1  overflow-y-auto">
        <div className="bg-white shadow-xl p-6 text-gray-100">
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-center">{error}</p>
            </div>
          )}

          {sidebarTab === "dash" && navigate("/user-dashboard")}


          {sidebarTab === "states" && (
            <StateManagement
              states={states}
              inactiveStates={inactiveStates}
              fetchStates={fetchStates}
              loading={loading}
              setLoading={setLoading}
              setError={setError}
              baseURL={baseURL}
            />
          )}
          {sidebarTab === "cities" && (
            <CityManagement
              cities={cities}
              inactiveCities={inactiveCities}
              states={states}
              fetchCities={fetchCities}
              selectedState={selectedState}
              loading={loading}
              setLoading={setLoading}
              setError={setError}
              baseURL={baseURL}
            />
          )}
          {sidebarTab === "hotels" && (
            <HotelManagement
              hotels={hotels}
              inactiveHotels={inactiveHotels}
              states={states}
              cities={cities}
              fetchHotels={fetchHotels}
              fetchCities={fetchCities}
              selectedState={selectedState}
              selectedCity={selectedCity}
              loading={loading}
              setLoading={setLoading}
              setError={setError}
              baseURL={baseURL}
            />
          )}
          {sidebarTab === "rooms" && (
            <RoomManagement
              rooms={rooms}
              inactiveRooms={inactiveRooms}
              states={states}
              cities={cities}
              hotels={hotels}
              fetchRooms={fetchRooms}
              fetchHotels={fetchHotels}
              fetchCities={fetchCities}
              selectedState={selectedState}
              selectedCity={selectedCity}
              selectedHotel={selectedHotel}
              loading={loading}
              setLoading={setLoading}
              setError={setError}
              baseURL={baseURL}
            />
          )}
          {sidebarTab === "bookings" && (
            <BookingManagement
              bookings={bookings}
              fetchBookings={fetchBookings}
              loading={loading}
              setLoading={setLoading}
              setError={setError}
              baseURL={baseURL}
            />
          )}
          {sidebarTab === "coupons" && (
            <CouponManagement
              coupons={coupons}
              inactiveCoupons={inactiveCoupons}
              fetchCoupons={fetchCoupons}
              loading={loading}
              setLoading={setLoading}
              setError={setError}
              baseURL={baseURL}
            />
          )}
          {sidebarTab === "view" && (
            <div>
              <h2 className="text-xl font-semibold text-blue-300 mb-4">
                Location View
              </h2>
              <div className="text-gray-100">
                <UserPanel />
              </div>
            </div>
          )}
         
        </div>
      </div>
    </div>
  );
};

export default ADLocation;
