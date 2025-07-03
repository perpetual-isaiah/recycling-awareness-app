

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { type: String, required: true }, // hash it before saving
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  location: {
  latitude: { type: Number, default: null },
  longitude: { type: Number, default: null },
},
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
