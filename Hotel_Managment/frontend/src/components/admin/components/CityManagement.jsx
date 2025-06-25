// import React, { useState } from "react";
// import axios from "axios";
// import FormInput from "./FormInput";
// import { FaBan, FaCheckCircle, FaEdit, FaTrash } from "react-icons/fa";

// const CityManagement = ({ cities, inactiveCities, states, fetchCities, selectedState, loading, setLoading, setError, baseURL }) => {
//     const [cityForm, setCityForm] = useState({ name: "", stateId: "" });
//     const [editCityId, setEditCityId] = useState(null);
//     const [cityTab, setCityTab] = useState("active");

//     const handleCitySubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError("");
//         const payload = {
//             name: cityForm.name?.trim(),
//             state: cityForm.stateId,
//         };
//         if (!payload.name || !payload.state) {
//             setError("Name and state are required.");
//             setLoading(false);
//             return;
//         }
//         try {
//             if (editCityId) {
//                 await axios.put(`${baseURL}/api/cities/${editCityId}`, payload);
//             } else {
//                 await axios.post(`${baseURL}/api/cities/add`, payload);
//             }
//             const stateId = cityForm.stateId;
//             setCityForm({ name: "", stateId: "" });
//             setEditCityId(null);
//             setCityTab("active");
//             await fetchCities(stateId);
//             console.log("City saved successfully");
//             alert("City saved successfully");
//         } catch (err) {
//             setError(err.response?.data?.message || "Failed to save city.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleCityEdit = (city) => {
//         setCityForm({
//             name: city.name || "",
//             stateId: city.state?._id || "",
//         });
//         setEditCityId(city._id);
//         setCityTab("active");
//     };

//     const handleCityDelete = async (id) => {
//         setLoading(true);
//         setError("");
//         try {
//             await axios.delete(`${baseURL}/api/cities/${id}`);
//             await fetchCities(selectedState);

//             console.log("City deleted successfully");
//             alert("City deleted successfully");
//         } catch (err) {
//             setError(err.response?.data?.message || "Failed to delete city.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleCitySoftDelete = async (id) => {
//         setLoading(true);
//         setError("");
//         try {
//             const city = cities.find((c) => c._id === id) || inactiveCities.find((c) => c._id === id);
//             const stateId = city?.state?._id || selectedState || "";
//             await axios.patch(`${baseURL}/api/cities/${id}/softdelete`);
//             if (stateId) {
//                 await fetchCities(stateId);
//             } else {
//                 setCities([]);
//                 setInactiveCities([]);
//                 setError("No state selected. Please select a state to view cities.");
//             }
//             setCityTab("inactive");
//             console.log("City deactivated successfully");
//             alert("City deactivated successfully");
//         } catch (err) {
//             setError(err.response?.data?.message || "Failed to soft-delete city.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleCityActivate = async (id) => {
//         setLoading(true);
//         setError("");
//         try {
//             await axios.patch(`${baseURL}/api/cities/${id}/activate`);
//             await fetchCities(selectedState);
//             setCityTab("active");
//             console.log("City activated successfully");
//             alert("City activated successfully");
//         } catch (err) {
//             setError(err.response?.data?.message || "Failed to activate city.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div>
//             <h2 className="text-xl font-semibold text-blue-300 mb-4">Manage Cities</h2>
//             <form onSubmit={handleCitySubmit} className="space-y-4 mb-6">
//                 <FormInput
//                     label="City Name"
//                     id="city-name"
//                     value={cityForm.name}
//                     onChange={(e) => setCityForm({ ...cityForm, name: e.target.value })}
//                     required
//                 />
//                 <div>
//                     <label htmlFor="city-state" className="block text-sm font-medium text-gray-300">
//                         State
//                     </label>
//                     <select
//                         id="city-state"
//                         value={cityForm.stateId}
//                         onChange={(e) => {
//                             const stateId = e.target.value;
//                             setCityForm({ ...cityForm, stateId });
//                             fetchCities(stateId);
//                         }}
//                         required
//                         className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                         <option value="">-- Select State --</option>
//                         {states.map((state) => (
//                             <option key={state._id} value={state._id}>
//                                 {state.name}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//                 <button
//                     type="submit"
//                     className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
//                     disabled={loading}
//                 >
//                     {loading ? "Saving..." : editCityId ? "Update" : "Add"}
//                 </button>
//             </form>
//             <div className="flex gap-2 mb-4">
//                 <button
//                     onClick={() => setCityTab("active")}
//                     className={`flex-1 py-2 rounded-md ${cityTab === "active" ? "bg-blue-600 text-white" : "bg-slate-700 text-gray-300"}`}
//                 >
//                     Active
//                 </button>
//                 <button
//                     onClick={() => setCityTab("inactive")}
//                     className={`flex-1 py-2 rounded-md ${cityTab === "inactive" ? "bg-red-600 text-white" : "bg-slate-700 text-gray-300"}`}
//                 >
//                     Inactive
//                 </button>
//             </div>
//             <ul className="space-y-2">
//                 {(cityTab === "active" ? cities : inactiveCities).map((city) => (
//                     <li
//                         key={city._id}
//                         className="flex justify-between items-center p-3 bg-slate-800 rounded-md border border-slate-700"
//                     >
//                         <span className="text-gray-200">{city.name}</span>
//                         <div className="flex gap-2">
//                             {cityTab === "active" ? (
//                                 <>
//                                     <button onClick={() => handleCityEdit(city)} className="text-yellow-400 hover:text-yellow-500">
//                                          <FaEdit size={28} />
//                                     </button>
//                                     <button onClick={() => handleCityDelete(city._id)} className="text-red-400 hover:text-red-500">
//                                         <FaTrash size={28} />
//                                     </button>
//                                     <button onClick={() => handleCitySoftDelete(city._id)} className="text-gray-400 hover:text-gray-500">
//                                       <FaBan size={28} />
//                                     </button>
//                                 </>
//                             ) : (
//                                 <button onClick={() => handleCityActivate(city._id)} className="text-green-400 hover:text-green-500">
//                                     <FaCheckCircle size={28} />
//                                 </button>
//                             )}
//                         </div>
//                     </li>
//                 ))}
//                 {(cityTab === "active" ? cities : inactiveCities).length === 0 && (
//                     <li className="text-center text-gray-400 py-4">No {cityTab} cities found.</li>
//                 )}
//             </ul>
//         </div>
//     );
// };

