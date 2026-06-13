import { useState } from "react"
import { Frown } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SearchPanel() {
  const [query, setQuery] = useState("")
  const [searched, setSearched] = useState(false)

  const handleSearch = () => {
    if (!query.trim()) return
    setSearched(true)
  }

  return (
    <div className="flex h-full flex-col bg-slate-100/80 opacity-90">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <h2 className="text-sm font-medium text-slate-500">Traditional Search</h2>
        <Badge variant="destructive">❌</Badge>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pointer-events-auto bg-slate-50 text-slate-500"
          />
          <Button
            variant="secondary"
            onClick={handleSearch}
            className="pointer-events-auto cursor-default bg-slate-300 text-slate-500 hover:bg-slate-300"
          >
            Search
          </Button>
        </div>
        {searched && (
          <div className="flex flex-col items-center justify-center gap-2 pt-12 text-slate-400">
            <Frown className="h-10 w-10" />
            <p className="text-sm">0 results found for &quot;{query}&quot;</p>
            <p className="text-xs">Try exact keywords like &quot;red kurta size M&quot;</p>
          </div>
        )}
      </div>
    </div>
  )
}
