export interface Message {
  role: "user" | "assistant"
  content: string
}

export interface ProductResult {
  id: string
  name: string
  price: number
  currency: string
  image_url: string
  product_url: string
  reason: string
}

export interface ChatRequest {
  query: string
  history: Message[]
  store_id: string
}

export interface ChatResponse {
  message: string
  products: ProductResult[]
}

export interface ChatMessage extends Message {
  products?: ProductResult[]
  isTyping?: boolean
}
