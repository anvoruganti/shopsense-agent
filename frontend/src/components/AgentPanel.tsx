import { ChatWidget } from "@/components/ChatWidget"
import { Badge } from "@/components/ui/badge"

export function AgentPanel() {
  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <h2 className="text-sm font-medium text-slate-700">ShopSense Agent</h2>
        <Badge variant="success">✅</Badge>
      </div>
      <div className="min-h-0 flex-1 p-4">
        <ChatWidget />
      </div>
    </div>
  )
}
