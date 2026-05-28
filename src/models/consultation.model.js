const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true, maxlength: 200 },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email"],
    },
    startTime: { type: Date, required: true, index: true },
    endTime: { type: Date, required: true },
    googleEventId: { type: String },
    googleMeetLink: { type: String },
    eventLink: { type: String },
    status: {
      type: String,
      enum: ["booked", "cancelled"],
      default: "booked",
    },
    formData: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

// Block the same email from booking the same slot twice.
consultationSchema.index(
  { email: 1, startTime: 1 },
  { unique: true, partialFilterExpression: { status: "booked" } }
);

module.exports = mongoose.model("Consultation", consultationSchema);
