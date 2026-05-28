# ttt_website_backend

## Independent Service Integration

This Express backend is deployed independently and integrates with an independent RAG chatbot service.

Topology:

1. `ttt_website_frontend` -> calls this backend at `/api/chatbot/chat`
2. `ttt_website_backend` -> proxies chatbot requests to FastAPI RAG service
3. `ttt_website_chatbot` -> handles cache/flow/structured/RAG pipeline

Required backend env:

```env
CORS_ORIGINS=https://www.teenytechtrek.com,http://localhost:5173,http://localhost:4173,http://localhost:3000
RAG_CHATBOT_API_URL=http://127.0.0.1:8001/chat
RAG_CHATBOT_HEALTH_URL=http://127.0.0.1:8001/health
RAG_TIMEOUT_MS=30000
```

Run backend:

```bash
npm install
npm run dev
```
