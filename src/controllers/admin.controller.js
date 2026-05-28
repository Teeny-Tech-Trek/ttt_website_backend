const adminService = require("../services/admin.service");

exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const users = await adminService.listUsers({});
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await adminService.deleteUser(req.params.id);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.listBusinesses = async (req, res) => {
  try {
    const businesses = await adminService.listBusinesses();
    res.json({ success: true, businesses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.listBlogs = async (req, res) => {
  try {
    const blogs = await adminService.listBlogs();
    res.json({ success: true, blogs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.togglePublishBlog = async (req, res) => {
  try {
    const blog = await adminService.togglePublishBlog(req.params.id);
    res.json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.listConsultations = async (req, res) => {
  try {
    const consultations = await adminService.listConsultations();
    res.json({ success: true, consultations });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.listContacts = async (req, res) => {
  try {
    const contacts = await adminService.listContacts();
    res.json({ success: true, contacts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
