"use client"
import * as React from "react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Shield } from "lucide-react"

const groups = [{ id: "football", name: "Football Calls", icon: Shield, color: "text-red-500" }]

export function GroupSidebar() {
  const [activeGroup, setActiveGroup] = React.useState("football")

  return (
    <aside className="h-full bg-black/30 border border-gray-800/50 rounded-xl p-2 flex flex-col items-center gap-2">
      <TooltipProvider delayDuration={0}>
        {groups.map((group) => (
          <Tooltip key={group.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => setActiveGroup(group.id)}
                className={cn(
                  "w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-200 relative",
                  activeGroup === group.id ? "bg-cyan-500/10" : "hover:bg-gray-800/50",
                )}
              >
                <group.icon className={cn("h-6 w-6", group.color)} />
                {activeGroup === group.id && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-cyan-400 rounded-r-full" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-gray-900 border-gray-700 text-white">
              <p>{group.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </aside>
  )
}
