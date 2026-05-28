const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

const createLocalUser = async ({ username, email, password }) => {
  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  const user = await User.create({
    username,
    email,
    password: hashed,
    provider: "local",
  });
  return user;
};

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

const findByUsername = async (username) => {
  return await User.findOne({ username });
};

const findById = async (id) => {
  return await User.findById(id);
};

const findOrCreateGoogleUser = async ({ googleId, email, username }) => {
  // try to find by googleId first then email
  let user = await User.findOne({ $or: [{ googleId }, { email }] });
  if (!user) {
    user = await User.create({
      username,
      email,
      provider: "google",
      googleId,
      // no password
    });
  } else if (!user.googleId) {
    // user exists (maybe local) — attach googleId to allow future oauth sign-in
    user.googleId = googleId;
    user.provider = user.provider === "local" ? "local" : "google";
    await user.save();
  }
  return user;
};

module.exports = {
  createLocalUser,
  findByEmail,
  findByUsername,
  findById,
  findOrCreateGoogleUser,
};
