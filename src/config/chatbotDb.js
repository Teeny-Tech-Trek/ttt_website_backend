const mongoose = require("mongoose");

// The chatbot persists leads in its OWN MongoDB cluster/database (separate from
// the main backend DB). The admin dashboard reads those leads, so we open a
// second, lazily-created mongoose connection scoped to that cluster and expose
// a read model bound to the `chatbot_leads` collection.

let chatbotConnection = null;
let ChatbotLeadModel = null;

// Schema is non-authoritative: the chatbot owns writes. `strict: false` keeps any
// extra fields the chatbot stores, and we never write from here.
const chatbotLeadSchema = new mongoose.Schema(
  {
    session_id: String,
    name: String,
    email: String,
    service: String,
    message: String,
    created_at: String,
    notified: Boolean,
  },
  { collection: "chatbot_leads", strict: false }
);

const getChatbotConnection = () => {
  if (chatbotConnection) return chatbotConnection;

  const uri = process.env.CHATBOT_MONGO_URI;
  if (!uri) {
    throw new Error("CHATBOT_MONGO_URI not set in .env");
  }
  const dbName = process.env.CHATBOT_MONGO_DB || "ttt_chatbot";

  chatbotConnection = mongoose.createConnection(uri, { dbName });
  chatbotConnection.on("error", (err) => {
    console.error("❌ Chatbot MongoDB connection error:", err.message);
  });
  chatbotConnection.once("open", () => {
    console.log("✅ Chatbot MongoDB connected (leads)");
  });

  return chatbotConnection;
};

const getChatbotLeadModel = () => {
  if (ChatbotLeadModel) return ChatbotLeadModel;
  ChatbotLeadModel = getChatbotConnection().model("ChatbotLead", chatbotLeadSchema);
  return ChatbotLeadModel;
};

module.exports = { getChatbotLeadModel };
