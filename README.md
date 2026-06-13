# ShopSense Agent

Conversational shopping agent for e-commerce — natural language product discovery powered by GPT-4o-mini and Qdrant vector search.

## Quick Start

### Prerequisites
- Docker, UV, pnpm
- OpenAI API key

### 1. Start Qdrant
```bash
docker compose up -d
```

### 2. Backend
```bash
cd backend
cp ../.env.example .env   # add OPENAI_API_KEY
uv sync
uv run python -m shopsense.ingest
uv run uvicorn shopsense.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend
```bash
cd frontend
cp ../.env.example .env   # VITE_API_URL=http://localhost:8000
pnpm install
pnpm dev
```

Open http://localhost:5173

## Demo Queries
- "I need something for a beach wedding, light and breezy, under ₹2000"
- "show me something in earthy tones" (follow-up)
- "something for a mehendi, I want to look traditional"
- "cotton kurta for daily office wear under ₹1200"

## Deploy (Railway)
- Backend: deploy `backend/` with start command `uv run uvicorn shopsense.main:app --host 0.0.0.0 --port $PORT`
- Frontend: deploy `frontend/` as static site, set `VITE_API_URL` to backend URL
