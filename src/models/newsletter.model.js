const mongoose = require("mongoose");

const newsletterSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Newsletter = mongoose.model("Newsletter", newsletterSchema);
module.exports = Newsletter;
