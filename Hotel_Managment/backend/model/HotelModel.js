// const mongoose = require('mongoose')
// const hotelSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   city: { type: mongoose.Schema.Types.ObjectId, ref: "City", required: true },
//   address: String,
//   rating: Number,
//   amenities: [String],
//   priceRange: { min: Number, max: Number },
//   contact: { phone: String, email: String },
//   isActive: { type: Boolean, default: true },
// });

// module.exports = mongoose.model('Hotel', hotelSchema);

const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: mongoose.Schema.Types.ObjectId, ref: "City", required: true },
  address: String,
  rating: Number,
  amenities: [String],
  priceRange: { min: Number, max: Number },
  contact: { phone: String, email: String },
  totalRooms: {
    type: Number,
    required: true,
    min: [0, "Total rooms cannot be negative"],
    validate: {
      validator: Number.isInteger,
      message: "Total rooms must be an integer",
    },
  },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("Hotel", hotelSchema);