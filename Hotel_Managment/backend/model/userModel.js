 

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstname: { type: String, required: false },
  lastname: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'other', ''], default: '' },
  age: { type: Number, min: 1 },
  role: { type: String, default: 'user' },
  profileImage: String,
  isDisabled: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  backgroundImage: { type: String, default: '' }
});

module.exports = mongoose.model('User', UserSchema);