const mongoose = require('mongoose');

const ContactInquirySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    replyText: { type: String, default: '' },
    status: { type: String, enum: ['Pending', 'Resolved'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ContactInquiry', ContactInquirySchema);
