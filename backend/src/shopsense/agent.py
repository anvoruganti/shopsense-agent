import json
import logging
from typing import Any

from openai import AsyncOpenAI

from shopsense.config import Settings
from shopsense.models import ChatRequest, ChatResponse, Message, ProductResult
from shopsense.store import QdrantStore

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are ShopSense, a helpful Indian fashion shopping assistant for Jaipur Kurti.
You understand occasion, fabric, feel, colour palette, silhouette, and budget constraints.
Respond naturally and warmly. When recommending products, explain why each fits the shopper's needs.
Keep responses concise — 2-3 sentences for the main message."""

PRICE_EXTRACTION_PROMPT = """Extract the maximum price budget from the user's query.
Return JSON: {"max_price": <integer or null>}
If no budget mentioned, return {"max_price": null}
Prices are in INR (₹). "under 2000" means max_price: 2000."""

REASON_GENERATION_PROMPT = """Given the conversation and retrieved products, generate:
1. A friendly assistant message (2-3 sentences)
2. A short reason (max 15 words) for each product explaining why it matches

Return JSON:
{
  "message": "string",
  "reasons": {"product_id": "reason string", ...}
}

Only include reasons for products you mention or recommend."""


class ShopSenseAgent:
    def __init__(
        self,
        openai_client: AsyncOpenAI,
        store: QdrantStore,
        settings: Settings,
    ) -> None:
        self._openai = openai_client
        self._store = store
        self._settings = settings

    async def chat(self, request: ChatRequest) -> ChatResponse:
        max_price = await self._extract_price_ceiling(request.query)
        query_vector = await self._embed_query(request.query)
        hits = self._store.search(
            query_vector=query_vector,
            top_k=self._settings.top_k,
            price_filter=max_price,
        )
        products = self._hits_to_products(hits)
        message, reasons = await self._generate_response(
            request.query, request.history, products
        )
        results = [
            ProductResult(
                id=p["id"],
                name=p["name"],
                price=p["price"],
                currency=p.get("currency", "INR"),
                image_url=p["image_url"],
                product_url=p["product_url"],
                reason=reasons.get(p["id"], "Matches your style preferences"),
            )
            for p in products
        ]
        return ChatResponse(message=message, products=results)

    async def _extract_price_ceiling(self, query: str) -> int | None:
        try:
            response = await self._openai.chat.completions.create(
                model=self._settings.chat_model,
                messages=[
                    {"role": "system", "content": PRICE_EXTRACTION_PROMPT},
                    {"role": "user", "content": query},
                ],
                response_format={"type": "json_object"},
                temperature=0,
            )
            content = response.choices[0].message.content or "{}"
            data = json.loads(content)
            max_price = data.get("max_price")
            return int(max_price) if max_price is not None else None
        except (json.JSONDecodeError, ValueError, TypeError) as exc:
            logger.warning("Price extraction failed: %s", exc)
            return None

    async def _embed_query(self, query: str) -> list[float]:
        response = await self._openai.embeddings.create(
            model=self._settings.embedding_model,
            input=query,
        )
        return response.data[0].embedding

    def _hits_to_products(self, hits: list[Any]) -> list[dict[str, Any]]:
        return [hit.payload for hit in hits if hit.payload]

    async def _generate_response(
        self,
        query: str,
        history: list[Message],
        products: list[dict[str, Any]],
    ) -> tuple[str, dict[str, str]]:
        product_context = json.dumps(
            [
                {
                    "id": p["id"],
                    "name": p["name"],
                    "price": p["price"],
                    "category": p.get("category", ""),
                    "description": p.get("description", ""),
                }
                for p in products
            ],
            indent=2,
        )
        messages: list[dict[str, str]] = [
            {"role": "system", "content": SYSTEM_PROMPT},
            *[{"role": m.role, "content": m.content} for m in history],
            {
                "role": "user",
                "content": (
                    f"Query: {query}\n\nRetrieved products:\n{product_context}\n\n"
                    f"{REASON_GENERATION_PROMPT}"
                ),
            },
        ]
        response = await self._openai.chat.completions.create(
            model=self._settings.chat_model,
            messages=messages,
            response_format={"type": "json_object"},
            temperature=0.7,
        )
        content = response.choices[0].message.content or "{}"
        data = json.loads(content)
        message = data.get("message", "Here are some picks for you!")
        reasons = data.get("reasons", {})
        return message, reasons
