const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'] },
  username: { type: String, required: [true, 'Username is required'], unique: true },
  email: { type: String, required: [true, 'Email is required'], unique: true },
  avatar: { type: String },
  bio: { type: String },
  expertise: { type: [String], default: [] },
  joinedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Member', memberSchema);