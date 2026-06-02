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
    default: 'https://i.pravatar.cc/150?img=47'
  },
  bio: {
    type: String,
    default: 'Active volunteer in the Youth Connect impact stream.'
  },
  phone: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
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
  },

  // 🏆 PILLAR 5: Gamification Fields
  points: {
    type: Number,
    default: 0
  },
  badges: [{
    title: String,
    icon: String,
    category: String,
    unlockedAt: { type: Date, default: Date.now }
  }],
  // 👥 Social Connection Fields
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // 🛡️ Security & Verification Engine
  isVerified: {
    type: Boolean,
    default: true // Default to true so existing users are not locked out
  },
  verificationOtp: {
    type: String,
    default: null
  },
  verificationOtpExpires: {
    type: Date,
    default: null
  },
  resetOtp: {
    type: String,
    default: null
  },
  resetOtpExpires: {
    type: Date,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
