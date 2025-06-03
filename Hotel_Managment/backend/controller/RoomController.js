// const Room = require("../model/RoomModel");
// const Hotel = require("../model/HotelModel");
// const { uploadToCloudinary } = require("../helpers/helper");

// exports.getRoomsByHotel = async (req, res) => {
//   try {
//     const rooms = await Room.find({ hotel: req.params.hotelId }).populate("hotel");
//     res.json(rooms);
//   } catch (err) {
//     console.error("GET /api/hotels/:hotelId/rooms - Error:", err);
//     res.status(500).json({ message: "Failed to fetch rooms" });
//   }
// };

// exports.uploadRoomImages = async (req, res) => {
//   try {
//     if (!req.files || Object.keys(req.files).length === 0) {
//       return res.status(400).json({ message: "No files uploaded" });
//     }

//     const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
//     const uploadPromises = files.map(async (file) => {
//       if (!["image/jpeg", "image/png", "image/jpg"].includes(file.mimetype)) {
//         throw new Error(`Invalid file type: ${file.name}`);
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         throw new Error(`File too large: ${file.name}`);
//       }
//       return await uploadToCloudinary(file.data, file.name);
//     });

//     const imageUrls = await Promise.all(uploadPromises);
//     res.json({ imageUrls });
//   } catch (err) {
//     console.error("POST /api/rooms/upload-images - Error:", err);
//     res.status(400).json({ message: err.message || "Failed to upload images" });
//   }
// };

// exports.addRoom = async (req, res) => {
//   try {
//     const hotel = await Hotel.findById(req.body.hotel);
//     if (!hotel) {
//       return res.status(400).json({ message: "Invalid hotel ID" });
//     }
//     const room = new Room({
//       roomNumber: req.body.roomNumber,
//       hotel: req.body.hotel,
//       type: req.body.type || "Standard",
//       price: req.body.price,
//       isAvailable: req.body.isAvailable === "true" || req.body.isAvailable === true,
//       images: req.body.images ? JSON.parse(req.body.images) : [],
//       amenities: req.body.amenities ? JSON.parse(req.body.amenities) : [],
//       description: req.body.description || "",
//       capacity: req.body.capacity,
//     });
//     await room.save();
//     const populatedRoom = await Room.findById(room._id).populate("hotel");
//     res.json(populatedRoom);
//   } catch (err) {
//     console.error("POST /api/rooms/add - Error:", err);
//     res.status(400).json({ message: err.message || "Failed to add room" });
//   }
// };

// exports.updateRoom = async (req, res) => {
//   try {
//     const room = await Room.findByIdAndUpdate(
//       req.params.id,
//       {
//         roomNumber: req.body.roomNumber,
//         hotel: req.body.hotel,
//         type: req.body.type || "Standard",
//         price: req.body.price,
//         isAvailable: req.body.isAvailable === "true" || req.body.isAvailable === true,
//         images: req.body.images ? JSON.parse(req.body.images) : [],
//         amenities: req.body.amenities ? JSON.parse(req.body.amenities) : [],
//         description: req.body.description || "",
//         capacity: req.body.capacity,
//       },
//       { new: true }
//     ).populate("hotel");
//     if (!room) return res.status(404).json({ message: "Room not found" });
//     res.json(room);
//   } catch (err) {
//     console.error("PUT /api/rooms/:id - Error:", err);
//     res.status(400).json({ message: err.message || "Failed to update room" });
//   }
// };

// exports.deleteRoom = async (req, res) => {
//   try {
//     const room = await Room.findByIdAndDelete(req.params.id);
//     if (!room) return res.status(404).json({ message: "Room not found" });
//     res.json({ message: "Room deleted" });
//   } catch (err) {
//     console.error("DELETE /api/rooms/:id - Error:", err);
//     res.status(500).json({ message: "Failed to delete room" });
//   }
// };

// exports.softDeleteRoom = async (req, res) => {
//   try {
//     const room = await Room.findByIdAndUpdate(
//       req.params.id,
//       { isActive: false },
//       { new: true }
//     );
//     if (!room) return res.status(404).json({ message: "Room not found" });
//     res.json({ message: "Room deactivated" });
//   } catch (err) {
//     console.error("PATCH /api/rooms/:id/softdelete - Error:", err);
//     res.status(500).json({ message: "Failed to deactivate room" });
//   }
// };

// exports.activateRoom = async (req, res) => {
//   try {
//     const room = await Room.findByIdAndUpdate(
//       req.params.id,
//       { isActive: true },
//       { new: true }
//     );
//     if (!room) return res.status(404).json({ message: "Room not found" });
//     res.json({ message: "Room activated" });
//   } catch (err) {
//     console.error("PATCH /api/rooms/:id/activate - Error:", err);
//     res.status(500).json({ message: "Failed to activate room" });
//   }
// };

