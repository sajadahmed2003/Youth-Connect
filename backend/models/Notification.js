const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: { type: String, required: true },
  senderAvatar: { type: String, default: 'https://i.pravatar.cc/150?img=47' },
  type: {
    type: String,
    enum: ['LIKE_POST', 'COMMENT_POST', 'LIKE_COMMENT', 'REPLY_COMMENT', 'FOLLOW'],
    required: true
  },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  commentId: { type: String }, // Can be the ID of the comment
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
