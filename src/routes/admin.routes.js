const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const { requireAdmin } = require("../middleware/auth.middleware");

// Public auth endpoints
router.post("/login", adminController.login);
router.post("/logout", adminController.logout);

// Protected dashboard data
router.get("/consultations", requireAdmin, adminController.getConsultations);
router.get("/chatbot-leads", requireAdmin, adminController.getChatbotLeads);

module.exports = router;
