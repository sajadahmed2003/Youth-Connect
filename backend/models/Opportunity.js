const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  orgName: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  requiredSkills: [{ type: String }],
  categories: [{ type: String }],
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['Open', 'Closed'], default: 'Open' }
}, { timestamps: true });

module.exports = mongoose.model('Opportunity', opportunitySchema);
