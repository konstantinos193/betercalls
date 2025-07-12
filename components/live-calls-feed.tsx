"use client"

import * as React from "react"
import { OfficialCallCard } from "@/components/official-call-card"
import type { Call } from "@/types/calls"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

type LiveCallsFeedProps = {
  calls: Call[]
  onSelectCall: (call: Call | null) => void
  selectedCallId?: string
}

const filterOptions: Array<Call["status"] | "All"> = ["All", "Upcoming", "Won", "Lost", "Push"]

export function LiveCallsFeed({ calls, onSelectCall, selectedCallId }: LiveCallsFeedProps) {
  const [statusFilter, setStatusFilter] = React.useState<Call["status"] | "All">("All")
  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredCalls = React.useMemo(() => {
    let filtered = calls

    // Apply status filter first
    if (statusFilter !== "All") {
      filtered = filtered.filter((call) => call.status === statusFilter)
    }

    // Apply search filter
    if (searchQuery.trim() !== "") {
      const lowercasedQuery = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (call) =>
          call.match.homeTeam.toLowerCase().includes(lowercasedQuery) ||
          call.match.awayTeam.toLowerCase().includes(lowercasedQuery),
      )
    }

    return filtered
  }, [calls, statusFilter, searchQuery])

  // Effect to handle when the selected call is filtered out
  React.useEffect(() => {
    // If a call is selected...
    if (selectedCallId) {
      // ...and it's not in the new filtered list...
      const isSelectedCallVisible = filteredCalls.some((call) => call.id === selectedCallId)
      if (!isSelectedCallVisible) {
        // ...select the first call of the new list, or null if the list is empty.
        onSelectCall(filteredCalls.length > 0 ? filteredCalls[0] : null)
      }
    } else if (filteredCalls.length > 0 && !selectedCallId) {
      // If no call is selected, but there are filtered calls, select the first one.
      onSelectCall(filteredCalls[0])
    }
  }, [filteredCalls, selectedCallId, onSelectCall])

  return (
    <div className="h-full flex flex-col">
      <div className="px-2 mb-4 space-y-4">
        <h2 className="text-2xl font-bold text-white">Live Calls Feed</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by team name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-black/30 border-gray-800/50 pl-10 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
        <div className="flex items-center gap-2 bg-black/30 p-1 rounded-lg">
          {filterOptions.map((option) => (
            <Button
              key={option}
              variant="ghost"
              size="sm"
              onClick={() => setStatusFilter(option)}
              className={cn(
                "flex-1 justify-center text-xs h-8 transition-colors",
                statusFilter === option
                  ? "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300"
                  : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200",
              )}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
        {filteredCalls.length > 0 ? (
          filteredCalls.map((call) => (
            <OfficialCallCard
              key={call.id}
              call={call}
              onSelect={() => onSelectCall(call)}
              isSelected={selectedCallId === call.id}
            />
          ))
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">No calls match your filters.</div>
        )}
      </div>
    </div>
  )
}
