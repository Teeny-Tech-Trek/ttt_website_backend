const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'] },
  description: { type: String },
  type: { type: String, default: 'guide' },
  url: { type: String },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  authorName: { type: String },
  tags: { type: [String], default: [] },
  downloads: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Resource', resourceSchema);