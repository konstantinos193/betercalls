import { cn } from "@/lib/utils"

export type Pick = {
  id: string
  sport: "Football" | "NBA" | "NFL" | "MLB" | "Soccer"
  match: {
    homeTeam: string
    awayTeam: string
    time: string
  }
  betType: string
  pick: string
  odds: string
  units: number
  status: "Upcoming" | "Won" | "Lost" | "Push"
}

type PickCardProps = {
  pick: Pick
  className?: string
}

const sportColors = {
  Football: "border-green-500",
  NBA: "border-orange-400",
  NFL: "border-red-500",
  MLB: "border-blue-400",
  Soccer: "border-green-400",
}

export function PickCardV2({ pick, className }: PickCardProps) {
  return (
    <div
      className={cn(
        "bg-gray-900/50 backdrop-blur-sm border-l-4 p-4 rounded-lg shadow-lg transition-all duration-300 hover:bg-gray-900/80 hover:shadow-cyan-500/10",
        sportColors[pick.sport],
        className,
      )}
    >
      <div className="flex justify-between items-center">
        <div className="text-sm font-bold text-white">
          {pick.sport} &middot; {pick.betType}
        </div>
        <div className="text-xs text-gray-400">{pick.match.time}</div>
      </div>
      <div className="mt-2">
        <p className="text-lg text-gray-300">
          {pick.match.awayTeam} @ {pick.match.homeTeam}
        </p>
      </div>
      <div className="mt-4 bg-black/30 p-3 rounded-md text-center">
        <p className="text-xl font-mono font-bold text-cyan-400">{pick.pick}</p>
        <p className="text-md font-mono text-white">{pick.odds}</p>
      </div>
      <div className="mt-3 text-right text-sm text-gray-400">
        <span className="font-bold text-white">{pick.units}</span> Units
      </div>
    </div>
  )
}
