const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true, maxlength: 200 },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email"],
    },
    // Always stored hashed. The pre-save hook below hashes any plaintext value,
    // so an admin can be inserted manually with a pre-hashed password too.
    // `select: false` keeps the hash out of query results by default; login
    // explicitly re-selects it via `.select("+password")`.
    password: { type: String, required: true, select: false },
    role: { type: String, default: "admin" },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

// Hash the password whenever it is set to a plaintext value. A bcrypt hash
// starts with "$2"; if it already looks hashed we leave it untouched so a
// manually-inserted (already hashed) document is not double-hashed.
adminSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  if (typeof this.password === "string" && this.password.startsWith("$2")) {
    return next();
  }
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

adminSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("Admin", adminSchema);
