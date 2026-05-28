// models/trainingData.model.js
const mongoose = require("mongoose");

const trainingDataSchema = new mongoose.Schema({
  keywords: [{ type: String }],
  commonQuestions: [{ type: String }],
  tone: { type: String, default: "Friendly & Professional" },
  business: { type: mongoose.Schema.Types.ObjectId, ref: "Business" }
}, { timestamps: true });

module.exports = mongoose.model("TrainingData", trainingDataSchema);