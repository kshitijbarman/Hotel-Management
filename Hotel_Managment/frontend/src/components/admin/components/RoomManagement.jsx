// import React, { useState } from "react";
// import axios from "axios";
// import FormInput from "./FormInput";
// import { FaBan, FaCheckCircle, FaEdit, FaTrash } from "react-icons/fa";

// const RoomManagement = ({
//     rooms,
//     inactiveRooms,
//     states,
//     cities,
//     hotels,
//     fetchRooms,
//     fetchHotels,
//     fetchCities,
//     selectedState,
//     selectedCity,
//     selectedHotel,
//     loading,
//     setLoading,
//     setError,
//     baseURL,
// }) => {
//     const [roomForm, setRoomForm] = useState({
//         stateId: "",
//         cityId: "",
//         hotelId: "",
//         roomNumber: "",
//         type: "",
//         price: "",
//         isAvailable: true,
//         images: [],
//         amenities: [],
//         description: "",
//         capacity: "",
//     });
//     const [editRoomId, setEditRoomId] = useState(null);
//     const [roomTab, setRoomTab] = useState("active");

//     const handleImageUpload = async (e) => {
//         const files = e.target.files;
//         if (!files || files.length === 0) return;

//         setLoading(true);
//         setError("");
//         try {
//             const formData = new FormData();
//             for (let i = 0; i < files.length; i++) {
//                 formData.append("images", files[i]);
//             }
//             const response = await axios.post(`${baseURL}/api/rooms/upload-images`, formData, {
//                 headers: { "Content-Type": "multipart/form-data" },
//                 timeout: 120000,
//             });
//             setRoomForm((prev) => ({
//                 ...prev,
//                 images: [...prev.images, ...response.data.imageUrls],
//             }));
//         } catch (err) {
//             setError(err.response?.data?.message || "Failed to upload images.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const removeImage = (index) => {
//         setRoomForm((prev) => ({
//             ...prev,
//             images: prev.images.filter((_, i) => i !== index),
//         }));
//     };

//     const handleAmenitiesChange = (e) => {
//         const { value, checked } = e.target;
//         setRoomForm((prev) => {
//             const amenities = checked
//                 ? [...prev.amenities, value]
//                 : prev.amenities.filter((amenity) => amenity !== value);
//             return { ...prev, amenities };
//         });
//     };

//     const handleRoomSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError("");
//         const payload = new FormData();
//         payload.append("roomNumber", roomForm.roomNumber?.trim() || "");
//         payload.append("hotel", roomForm.hotelId || "");
//         payload.append("type", roomForm.type?.trim() || "Standard");
//         payload.append("price", parseFloat(roomForm.price) || "");
//         payload.append("isAvailable", roomForm.isAvailable);
//         payload.append("images", JSON.stringify(roomForm.images));
//         payload.append("amenities", JSON.stringify(roomForm.amenities));
//         payload.append("description", roomForm.description?.trim() || "");
//         payload.append("capacity", parseInt(roomForm.capacity, 10) || "");

