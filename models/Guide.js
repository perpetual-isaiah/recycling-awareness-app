const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: String,
  description: String,
  steps: [String],
  images: [String],
});

module.exports = mongoose.model('Guide', guideSchema);
