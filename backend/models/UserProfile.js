const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  skills: [{ type: String }],
  interests: [{ type: String }],
  location: { type: String },
  availability: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('UserProfile', userProfileSchema);
