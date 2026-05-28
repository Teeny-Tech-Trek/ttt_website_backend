const mongoose = require('mongoose');

const discussionSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'] },
  content: { type: String, required: [true, 'Content is required'] },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  authorName: { type: String },
  authorAvatar: { type: String },
  category: { type: String, default: 'general' },
  tags: { type: [String], default: [] },
  replies: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Discussion', discussionSchema);