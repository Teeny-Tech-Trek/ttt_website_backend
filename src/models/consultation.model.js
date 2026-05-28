const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  startTime: { type: Date },
  endTime: { type: Date },
  googleEventId: { type: String },
  googleMeetLink: { type: String },
  eventLink: { type: String },
  status: { type: String, default: "booked" },
  formData: { type: mongoose.Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Consultation", consultationSchema);
