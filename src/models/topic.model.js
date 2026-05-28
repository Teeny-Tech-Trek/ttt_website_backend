// models/topic.model.js (updated)
const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ["faq", "service"], default: "faq" },
  faqs: [{
    question: String,
    answer: String,
  }],
  business: { type: mongoose.Schema.Types.ObjectId, ref: "Business" }
}, { timestamps: true });

module.exports = mongoose.model("Topic", topicSchema);