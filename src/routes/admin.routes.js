const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { adminOnly } = require("../middlewares/admin.middleware");

// 🔒 Protect all admin routes
router.use(authMiddleware, adminOnly);

// 📊 Dashboard
router.get("/dashboard", adminController.getDashboardStats);

// 👥 Users
router.get("/users", adminController.listUsers);
router.delete("/users/:id", adminController.deleteUser);

// 🏢 Businesses
router.get("/businesses", adminController.listBusinesses);

// 📝 Blogs
router.get("/blogs", adminController.listBlogs);
router.put("/blogs/:id/toggle-publish", adminController.togglePublishBlog);

// 💬 Consultations
router.get("/consultations", adminController.listConsultations);

// 📩 Contacts
router.get("/contacts", adminController.listContacts);

module.exports = router;
