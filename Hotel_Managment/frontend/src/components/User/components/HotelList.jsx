
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import useDarkMode from "../hooks/useDarkMode";

import {
  FaMapMarkerAlt,
  FaHotel,
  FaStar,
  FaBed,
  FaRegStar,
  FaCalendarAlt,
  FaTimes,
  FaWifi,
  FaTv,
  FaSwimmingPool,
  FaParking,
  FaUtensils,
  FaSnowflake,
  FaConciergeBell,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

const HotelList = ({
  hotels,
  filterRating,
  searchTerm,
  sortOrder,
  onBookNow,
  selectedState,
  selectedCity,
  loading,
  error,
  setError,
}) => {
  const [isDarkMode] = useDarkMode();
  const [rooms, setRooms] = useState([]);
  const [expandedHotel, setExpandedHotel] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [roomLoading, setRoomLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState({});
  const baseURL = "https://hotel-management-backend-zitt.onrender.com";
  const scrollPositionRef = useRef(0);

  // Filter and sort hotels
  const filteredHotels = (Array.isArray(hotels) ? hotels : [])
    .filter((hotel) => {
      const hotelRating = hotel.rating ?? 0;
      const meetsRatingFilter =
        filterRating === 0 || hotelRating >= filterRating;
      const hotelName = hotel.name || "";
      const meetsSearchFilter = hotelName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return meetsRatingFilter && meetsSearchFilter;
    })
    .sort((a, b) => {
      const ratingA = a.rating ?? 0;
      const ratingB = b.rating ?? 0;
      return sortOrder === "asc" ? ratingA - ratingB : ratingB - ratingA;
    });

  const fetchRooms = async (hotelId) => {
    if (!hotelId) {
      setRooms([]);
      return;
    }
    setRoomLoading(true);
    try {
      const response = await axios.get(`${baseURL}/api/${hotelId}/rooms`);
      // const response = await axios.get(`${baseURL}/hotels/${hotelId}/rooms`);
      console.log(response.data);
      const activeRooms = Array.isArray(response.data)
        ? response.data.filter((r) => r.isActive)
        : [];
      setRooms(activeRooms);
      const initialImageIndex = activeRooms.reduce((acc, room) => {
        acc[room._id] = 0;
        return acc;
      }, {});
      setCurrentImageIndex((prev) => ({ ...prev, ...initialImageIndex }));
    } catch (err) {
      console.error("Error fetching rooms:", err);
      setError(err.response?.data?.message || "Failed to fetch rooms.");
      setRooms([]);
    } finally {
      setRoomLoading(false);
    }
  };

  const toggleHotelDetails = (hotel) => {
    if (expandedHotel && expandedHotel._id === hotel._id) {
      setExpandedHotel(null);
      setRooms([]);
    } else {
      scrollPositionRef.current = window.scrollY;
      setExpandedHotel(hotel);
      fetchRooms(hotel._id);
    }
  };

  const closeExpandedView = () => {
    setExpandedHotel(null);
    setRooms([]);
  };

  const handlePrevImage = (roomId, roomImages) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [roomId]: (prev[roomId] - 1 + roomImages.length) % roomImages.length,
    }));
  };

  const handleNextImage = (roomId, roomImages) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [roomId]: (prev[roomId] + 1) % roomImages.length,
    }));
  };

  const renderStars = (rating) => {
    const stars = [];
    const safeRating = rating ?? 0;
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i}>
          {i <= safeRating ? (
            <FaStar className="text-yellow-400" />
          ) : (
            <FaRegStar className="text-gray-400" />
          )}
        </span>
      );
    }
    return <span className="flex">{stars}</span>;
  };

  // Amenity icons mapping
  const amenityIcons = {
    wifi: <FaWifi className="text-blue-500" />,
    tv: <FaTv className="text-blue-500" />,
    pool: <FaSwimmingPool className="text-blue-500" />,
    parking: <FaParking className="text-blue-500" />,
    restaurant: <FaUtensils className="text-blue-500" />,
    ac: <FaSnowflake className="text-blue-500" />,
    service: <FaConciergeBell className="text-blue-500" />,
  };

  return (
    <section
      className={`${
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      }bg-gray-50 min-h-screen p-4 md:p-1`}
    >
      <h1 className={`${
        isDarkMode ? " text-white" : " text-black"
      } text-4xl font-bold text-center  tracking-tight font-sans pb-10`}>
        Featured Hotels
      </h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p className="font-medium">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {expandedHotel ? (
            <div
              className={`fixed inset-0 bg-white px- z-50 overflow-hidden ${
                isDarkMode ? "bg-black text-white" : "bg-white text-black"
              }`}
            >
              <div className="h-full flex flex-col bg">
                {/* Header with shadow */}
                <div
                  className={`flex-shrink-0 flex justify-between items-center p-4 md:p-6 border-b  shadow-sm bg ${
                    isDarkMode ? "bg-black text-white" : "bg-white text-black"
                  }`}
                >
                  <h2
                    className={`text-2xl md:text-3xl font-bold  ${
                      isDarkMode ? "bg-black text-white" : "bg-white text-black"
                    }`}
                  >
                    {expandedHotel.name}
                  </h2>
                  <button
                    onClick={closeExpandedView}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Close expanded view"
                  >
                    <FaTimes size={24} />
                  </button>
                </div>

                {/* Content Area */}

                <div
                  className={`flex flex-1 min-h-0  ${
                    isDarkMode ? "bg-black text-white" : "bg-white text-black"
                  }`}
                >
                  {/* Left Side - Hotel Details */}
                  <div className="w-full md:w-1/2 p-4 md:p-6 overflow-y-auto ">
                    <div className="bg-gray-100 rounded-xl overflow-hidden mb-6 h-64 md:h-96 shadow-inner relative ">
                      {previewImages[expandedHotel._id] ? (
                        <img
                          src={previewImages[expandedHotel._id]}
                          alt={expandedHotel.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <img
                            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                            className="w-full h-full object-cover opacity-90"
                            alt="Luxury hotel"
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 ">
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <h3 className="text-xl font-semibold mb-3 text-gray-800">
                          Details
                        </h3>
                        <div className="space-y-3">
                          <p className="flex items-start text-gray-700">
                            <FaMapMarkerAlt className="mt-1 mr-2 text-red-500 flex-shrink-0" />
                            <span>
                              {expandedHotel.address || "Address not available"}
                            </span>
                          </p>
                          <p className="flex items-center text-gray-700">
                            <span className="font-medium mr-2">Rating:</span>
                            {renderStars(expandedHotel.rating)}
                            <span className="ml-2 text-gray-600">
                              ({expandedHotel.rating || 0}/5)
                            </span>
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Price Range:</span> ₹
                            {expandedHotel.priceRange?.min || "N/A"} - ₹
                            {expandedHotel.priceRange?.max || "N/A"}
                          </p>
                        </div>
                      </div>

                      {expandedHotel.amenities?.length > 0 && (
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                          <h3 className="text-xl font-semibold mb-3 text-gray-800">
                            Amenities
                          </h3>
                          <div className="flex flex-wrap gap-3">
                            {expandedHotel.amenities.map((amenity, index) => (
                              <div
                                key={index}
                                className="flex items-center bg-gray-50 px-3 py-2 rounded-lg"
                              >
                                {amenityIcons[amenity.toLowerCase()] || (
                                  <FaConciergeBell className="text-blue-500" />
                                )}
                                <span className="ml-2 text-gray-700 capitalize">
                                  {amenity}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side - Rooms */}
                  <div
                    className={`w-full md:w-1/2 border-l border-gray-200 p-4 md:p-6 overflow-y-auto ${
                      isDarkMode ? "bg-black text-white" : "bg-white text-black"
                    }`}
                  >
                    <h3
                      className={`${
                        isDarkMode
                          ? "bg-black text-white"
                          : "bg-white text-black"
                      }text-xl font-semibold mb-4 `}
                    >
                      Available Rooms
                    </h3>

                    {roomLoading ? (
                      <div className="flex justify-center items-center h-64 bg">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    ) : rooms.length > 0 ? (
                      <div className="space-y-4">
                        {rooms.map((room) => (
                          <div
                            key={room._id}
                            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="text-lg font-medium text-gray-800">
                                  {room.type} Room
                                </h4>
                                <p className="text-gray-600 text-sm">
                                  Room {room.roomNumber}
                                </p>
                              </div>
                              <span
                                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                  room.isAvailable
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {room.isAvailable ? "Available" : "Booked"}
                              </span>
                            </div>

                            {room.images?.length > 0 && (
                              <div className="relative mb-4 h-48 bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                  src={
                                    room.images[
                                      currentImageIndex[room._id] || 0
                                    ]
                                  }
                                  alt={`Room ${room.roomNumber}`}
                                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                                {room.images.length > 1 && (
                                  <>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handlePrevImage(room._id, room.images);
                                      }}
                                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
                                    >
                                      <FaArrowLeft className="text-gray-800" />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleNextImage(room._id, room.images);
                                      }}
                                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
                                    >
                                      <FaArrowRight className="text-gray-800" />
                                    </button>
                                  </>
                                )}
                              </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-gray-500">
                                  Capacity
                                </p>
                                <p className="font-medium">
                                  {room.capacity} guests
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Price</p>
                                <p className="font-medium">
                                  ₹{room.price}/night
                                </p>
                              </div>
                            </div>

                            {room.description && (
                              <p className="text-gray-600 text-sm mb-4">
                                {room.description}
                              </p>
                            )}

                            {room.isAvailable && (
                              <button
                                onClick={() => onBookNow(room)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors font-medium flex items-center justify-center"
                              >
                                <FaCalendarAlt className="mr-2" />
                                Book Now
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                        <FaBed className="mx-auto text-4xl mb-4 text-gray-400" />
                        <h4 className="text-lg font-medium text-gray-700 mb-2">
                          No rooms available
                        </h4>
                        <p className="text-gray-500">
                          Please check back later or try another hotel
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="container mx-auto">
              {/* <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                {selectedCity || selectedState 
                  ? `Hotels in ${selectedCity || selectedState}`
                  : "Featured Hotels"}
              </h2> */}

              {filteredHotels.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredHotels.map((hotel) => (
                    <div
                      key={hotel._id}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                      onClick={() => toggleHotelDetails(hotel)}
                    >
                      <div className="h-48 overflow-hidden relative">
                        {previewImages[hotel._id] ? (
                          <img
                            src={previewImages[hotel._id]}
                            alt={hotel.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <img
                              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                              className="w-full h-full object-cover opacity-90"
                              alt={hotel.name}
                            />
                          </div>
                        )}
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                          {renderStars(hotel.rating)}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
                          {hotel.name}
                        </h3>
                        <div className="flex items-center text-gray-600 text-sm mb-2">
                          <FaMapMarkerAlt className="mr-1 text-red-400" />
                          <span className="truncate">{hotel.address}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-blue-600 font-bold">
                            ₹{hotel.priceRange?.min || "N/A"}+
                          </span>
                          <button
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleHotelDetails(hotel);
                            }}
                          >
                            View Rooms
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-8 text-center shadow-sm max-w-2xl mx-auto">
                  <FaHotel className="mx-auto text-5xl mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No hotels found
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm
                      ? "Try adjusting your search filters"
                      : "Please check back later for new listings"}
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default HotelList;
