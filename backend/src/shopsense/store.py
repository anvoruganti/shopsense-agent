from typing import Any

from qdrant_client import QdrantClient
from qdrant_client.http.models import (
    Distance,
    FieldCondition,
    Filter,
    PointStruct,
    Range,
    VectorParams,
)

from shopsense.config import Settings


class QdrantStore:
    def __init__(self, client: QdrantClient, settings: Settings) -> None:
        self._client = client
        self._settings = settings

    def init_collection(self) -> None:
        collections = self._client.get_collections().collections
        names = {c.name for c in collections}
        if self._settings.collection_name not in names:
            self._client.create_collection(
                collection_name=self._settings.collection_name,
                vectors_config=VectorParams(
                    size=self._settings.embedding_dim,
                    distance=Distance.COSINE,
                ),
            )

    def upsert_products(
        self,
        products: list[dict[str, Any]],
        vectors: list[list[float]],
    ) -> None:
        points = [
            PointStruct(
                id=int(product["id"]),
                vector=vector,
                payload=product,
            )
            for product, vector in zip(products, vectors, strict=True)
        ]
        self._client.upsert(
            collection_name=self._settings.collection_name,
            points=points,
        )

    def search(
        self,
        query_vector: list[float],
        top_k: int,
        price_filter: int | None = None,
    ) -> list[Any]:
        query_filter: Filter | None = None
        if price_filter is not None:
            query_filter = Filter(
                must=[
                    FieldCondition(
                        key="price",
                        range=Range(lte=price_filter),
                    )
                ]
            )

        results = self._client.search(
            collection_name=self._settings.collection_name,
            query_vector=query_vector,
            limit=top_k,
            query_filter=query_filter,
        )
        return list(results)