const Room = require("../model/RoomModel");
const Hotel = require("../model/HotelModel");
const { uploadToCloudinary } = require("../helpers/helper");

// exports.getRoomsByHotel = async (req, res) => {
//   try {
//     const rooms = await Room.find({ hotel: req.params.hotelId }).populate("hotel");
//     console.log(rooms)
//     res.json(rooms);
//   } catch (err) {
//     console.error("GET /api/hotels/:hotelId/rooms - Error:", err);
//     res.status(500).json({ message: "Failed to fetch rooms" });
//   }
// };

exports.getRoomsByHotel = async (req, res) => {
  console.log("Hit /api/hotels/:hotelId/rooms with:", req.params.hotelId); // ADD THIS

  try {
    const rooms = await Room.find({ hotel: req.params.hotelId }).populate("hotel");
    res.json(rooms);
  } catch (err) {
    console.error("GET /api/hotels/:hotelId/rooms - Error:", err);
    res.status(500).json({ message: "Failed to fetch rooms" });
  }
};


exports.getRooms = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id).populate("hotel", "name");  
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json(room);
  } catch (error) {
    console.error("GET /api/rooms/:id - Error:", error);
    res.status(500).json({ message: "Server error" });
  }

  //no hotel showing 

  // try {
  //   const rooms = await Room.aggregate([
  //     {
  //       $lookup: {
  //         from: "hotels",  
  //         localField: "hotel",
  //         foreignField: "_id",
  //         as: "hotel",
  //       },
  //     },
  //   ]);

    
  //   res.status(200).json(rooms);
  // } catch (error) {
  //   console.error("GET /api/rooms/:id - Error:", error);
  //   res.status(500).json({ message: "Server error" });
  // }
};


exports.uploadRoomImages = async (req, res) => {
  try {
    if (!req.files?.images) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
    const uploadPromises = files.map(file => {
      if (!["image/jpeg", "image/png", "image/jpg"].includes(file.mimetype)) {
        throw new Error(`Invalid file type: ${file.name}`);
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new Error(`File too large: ${file.name}`);
      }
      return uploadToCloudinary(file.data, file.name);
    });

    const imageUrls = await Promise.all(uploadPromises);
    res.json({ imageUrls });
  } catch (err) {
    console.error("POST /api/rooms/upload-images - Error:", err);
    res.status(400).json({ message: err.message || "Failed to upload images" });
  }
};

exports.addRoom = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.body.hotel);
    if (!hotel) {
      return res.status(400).json({ message: "Invalid hotel ID" });
    }

    const room = new Room({
      roomNumber: req.body.roomNumber,
      hotel: req.body.hotel,
      type: req.body.type || "Standard",
      price: req.body.price,
      isAvailable: req.body.isAvailable === "true" || req.body.isAvailable === true,
      images: JSON.parse(req.body.images || "[]"),
      amenities: JSON.parse(req.body.amenities || "[]"),
      description: req.body.description || "",
      capacity: req.body.capacity,
    });

    await room.save();
    const populatedRoom = await Room.findById(room._id).populate("hotel");
    res.json(populatedRoom);
  } catch (err) {
    console.error("POST /api/rooms/add - Error:", err);
    res.status(400).json({ message: err.message || "Failed to add room" });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      {
        roomNumber: req.body.roomNumber,
        hotel: req.body.hotel,
        type: req.body.type || "Standard",
        price: req.body.price,
        isAvailable: req.body.isAvailable === "true" || req.body.isAvailable === true,
        images: JSON.parse(req.body.images || "[]"),
        amenities: JSON.parse(req.body.amenities || "[]"),
        description: req.body.description || "",
        capacity: req.body.capacity,
      },
      { new: true }
    ).populate("hotel");

    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (err) {
    console.error("PUT /api/rooms/:id - Error:", err);
    res.status(400).json({ message: err.message || "Failed to update room" });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json({ message: "Room deleted" });
  } catch (err) {
    console.error("DELETE /api/rooms/:id - Error:", err);
    res.status(500).json({ message: "Failed to delete room" });
  }
};

exports.softDeleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json({ message: "Room deactivated" });
  } catch (err) {
    console.error("PATCH /api/rooms/:id/softdelete - Error:", err);
    res.status(500).json({ message: "Failed to deactivate room" });
  }
};

exports.activateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json({ message: "Room activated" });
  } catch (err) {
    console.error("PATCH /api/rooms/:id/activate - Error:", err);
    res.status(500).json({ message: "Failed to activate room" });
  }
};
