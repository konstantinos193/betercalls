import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Flame, Gem } from "lucide-react"

export type Pick = {
  id: string
  sport: "NBA" | "NFL" | "MLB" | "Soccer"
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
}

const statusStyles = {
  Upcoming: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Won: "bg-green-500/20 text-green-400 border-green-500/30",
  Lost: "bg-red-500/20 text-red-400 border-red-500/30",
  Push: "bg-slate-500/20 text-slate-400 border-slate-500/30",
}

const sportIcons = {
  NBA: <Flame className="h-5 w-5 text-orange-400" />,
  NFL: <Flame className="h-5 w-5 text-red-500" />,
  MLB: <Flame className="h-5 w-5 text-blue-400" />,
  Soccer: <Flame className="h-5 w-5 text-green-400" />,
}

export function PickCard({ pick }: PickCardProps) {
  return (
    <Card className="bg-slate-900 border-slate-800 text-slate-200 backdrop-blur-sm transition-all hover:border-slate-700 hover:shadow-lg hover:shadow-slate-900/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
          {sportIcons[pick.sport]}
          {pick.sport} - {pick.betType}
        </CardTitle>
        <Badge className={cn("border", statusStyles[pick.status])}>{pick.status}</Badge>
      </CardHeader>
      <CardContent className="py-4">
        <div className="text-lg font-bold">
          {pick.match.awayTeam} @ {pick.match.homeTeam}
        </div>
        <p className="text-xs text-slate-500">{pick.match.time}</p>
        <div className="mt-4 bg-slate-800/50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold tracking-wider text-slate-50">{pick.pick}</p>
          <p className="text-lg font-semibold text-cyan-400">{pick.odds}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-slate-400 pt-4 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <Gem className="h-4 w-4 text-purple-400" />
          <span>Confidence</span>
        </div>
        <span className="font-bold text-slate-200">{pick.units} Units</span>
      </CardFooter>
    </Card>
  )
}