// export default CityManagement;

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

  // return (
  //   <div className="p-4 bg-white h-screen rounded-lg">
  //     <h2 className="text-xl font-semibold text-black mb-4">
  //       Manage Cities
  //     </h2>
  //     {loading && (
  //       <div className="flex justify-center mb-4">
  //         <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
  //       </div>
  //     )}
  //     <form onSubmit={handleCitySubmit} className="space-y-4 mb-6">
  //       <FormInput
  //         label="City Name"
  //         id="city-name"
  //         value={cityForm.name}
  //         onChange={(e) => setCityForm({ ...cityForm, name: e.target.value })}
  //         required
  //         disabled={loading}
  //         aria-label="Enter city name"
  //       />
  //       <div>
  //         <label
  //           htmlFor="city-state"
  //           className="block text-sm font-medium text-black mb-1"
  //         >
  //           State
  //         </label>
  //         <select
  //           id="city-state"
  //           value={cityForm.stateId}
  //           onChange={(e) => {
  //             const stateId = e.target.value;
  //             setCityForm({ ...cityForm, stateId });
  //             if (stateId) fetchCities(stateId, stateId);
  //           }}
  //           required
  //           disabled={loading || states.length === 0}
  //           className="w-full bg-white border border-slate-600 rounded-md px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-600 disabled:text-gray-400"
  //           aria-label="Select state for city"
  //         >
  //           <option value="">-- Select State --</option>
  //           {Array.isArray(states) ? (
  //             states.map((state) => (
  //               <option key={state._id} value={state._id}>
  //                 {state.name}
  //               </option>
  //             ))
  //           ) : (
  //             <option disabled>No states available</option>
  //           )}
  //         </select>
  //       </div>
  //       <button
  //         type="submit"
  //         className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-all duration-200"
  //         disabled={loading}
  //         aria-label={editCityId ? "Update city" : "Add city"}
  //       >
  //         {loading ? "Processing..." : editCityId ? "Update City" : "Add City"}
  //       </button>
  //     </form>
  //     <div className="flex gap-2 mb-4">
  //       <button
  //         onClick={() => setCityTab("active")}
  //         className={`flex-1 py-2 rounded-md transition-all duration-200 ${
  //           cityTab === "active"
  //             ? "bg-green-600 text-white"
  //             : "bg-green-700 text-gray-300 hover:bg-green-600"
  //         }`}
  //         aria-label="View active cities"
  //       >
  //         Active Cities
  //       </button>
  //       <button
  //         onClick={() => setCityTab("inactive")}
  //         className={`flex-1 py-2 rounded-md transition-all duration-200 ${
  //           cityTab === "inactive"
  //             ? "bg-red-600 text-white"
  //             : "bg-red-700 text-gray-300 hover:bg-red-600"
  //         }`}
  //         aria-label="View inactive cities"
  //       >
  //         Inactive Cities
  //       </button>
  //     </div>
  //     <ul className="space-y-2">
  //       {Array.isArray(cityTab === "active" ? cities : inactiveCities) ? (
  //         (cityTab === "active" ? cities : inactiveCities).map((city) => (
  //           <li
  //             key={city._id}
  //             className="flex justify-between items-center p-3 bg-slate-800 rounded-md border border-slate-700"
  //           >
  //             <span className="text-gray-200 flex items-center">
  //               {/* {city.name} (
  //               {Array.isArray(city.state) && city.state.length > 0 ? (
  //                 city.code[0]
  //               ) : (
  //                 <span className="text-red-400 flex items-center">
  //                   State Missing
  //                   <span className="ml-1 group relative">
  //                     <FaInfoCircle size={14} />
  //                     <span className="absolute hidden group-hover:block bg-gray-700 text-white text-xs rounded p-2 -top-10 left-1/2 transform -translate-x-1/2 w-48">
  //                       The state for this city is not found in the database. Please update the city with a valid state.
  //                     </span>
  //                   </span>
  //                 </span>
  //               )}
  //               ) */}
  //               {city.name} (
  //               {city.state && city.state.code ? (
  //                 city.state.code
  //               ) : (
  //                 <span className="text-red-400 flex items-center">
  //                   State Code Missing
  //                   <span className="ml-1 group relative">
  //                     <FaInfoCircle size={14} />
  //                     <span className="absolute hidden group-hover:block bg-gray-700 text-white text-xs rounded p-2 -top-10 left-1/2 transform -translate-x-1/2 w-48">
  //                       The state for this city is not found in the database.
  //                       Please update the city with a valid state.
  //                     </span>
  //                   </span>
  //                 </span>
  //               )}
  //               )
  //             </span>
  //             <div className="flex gap-2">
  //               {cityTab === "active" ? (
  //                 <>
  //                   <button
  //                     onClick={() => handleCityEdit(city)}
  //                     className="text-yellow-400 hover:text-yellow-500 p-1"
  //                     aria-label={`Edit city ${city.name}`}
  //                     disabled={loading}
  //                   >
  //                     <FaEdit size={20} />
  //                   </button>
  //                   <button
  //                     onClick={() => handleCityDelete(city._id)}
  //                     className="text-red-400 hover:text-red-500 p-1"
  //                     aria-label={`Delete city ${city.name}`}
  //                     disabled={loading}
  //                   >
  //                     <FaTrash size={20} />
  //                   </button>
  //                   <button
  //                     onClick={() => handleCitySoftDelete(city._id)}
  //                     className="text-gray-400 hover:text-gray-500 p-1"
  //                     aria-label={`Deactivate city ${city.name}`}
  //                     disabled={loading}
  //                   >
  //                     <FaBan size={20} />
  //                   </button>
  //                 </>
  //               ) : (
  //                 <button
  //                   onClick={() => handleCityActivate(city._id)}
  //                   className="text-green-400 hover:text-green-500 p-1"
  //                   aria-label={`Activate city ${city.name}`}
  //                   disabled={loading}
  //                 >
  //                   <FaCheckCircle size={20} />
  //                 </button>
  //               )}
  //             </div>
  //           </li>
  //         ))
  //       ) : (
  //         <li className="text-center text-gray-400 py-4">
  //           Error: City data is not available.
  //         </li>
  //       )}
  //       {(cityTab === "active" ? cities : inactiveCities).length === 0 && (
  //         <li className="text-center text-gray-400 py-4">
  //           No {cityTab} cities found.{" "}
  //           {cityTab === "active"
  //             ? "Add a city to get started."
  //             : "No inactive cities available."}
  //         </li>
  //       )}
  //     </ul>
  //   </div>
  // );

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