//         if (!roomForm.roomNumber || !roomForm.hotelId) {
//             setError("Room number and hotel are required.");
//             setLoading(false);
//             return;
//         }
//         try {
//             if (editRoomId) {
//                 await axios.put(`${baseURL}/api/rooms/${editRoomId}`, payload, {
//                     headers: { "Content-Type": "multipart/form-data" },
//                 });
//             } else {
//                 await axios.post(`${baseURL}/api/rooms/add`, payload, {
//                     headers: { "Content-Type": "multipart/form-data" },
//                 });
//             }
//             const hotelId = roomForm.hotelId;
//             setRoomForm({
//                 stateId: roomForm.stateId,
//                 cityId: roomForm.cityId,
//                 hotelId: hotelId,
//                 roomNumber: "",
//                 type: "",
//                 price: "",
//                 isAvailable: true,
//                 images: [],
//                 amenities: [],
//                 description: "",
//                 capacity: "",
//             });
//             setEditRoomId(null);
//             setRoomTab("active");
//             await fetchRooms(hotelId);
//         } catch (err) {
//             setError(err.response?.data?.message || "Failed to save room.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleRoomEdit = (room) => {
//         const hotelId = room.hotel?._id || "";
//         const cityId = room.hotel?.city?._id || "";
//         const stateId = room.hotel?.city?.state?._id || selectedState || "";
//         setRoomForm({
//             stateId,
//             cityId,
//             hotelId,
//             roomNumber: room.roomNumber || "",
//             type: room.type || "",
//             price: room.price?.toString() || "",
//             isAvailable: room.isAvailable ?? true,
//             images: room.images || [],
//             amenities: room.amenities || [],
//             description: room.description || "",
//             capacity: room.capacity?.toString() || "",
//         });
//         setEditRoomId(room._id);
//         setRoomTab("active");
//         if (stateId && !cities.length) {
//             fetchCities(stateId);
//         }
//         if (cityId) {
//             fetchHotels(cityId);
//         }
//         if (hotelId) {
//             fetchRooms(hotelId);
//         }
//     };

