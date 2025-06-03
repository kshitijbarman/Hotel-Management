const mongoose = require('mongoose')
const citySchema = new mongoose.Schema({
  name: { type: String, required: true },
  state: { type: mongoose.Schema.Types.ObjectId, ref: "State", required: true },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model('City', citySchema);