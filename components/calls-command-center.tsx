"use client"

import * as React from "react"
import { GroupSidebar } from "@/components/group-sidebar"
import { LiveCallsFeed } from "@/components/live-calls-feed"
import { ContextualPanel } from "@/components/contextual-panel"
import type { Call } from "@/types/calls"

type CallsCommandCenterProps = {
  initialCalls: Call[]
}

export function CallsCommandCenter({ initialCalls }: CallsCommandCenterProps) {
  const [selectedCall, setSelectedCall] = React.useState<Call | null>(initialCalls.length > 0 ? initialCalls[0] : null)

  return (
    <div className="h-full grid grid-cols-12 gap-4 p-4">
      <div className="col-span-1 hidden lg:block">
        <GroupSidebar />
      </div>
      <div className="col-span-12 lg:col-span-6 xl:col-span-7">
        <LiveCallsFeed calls={initialCalls} onSelectCall={setSelectedCall} selectedCallId={selectedCall?.id} />
      </div>
      <div className="col-span-12 lg:col-span-5 xl:col-span-4">
        <ContextualPanel call={selectedCall} />
      </div>
    </div>
  )
}