//     const handleRoomDelete = async (id) => {
//         setLoading(true);
//         setError("");
//         try {
//             await axios.delete(`${baseURL}/api/rooms/${id}`);
//             await fetchRooms(roomForm.hotelId || selectedHotel);
//         } catch (err) {
//             setError(err.response?.data?.message || "Failed to delete room.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleRoomSoftDelete = async (id) => {
//         setLoading(true);
//         setError("");
//         try {
//             await axios.patch(`${baseURL}/api/rooms/${id}/softdelete`);
//             await fetchRooms(roomForm.hotelId || selectedHotel);
//             setRoomTab("inactive");
//         } catch (err) {
//             setError(err.response?.data?.message || "Failed to soft-delete room.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleRoomActivate = async (id) => {
//         setLoading(true);
//         setError("");
//         try {
//             await axios.patch(`${baseURL}/api/rooms/${id}/activate`);
//             await fetchRooms(roomForm.hotelId || selectedHotel);
//             setRoomTab("active");
//         } catch (err) {
//             setError(err.response?.data?.message || "Failed to activate room.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div>
//             <h2 className="text-xl font-semibold text-blue-300 mb-4">Manage Rooms</h2>
//             <form onSubmit={handleRoomSubmit} className="space-y-4 mb-6">
//                 <div>
//                     <label htmlFor="room-state" className="block text-sm font-medium text-gray-300">
//                         State
//                     </label>
//                     <select
//                         id="room-state"
//                         value={roomForm.stateId}
//                         onChange={(e) => {
//                             const stateId = e.target.value;
//                             setRoomForm({ ...roomForm, stateId, cityId: "", hotelId: "" });
//                             fetchCities(stateId);
//                         }}
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
//                 <div>
//                     <label htmlFor="room-city" className="block text-sm font-medium text-gray-300">
//                         City
//                     </label>
//                     <select
//                         id="room-city"
//                         value={roomForm.cityId}
//                         onChange={(e) => {
//                             const cityId = e.target.value;
//                             setRoomForm({ ...roomForm, cityId, hotelId: "" });
//                             if (cityId) {
//                                 fetchHotels(cityId);
//                             } else {
//                                 setHotels([]);
//                                 setInactiveHotels([]);
//                                 setRooms([]);
//                                 setInactiveRooms([]);
//                             }
//                         }}
//                         disabled={!roomForm.stateId}
//                         className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-600"
//                     >
//                         <option value="">-- Select City --</option>
//                         {cities.map((city) => (
//                             <option key={city._id} value={city._id}>
//                                 {city.name}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//                 <div>
//                     <label htmlFor="room-hotel" className="block text-sm font-medium text-gray-300">
//                         Hotel
//                     </label>
//                     <select
//                         id="room-hotel"
//                         value={roomForm.hotelId}
//                         onChange={(e) => {
//                             const hotelId = e.target.value;
//                             setRoomForm({ ...roomForm, hotelId });
//                             if (hotelId) {
//                                 fetchRooms(hotelId);
//                             } else {
//                                 setRooms([]);
//                                 setInactiveRooms([]);
//                             }
//                         }}
//                         disabled={!roomForm.cityId}
//                         className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-600"
//                     >
//                         <option value="">-- Select Hotel --</option>
//                         {hotels.map((hotel) => (
//                             <option key={hotel._id} value={hotel._id}>
//                                 {hotel.name}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//                 <FormInput
//                     label="Room Number"
//                     id="room-number"
//                     value={roomForm.roomNumber}
//                     onChange={(e) => setRoomForm({ ...roomForm, roomNumber: e.target.value })}
//                     required
//                 />
//                 <FormInput
//                     label="Room Type"
//                     id="room-type"
//                     value={roomForm.type}
//                     onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value })}
//                 />
//                 <FormInput
//                     label="Price"
//                     id="room-price"
//                     type="number"
//                     min="0"
//                     value={roomForm.price}
//                     onChange={(e) => setRoomForm({ ...roomForm, price: e.target.value })}
//                 />
//                 <FormInput
//                     label="Capacity (Guests)"
//                     id="room-capacity"
//                     type="number"
//                     min="1"
//                     value={roomForm.capacity}
//                     onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })}
//                 />
//                 <div>
//                     <label className="block text-sm font-medium text-gray-300">Amenities</label>
//                     <div className="mt-2 space-y-2">
//                         {["WiFi", "TV", "Air Conditioning", "Mini Bar", "Room Service", "Balcony"].map((amenity) => (
//                             <div key={amenity} className="flex items-center">
//                                 <input
//                                     type="checkbox"
//                                     id={`room-amenity-${amenity}`}
//                                     value={amenity}
//                                     checked={roomForm.amenities.includes(amenity)}
//                                     onChange={handleAmenitiesChange}
//                                     className="h-4 w-4 text-blue-600 border-slate-600 rounded focus:ring-blue-500 bg-slate-700"
//                                 />
//                                 <label htmlFor={`room-amenity-${amenity}`} className="ml-2 text-sm text-gray-300">
//                                     {amenity}
//                                 </label>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//                 <div>
//                     <label htmlFor="room-description" className="block text-sm font-medium text-gray-300">
//                         Description
//                     </label>
//                     <textarea
//                         id="room-description"
//                         value={roomForm.description}
//                         onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })}
//                         className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         rows="4"
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="room-images" className="block text-sm font-medium text-gray-300">
//                         Room Images
//                     </label>
//                     <input
//                         id="room-images"
//                         type="file"
//                         multiple
//                         accept="image/jpeg,image/png,image/jpg"
//                         onChange={handleImageUpload}
//                         className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
//                     />
//                     {roomForm.images.length > 0 && (
//                         <div className="mt-4 grid grid-cols-3 gap-4">
//                             {roomForm.images.map((url, index) => (
//                                 <div key={index} className="relative">
//                                     <img
//                                         src={url}
//                                         alt={`Room image ${index + 1}`}
//                                         className="w-full h-32 object-cover rounded-md"
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={() => removeImage(index)}
//                                         className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
//                                     >
//                                         ×
//                                     </button>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//                 <div>
//                     <label htmlFor="room-available" className="flex items-center">
//                         <input
//                             id="room-available"
//                             type="checkbox"
//                             checked={roomForm.isAvailable}
//                             onChange={(e) => setRoomForm({ ...roomForm, isAvailable: e.target.checked })}
//                             className="h-4 w-4 text-blue-600 border-slate-600 rounded focus:ring-blue-500 bg-slate-700"
//                         />
//                         <span className="ml-2 text-sm font-medium text-gray-300">Available</span>
//                     </label>
//                 </div>
//                 <button
//                     type="submit"
//                     className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
//                     disabled={loading || !roomForm.hotelId}
//                 >
//                     {loading ? "Saving..." : editRoomId ? "Update" : "Add"}
//                 </button>
//             </form>
//             <div className="flex gap-2 mb-4">
//                 <button
//                     onClick={() => setRoomTab("active")}
//                     className={`flex-1 py-2 rounded-md ${roomTab === "active" ? "bg-blue-600 text-white" : "bg-slate-700 text-gray-300"}`}
//                 >
//                     Active
//                 </button>
//                 <button
//                     onClick={() => setRoomTab("inactive")}
//                     className={`flex-1 py-2 rounded-md ${roomTab === "inactive" ? "bg-red-600 text-white" : "bg-slate-700 text-gray-300"}`}
//                 >
//                     Inactive
//                 </button>
//             </div>
//             <ul className="space-y-2">
//                 {(roomTab === "active" ? rooms : inactiveRooms).map((room) => (
//                     <li
//                         key={room._id}
//                         className="flex justify-between items-center p-3 bg-slate-800 rounded-md border border-slate-700"
//                     >
//                         <span className="text-gray-200">
//                             Room {room.roomNumber} ({room.type})
//                         </span>
//                         <div className="flex gap-2">
//                             {roomTab === "active" ? (
//                                 <>
//                                     <button onClick={() => handleRoomEdit(room)} className="text-yellow-400 hover:text-yellow-500">
//                                         <FaEdit size={28} />
//                                     </button>
//                                     <button onClick={() => handleRoomDelete(room._id)} className="text-red-400 hover:text-red-500">
//                                         <FaTrash size={28} />
//                                     </button>
//                                     <button onClick={() => handleRoomSoftDelete(room._id)} className="text-gray-400 hover:text-gray-500">
//                                         <FaBan size={28} />
//                                     </button>
//                                 </>
//                             ) : (
//                                 <button onClick={() => handleRoomActivate(room._id)} className="text-green-400 hover:text-green-500">
//                                     <FaCheckCircle size={28} />
//                                 </button>
//                             )}
//                         </div>
//                     </li>
//                 ))}
//                 {(roomTab === "active" ? rooms : inactiveRooms).length === 0 && (
//                     <li className="text-center text-gray-400 py-4">No {roomTab} rooms found.</li>
//                 )}
//             </ul>
//         </div>
//     );
// };

