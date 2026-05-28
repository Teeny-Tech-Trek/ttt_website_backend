// routes/chatbot.js
const express = require("express");
const router = express.Router();
const chatbotController = require("./chatbot.controller");

// GET intro message
router.get("/intro", chatbotController.intro);
router.get("/health", chatbotController.health);

// POST user message
router.post("/chat", chatbotController.chat);

// POST lead capture form
router.post("/lead", chatbotController.lead);

module.exports = router;
