const mongoose = require('mongoose');

const SupportQuerySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: String,
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', default: null },
    campaignTitle: { type: String, default: '' },
    queryText: String,
    botResponse: String,
    adminReply: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SupportQuery', SupportQuerySchema);
