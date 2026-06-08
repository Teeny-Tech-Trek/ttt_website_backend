const dotenv = require("dotenv");

// Load env vars FIRST
dotenv.config();
const cors = require("cors");
const express = require("express");
const connectDB = require("./config/db");
const communityRoutes = require("./routes/community.routes");
const chatbotRoutes = require("./chatbot/chatbot.routes");
const contactRoutes = require("./routes/contact.routes");
const newsletterRoutes = require("./routes/newsletter.routes");
const consultationRoutes = require("./routes/consultation.routes");
const voiceAgentRoutes = require("./routes/voiceAgent.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

const corsOrigins = (process.env.CORS_ORIGINS || "https://www.teenytechtrek.com,http://localhost:5173,http://localhost:4173,http://localhost:3000")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: corsOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Connect DB (now has access to MONGO_URI)
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/community', communityRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use('/api', contactRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/api/voice-agent", voiceAgentRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/", (req, res) => res.send("ttt-backend-new API is live"));
app.get("/health", (req, res) => res.json({ status: "ok", service: "ttt_website_backend" }));

// Basic error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Server error" });
});

module.exports = app;
