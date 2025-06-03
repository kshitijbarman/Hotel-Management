 
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  // hotel:{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Hotel",
  //   required: true,
  // },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  members: {
    type: Number,
    required: true,
    min: 1,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
    required: true,
  },
  hasChild: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: String,
    required: true,
    match: [/^\d{10}$/, "Phone number must be 10 digits"],
  },
  couponCode: {
    type: String,
    default: null,
  },
  discountApplied: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected",'cancelled'],
    default: "pending",
  },
  checkedIn: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Booking", bookingSchema);