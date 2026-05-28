const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'] },
  content: { type: String, required: [true, 'Content is required'] },
  excerpt: { type: String },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  authorName: { type: String },
  authorAvatar: { type: String },
  category: { type: String, default: 'general' },
  tags: { type: [String], default: [] },
  coverImage: { type: String },
  featured: { type: Boolean, default: false },
  published: { type: Boolean, default: true },
  publishedAt: { type: Date },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  readTime: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Blog', blogSchema);