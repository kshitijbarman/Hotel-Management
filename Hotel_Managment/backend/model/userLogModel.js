const mongoose = require("mongoose");

const userLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    ipAddress: {
      type: String,
    },
    systemName: {
      type: String,
    },
    action: {
      type: String,
      enum: ["signup", "login", "logout"],
    },
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model("UserLog", userLogSchema);
