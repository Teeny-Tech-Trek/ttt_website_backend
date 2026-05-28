const mongoose = require('mongoose');

const successStorySchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'] },
  description: { type: String, required: [true, 'Description is required'] },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  authorName: { type: String },
  authorAvatar: { type: String },
  authorTitle: { type: String },
  company: { type: String },
  metrics: { type: [{ label: String, value: String }], default: [] },
  featured: { type: Number, default: 0 }, // 0: not featured, 1: featured
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SuccessStory', successStorySchema);