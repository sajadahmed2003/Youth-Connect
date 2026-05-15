const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: 'https://i.pravatar.cc/150?img=47' // Default mock avatar
  },
  skills: {
    type: [String],
    default: []
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'volunteer', 'ngo'],
    default: 'volunteer'
  },
  campaignsJoined: {
    type: Number,
    default: 0
  },
  campaignsCompleted: {
    type: Number,
    default: 0
  },
  campaignsPosted: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
