const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  creatorName: { type: String, required: true },
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
  
  // 💎 PILLAR 1: Crowdfunding Fields
  targetAmount: { type: Number, default: 0 }, // Target funding amount
  raisedAmount: { type: Number, default: 0 }, // Total raised amount
  fundingReason: { type: String, default: '' }, // Purpose of raising funds
  donations: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: String,
    amount: Number,
    commissionDeducted: Number,
    transactionId: String,
    createdAt: { type: Date, default: Date.now }
  }],

  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['Open', 'Closed', 'Pending', 'Approved'], default: 'Open' }
}, { timestamps: true });

module.exports = mongoose.model('Campaign', campaignSchema);
