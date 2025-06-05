
import React, { useState } from "react";
import axios from "axios";
import FormInput from "./FormInput";
import {
  FaBan,
  FaCheckCircle,
  FaEdit,
  FaTrash,
  FaInfoCircle,
} from "react-icons/fa";

const CityManagement = ({
  cities = [],
  inactiveCities = [],
  states = [],
  fetchCities,
  selectedState,
  loading,
  setLoading,
  setError,
  baseURL,
}) => {
  const [cityForm, setCityForm] = useState({
    name: "",
    stateId: selectedState || "",
  });
  const [editCityId, setEditCityId] = useState(null);
  const [cityTab, setCityTab] = useState("active");

  const handleCitySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const payload = {
      name: cityForm.name?.trim(),
      state: cityForm.stateId,
    };
    if (!payload.name || !payload.state) {
      setError("City name and state are required.");
      setLoading(false);
      return;
    }
    try {
      if (editCityId) {
        await axios.put(`${baseURL}/api/cities/${editCityId}`, payload);
      } else {
        await axios.post(`${baseURL}/api/cities/add`, payload);
      }
      setCityForm({ name: "", stateId: selectedState || "" });
      setEditCityId(null);
      setCityTab("active");
      await fetchCities(cityForm.stateId, selectedState);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to save city.";
      setError(errorMessage);
      console.error("handleCitySubmit - Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCityEdit = (city) => {
    setCityForm({
      name: city.name || "",
      stateId:
        Array.isArray(city.state) && city.state.length > 0
          ? city.state[0]._id
          : "",
    });
    setEditCityId(city._id);
    setCityTab("active");
  };

  const handleCityDelete = async (id) => {
    setLoading(true);
    setError("");
    try {
      await axios.delete(`${baseURL}/api/cities/${id}`);
      await fetchCities(selectedState, selectedState);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to delete city.";
      setError(errorMessage);
      console.error("handleCityDelete - Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCitySoftDelete = async (id) => {
    setLoading(true);
    setError("");
    try {
      const city =
        cities.find((c) => c._id === id) ||
        inactiveCities.find((c) => c._id === id);
      const stateId =
        (Array.isArray(city.state) && city.state.length > 0
          ? city.state[0]._id
          : null) || selectedState;
      if (!stateId) {
        throw new Error("No state selected or available for this city.");
      }
      await axios.patch(`${baseURL}/api/cities/${id}/softdelete`);
      await fetchCities(stateId, selectedState);
      setCityTab("inactive");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to deactivate city.";
      setError(errorMessage);
      console.error("handleCitySoftDelete - Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCityActivate = async (id) => {
    setLoading(true);
    setError("");
    try {
      const city = inactiveCities.find((c) => c._id === id);
      const stateId =
        (Array.isArray(city.state) && city.state.length > 0
          ? city.state[0]._id
          : null) || selectedState;
      if (!stateId) {
        throw new Error("No state selected or available for this city.");
      }
      await axios.patch(`${baseURL}/api/cities/${id}/activate`);
      await fetchCities(stateId, selectedState);
      setCityTab("active");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to activate city.";
      setError(errorMessage);
      console.error("handleCityActivate - Error:", err);
    } finally {
      setLoading(false);
    }
  };

 
  return (
  <div className="p-6 bg-gradient-to-br from-white to-slate-100 rounded-2xl shadow-lg min-h-screen">
    <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
      🌆 Manage Cities
    </h2>

    {loading && (
      <div className="flex justify-center mb-6">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    )}

    <form onSubmit={handleCitySubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-md max-w-2xl mx-auto">
      <FormInput
        label="City Name"
        id="city-name"
        value={cityForm.name}
        onChange={(e) => setCityForm({ ...cityForm, name: e.target.value })}
        required
        disabled={loading}
        aria-label="Enter city name"
      />

      <div>
        <label htmlFor="city-state" className="block text-sm font-semibold text-gray-700 mb-2">
          Select State
        </label>
        <select
          id="city-state"
          value={cityForm.stateId}
          onChange={(e) => {
            const stateId = e.target.value;
            setCityForm({ ...cityForm, stateId });
            if (stateId) fetchCities(stateId, stateId);
          }}
          required
          disabled={loading || states.length === 0}
          className="w-full border border-gray-400 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200 disabled:text-gray-500"
        >
          <option value="">-- Select State --</option>
          {Array.isArray(states)
            ? states.map((state) => (
                <option key={state._id} value={state._id}>
                  {state.name}
                </option>
              ))
            : <option disabled>No states available</option>}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-blue-300"
      >
        {loading ? "Processing..." : editCityId ? "Update City" : "Add City"}
      </button>
    </form>

    <div className="flex justify-center gap-4 mt-8 mb-6">
      <button
        onClick={() => setCityTab("active")}
        className={`px-6 py-2 rounded-full font-semibold text-sm shadow-md ${
          cityTab === "active"
            ? "bg-green-600 text-white"
            : "bg-gray-300 text-gray-700 hover:bg-green-100"
        }`}
      >
        Active Cities
      </button>
      <button
        onClick={() => setCityTab("inactive")}
        className={`px-6 py-2 rounded-full font-semibold text-sm shadow-md ${
          cityTab === "inactive"
            ? "bg-red-600 text-white"
            : "bg-gray-300 text-gray-700 hover:bg-red-100"
        }`}
      >
        Inactive Cities
      </button>
    </div>

    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {(cityTab === "active" ? cities : inactiveCities).map((city) => (
        <li
          key={city._id}
          className="bg-white border border-slate-300 rounded-xl p-4 flex flex-col justify-between shadow-md"
        >
          <span className="text-gray-800 font-semibold mb-2">
            {city.name} (
            {city.state?.code ? (
              city.state.code
            ) : (
              <span className="text-red-500 flex items-center">
                State Code Missing
                <span className="ml-1 group relative cursor-pointer">
                  <FaInfoCircle size={14} />
                  <span className="absolute hidden group-hover:block bg-black text-white text-xs rounded p-2 top-[-2.5rem] left-1/2 transform -translate-x-1/2 w-56 z-10">
                    The state for this city is not found. Please update it with a valid state.
                  </span>
                </span>
              </span>
            )}
            )
          </span>

          <div className="flex justify-end gap-2">
            {cityTab === "active" ? (
              <>
                <button
                  onClick={() => handleCityEdit(city)}
                  className="text-yellow-500 hover:text-yellow-600"
                  disabled={loading}
                >
                  <FaEdit size={20} />
                </button>
                <button
                  onClick={() => handleCityDelete(city._id)}
                  className="text-red-500 hover:text-red-600"
                  disabled={loading}
                >
                  <FaTrash size={20} />
                </button>
                <button
                  onClick={() => handleCitySoftDelete(city._id)}
                  className="text-gray-500 hover:text-gray-600"
                  disabled={loading}
                >
                  <FaBan size={20} />
                </button>
              </>
            ) : (
              <button
                onClick={() => handleCityActivate(city._id)}
                className="text-green-500 hover:text-green-600"
                disabled={loading}
              >
                <FaCheckCircle size={20} />
              </button>
            )}
          </div>
        </li>
      ))}

      {(cityTab === "active" ? cities : inactiveCities).length === 0 && (
        <li className="text-center col-span-full text-gray-500 py-6">
          No {cityTab} cities found.
        </li>
      )}
    </ul>
  </div>
);


};

export default CityManagement;
