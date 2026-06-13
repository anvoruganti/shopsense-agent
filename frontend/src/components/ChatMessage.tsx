import { ProductScroll } from "@/components/ProductScroll"
import { TypingIndicator } from "@/components/TypingIndicator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { ChatMessage } from "@/types"

interface ChatMessageProps {
  message: ChatMessage
}

export function ChatMessageBubble({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  if (message.isTyping) {
    return (
      <div className="flex items-start gap-2">
        <Avatar className="h-7 w-7">
          <AvatarFallback className="bg-cobalt text-[10px] font-bold text-white">
            GB
          </AvatarFallback>
        </Avatar>
        <TypingIndicator />
      </div>
    )
  }

  return (
    <div className={cn("flex gap-2", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <Avatar className="h-7 w-7 shrink-0">
          <AvatarFallback className="bg-cobalt text-[10px] font-bold text-white">
            GB
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-[85%] space-y-2 rounded-2xl px-4 py-2.5 text-sm",
          isUser
            ? "rounded-bl-none bg-cobalt text-white"
            : "rounded-tl-none bg-slate-50 text-slate-900"
        )}
      >
        <p>{message.content}</p>
        {message.products && message.products.length > 0 && (
          <ProductScroll products={message.products} />
        )}
      </div>
    </div>
  )
}
