import React, { useState } from "react";
import axios from "axios";
import FormInput from "./FormInput";
import { FaBan, FaCheckCircle, FaEdit, FaTrash } from "react-icons/fa";

const HotelManagement = ({
  hotels,
  inactiveHotels,
  states,
  cities,
  fetchHotels,
  fetchCities,
  selectedState,
  selectedCity,
  loading,
  setLoading,
  setError,
  baseURL,
}) => {
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
  const [editHotelId, setEditHotelId] = useState(null);
  const [hotelTab, setHotelTab] = useState("active");

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
      console.log("Hotel saved successfully");
      alert("Hotel saved successfully");
    } catch (err) {
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
      setHotelTab("active");
      console.log("Hotel deleted successfully");
      alert("Hotel deleted successfully");
    } catch (err) {
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
      console.log("Hotel deactivated successfully");
      alert("Hotel deactivated successfully");
    } catch (err) {
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
      console.log("Hotel activated successfully");
      alert("Hotel activated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to activate hotel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-black px-10 py-8">
      <h2 className="text-3xl font-bold mb-8">🏨 Manage Hotels </h2>
      <form onSubmit={handleHotelSubmit} className="space-y-6 mb-10">
        <div>
          <label
            htmlFor="hotel-state"
            className="block text-lg font-semibold mb-2"
          >
            State
          </label>
          <select
            id="hotel-state"
            value={hotelForm.stateId}
            onChange={(e) => {
              const stateId = e.target.value;
              setHotelForm({ ...hotelForm, stateId, cityId: "" });
              fetchCities(stateId);
            }}
            className="w-full bg-white border border-black rounded-lg px-4 py-3 text-lg"
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
          <label
            htmlFor="hotel-city"
            className="block text-lg font-semibold mb-2"
          >
            City
          </label>
          <select
            id="hotel-city"
            value={hotelForm.cityId}
            onChange={(e) => {
              const cityId = e.target.value;
              setHotelForm({ ...hotelForm, cityId });
              if (cityId) {
                fetchHotels(cityId);
              } else {
                setHotels([]);
                setInactiveHotels([]);
              }
            }}
            disabled={!hotelForm.stateId}
            className="w-full bg-white border border-black rounded-lg px-4 py-3 text-lg"
          >
            <option value="">-- Select City --</option>
            {cities.map((city) => (
              <option key={city._id} value={city._id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        <FormInput
          label="Hotel Name"
          id="hotel-name"
          value={hotelForm.name}
          onChange={(e) => setHotelForm({ ...hotelForm, name: e.target.value })}
          required
          className="text-black text-lg"
        />
        <FormInput
          label="Address"
          id="hotel-address"
          value={hotelForm.address}
          onChange={(e) =>
            setHotelForm({ ...hotelForm, address: e.target.value })
          }
          className="text-black text-lg"
        />
        <FormInput
          label="Rating (1-5)"
          id="hotel-rating"
          type="number"
          min="1"
          max="5"
          step="0.1"
          value={hotelForm.rating}
          onChange={(e) =>
            setHotelForm({ ...hotelForm, rating: e.target.value })
          }
          className="text-black text-lg"
        />
        <FormInput
          label="Amenities (comma-separated)"
          id="hotel-amenities"
          value={hotelForm.amenities}
          onChange={(e) =>
            setHotelForm({ ...hotelForm, amenities: e.target.value })
          }
          className="text-black text-lg"
        />

        <div className="flex gap-6">
          <FormInput
            label="Price Min"
            id="hotel-price-min"
            type="number"
            min="0"
            value={hotelForm.priceMin}
            onChange={(e) =>
              setHotelForm({ ...hotelForm, priceMin: e.target.value })
            }
            className="flex-1 text-black text-lg"
          />
          <FormInput
            label="Price Max"
            id="hotel-price-max"
            type="number"
            min="0"
            value={hotelForm.priceMax}
            onChange={(e) =>
              setHotelForm({ ...hotelForm, priceMax: e.target.value })
            }
            className="flex-1 text-black text-lg"
          />
        </div>

        <FormInput
          label="Contact Phone"
          id="hotel-contact-phone"
          value={hotelForm.contactPhone}
          onChange={(e) =>
            setHotelForm({ ...hotelForm, contactPhone: e.target.value })
          }
          className="text-black text-lg"
        />
        <FormInput
          label="Contact Email"
          id="hotel-contact-email"
          type="email"
          value={hotelForm.contactEmail}
          onChange={(e) =>
            setHotelForm({ ...hotelForm, contactEmail: e.target.value })
          }
          className="text-black text-lg"
        />
        <FormInput
          label="Total Rooms"
          id="hotel-total-rooms"
          type="number"
          min="0"
          value={hotelForm.totalRooms}
          onChange={(e) =>
            setHotelForm({ ...hotelForm, totalRooms: e.target.value })
          }
          required
          className="text-black text-lg"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white text-lg font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
          disabled={loading || !hotelForm.cityId}
        >
          {loading ? "Saving..." : editHotelId ? "Update" : "Add"}
        </button>
      </form>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setHotelTab("active")}
          className={`flex-1 text-lg font-medium py-3 rounded-lg ${
            hotelTab === "active"
              ? "bg-green-600 text-white"
              : "bg-green-700 text-gray-300"
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setHotelTab("inactive")}
          className={`flex-1 text-lg font-medium py-3 rounded-lg ${
            hotelTab === "inactive"
              ? "bg-red-600 text-white"
              : "bg-red-700 text-gray-300"
          }`}
        >
          Inactive
        </button>
      </div>

      <ul className="space-y-4">
        {(hotelTab === "active" ? hotels : inactiveHotels).map((hotel) => (
          <li
            key={hotel._id}
            className="flex justify-between items-center p-4 bg-white text-black border border-black rounded-lg shadow-sm"
          >
            <span className="text-lg font-medium">{hotel.name}</span>
            <div className="flex gap-4">
              {hotelTab === "active" ? (
                <>
                  <button
                    onClick={() => handleHotelEdit(hotel)}
                    className="text-yellow-600 hover:text-yellow-700"
                  >
                    <FaEdit size={28} />
                  </button>
                  <button
                    onClick={() => handleHotelDelete(hotel._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <FaTrash size={28} />
                  </button>
                  <button
                    onClick={() => handleHotelSoftDelete(hotel._id)}
                    className="text-gray-600 hover:text-gray-700"
                  >
                    <FaBan size={28} />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleHotelActivate(hotel._id)}
                  className="text-green-600 hover:text-green-700"
                >
                  <FaCheckCircle size={28} />
                </button>
              )}
            </div>
          </li>
        ))}
        {(hotelTab === "active" ? hotels : inactiveHotels).length === 0 && (
          <li className="text-center text-gray-600 text-lg py-6">
            No {hotelTab} hotels found.
          </li>
        )}
      </ul>
    </div>
  );
};

export default HotelManagement;