// export default RoomManagement;


import React, { useState } from "react";
import axios from "axios";
import FormInput from "./FormInput";
import { FaBan, FaCheckCircle, FaEdit, FaTrash } from "react-icons/fa";

const RoomManagement = ({
  rooms,
  inactiveRooms,
  states,
  cities,
  hotels,
  fetchRooms,
  fetchHotels,
  fetchCities,
  selectedState,
  selectedCity,
  selectedHotel,
  loading,
  setLoading,
  setError,
  baseURL,
}) => {
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
  const [editRoomId, setEditRoomId] = useState(null);
  const [roomTab, setRoomTab] = useState("active");

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
      const response = await axios.post(`${baseURL}/api/rooms/upload-images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000,
      });
      setRoomForm((prev) => ({
        ...prev,
        images: [...prev.images, ...response.data.imageUrls],
      }));
    } catch (err) {
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
      setError(err.response?.data?.message || "Failed to save room.");
    } finally {
      setLoading(false);
    }
  };

  const handleRoomEdit = (room) => {
    const hotelData = room.hotel && room.hotel.length > 0 ? room.hotel[0] : {};
    const hotelId = hotelData._id || "";
    const cityId = hotelData.city?._id || "";
    const stateId = hotelData.city?.state?._id || selectedState || "";
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
      fetchHotels(cityId);
    }
    if (hotelId) {
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
      setError(err.response?.data?.message || "Failed to activate room.");
    } finally {
      setLoading(false);
    }
  };

//   return (
//     <div className="bg-white">
//       <h2 className="text-xl font-semibold text-black mb-4">Manage Rooms</h2>
//       <form onSubmit={handleRoomSubmit} className="space-y-4 mb-6">
//         <div>
//           <label htmlFor="room-state" className="block text-sm font-medium text-black">
//             State
//           </label>
//           <select
//             id="room-state"
//             value={roomForm.stateId}
//             onChange={(e) => {
//               const stateId = e.target.value;
//               setRoomForm({ ...roomForm, stateId, cityId: "", hotelId: "" });
//               fetchCities(stateId);
//             }}
//             className="w-full bg-white border border-slate-600 rounded-md px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">-- Select State --</option>
//             {states.map((state) => (
//               <option key={state._id} value={state._id}>
//                 {state.name}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label htmlFor="room-city" className="block text-sm font-medium text-black">
//             City
//           </label>
//           <select
//             id="room-city"
//             value={roomForm.cityId}
//             onChange={(e) => {
//               const cityId = e.target.value;
//               setRoomForm({ ...roomForm, cityId, hotelId: "" });
//               if (cityId) {
//                 fetchHotels(cityId);
//               } else {
//                 setHotels([]);
//                 setInactiveHotels([]);
//                 setRooms([]);
//                 setInactiveRooms([]);
//               }
//             }}
//             disabled={!roomForm.stateId}
//             className="w-full bg-white border border-slate-600 rounded-md px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 "
//           >
//             <option value="">-- Select City --</option>
//             {cities.map((city) => (
//               <option key={city._id} value={city._id}>
//                 {city.name}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label htmlFor="room-hotel" className="block text-sm font-medium text-black">
//             Hotel
//           </label>
//           <select
//             id="room-hotel"
//             value={roomForm.hotelId}
//             onChange={(e) => {
//               const hotelId = e.target.value;
//               setRoomForm({ ...roomForm, hotelId });
//               if (hotelId) {
//                 fetchRooms(hotelId);
//               } else {
//                 setRooms([]);
//                 setInactiveRooms([]);
//               }
//             }}
//             disabled={!roomForm.cityId}
//             className="w-full bg-white border border-slate-600 rounded-md px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">-- Select Hotel --</option>
//             {hotels.map((hotel) => (
//               <option key={hotel._id} value={hotel._id}>
//                 {hotel.name}
//               </option>
//             ))}
//           </select>
//         </div>
//         <FormInput
//           label="Room Number"
//           id="room-number"
//           value={roomForm.roomNumber}
//           onChange={(e) => setRoomForm({ ...roomForm, roomNumber: e.target.value })}
//           required
//         />
//         <FormInput
//           label="Room Type"
//           id="room-type"
//           value={roomForm.type}
//           onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value })}
//         />
//         <FormInput
//           label="Price"
//           id="room-price"
//           type="number"
//           min="0"
//           value={roomForm.price}
//           onChange={(e) => setRoomForm({ ...roomForm, price: e.target.value })}
//         />
//         <FormInput
//           label="Capacity (Guests)"
//           id="room-capacity"
//           type="number"
//           min="1"
//           value={roomForm.capacity}
//           onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })}
//         />
//         {/* <div>
//           <label className="block text-sm font-medium text-black">Amenities</label>
//           <div className="mt-2 space-y-2">
//             {["WiFi", "TV", "Air Conditioning", "Mini Bar", "Room Service", "Balcony"].map((amenity) => (
//               <div key={amenity} className="flex items-center">
//                 <input
//                   type="checkbox"
//                   id={`room-amenity-${amenity}`}
//                   value={amenity}
//                   checked={roomForm.amenities.includes(amenity)}
//                   onChange={handleAmenitiesChange}
//                   className="h-4 w-4 text-blue-600 border-slate-600 rounded focus:ring-blue-500 bg-slate-700"
//                 />
//                 <label htmlFor={`room-amenity-${amenity}`} className="ml-2 text-sm text-gray-300">
//                   {amenity}
//                 </label>
//               </div>
//             ))}
//           </div>
//         </div> */}
//         <div className="bg-white text-black p-4 rounded">
//   <label className="block text-sm font-medium text-black">Amenities</label>
//   <div className="mt-2 space-y-2">
//     {["WiFi", "TV", "Air Conditioning", "Mini Bar", "Room Service", "Balcony"].map((amenity) => (
//       <div key={amenity} className="flex items-center">
//         <input
//           type="checkbox"
//           id={`room-amenity-${amenity}`}
//           value={amenity}
//           checked={roomForm.amenities.includes(amenity)}
//           onChange={handleAmenitiesChange}
//           className="h-4 w-4 text-blue-600 border-slate-600 rounded focus:ring-blue-500 bg-white"
//         />
//         <label htmlFor={`room-amenity-${amenity}`} className="ml-2 text-sm text-black">
//           {amenity}
//         </label>
//       </div>
//     ))}
//   </div>
// </div>

//         <div>
//           <label htmlFor="room-description" className="block text-sm font-medium text-black">
//             Description
//           </label>
//           <textarea
//             id="room-description"
//             value={roomForm.description}
//             onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })}
//             className="w-full bg-white border border-slate-600 rounded-md px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
//             rows="4"
//           />
//         </div>
//         <div>
//           <label htmlFor="room-images" className="block text-sm font-medium text-black">
//             Room Images
//           </label>
//           <input
//             id="room-images"
//             type="file"
//             multiple
//             accept="image/jpeg,image/png,image/jpg"
//             onChange={handleImageUpload}
//             className="w-full bg-white border border-slate-600 rounded-md px-3 py-2 text-black file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
//           />
//           {roomForm.images.length > 0 && (
//             <div className="mt-4 grid grid-cols-3 gap-4">
//               {roomForm.images.map((url, index) => (
//                 <div key={index} className="relative">
//                   <img
//                     src={url}
//                     alt={`Room image ${index + 1}`}
//                     className="w-full h-32 object-cover rounded-md"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removeImage(index)}
//                     className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
//                   >
//                     ×
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//         <div>
//           <label htmlFor="room-available" className="flex items-center">
//             <input
//               id="room-available"
//               type="checkbox"
//               checked={roomForm.isAvailable}
//               onChange={(e) => setRoomForm({ ...roomForm, isAvailable: e.target.checked })}
//               className="h-4 w-4 text-blue-600 border-slate-600 rounded focus:ring-blue-500 bg-slate-700"
//             />
//             <span className="ml-2 text-sm font-medium text-black">Available</span>
//           </label>
//         </div>
//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
//           disabled={loading || !roomForm.hotelId}
//         >
//           {loading ? "Saving..." : editRoomId ? "Update" : "Add"}
//         </button>
//       </form>
//       <div className="flex gap-2 mb-4">
//         <button
//           onClick={() => setRoomTab("active")}
//           className={`flex-1 py-2 rounded-md ${roomTab === "active" ? "bg-green-600 text-white" : "bg-green-700 text-gray-300"}`}
//         >
//           Active
//         </button>
//         <button
//           onClick={() => setRoomTab("inactive")}
//           className={`flex-1 py-2 rounded-md ${roomTab === "inactive" ? "bg-red-600 text-white" : "bg-red-700 text-gray-300"}`}
//         >
//           Inactive
//         </button>
//       </div>
//       <ul className="space-y-2">
//         {(roomTab === "active" ? rooms : inactiveRooms).map((room) => (
//           <li
//             key={room._id}
//             className="flex justify-between items-center p-3 bg-slate-800 rounded-md border border-slate-700"
//           >
//             <span className="text-gray-200">
//               Room {room.roomNumber} ({room.type})
//             </span>
//             <div className="flex gap-2">
//               {roomTab === "active" ? (
//                 <>
//                   <button onClick={() => handleRoomEdit(room)} className="text-yellow-400 hover:text-yellow-500">
//                     <FaEdit size={28} />
//                   </button>
//                   <button onClick={() => handleRoomDelete(room._id)} className="text-red-400 hover:text-red-500">
//                     <FaTrash size={28} />
//                   </button>
//                   <button onClick={() => handleRoomSoftDelete(room._id)} className="text-gray-400 hover:text-gray-500">
//                     <FaBan size={28} />
//                   </button>
//                 </>
//               ) : (
//                 <button onClick={() => handleRoomActivate(room._id)} className="text-green-400 hover:text-green-500">
//                   <FaCheckCircle size={28} />
//                 </button>
//               )}
//             </div>
//           </li>
//         ))}
//         {(roomTab === "active" ? rooms : inactiveRooms).length === 0 && (
//           <li className="text-center text-gray-400 py-4">No {roomTab} rooms found.</li>
//         )}
//       </ul>
//     </div>
//   );

return (
  <div className="bg-white p-6 rounded shadow-md">
    <h2 className="text-2xl font-bold text-black mb-6">Manage Rooms</h2>

    <form onSubmit={handleRoomSubmit} className="space-y-5 mb-8">
      {/* State Dropdown */}
      <div>
        <label htmlFor="room-state" className="block text-sm font-semibold text-black mb-1">State</label>
        <select
          id="room-state"
          value={roomForm.stateId}
          onChange={(e) => {
            const stateId = e.target.value;
            setRoomForm({ ...roomForm, stateId, cityId: "", hotelId: "" });
            fetchCities(stateId);
          }}
          className="w-full border border-slate-600 rounded px-3 py-2 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Select State --</option>
          {states.map((state) => (
            <option key={state._id} value={state._id}>{state.name}</option>
          ))}
        </select>
      </div>

      {/* City Dropdown */}
      <div>
        <label htmlFor="room-city" className="block text-sm font-semibold text-black mb-1">City</label>
        <select
          id="room-city"
          value={roomForm.cityId}
          onChange={(e) => {
            const cityId = e.target.value;
            setRoomForm({ ...roomForm, cityId, hotelId: "" });
            if (cityId) fetchHotels(cityId);
            else {
              setHotels([]);
              setInactiveHotels([]);
              setRooms([]);
              setInactiveRooms([]);
            }
          }}
          disabled={!roomForm.stateId}
          className="w-full border border-slate-600 rounded px-3 py-2 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Select City --</option>
          {cities.map((city) => (
            <option key={city._id} value={city._id}>{city.name}</option>
          ))}
        </select>
      </div>

      {/* Hotel Dropdown */}
      <div>
        <label htmlFor="room-hotel" className="block text-sm font-semibold text-black mb-1">Hotel</label>
        <select
          id="room-hotel"
          value={roomForm.hotelId}
          onChange={(e) => {
            const hotelId = e.target.value;
            setRoomForm({ ...roomForm, hotelId });
            if (hotelId) fetchRooms(hotelId);
            else {
              setRooms([]);
              setInactiveRooms([]);
            }
          }}
          disabled={!roomForm.cityId}
          className="w-full border border-slate-600 rounded px-3 py-2 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Select Hotel --</option>
          {hotels.map((hotel) => (
            <option key={hotel._id} value={hotel._id}>{hotel.name}</option>
          ))}
        </select>
      </div>

      {/* Room Details Inputs */}
      <FormInput label="Room Number" id="room-number" value={roomForm.roomNumber} onChange={(e) => setRoomForm({ ...roomForm, roomNumber: e.target.value })} required />
      <FormInput label="Room Type" id="room-type" value={roomForm.type} onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value })} />
      <FormInput label="Price" id="room-price" type="number" min="0" value={roomForm.price} onChange={(e) => setRoomForm({ ...roomForm, price: e.target.value })} />
      <FormInput label="Capacity (Guests)" id="room-capacity" type="number" min="1" value={roomForm.capacity} onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })} />

      {/* Amenities */}
      <div>
        <label className="block text-sm font-semibold text-black mb-2">Amenities</label>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {["WiFi", "TV", "Air Conditioning", "Mini Bar", "Room Service", "Balcony"].map((amenity) => (
            <label key={amenity} className="flex items-center text-black">
              <input
                type="checkbox"
                value={amenity}
                checked={roomForm.amenities.includes(amenity)}
                onChange={handleAmenitiesChange}
                className="mr-2 h-4 w-4 text-blue-600 border-slate-600 rounded focus:ring-blue-500"
              />
              {amenity}
            </label>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="room-description" className="block text-sm font-semibold text-black mb-1">Description</label>
        <textarea
          id="room-description"
          rows="4"
          value={roomForm.description}
          onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })}
          className="w-full border border-slate-600 rounded px-3 py-2 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Room Images */}
      <div>
        <label htmlFor="room-images" className="block text-sm font-semibold text-black mb-1">Room Images</label>
        <input
          type="file"
          id="room-images"
          multiple
          accept="image/jpeg,image/png,image/jpg"
          onChange={handleImageUpload}
          className="w-full border border-slate-600 rounded px-3 py-2 bg-white text-black file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
        />
        {roomForm.images.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-4">
            {roomForm.images.map((url, index) => (
              <div key={index} className="relative">
                <img src={url} alt={`Room ${index + 1}`} className="w-full h-32 object-cover rounded-md" />
                <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700">×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Availability */}
      <div className="flex items-center">
        <input
          id="room-available"
          type="checkbox"
          checked={roomForm.isAvailable}
          onChange={(e) => setRoomForm({ ...roomForm, isAvailable: e.target.checked })}
          className="h-4 w-4 text-blue-600 border-slate-600 rounded focus:ring-blue-500"
        />
        <label htmlFor="room-available" className="ml-2 text-sm font-semibold text-black">Available</label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
        disabled={loading || !roomForm.hotelId}
      >
        {loading ? "Saving..." : editRoomId ? "Update" : "Add"}
      </button>
    </form>

    {/* Tabs */}
    <div className="flex gap-2 mb-4">
      <button onClick={() => setRoomTab("active")} className={`flex-1 py-2 rounded-md font-medium ${roomTab === "active" ? "bg-green-600 text-white" : "bg-green-100 text-black"}`}>
        Active
      </button>
      <button onClick={() => setRoomTab("inactive")} className={`flex-1 py-2 rounded-md font-medium ${roomTab === "inactive" ? "bg-red-600 text-white" : "bg-red-100 text-black"}`}>
        Inactive
      </button>
    </div>

    {/* Room List */}
    <ul className="space-y-2">
      {(roomTab === "active" ? rooms : inactiveRooms).map((room) => (
        <li key={room._id} className="flex justify-between items-center p-3 bg-white border border-slate-300 rounded-md">
          <span className="text-black font-medium">Room {room.roomNumber} ({room.type})</span>
          <div className="flex gap-2">
            {roomTab === "active" ? (
              <>
                <button onClick={() => handleRoomEdit(room)} className="text-yellow-500 hover:text-yellow-600"><FaEdit size={24} /></button>
                <button onClick={() => handleRoomDelete(room._id)} className="text-red-500 hover:text-red-600"><FaTrash size={24} /></button>
                <button onClick={() => handleRoomSoftDelete(room._id)} className="text-gray-500 hover:text-gray-600"><FaBan size={24} /></button>
              </>
            ) : (
              <button onClick={() => handleRoomActivate(room._id)} className="text-green-500 hover:text-green-600"><FaCheckCircle size={24} /></button>
            )}
          </div>
        </li>
      ))}
      {(roomTab === "active" ? rooms : inactiveRooms).length === 0 && (
        <li className="text-center text-gray-400 py-4">No {roomTab} rooms found.</li>
      )}
    </ul>
  </div>
);


};

export default RoomManagement;