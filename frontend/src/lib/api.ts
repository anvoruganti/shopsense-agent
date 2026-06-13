import type { ChatRequest, ChatResponse } from "@/types"

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000"

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

export async function chatWithAgent(request: ChatRequest): Promise<ChatResponse> {
  const response = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new ApiError(text || `Request failed with status ${response.status}`, response.status)
  }

  return response.json() as Promise<ChatResponse>
}
