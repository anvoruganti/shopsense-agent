import { useEffect, useRef, useState } from "react"
import { Send } from "lucide-react"

import { ChatMessageBubble } from "@/components/ChatMessage"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChat } from "@/hooks/useChat"

export function ChatWidget() {
  const { messages, isLoading, sendMessage } = useChat()
  const [input, setInput] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return
    const query = input
    setInput("")
    await sendMessage(query)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      void handleSend()
    }
  }

  return (
    <Card className="flex h-full flex-col border-slate-200 shadow-sm">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base">ShopSense Agent</CardTitle>
        <Badge variant="secondary" className="text-[10px] font-normal">
          Powered by GOBIGAI
        </Badge>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 overflow-hidden pb-0">
        <ScrollArea className="h-[min(420px,50vh)] pr-3">
          <div className="space-y-4 pb-4">
            {messages.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Describe what you&apos;re looking for — occasion, fabric, budget, vibe.
              </p>
            )}
            {messages.map((message, index) => (
              <ChatMessageBubble key={index} message={message} />
            ))}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="gap-2 pt-4">
        <Input
          placeholder="Try: something flowy for a beach wedding under ₹2000"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <Button
          size="icon"
          className="shrink-0 bg-cobalt hover:bg-cobalt/90"
          onClick={() => void handleSend()}
          disabled={isLoading || !input.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
