from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    openai_api_key: str
    qdrant_host: str = "localhost"
    qdrant_port: int = 6333
    collection_name: str = "shopsense_products"
    embedding_model: str = "text-embedding-3-small"
    chat_model: str = "gpt-4o-mini"
    embedding_dim: int = 1536
    top_k: int = 5

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
