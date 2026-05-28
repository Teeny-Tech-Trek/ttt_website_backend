    // models/service.model.js
const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  startingPrice: { type: Number },
  pricingUnit: { type: String, default: "/month" },
  category: { type: String },
  business: { type: mongoose.Schema.Types.ObjectId, ref: "Business" }
}, { timestamps: true });

module.exports = mongoose.model("Service", serviceSchema);