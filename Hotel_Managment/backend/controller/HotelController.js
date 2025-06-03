// const Hotel = require('../model/HotelModel');
// const mongoose = require('mongoose')

// exports.getHotelsByCity = async (req, res) => {
//     const { cityId } = req.params;
  
//     if (!mongoose.Types.ObjectId.isValid(cityId)) {
//       return res.status(400).json({ message: "Invalid city ID" });
//     }
  
//     try {
//       const hotels = await Hotel.find({ city: cityId }).populate({
//         path: "city",
//         populate: { path: "state" },
//       });
//       res.json(hotels);
//     } catch (err) {
//       console.error("GET /api/cities/:cityId/hotels - Error:", err);
//       res.status(500).json({ message: "Failed to fetch hotels" });
//     }
//   };


// exports.addHotel = async (req, res) => {
//   try {
//     console.log("---------------hotelboby-------------------",req.body);
    
//     const hotel = new Hotel(req.body);
//     await hotel.save();
//     const populatedHotel = await Hotel.findById(hotel._id).populate({
//       path: "city",
//       populate: { path: "state" },
//     });
//     res.json(populatedHotel);
//   } catch (err) {
//     console.error("POST /api/hotels/add - Error:", err);
//     res.status(400).json({ message: err.message || "Failed to add hotel" });
//   }
// };

// exports.updateHotel = async (req, res) => {
//   try {
//     const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate({
//       path: "city",
//       populate: { path: "state" },
//     });
//     if (!hotel) return res.status(404).json({ message: "Hotel not found" });
//     res.json(hotel);
//   } catch (err) {
//     console.error("PUT /api/hotels/:id - Error:", err);
//     res.status(400).json({ message: err.message || "Failed to update hotel" });
//   }
// };

// exports.deleteHotel = async (req, res) => {
//   try {
//     const hotel = await Hotel.findByIdAndDelete(req.params.id);
//     if (!hotel) return res.status(404).json({ message: "Hotel not found" });
//     res.json({ message: "Hotel deleted" });
//   } catch (err) {
//     console.error("DELETE /api/hotels/:id - Error:", err);
//     res.status(500).json({ message: "Failed to delete hotel" });
//   }
// };

// exports.softDeleteHotel = async (req, res) => {
//   try {
//     const hotel = await Hotel.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
//     if (!hotel) return res.status(404).json({ message: "Hotel not found" });
//     res.json({ message: "Hotel deactivated" });
//   } catch (err) {
//     console.error("PATCH /api/hotels/:id/softdelete - Error:", err);
//     res.status(500).json({ message: "Failed to deactivate hotel" });
//   }
// };

// exports.activateHotel = async (req, res) => {
//   try {
//     const hotel = await Hotel.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });
//     if (!hotel) return res.status(404).json({ message: "Hotel not found" });
//     res.json({ message: "Hotel activated" });
//   } catch (err) {
//     console.error("PATCH /api/hotels/:id/activate - Error:", err);
//     res.status(500).json({ message: "Failed to activate hotel" });
//   }
// };


const Hotel = require("../model/HotelModel");
const City = require("../model/CityModel");
const Room = require("../model/RoomModel");
// Get hotels by city
exports.getHotelsByCity = async (req, res) => {
  try {
    const hotels = await Hotel.find({ city: req.params.cityId }).populate({
      path: "city",
      populate: { path: "state" },
    });
    res.json(hotels);
  } catch (err) {
    console.error("GET /api/cities/:cityId/hotels - Error:", err);
    res.status(500).json({ message: "Failed to fetch hotels" });
  }
};

// Add a hotel
exports.addHotel = async (req, res) => {
  try {
    const city = await City.findById(req.body.city);
    if (!city) {
      return res.status(400).json({ message: "Invalid city ID" });
    }
    const hotelData = {
      ...req.body,
      totalRooms: parseInt(req.body.totalRooms, 10), // Ensure integer
    };
    const hotel = new Hotel(hotelData);
    await hotel.save();
    const populatedHotel = await Hotel.findById(hotel._id).populate({
      path: "city",
      populate: { path: "state" },
    });
    res.json(populatedHotel);
  } catch (err) {
    console.error("POST /api/hotels/add - Error:", err);
    res.status(400).json({ message: err.message || "Failed to add hotel" });
  }
};

// Update a hotel
exports.updateHotel = async (req, res) => {
  try {
    const hotelData = {
      ...req.body,
      totalRooms: parseInt(req.body.totalRooms, 10), // Ensure integer
    };
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, hotelData, {
      new: true,
    }).populate({
      path: "city",
      populate: { path: "state" },
    });
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    res.json(hotel);
  } catch (err) {
    console.error("PUT /api/hotels/:id - Error:", err);
    res.status(400).json({ message: err.message || "Failed to update hotel" });
  }
};

// Delete a hotel (unchanged)
// exports.deleteHotel = async (req, res) => {
//   try {
//     const hotel = await Hotel.findByIdAndDelete(req.params.id);
//     if (!hotel) return res.status(404).json({ message: "Hotel not found" });
//     res.json({ message: "Hotel deleted" });
//   } catch (err) {
//     console.error("DELETE /api/hotels/:id - Error:", err);
//     res.status(500).json({ message: "Failed to delete hotel" });
//   }
// };
exports.deleteHotel = async (req, res) => {
    try {
      const hotel = await Hotel.findById(req.params.id);
      if (!hotel) return res.status(404).json({ message: "Hotel not found" });
      // Delete associated rooms
      await Room.deleteMany({ hotel: req.params.id });
      await Hotel.findByIdAndDelete(req.params.id);
      res.json({ message: "Hotel and associated rooms deleted" });
    } catch (err) {
      console.error("DELETE /api/hotels/:id - Error:", err);
      res.status(500).json({ message: "Failed to delete hotel" });
    }
  };
// Soft delete a hotel (unchanged)
exports.softDeleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    res.json({ message: "Hotel deactivated" });
  } catch (err) {
    console.error("PATCH /api/hotels/:id/softdelete - Error:", err);
    res.status(500).json({ message: "Failed to deactivate hotel" });
  }
};

// Activate a hotel (unchanged)
exports.activateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    res.json({ message: "Hotel activated" });
  } catch (err) {
    console.error("PATCH /api/hotels/:id/activate - Error:", err);
    res.status(500).json({ message: "Failed to activate hotel" });
  }
};

exports.getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({ isActive: true }).populate({
      path: "city",
      populate: { path: "state" },
    });

    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all hotels", error });
  }
};


module.exports = exports;