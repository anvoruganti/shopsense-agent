import { AgentPanel } from "@/components/AgentPanel"
import { SearchPanel } from "@/components/SearchPanel"

export default function App() {
  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr_auto]">
      <header className="bg-navy px-4 py-4 text-white sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">GOBIGAI</h1>
          <p className="text-sm text-sky">
            ShopSense Agent — conversational shopping that understands intent
          </p>
        </div>
      </header>

      <main className="grid min-h-0 grid-cols-1 md:grid-cols-2">
        <SearchPanel />
        <AgentPanel />
      </main>

      <footer className="border-t bg-slate-50 px-4 py-3 text-center text-xs text-slate-500 sm:text-sm">
        Any store gets this by adding one line of JavaScript
      </footer>
    </div>
  )
}
