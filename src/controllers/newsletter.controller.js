const newsletterService = require("../services/newsletter.service");

const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const subscription = await newsletterService.subscribeNewsletter(email);
    res.status(201).json({ message: "Successfully subscribed!", subscription });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Server error" });
  }
};

const listSubscribers = async (_req, res) => {
  try {
    const subscribers = await newsletterService.getSubscribers();
    res.status(200).json(subscribers);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

module.exports = { subscribe, listSubscribers };
