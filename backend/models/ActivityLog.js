const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['USER_SIGNUP', 'NGO_PORTAL_CREATED', 'SYSTEM_ALERT', 'SIGNUP', 'LOGIN', 'LOG'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  metadata: {
     type: Object,
     default: {}
  }
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
