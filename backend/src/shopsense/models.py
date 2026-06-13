from pydantic import BaseModel


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    query: str
    history: list[Message] = []
    store_id: str = "demo"


class ProductResult(BaseModel):
    id: str
    name: str
    price: int
    currency: str = "INR"
    image_url: str
    product_url: str
    reason: str


class ChatResponse(BaseModel):
    message: str
    products: list[ProductResult]
