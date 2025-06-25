 
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaCity, FaHotel, FaSignOutAlt, FaSearch, FaSort, FaUserAltSlash, FaUserAlt, FaBed, FaCalendarCheck, FaUsers, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaUser, FaPhone, FaChild, FaEye } from "react-icons/fa";
import UserPanel from "../User/UserPanel";

const ALocation = () => {
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
    const [stateForm, setStateForm] = useState({ name: "", code: "" });
    const [cityForm, setCityForm] = useState({ name: "", stateId: "" });
    const [hotelForm, setHotelForm] = useState({
        stateId: "",
        cityId: "",
        name: "",
        address: "",
        rating: "",
        amenities: "",
        priceMin: "",
        priceMax: "",
        contactPhone: "",
        contactEmail: "",
        totalRooms: "",
    });
    const [roomForm, setRoomForm] = useState({
        stateId: "",
        cityId: "",
        hotelId: "",
        roomNumber: "",
        type: "",
        price: "",
        isAvailable: true,
        images: [],
        amenities: [],
        description: "",
        capacity: "",
    });
    const [editStateId, setEditStateId] = useState(null);
    const [editCityId, setEditCityId] = useState(null);
    const [editHotelId, setEditHotelId] = useState(null);
    const [editRoomId, setEditRoomId] = useState(null);
    const [sidebarTab, setSidebarTab] = useState("states");
    const [stateTab, setStateTab] = useState("active");
    const [cityTab, setCityTab] = useState("active");
    const [hotelTab, setHotelTab] = useState("active");
    const [roomTab, setRoomTab] = useState("active");
    const [bookingFilter, setBookingFilter] = useState("all"); // New state for booking filter
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [isHotelExpanded, setIsHotelExpanded] = useState(false);
    const [expandedHotels, setExpandedHotels] = useState({});

    const baseURL = "http://localhost:6969";

    // -----------------------------------Fetch data-----------------------------------
    const fetchStates = async () => {
        try {
            const response = await axios.get(`${baseURL}/api/states`);
            const active = response.data.filter((s) => s.isActive);
            const inactive = response.data.filter((s) => !s.isActive);
            setStates(active);
            setInactiveStates(inactive);
        } catch (err) {
            console.error("fetchStates - Error:", err);
            setError(err.response?.data?.message || "Failed to fetch states.");
        }
    };

    const fetchCities = async (stateId) => {
        if (!stateId) {
            setCities([]);
            setInactiveCities([]);
            setHotels([]);
            setInactiveHotels([]);
            setRooms([]);
            setInactiveRooms([]);
            return;
        }
        try {
            const response = await axios.get(`${baseURL}/api/states/${stateId}/cities`);
            const active = response.data.filter((c) => c.isActive);
            const inactive = response.data.filter((c) => !c.isActive);
            setCities(active);
            setInactiveCities(inactive);
        } catch (err) {
            console.error("fetchCities - Error:", err);
            setError(err.response?.data?.message || "Failed to fetch cities.");
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
            const response = await axios.get(`${baseURL}/api/cities/${cityId}/hotels`);
            const active = response.data.filter((h) => h.isActive);
            const inactive = response.data.filter((h) => !h.isActive);
            setHotels(active);
            setInactiveHotels(inactive);
            setExpandedHotels({});
        } catch (err) {
            console.error("fetchHotels - Error:", err);
            setError(err.response?.data?.message || "Failed to fetch hotels.");
        } finally {
            setLoading(false);
        }
    };

    const fetchRooms = async (hotelId) => {
        if (!hotelId) {
            setRooms([]);
            setInactiveRooms([]);
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get(`${baseURL}/api/${hotelId}/rooms`);
           
            const active = response.data.filter((r) => r.isActive);
            const inactive = response.data.filter((r) => !r.isActive);
            setRooms(active);
            setInactiveRooms(inactive);
        } catch (err) {
            console.error("fetchRooms - Error:", err);
            setError(err.response?.data?.message || "Failed to fetch rooms.");
        } finally {
            setLoading(false);
        }
    };

    const fetchBookings = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await axios.get(`${baseURL}/api/bookings`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setBookings(response.data.bookings);
        } catch (err) {
            console.error("fetchBookings - Error:", err);
            setError(err.response?.data?.message || "Failed to fetch bookings.");
        } finally {
            setLoading(false);
        }
    };

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
            console.error("handleUpdateStatus - Error:", err);
            setError(err.response?.data?.message || `Failed to ${status} booking.`);
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
    }, [navigate]);

    const toggleHotelDetails = (hotelId) => {
        setExpandedHotels((prev) => ({
            ...prev,
            [hotelId]: !prev[hotelId],
        }));
    };

    // -----------------------------------State handle submit -----------------------------------
    const handleStateSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        const payload = {
            name: stateForm.name?.trim(),
            code: stateForm.code?.trim(),
        };
        if (!payload.name || !payload.code) {
            setError("Name and code are required.");
            setLoading(false);
            return;
        }
        try {
            if (editStateId) {
                await axios.put(`${baseURL}/api/states/${editStateId}`, payload);
            } else {
                await axios.post(`${baseURL}/api/states/add`, payload);
            }
            setStateForm({ name: "", code: "" });
            setEditStateId(null);
            await fetchStates();
        } catch (err) {
            console.error("handleStateSubmit - Error:", err);
            setError(err.response?.data?.message || "Failed to save state.");
        } finally {
            setLoading(false);
        }
    };

    const handleStateEdit = (state) => {
        setStateForm({ name: state.name, code: state.code });
        setEditStateId(state._id);
        setStateTab("active");
    };

    const handleStateDelete = async (id) => {
        setLoading(true);
        setError("");
        try {
            await axios.delete(`${baseURL}/api/states/${id}`);
            await fetchStates();
            alert("State deleted successfully with cities and hotels");
        } catch (err) {
            console.error("handleStateDelete - Error:", err);
            setError(err.response?.data?.message || "Failed to delete state.");
        } finally {
            setLoading(false);
        }
    };

    const handleStateSoftDelete = async (id) => {
        setLoading(true);
        setError("");
        try {
            await axios.patch(`${baseURL}/api/states/${id}/softdelete`);
            await fetchStates();
            setStateTab("inactive");
        } catch (err) {
            console.error("handleStateSoftDelete - Error:", err);
            setError(err.response?.data?.message || "Failed to soft-delete state.");
        } finally {
            setLoading(false);
        }
    };

    const handleStateActivate = async (id) => {
        setLoading(true);
        setError("");
        try {
            await axios.patch(`${baseURL}/api/states/${id}/activate`);
            await fetchStates();
            setStateTab("active");
        } catch (err) {
            console.error("handleStateActivate - Error:", err);
            setError(err.response?.data?.message || "Failed to activate state.");
        } finally {
            setLoading(false);
        }
    };

    //----------------------------------- City handler submit-----------------------------------
    const handleCitySubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        const payload = {
            name: cityForm.name?.trim(),
            state: cityForm.stateId,
        };
        if (!payload.name || !payload.state) {
            setError("Name and state are required.");
            setLoading(false);
            return;
        }
        try {
            if (editCityId) {
                await axios.put(`${baseURL}/api/cities/${editCityId}`, payload);
            } else {
                await axios.post(`${baseURL}/api/cities/add`, payload);
            }
            const stateId = cityForm.stateId;
            setCityForm({ name: "", stateId: "" });
            setEditCityId(null);
            setCityTab("active");
            await fetchCities(stateId);
        } catch (err) {
            console.error("handleCitySubmit - Error:", err);
            setError(err.response?.data?.message || "Failed to save city.");
        } finally {
            setLoading(false);
        }
    };

    const handleCityEdit = (city) => {
        setCityForm({
            name: city.name || "",
            stateId: city.state?._id || "",
        });
        setEditCityId(city._id);
        setCityTab("active");
    };

    const handleCityDelete = async (id) => {
        setLoading(true);
        setError("");
        try {
            await axios.delete(`${baseURL}/api/cities/${id}`);
            await fetchCities(selectedState);
        } catch (err) {
            console.error("handleCityDelete - Error:", err);
            setError(err.response?.data?.message || "Failed to delete city.");
        } finally {
            setLoading(false);
        }
    };

    const handleCitySoftDelete = async (id) => {
        setLoading(true);
        setError("");
        try {
            const city = cities.find((c) => c._id === id) || inactiveCities.find((c) => c._id === id);
            const stateId = city?.state?._id || selectedState || "";
            await axios.patch(`${baseURL}/api/cities/${id}/softdelete`);
            if (stateId) {
                await fetchCities(stateId);
                setSelectedState(stateId);
            } else {
                setCities([]);
                setInactiveCities([]);
                setError("No state selected. Please select a state to view cities.");
            }
            setCityTab("inactive");
        } catch (err) {
            console.error("handleCitySoftDelete - Error:", err);
            setError(err.response?.data?.message || "Failed to soft-delete city.");
        } finally {
            setLoading(false);
        }
    };

    const handleCityActivate = async (id) => {
        setLoading(true);
        setError("");
        try {
            await axios.patch(`${baseURL}/api/cities/${id}/activate`);
            await fetchCities(selectedState);
            setCityTab("active");
        } catch (err) {
            console.error("handleCityActivate - Error:", err);
            setError(err.response?.data?.message || "Failed to activate city.");
        } finally {
            setLoading(false);
        }
    };

    const handleHotelSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        const payload = {
            name: hotelForm.name?.trim() || "",
            city: hotelForm.cityId || "",
            address: hotelForm.address?.trim() || "",
            rating: parseFloat(hotelForm.rating) || undefined,
            amenities: hotelForm.amenities
                ? hotelForm.amenities
                    .split(",")
                    .map((a) => a.trim())
                    .filter((a) => a)
                : [],
            priceRange: {
                min: parseFloat(hotelForm.priceMin) || undefined,
                max: parseFloat(hotelForm.priceMax) || undefined,
            },
            contact: {
                phone: hotelForm.contactPhone?.trim() || "",
                email: hotelForm.contactEmail?.trim() || "",
            },
            totalRooms: parseInt(hotelForm.totalRooms, 10) || undefined,
        };
        if (!payload.name || !payload.city || payload.totalRooms === undefined) {
            setError("Name, city, and total rooms are required.");
            setLoading(false);
            return;
        }
        try {
            if (editHotelId) {
                await axios.put(`${baseURL}/api/hotels/${editHotelId}`, payload);
            } else {
                await axios.post(`${baseURL}/api/hotels/add`, payload);
            }
            const cityId = hotelForm.cityId;
            setHotelForm({
                stateId: hotelForm.stateId,
                cityId: cityId,
                name: "",
                address: "",
                rating: "",
                amenities: "",
                priceMin: "",
                priceMax: "",
                contactPhone: "",
                contactEmail: "",
                totalRooms: "",
            });
            setEditHotelId(null);
            setHotelTab("active");
            await fetchHotels(cityId);
        } catch (err) {
            console.error("handleHotelSubmit - Error:", err);
            setError(err.response?.data?.message || "Failed to save hotel.");
        } finally {
            setLoading(false);
        }
    };

    const handleHotelEdit = (hotel) => {
        const cityId = hotel.city?._id || "";
        const stateId = hotel.city?.state?._id || selectedState || "";
        setHotelForm({
            stateId,
            cityId,
            name: hotel.name || "",
            address: hotel.address || "",
            rating: hotel.rating?.toString() || "",
            amenities: hotel.amenities?.join(", ") || "",
            priceMin: hotel.priceRange?.min?.toString() || "",
            priceMax: hotel.priceRange?.max?.toString() || "",
            contactPhone: hotel.contact?.phone || "",
            contactEmail: hotel.contact?.email || "",
            totalRooms: hotel.totalRooms?.toString() || "",
        });
        setEditHotelId(hotel._id);
        setHotelTab("active");
        if (stateId) {
            fetchCities(stateId);
        }
        if (cityId) {
            fetchHotels(cityId);
        }
    };

    const handleHotelDelete = async (id) => {
        setLoading(true);
        setError("");
        try {
            await axios.delete(`${baseURL}/api/hotels/${id}`);
            await fetchHotels(hotelForm.cityId || selectedCity);
        } catch (err) {
            console.error("handleHotelDelete - Error:", err);
            setError(err.response?.data?.message || "Failed to delete hotel.");
        } finally {
            setLoading(false);
        }
    };

    const handleHotelSoftDelete = async (id) => {
        setLoading(true);
        setError("");
        try {
            await axios.patch(`${baseURL}/api/hotels/${id}/softdelete`);
            await fetchHotels(hotelForm.cityId || selectedCity);
            setHotelTab("inactive");
        } catch (err) {
            console.error("handleHotelSoftDelete - Error:", err);
            setError(err.response?.data?.message || "Failed to soft-delete hotel.");
        } finally {
            setLoading(false);
        }
    };

    const handleHotelActivate = async (id) => {
        setLoading(true);
        setError("");
        try {
            await axios.patch(`${baseURL}/api/hotels/${id}/activate`);
            await fetchHotels(hotelForm.cityId || selectedCity);
            setHotelTab("active");
        } catch (err) {
            console.error("handleHotelActivate - Error:", err);
            setError(err.response?.data?.message || "Failed to activate hotel.");
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setLoading(true);
        setError("");
        try {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append("images", files[i]);
            }

            const response = await axios.post(
                `${baseURL}/api/rooms/upload-images`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    timeout: 120000,
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        console.log(`Upload Progress: ${percentCompleted}%`);
                    },
                }
            );

            setRoomForm((prev) => ({
                ...prev,
                images: [...prev.images, ...response.data.imageUrls],
            }));
        } catch (err) {
            console.error("handleImageUpload - Error:", err);
            setError(err.response?.data?.message || "Failed to upload images.");
        } finally {
            setLoading(false);
        }
    };

    const removeImage = (index) => {
        setRoomForm((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const handleAmenitiesChange = (e) => {
        const { value, checked } = e.target;
        setRoomForm((prev) => {
            const amenities = checked
                ? [...prev.amenities, value]
                : prev.amenities.filter((amenity) => amenity !== value);
            return { ...prev, amenities };
        });
    };

    const handleRoomSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        const payload = new FormData();
        payload.append("roomNumber", roomForm.roomNumber?.trim() || "");
        payload.append("hotel", roomForm.hotelId || "");
        payload.append("type", roomForm.type?.trim() || "Standard");
        payload.append("price", parseFloat(roomForm.price) || "");
        payload.append("isAvailable", roomForm.isAvailable);
        payload.append("images", JSON.stringify(roomForm.images));
        payload.append("amenities", JSON.stringify(roomForm.amenities));
        payload.append("description", roomForm.description?.trim() || "");
        payload.append("capacity", parseInt(roomForm.capacity, 10) || "");

        if (!roomForm.roomNumber || !roomForm.hotelId) {
            setError("Room number and hotel are required.");
            setLoading(false);
            return;
        }
        try {
            if (editRoomId) {
                await axios.put(`${baseURL}/api/rooms/${editRoomId}`, payload, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } else {
                await axios.post(`${baseURL}/api/rooms/add`, payload, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }
            const hotelId = roomForm.hotelId;
            setRoomForm({
                stateId: roomForm.stateId,
                cityId: roomForm.cityId,
                hotelId: hotelId,
                roomNumber: "",
                stateId: "",
                cityId: "",
                hotelId: "",
                type: "",
                price: "",
                isAvailable: true,
                images: [],
                amenities: [],
                description: "",
                capacity: "",
            });
            setEditRoomId(null);
            setRoomTab("active");
            await fetchRooms(hotelId);
        } catch (err) {
            console.error("handleRoomSubmit - Error:", err);
            setError(err.response?.data?.message || "Failed to save room.");
        } finally {
            setLoading(false);
        }
    };

    const handleRoomEdit = (room) => {
        const hotelId = room.hotel?._id || "";
        const cityId = room.hotel?.city?._id || "";
        const stateId = room.hotel?.city?.state?._id || selectedState || "";
        setRoomForm({
            stateId,
            cityId,
            hotelId,
            roomNumber: room.roomNumber || "",
            type: room.type || "",
            price: room.price?.toString() || "",
            isAvailable: room.isAvailable ?? true,
            images: room.images || [],
            amenities: room.amenities || [],
            description: room.description || "",
            capacity: room.capacity?.toString() || "",
        });
        setEditRoomId(room._id);
        setRoomTab("active");
        if (stateId && !cities.length) {
            fetchCities(stateId);
        }
        if (cityId) {
            setSelectedCity(cityId);
            fetchHotels(cityId);
        }
        if (hotelId) {
            setSelectedHotel(hotelId);
            fetchRooms(hotelId);
        }
    };

    const handleRoomDelete = async (id) => {
        setLoading(true);
        setError("");
        try {
            await axios.delete(`${baseURL}/api/rooms/${id}`);
            await fetchRooms(roomForm.hotelId || selectedHotel);
        } catch (err) {
            console.error("handleRoomDelete - Error:", err);
            setError(err.response?.data?.message || "Failed to delete room.");
        } finally {
            setLoading(false);
        }
    };

    const handleRoomSoftDelete = async (id) => {
        setLoading(true);
        setError("");
        try {
            await axios.patch(`${baseURL}/api/rooms/${id}/softdelete`);
            await fetchRooms(roomForm.hotelId || selectedHotel);
            setRoomTab("inactive");
        } catch (err) {
            console.error("handleRoomSoftDelete - Error:", err);
            setError(err.response?.data?.message || "Failed to soft-delete room.");
        } finally {
            setLoading(false);
        }
    };

    const handleRoomActivate = async (id) => {
        setLoading(true);
        setError("");
        try {
            await axios.patch(`${baseURL}/api/rooms/${id}/activate`);
            await fetchRooms(roomForm.hotelId || selectedHotel);
            setRoomTab("active");
        } catch (err) {
            console.error("handleRoomActivate - Error:", err);
            setError(err.response?.data?.message || "Failed to activate room.");
        } finally {
            setLoading(false);
        }
    };

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
        setHotelForm((prev) => ({ ...prev, cityId }));
        setRooms([]);
        setInactiveRooms([]);
        await fetchHotels(cityId);
    };

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

    // Filter bookings based on bookingFilter
    const filteredBookings = bookingFilter === "all"
        ? bookings
        : bookings.filter((booking) => booking.status === bookingFilter);

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-slate-900 to-blue-900">
            {/* -----------------------------------Sidebar----------------------------------- */}
            <div className="w-64 bg-slate-950 text-white flex flex-col shadow-lg">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <FaUserAlt className="text-blue-400" /> Admin Panel
                    </h1>
                </div>
                <nav className="flex-1">
                    <ul className="space-y-2 p-4">
                        <li>
                            <button
                                onClick={() => setSidebarTab("states")}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${sidebarTab === "states" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-slate-800"
                                    }`}
                            >
                                <FaMapMarkerAlt /> States
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setSidebarTab("cities")}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${sidebarTab === "cities" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-slate-800"
                                    }`}
                            >
                                <FaCity /> Cities
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setSidebarTab("hotels")}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${sidebarTab === "hotels" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-slate-800"
                                    }`}
                            >
                                <FaHotel /> Hotels
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setSidebarTab("rooms")}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${sidebarTab === "rooms" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-slate-800"
                                    }`}
                            >
                                <FaBed /> Rooms
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setSidebarTab("bookings")}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${sidebarTab === "bookings" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-slate-800"
                                    }`}
                            >
                                <FaCalendarCheck /> Bookings
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setSidebarTab("view")}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${sidebarTab === "view" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-slate-800"
                                    }`}
                            >
                                <FaEye /> View
                            </button>
                        </li>
                    </ul>
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-3 rounded-lg bg-red-600 hover:bg-red-700 transition-all duration-200"
                    >
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
                {/* -----------------------------------Management ----------------------------------- */}
                <div className="bg-gradient-to-r from-slate-800/90 to-blue-900/90 rounded-2xl shadow-xl p-6 text-gray-100">
                    {error && (
                        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6">
                            <p className="text-red-400 text-center">{error}</p>
                        </div>
                    )}

                    {/*----------------------------------- States Tab----------------------------------- */}
                    {sidebarTab === "states" && (
                        <div>
                            <h2 className="text-xl font-semibold text-blue-300 mb-4">Manage States</h2>
                            <form onSubmit={handleStateSubmit} className="space-y-4 mb-6">
                                <div>
                                    <label htmlFor="state-name" className="block text-sm font-medium text-gray-300">
                                        State Name
                                    </label>
                                    <input
                                        id="state-name"
                                        type="text"
                                        value={stateForm.name}
                                        onChange={(e) => setStateForm({ ...stateForm, name: e.target.value })}
                                        required
                                        className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="state-code" className="block text-sm font-medium text-gray-300">
                                        State Code
                                    </label>
                                    <input
                                        id="state-code"
                                        type="text"
                                        value={stateForm.code}
                                        onChange={(e) => setStateForm({ ...stateForm, code: e.target.value })}
                                        required
                                        className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                                    disabled={loading}
                                >
                                    {loading ? "Saving..." : editStateId ? "Update" : "Add"}
                                </button>
                            </form>
                            <div className="flex gap-2 mb-4">
                                <button
                                    onClick={() => setStateTab("active")}
                                    className={`flex-1 py-2 rounded-md ${stateTab === "active" ? "bg-blue-600 text-white" : "bg-slate-700 text-gray-300"
                                        }`}
                                >
                                    Active
                                </button>
                                <button
                                    onClick={() => setStateTab("inactive")}
                                    className={`flex-1 py-2 rounded-md ${stateTab === "inactive" ? "bg-red-600 text-white" : "bg-slate-700 text-gray-300"
                                        }`}
                                >
                                    Inactive
                                </button>
                            </div>
                            <ul className="space-y-2">
                                {(stateTab === "active" ? states : inactiveStates).map((state) => (
                                    <li
                                        key={state._id}
                                        className="flex justify-between items-center p-3 bg-slate-800 rounded-md border border-slate-700"
                                    >
                                        <span className="text-gray-200">
                                            {state.name} ({state.code})
                                        </span>
                                        <div className="flex gap-2">
                                            {stateTab === "active" ? (
                                                <>
                                                    <button
                                                        onClick={() => handleStateEdit(state)}
                                                        className="text-yellow-400 hover:text-yellow-500"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleStateDelete(state._id)}
                                                        className="text-red-400 hover:text-red-500"
                                                    >
                                                        Delete
                                                    </button>
                                                    <button
                                                        onClick={() => handleStateSoftDelete(state._id)}
                                                        className="text-gray-400 hover:text-gray-500"
                                                    >
                                                        Deactivate
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => handleStateActivate(state._id)}
                                                    className="text-green-400 hover:text-green-500"
                                                >
                                                    Activate
                                                </button>
                                            )}
                                        </div>
                                    </li>
                                ))}
                                {(stateTab === "active" ? states : inactiveStates).length === 0 && (
                                    <li className="text-center text-gray-400 py-4">No {stateTab} states found.</li>
                                )}
                            </ul>
                        </div>
                    )}

                    {/* -----------------------------------Cities Tab----------------------------------- */}
                    {sidebarTab === "cities" && (
                        <div>
                            <h2 className="text-xl font-semibold text-blue-300 mb-4">Manage Cities</h2>
                            <form onSubmit={handleCitySubmit} className="space-y-4 mb-6">
                                <div>
                                    <label htmlFor="city-name" className="block text-sm font-medium text-gray-300">
                                        City Name
                                    </label>
                                    <input
                                        id="city-name"
                                        type="text"
                                        value={cityForm.name}
                                        onChange={(e) => setCityForm({ ...cityForm, name: e.target.value })}
                                        required
                                        className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="city-state" className="block text-sm font-medium text-gray-300">
                                        State
                                    </label>
                                    <select
                                        id="city-state"
                                        value={cityForm.stateId}
                                        onChange={(e) => {
                                            const stateId = e.target.value;
                                            setCityForm({ ...cityForm, stateId });
                                            fetchCities(stateId);
                                        }}
                                        required
                                        className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">-- Select State --</option>
                                        {states.map((state) => (
                                            <option key={state._id} value={state._id}>
                                                {state.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                                    disabled={loading}
                                >
                                    {loading ? "Saving..." : editCityId ? "Update" : "Add"}
                                </button>
                            </form>
                            <div className="flex gap-2 mb-4">
                                <button
                                    onClick={() => setCityTab("active")}
                                    className={`flex-1 py-2 rounded-md ${cityTab === "active" ? "bg-blue-600 text-white" : "bg-slate-700 text-gray-300"
                                        }`}
                                >
                                    Active
                                </button>
                                <button
                                    onClick={() => setCityTab("inactive")}
                                    className={`flex-1 py-2 rounded-md ${cityTab === "inactive" ? "bg-red-600 text-white" : "bg-slate-700 text-gray-300"
                                        }`}
                                >
                                    Inactive
                                </button>
                            </div>
                            <ul className="space-y-2">
                                {(cityTab === "active" ? cities : inactiveCities).map((city) => (
                                    <li
                                        key={city._id}
                                        className="flex justify-between items-center p-3 bg-slate-800 rounded-md border border-slate-700"
                                    >
                                        <span className="text-gray-200">{city.name}</span>
                                        <div className="flex gap-2">
                                            {cityTab === "active" ? (
                                                <>
                                                    <button
                                                        onClick={() => handleCityEdit(city)}
                                                        className="text-yellow-400 hover:text-yellow-500"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleCityDelete(city._id)}
                                                        className="text-red-400 hover:text-red-500"
                                                    >
                                                        Delete
                                                    </button>
                                                    <button
                                                        onClick={() => handleCitySoftDelete(city._id)}
                                                        className="text-gray-400 hover:text-gray-500"
                                                    >
                                                        Deactivate
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => handleCityActivate(city._id)}
                                                    className="text-green-400 hover:text-green-500"
                                                >
                                                    Activate
                                                </button>
                                            )}
                                        </div>
                                    </li>
                                ))}
                                {(cityTab === "active" ? cities : inactiveCities).length === 0 && (
                                    <li className="text-center text-gray-400 py-4">No {cityTab} cities found.</li>
                                )}
                            </ul>
                        </div>
                    )}

                    {/*----------------------------------- Hotels Tab -----------------------------------*/}
                    {sidebarTab === "hotels" && (
                        <div>
                            <h2 className="text-xl font-semibold text-blue-300 mb-4">Manage Hotels</h2>
                            <form onSubmit={handleHotelSubmit} className="space-y-4 mb-6">
                                <div>
                                    <label htmlFor="hotel-state" className="block text-sm font-medium text-gray-300">
                                        State
                                    </label>
                                    <select
                                        id="hotel-state"
                                        value={hotelForm.stateId}
                                        onChange={(e) => {
                                            const stateId = e.target.value;
                                            setHotelForm({ ...hotelForm, stateId, cityId: "" });
                                            setSelectedState(stateId);
                                            fetchCities(stateId);
                                        }}
                                        className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">-- Select State --</option>
                                        {states.map((state) => (
                                            <option key={state._id} value={state._id}>
                                                {state.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="hotel-city" className="block text-sm font-medium text-gray-300">
                                        City
                                    </label>
                                    <select
                                        id="hotel-city"
                                        value={hotelForm.cityId}
                                        onChange={(e) => {
                                            const cityId = e.target.value;
                                            setHotelForm({ ...hotelForm, cityId });
                                            setSelectedCity(cityId);
                                            if (cityId) {
                                                fetchHotels(cityId);
                                            } else {
                                                setHotels([]);
                                                setInactiveHotels([]);
                                                setExpandedHotels({});
                                            }
                                        }}
                                        disabled={!hotelForm.stateId}
                                        className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-600"
                                    >
                                        <option value="">-- Select City --</option>
                                        {cities.map((city) => (
                                            <option key={city._id} value={city._id}>
                                                {city.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="hotel-name" className="block text-sm font-medium text-gray-300">
                                        Hotel Name
                                    </label>
                                    <input
                                        id="hotel-name"
                                        type="text"
                                        value={hotelForm.name}
                                        onChange={(e) => setHotelForm({ ...hotelForm, name: e.target.value })}
                                        required
                                        className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="hotel-address" className="block text-sm font-medium text-gray-300">
                                        Address
                                    </label>
                                    <input
                                        id="hotel-address"
                                        type="text"
                                        value={hotelForm.address}
                                        onChange={(e) => setHotelForm({ ...hotelForm, address: e.target.value })}
                                        className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="hotel-rating" className="block text-sm font-medium text-gray-300">
                                        Rating (1-5)
                                    </label>
                                    <input
                                        id="hotel-rating"
                                        type="number"
                                        min="1"
                                        max="5"
                                        step="0.1"
                                        value={hotelForm.rating}
                                        onChange={(e) => setHotelForm({ ...hotelForm, rating: e.target.value })}
                                        className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="hotel-amenities" className="block text-sm font-medium text-gray-300">
                                        Amenities (comma-separated)
                                    </label>
                                    <input
                                        id="hotel-amenities"
                                        type="text"
                                        value={hotelForm.amenities}
                                        onChange={(e) => setHotelForm({ ...hotelForm, amenities: e.target.value })}
                                        className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label htmlFor="hotel-price-min" className="block text-sm font-medium text-gray-300">
                                            Price Min
                                        </label>
                                        <input
                                            id="hotel-price-min"
                                            type="number"
                                            min="0"
                                            value={hotelForm.priceMin}
                                            onChange={(e) => setHotelForm({ ...hotelForm, priceMin: e.target.value })}
                                            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="hotel-price-max" className="block text-sm font-medium text-gray-300">
                                            Price Max
                                        </label>
                                        <input
                                            id="hotel-price-max"
                                            type="number"
                                            min="0"
                                            value={hotelForm.priceMax}
                                            onChange={(e) => setHotelForm({ ...hotelForm, priceMax: e.target.value })}
                                            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="hotel-contact-phone" className="block text-sm font-medium text-gray-300">
                                        Contact Phone
                                    </label>
                                    <input
                                        id="hotel-contact-phone"
                                        type="text"
                                        value={hotelForm.contactPhone}
                                        onChange={(e) => setHotelForm({ ...hotelForm, contactPhone: e.target.value })}
                                        className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="hotel-contact-email" className="block text-sm font-medium text-gray-300">
                                        Contact Email
                                    </label>
                                    <input
                                        id="hotel-contact-email"
                                        type="email"
                                        value={hotelForm.contactEmail}
                                        onChange={(e) => setHotelForm({ ...hotelForm, contactEmail: e.target.value })}
                                        className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="hotel-total-rooms" className="block text-sm font-medium text-gray-300">
                                        Total Rooms
                                    </label>
                                    <input
                                        id="hotel-total-rooms"
                                        type="number"
                                        min="0"
                                        value={hotelForm.totalRooms}
                                        onChange={(e) => setHotelForm({ ...hotelForm, totalRooms: e.target.value })}
                                        required
                                        className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                                    disabled={loading || !hotelForm.cityId}
                                >
                                    {loading ? "Saving..." : editHotelId ? "Update" : "Add"}
                                </button>
                            </form>
                            <div className="flex gap-2 mb-4">
                                <button
                                    onClick={() => setHotelTab("active")}
                                    className={`flex-1 py-2 rounded-md ${hotelTab === "active" ? "bg-blue-600 text-white" : "bg-slate-700 text-gray-300"
                                        }`}
                                >
                                    Active
                                </button>
                                <button
                                    onClick={() => setHotelTab("inactive")}
                                    className={`flex-1 py-2 rounded-md ${hotelTab === "inactive" ? "bg-red-600 text-white" : "bg-slate-700 text-gray-300"
                                        }`}
                                >
                                    Inactive
                                </button>
                            </div>
                            <ul className="space-y-2">
                                {(hotelTab === "active" ? hotels : inactiveHotels).map((hotel) => (
                                    <li
                                        key={hotel._id}
                                        className="flex justify-between items-center p-3 bg-slate-800 rounded-md border border-slate-700"
                                    >
                                        <span className="text-gray-200">{hotel.name}</span>
                                        <div className="flex gap-2">
                                            {hotelTab === "active" ? (
                                                <>
                                                    <button
                                                        onClick={() => handleHotelEdit(hotel)}
                                                        className="text-yellow-400 hover:text-yellow-500"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleHotelDelete(hotel._id)}
                                                        className="text-red-400 hover:text-red-500"
                                                    >
                                                        Delete
                                                    </button>
                                                    <button
                                                        onClick={() => handleHotelSoftDelete(hotel._id)}
                                                        className="text-gray-400 hover:text-gray-500"
                                                    >
                                                        Deactivate
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => handleHotelActivate(hotel._id)}
                                                    className="text-green-400 hover:text-green-500"
                                                >
                                                    Activate
                                                </button>
                                            )}
                                        </div>
                                    </li>
                                ))}
                                {(hotelTab === "active" ? hotels : inactiveHotels).length === 0 && (
                                    <li className="text-center text-gray-400 py-4">No {hotelTab} hotels found.</li>
                                )}
                            </ul>
                        </div>
                    )}

                    {/*----------------------------------- Rooms Tab----------------------------------- */}
                    {sidebarTab === "rooms" && (
                        <div>
                            <h2 className="text-xl font-semibold text-blue-300 mb-4">Manage Rooms</h2>
                            <form onSubmit={handleRoomSubmit} className="space-y-4 mb-6">
                                <div>
                                    <label htmlFor="room-state" className="block text-sm font-medium text-gray-300">
                                        State
                                    </label>
                                    <select
                                        id="room-state"
                                        value={roomForm.stateId}
                                        onChange={(e) => {
                                            const stateId = e.target.value;
                                            setRoomForm({ ...roomForm, stateId, cityId: "", hotelId: "" });
                                            setSelectedState(stateId);
                                            fetchCities(stateId);
                                        }}
                                        className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">-- Select State --</option>
                                        {states.map((state) => (
                                            <option key={state._id} value={state._id}>
                                                {state.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="room-city" className="block text-sm font-medium text-gray-300">
                                        City
                                    </label>
                                    <select
                                        id="room-city"
                                        value={roomForm.cityId}
                                        onChange={(e) => {
                                            const cityId = e.target.value;
                                            setRoomForm({ ...roomForm, cityId, hotelId: "" });
                                            setSelectedCity(cityId);
                                            if (cityId) {
                                                fetchHotels(cityId);
                                            } else {
                                                setHotels([]);
                                                setInactiveHotels([]);
                                                setRooms([]);
                                                setInactiveRooms([]);
                                            }
                                        }}
                                        disabled={!roomForm.stateId}
                                        className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-600"
                                    >
                                        <option value="">-- Select City --</option>
                                        {cities.map((city) => (
                                            <option key={city._id} value={city._id}>
                                                {city.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="room-hotel" className="block text-sm font-medium text-gray-300">
                                        Hotel
                                    </label>
                                    <select
                                        id="room-hotel"
                                        value={roomForm.hotelId}
                                        onChange={(e) => {
                                            const hotelId = e.target.value;
                                            setRoomForm({ ...roomForm, hotelId });
                                            setSelectedHotel(hotelId);
                                            if (hotelId) {
                                                fetchRooms(hotelId);
                                            } else {
                                                setRooms([]);
                                                setInactiveRooms([]);
                                            }
                                        }}
                                        disabled={!roomForm.cityId}
                                        className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-600"
                                    >
                                        <option value="">-- Select Hotel --</option>
                                        {hotels.map((hotel) => (
                                            <option key={hotel._id} value={hotel._id}>
                                                {hotel.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="room-number" className="block text-sm font-medium text-gray-300">
                                        Room Number
                                    </label>
                                    <input
                                        id="room-number"
                                        type="text"
                                        value={roomForm.roomNumber}
                                        onChange={(e) => setRoomForm({ ...roomForm, roomNumber: e.target.value })}
                                        required
                                        className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="room-type" className="block text-sm font-medium text-gray-300">
                                        Room Type
                                    </label>
                                    <input
                                        id="room-type"
                                        type="text"
                                        value={roomForm.type}
                                        onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value })}
                                        className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="room-price" className="block text-sm font-medium text-gray-300">
                                        Price
                                    </label>
                                    <input
                                        id="room-price"
                                        type="number"
                                        min="0"
                                        value={roomForm.price}
                                        onChange={(e) => setRoomForm({ ...roomForm, price: e.target.value })}
                                        className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="room-capacity" className="block text-sm font-medium text-gray-300">
                                        Capacity (Guests)
                                    </label>
                                    <input
                                        id="room-capacity"
                                        type="number"
                                        min="1"
                                        value={roomForm.capacity}
                                        onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })}
                                        className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300">Amenities</label>
                                    <div className="mt-2 space-y-2">
                                        {["WiFi", "TV", "Air Conditioning", "Mini Bar", "Room Service", "Balcony"].map((amenity) => (
                                            <div key={amenity} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={`room-amenity-${amenity}`}
                                                    value={amenity}
                                                    checked={roomForm.amenities.includes(amenity)}
                                                    onChange={handleAmenitiesChange}
                                                    className="h-4 w-4 text-blue-600 border-slate-600 rounded focus:ring-blue-500 bg-slate-700"
                                                />
                                                <label htmlFor={`room-amenity-${amenity}`} className="ml-2 text-sm text-gray-300">
                                                    {amenity}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="room-description" className="block text-sm font-medium text-gray-300">
                                        Description
                                    </label>
                                    <textarea
                                        id="room-description"
                                        value={roomForm.description}
                                        onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })}
                                        className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows="4"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="room-images" className="block text-sm font-medium text-gray-300">
                                        Room Images
                                    </label>
                                    <input
                                        id="room-images"
                                        type="file"
                                        multiple
                                        accept="image/jpeg,image/png,image/jpg"
                                        onChange={handleImageUpload}
                                        className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                    />
                                    {roomForm.images.length > 0 && (
                                        <div className="mt-4 grid grid-cols-3 gap-4">
                                            {roomForm.images.map((url, index) => (
                                                <div key={index} className="relative">
                                                    <img
                                                        src={url}
                                                        alt={`Room image ${index + 1}`}
                                                        className="w-full h-32 object-cover rounded-md"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="room-available" className="flex items-center">
                                        <input
                                            id="room-available"
                                            type="checkbox"
                                            checked={roomForm.isAvailable}
                                            onChange={(e) => setRoomForm({ ...roomForm, isAvailable: e.target.checked })}
                                            className="h-4 w-4 text-blue-600 border-slate-600 rounded focus:ring-blue-500 bg-slate-700"
                                        />
                                        <span className="ml-2 text-sm font-medium text-gray-300">Available</span>
                                    </label>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                                    disabled={loading || !roomForm.hotelId}
                                >
                                    {loading ? "Saving..." : editRoomId ? "Update" : "Add"}
                                </button>
                            </form>
                            <div className="flex gap-2 mb-4">
                                <button
                                    onClick={() => setRoomTab("active")}
                                    className={`flex-1 py-2 rounded-md ${roomTab === "active" ? "bg-blue-600 text-white" : "bg-slate-700 text-gray-300"
                                        }`}
                                >
                                    Active
                                </button>
                                <button
                                    onClick={() => setRoomTab("inactive")}
                                    className={`flex-1 py-2 rounded-md ${roomTab === "inactive" ? "bg-red-600 text-white" : "bg-slate-700 text-gray-300"
                                        }`}
                                >
                                    Inactive
                                </button>
                            </div>
                            <ul className="space-y-2">
                                {(roomTab === "active" ? rooms : inactiveRooms).map((room) => (
                                    <li
                                        key={room._id}
                                        className="flex justify-between items-center p-3 bg-slate-800 rounded-md border border-slate-700"
                                    >
                                        <span className="text-gray-200">
                                            Room {room.roomNumber} ({room.type})
                                        </span>
                                        <div className="flex gap-2">
                                            {roomTab === "active" ? (
                                                <>
                                                    <button
                                                        onClick={() => handleRoomEdit(room)}
                                                        className="text-yellow-400 hover:text-yellow-500"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleRoomDelete(room._id)}
                                                        className="text-red-400 hover:text-red-500"
                                                    >
                                                        Delete
                                                    </button>
                                                    <button
                                                        onClick={() => handleRoomSoftDelete(room._id)}
                                                        className="text-gray-400 hover:text-gray-500"
                                                    >
                                                        Deactivate
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => handleRoomActivate(room._id)}
                                                    className="text-green-400 hover:text-green-500"
                                                >
                                                    Activate
                                                </button>
                                            )}
                                        </div>
                                    </li>
                                ))}
                                {(roomTab === "active" ? rooms : inactiveRooms).length === 0 && (
                                    <li className="text-center text-gray-400 py-4">No {roomTab} rooms found.</li>
                                )}
                            </ul>
                        </div>
                    )}

                    {/* -----------------------------------Bookings Tab----------------------------------- */}
                    {sidebarTab === "bookings" && (
                        <div>
                            <h2 className="text-xl font-semibold text-blue-300 mb-4">Manage Bookings</h2>
                         {/* ---------------------fillter -----------------------*/}
                            <div className="flex gap-2 mb-6">
                                <button
                                    onClick={() => setBookingFilter("all")}
                                    className={`flex-1 py-2 rounded-md ${
                                        bookingFilter === "all"
                                            ? "bg-blue-600 text-white"
                                            : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                                    } transition-all duration-200`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setBookingFilter("pending")}
                                    className={`flex-1 py-2 rounded-md ${
                                        bookingFilter === "pending"
                                            ? "bg-yellow-600 text-white"
                                            : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                                    } transition-all duration-200`}
                                >
                                    Pending
                                </button>
                                <button
                                    onClick={() => setBookingFilter("approved")}
                                    className={`flex-1 py-2 rounded-md ${
                                        bookingFilter === "approved"
                                            ? "bg-green-600 text-white"
                                            : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                                    } transition-all duration-200`}
                                >
                                    Approved
                                </button>
                                <button
                                    onClick={() => setBookingFilter("rejected")}
                                    className={`flex-1 py-2 rounded-md ${
                                        bookingFilter === "rejected"
                                            ? "bg-red-600 text-white"
                                            : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                                    } transition-all duration-200`}
                                >
                                    Rejected
                                </button>
                            </div>
                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                                </div>
                            ) : filteredBookings.length > 0 ? (
                                <div className="grid grid-cols-1 gap-6">
                                    {filteredBookings.map((booking) => (
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
                                                            className={`${booking.checkedIn ? "text-green-400" : "text-gray-400"}`}
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
                        </div>
                    )}

                    {/* -----------------------------------View Tab----------------------------------- */}
                    {sidebarTab === "view" && (
                        <div>
                            <h2 className="text-xl font-semibold text-blue-300 mb-4">Location View</h2>
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

export default ALocation;