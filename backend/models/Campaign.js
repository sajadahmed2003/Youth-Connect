const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  creatorName: { type: String, required: true }, // Previous orgName
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  description: { type: String, required: true },
  location: { type: String, required: true },
  requiredSkills: [{ type: String }],
  categories: [{ type: String }],
  neededPositions: { type: Number, default: 10 },
  filledPositions: { type: Number, default: 0 },
  image: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: String,
    text: String,
    date: { type: Date, default: Date.now }
  }],
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['Open', 'Closed', 'Pending', 'Approved'], default: 'Open' }
}, { timestamps: true });

module.exports = mongoose.model('Campaign', campaignSchema);
