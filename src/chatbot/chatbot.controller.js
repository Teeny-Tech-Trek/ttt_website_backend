// controllers/chatbot.controller.js
// RAG-only chatbot proxy controller (Node -> FastAPI RAG service).

const RAG_CHATBOT_API_URL = process.env.RAG_CHATBOT_API_URL || "http://127.0.0.1:8001/chat";
const RAG_TIMEOUT_MS = Number(process.env.RAG_TIMEOUT_MS || 30000);
const RAG_CHATBOT_HEALTH_URL = process.env.RAG_CHATBOT_HEALTH_URL || RAG_CHATBOT_API_URL.replace(/\/chat\/?$/, "/health");

async function consumeSSEToText(response) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let combinedText = "";
  let finalPayload = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() || "";

    for (const evt of events) {
      const line = evt
        .split("\n")
        .find((l) => l.startsWith("data:"));
      if (!line) continue;
      const payload = line.slice(5).trim();
      if (!payload) continue;

      try {
        const parsed = JSON.parse(payload);
        if (parsed.token) combinedText += parsed.token;
        if (parsed.done && parsed.final) {
          finalPayload = parsed.final;
          await reader.cancel();
          break;
        }
      } catch (_err) {
        // Ignore malformed SSE chunk and continue.
      }
    }

    if (finalPayload) break;
  }

  if (finalPayload && typeof finalPayload === "object") {
    return {
      ...finalPayload,
      message: (finalPayload.message || combinedText || "Information not available.").trim(),
    };
  }
  return {
    source: "rag",
    message: (combinedText || "Information not available.").trim(),
  };
}

const chatbotController = {
  intro: async (_req, res) => {
    res.json({
      message: "Hey there! I am Anisha, your AI assistant at Teeny Tech Trek. Ask me anything about our services, plans, support, or contact details.",
    });
  },

  health: async (_req, res) => {
    try {
      const response = await fetch(RAG_CHATBOT_HEALTH_URL, { method: "GET" });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        return res.status(502).json({ status: "degraded", rag: payload });
      }
      return res.json({ status: "ok", rag: payload });
    } catch (error) {
      return res.status(502).json({ status: "degraded", error: "RAG chatbot unreachable" });
    }
  },

  chat: async (req, res) => {
    try {
      const { userId, session_id, message, type, stream } = req.body || {};
      if (!message) return res.status(400).json({ error: "Message is required" });

      const payload = {
        message,
        session_id: session_id || userId || `web-${Date.now()}`,
        type: type === "button" ? "button" : "text",
      };

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), RAG_TIMEOUT_MS);
      const ragResponse = await fetch(RAG_CHATBOT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!ragResponse.ok) {
        const fallback = await ragResponse.text();
        console.error("RAG chatbot API error:", fallback);
        return res.status(502).json({ error: "RAG chatbot service unavailable" });
      }

      const contentType = ragResponse.headers.get("content-type") || "";
      const wantsStream = Boolean(stream);

      if (wantsStream && contentType.includes("text/event-stream")) {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.setHeader("X-Accel-Buffering", "no");

        const reader = ragResponse.body.getReader();
        const decoder = new TextDecoder();
        let sseBuffer = "";
        let finalReply = "";
        let tokenReply = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          res.write(chunk);

          sseBuffer += chunk;
          const events = sseBuffer.split("\n\n");
          sseBuffer = events.pop() || "";

          for (const evt of events) {
            const line = evt.split("\n").find((l) => l.startsWith("data:"));
            if (!line) continue;
            try {
              const parsed = JSON.parse(line.slice(5).trim());
              if (parsed.token) tokenReply += parsed.token;
              if (parsed.done && parsed.final && parsed.final.message) {
                finalReply = parsed.final.message;
                await reader.cancel();
                break;
              }
            } catch (_err) {
              // Ignore parse errors for incomplete fragments.
            }
          }

          if (finalReply) break;
        }

        if (!finalReply) {
          finalReply = (tokenReply || "Information not available.").trim();
          res.write(
            `data: ${JSON.stringify({ done: true, final: { source: "rag", message: finalReply, short_message: finalReply, full_message: finalReply, suggested_actions: [] } })}\n\n`,
          );
        }

        return res.end();
      }

      if (contentType.includes("text/event-stream")) {
        const finalData = await consumeSSEToText(ragResponse);
        const msg = finalData.message || "Information not available.";
        return res.json({
          reply: msg,
          message: msg,
          source: finalData.source || "rag",
          session_id: finalData.session_id || payload.session_id,
          options: finalData.options || null,
          buttons: finalData.buttons || [],
          suggested_actions: finalData.suggested_actions || [],
          short_message: finalData.short_message || msg,
          full_message: finalData.full_message || msg,
          scroll_to: finalData.scroll_to || null,
          open_login_modal: Boolean(finalData.open_login_modal),
          metadata: finalData.metadata || {},
        });
      }

      const data = await ragResponse.json();
      const msg = data.message || "Information not available.";
      return res.json({
        reply: msg,
        message: msg,
        source: data.source,
        session_id: data.session_id || payload.session_id,
        options: data.options || null,
        buttons: data.buttons || [],
        suggested_actions: data.suggested_actions || [],
        short_message: data.short_message || msg,
        full_message: data.full_message || msg,
        scroll_to: data.scroll_to || null,
        open_login_modal: Boolean(data.open_login_modal),
        metadata: data.metadata || {},
      });
    } catch (error) {
      console.error("Chat error:", error);
      return res.status(500).json({ error: "Oops, something went wrong on my end. Please try again." });
    }
  },
};

module.exports = chatbotController;

