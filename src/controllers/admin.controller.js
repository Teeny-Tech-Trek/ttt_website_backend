const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model");
const Consultation = require("../models/consultation.model");
const { getChatbotLeadModel } = require("../config/chatbotDb");

const signToken = (admin) =>
  jwt.sign(
    { id: admin._id.toString(), email: admin.email, name: admin.name, role: admin.role || "admin" },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

// POST /api/admin/login
const login = async (req, res) => {
  try {
    const email = (req.body?.email || "").toString().trim().toLowerCase();
    const password = (req.body?.password || "").toString();

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    // `password` is `select: false` in the schema, so re-select it for the check.
    const admin = await Admin.findOne({ email }).select("+password");
    // Same response for unknown email and wrong password — don't leak which.
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = signToken(admin);
    return res.json({
      success: true,
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({ success: false, message: "Login failed" });
  }
};

// POST /api/admin/logout
// JWTs are stateless, so logout is handled client-side by discarding the token.
// This endpoint exists so the client has a clear action to call.
const logout = async (_req, res) => {
  return res.json({ success: true, message: "Logged out" });
};

// GET /api/admin/consultations
const getConsultations = async (_req, res) => {
  try {
    const consultations = await Consultation.find().sort({ createdAt: -1 }).lean();
    return res.json({ success: true, count: consultations.length, consultations });
  } catch (error) {
    console.error("Fetch consultations error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch consultations" });
  }
};

// GET /api/admin/chatbot-leads
const getChatbotLeads = async (_req, res) => {
  try {
    const ChatbotLead = getChatbotLeadModel();
    const leads = await ChatbotLead.find().sort({ created_at: -1 }).lean();
    return res.json({ success: true, count: leads.length, leads });
  } catch (error) {
    console.error("Fetch chatbot leads error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch chatbot leads" });
  }
};

module.exports = { login, logout, getConsultations, getChatbotLeads };
