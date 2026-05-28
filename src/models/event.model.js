const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'] },
  description: { type: String },
  date: { type: Date, required: [true, 'Date is required'] },
  time: { type: String, required: [true, 'Time is required'] },
  type: { type: String, default: 'virtual' },
  location: { type: String },
  attendees: { type: Number, default: 0 },
  maxAttendees: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Event', eventSchema);