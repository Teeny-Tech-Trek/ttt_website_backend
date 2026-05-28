// models/business.model.js
const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  industry: { type: String, required: true },
  description: { type: String },
  contactEmail: { type: String },
  phoneNumber: { type: String },
  address: { type: String },
  profileCompletion: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Business", businessSchema);