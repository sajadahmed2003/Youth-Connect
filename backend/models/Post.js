const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    userAvatar: { type: String, default: 'https://i.pravatar.cc/150?img=47' },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const commentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    userAvatar: { type: String, default: 'https://i.pravatar.cc/150?img=47' },
    text: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    replies: [replySchema],
    status: { type: String, default: 'approved' },
    flagReason: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    userAvatar: { type: String, default: 'https://i.pravatar.cc/150?img=47' },
    content: { type: String, default: '' },
    image: { type: String },
    videoUrl: { type: String, default: '' },
    mediaType: { type: String, enum: ['post', 'reel', 'video'], default: 'post' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [commentSchema],
    shareCount: { type: Number, default: 0 },
    status: { type: String, default: 'approved' },
    flagReason: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
