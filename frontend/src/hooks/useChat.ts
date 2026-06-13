import { useCallback, useState } from "react"

import { chatWithAgent } from "@/lib/api"
import type { ChatMessage, Message } from "@/types"

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = useCallback(async (query: string) => {
    const trimmed = query.trim()
    if (!trimmed || isLoading) return

    const userMessage: ChatMessage = { role: "user", content: trimmed }
    const typingMessage: ChatMessage = {
      role: "assistant",
      content: "",
      isTyping: true,
    }

    setMessages((prev) => [...prev, userMessage, typingMessage])
    setIsLoading(true)

    const history: Message[] = messages
      .filter((m) => !m.isTyping)
      .map(({ role, content }) => ({ role, content }))

    try {
      const response = await chatWithAgent({
        query: trimmed,
        history,
        store_id: "demo",
      })

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.message,
        products: response.products,
      }

      setMessages((prev) => [...prev.slice(0, -1), assistantMessage])
    } catch {
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "Sorry, something went wrong. Please try again.",
      }
      setMessages((prev) => [...prev.slice(0, -1), errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, messages])

  return { messages, isLoading, sendMessage }
}
