const Newsletter = require("../models/newsletter.model");

const subscribeNewsletter = async (email) => {
  const existing = await Newsletter.findOne({ email });
  if (existing) {
    const error = new Error("This email is already subscribed.");
    error.status = 409;
    throw error;
  }

  const subscription = new Newsletter({ email });
  return await subscription.save();
};

const getSubscribers = async () => {
  return await Newsletter.find().sort({ createdAt: -1 });
};

module.exports = { subscribeNewsletter, getSubscribers };
