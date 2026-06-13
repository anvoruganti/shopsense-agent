import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from openai import AsyncOpenAI
from qdrant_client import QdrantClient

from shopsense.agent import ShopSenseAgent
from shopsense.config import settings
from shopsense.models import ChatRequest, ChatResponse
from shopsense.store import QdrantStore

logger = logging.getLogger(__name__)

_agent: ShopSenseAgent | None = None


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    global _agent
    cfg = settings
    openai_client = AsyncOpenAI(api_key=cfg.openai_api_key)
    qdrant_client = QdrantClient(host=cfg.qdrant_host, port=cfg.qdrant_port)
    store = QdrantStore(qdrant_client, cfg)
    store.init_collection()
    _agent = ShopSenseAgent(openai_client, store, cfg)
    logger.info("ShopSense Agent started")
    yield
    await openai_client.close()
    qdrant_client.close()
    _agent = None


app = FastAPI(title="ShopSense Agent", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_agent() -> ShopSenseAgent:
    if _agent is None:
        raise RuntimeError("Agent not initialized")
    return _agent


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    agent: ShopSenseAgent = Depends(get_agent),
) -> ChatResponse:
    return await agent.chat(request)
