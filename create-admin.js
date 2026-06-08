/**
 * Create an internal admin user.
 *
 * Usage:
 *   node create-admin.js "Full Name" admin@example.com "StrongPassword123"
 *
 * Connects to MONGO_URI (from .env), hashes the password, and upserts the admin.
 * If you'd rather insert manually in MongoDB Compass/Atlas, run with --hash-only
 * to just print a bcrypt hash and a ready-to-paste document:
 *   node create-admin.js --hash-only "StrongPassword123"
 */
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./src/models/admin.model");

const args = process.argv.slice(2);

async function hashOnly(password) {
  if (!password) {
    console.error('Usage: node create-admin.js --hash-only "YourPassword"');
    process.exit(1);
  }
  const hash = await bcrypt.hash(password, 10);
  console.log("\nBcrypt hash:\n" + hash);
  console.log(
    "\nSample MongoDB document (collection: admins):\n" +
      JSON.stringify(
        {
          name: "Admin Name",
          email: "admin@example.com",
          password: hash,
          role: "admin",
          createdAt: { $date: new Date().toISOString() },
        },
        null,
        2
      )
  );
}

async function createAdmin(name, email, password) {
  if (!name || !email || !password) {
    console.error('Usage: node create-admin.js "Full Name" admin@example.com "Password"');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);
  const hash = await bcrypt.hash(password, 10);
  const admin = await Admin.findOneAndUpdate(
    { email: email.toLowerCase().trim() },
    { name, email: email.toLowerCase().trim(), password: hash, role: "admin" },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log("✅ Admin ready:", { id: admin._id.toString(), email: admin.email, role: admin.role });
  await mongoose.disconnect();
}

(async () => {
  try {
    if (args[0] === "--hash-only") {
      await hashOnly(args[1]);
    } else {
      await createAdmin(args[0], args[1], args[2]);
    }
    process.exit(0);
  } catch (err) {
    console.error("Failed:", err.message);
    process.exit(1);
  }
})();
