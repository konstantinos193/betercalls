"use client"

import { cn } from "@/lib/utils"
import { Crown, User } from "lucide-react"
import type { Call } from "@/types/calls"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

type OfficialCallCardProps = {
  call: Call
  onSelect: () => void
  isSelected: boolean
}

const sportColors = {
  Football: "border-red-500/50",
}

export function OfficialCallCard({ call, onSelect, isSelected }: OfficialCallCardProps) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        "bg-black/30 border-t-4 cursor-pointer rounded-xl p-4 transition-all duration-200",
        "hover:bg-gray-900/50",
        sportColors[call.sport],
        isSelected ? "bg-gray-900/80 ring-2 ring-cyan-500/50" : "border-gray-800/50",
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <Link
            href={`/experts/${call.expert.id}`}
            className="flex items-center gap-3 group"
            onClick={(e) => e.stopPropagation()} // Prevent card selection when clicking link
          >
            <Avatar className="h-10 w-10 border-2 border-transparent group-hover:border-cyan-400/50 transition-colors">
              <AvatarImage src={call.expert.avatarUrl || ""} alt={call.expert.name} />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-cyan-400 flex items-center gap-1.5 group-hover:underline">
                <Crown className="h-4 w-4 text-yellow-400" />
                {call.expert.name}
              </p>
              <p className="text-xs text-gray-500">{call.timestamp}</p>
            </div>
          </Link>
          <div className="mt-3">
            <p className="text-lg font-semibold text-white">
              {call.match.awayTeam} @ {call.match.homeTeam}
            </p>
            <p className="text-sm text-gray-400">{call.match.time}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-mono font-bold text-white">{call.pick}</p>
          <p className="text-xl font-mono text-cyan-400">{call.odds}</p>
          <p className="text-sm text-gray-400 mt-2">
            <span className="font-bold text-white">{call.units}</span> Units
          </p>
        </div>
      </div>
    </div>
  )
}
