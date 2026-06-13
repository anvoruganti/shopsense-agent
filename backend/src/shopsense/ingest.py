import asyncio
import json
import logging
from pathlib import Path

from openai import AsyncOpenAI
from qdrant_client import QdrantClient

from shopsense.config import settings
from shopsense.store import QdrantStore

logger = logging.getLogger(__name__)

DATA_PATH = Path(__file__).resolve().parents[2] / "data" / "products.json"


async def ingest() -> None:
    logging.basicConfig(level=logging.INFO)
    products = json.loads(DATA_PATH.read_text(encoding="utf-8"))

    openai_client = AsyncOpenAI(api_key=settings.openai_api_key)
    qdrant_client = QdrantClient(host=settings.qdrant_host, port=settings.qdrant_port)
    store = QdrantStore(qdrant_client, settings)
    store.init_collection()

    texts = [
        f"{p['name']}. {p['description']}. Category: {p['category']}"
        for p in products
    ]

    logger.info("Embedding %d products...", len(texts))
    response = await openai_client.embeddings.create(
        model=settings.embedding_model,
        input=texts,
    )
    vectors = [item.embedding for item in response.data]

    logger.info("Upserting to Qdrant...")
    store.upsert_products(products, vectors)
    logger.info("Ingestion complete: %d products", len(products))

    await openai_client.close()
    qdrant_client.close()


def main() -> None:
    asyncio.run(ingest())


if __name__ == "__main__":
    main()
