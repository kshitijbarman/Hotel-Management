const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true },
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
  type: { type: String, default: "Standard" },
  price: { type: Number, min: 0 },
  isAvailable: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  images: [{ type: String }],  
  amenities: [{ type: String }],  
  description: { type: String },
  capacity: { type: Number, min: 1 }, 
  // city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
  // state: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true }, 
});

module.exports = mongoose.model("Room", roomSchema);