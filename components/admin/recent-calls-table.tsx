import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { updateCallStatus } from "@/app/admin/actions"

const statusStyles = {
  Upcoming: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Won: "bg-green-500/20 text-green-400 border-green-500/30",
  Lost: "bg-red-500/20 text-red-400 border-red-500/30",
  Push: "bg-slate-500/20 text-slate-400 border-slate-500/30",
}

export async function RecentCallsTable() {
  const supabase = createSupabaseServerClient()
  const { data: calls, error } = await supabase
    .from("calls")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10)

  if (error) {
    return <p className="text-red-400">Error fetching calls: {error.message}</p>
  }

  return (
    <div className="bg-black/30 border border-gray-800/50 rounded-xl">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-800/50">
            <TableHead className="text-white">Match</TableHead>
            <TableHead className="text-white">Pick</TableHead>
            <TableHead className="text-white">Status</TableHead>
            <TableHead className="text-right text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {calls.map((call) => (
            <TableRow key={call.id} className="border-gray-800/50">
              <TableCell className="font-medium">{`${call.match_away_team} @ ${call.match_home_team}`}</TableCell>
              <TableCell>{call.pick}</TableCell>
              <TableCell>
                <Badge className={cn("border", statusStyles[call.status])}>{call.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700 text-white">
                    <form action={updateCallStatus.bind(null, call.id, "Won")}>
                      <button type="submit" className="w-full text-left">
                        <DropdownMenuItem>Mark as Won</DropdownMenuItem>
                      </button>
                    </form>
                    <form action={updateCallStatus.bind(null, call.id, "Lost")}>
                      <button type="submit" className="w-full text-left">
                        <DropdownMenuItem>Mark as Lost</DropdownMenuItem>
                      </button>
                    </form>
                    <form action={updateCallStatus.bind(null, call.id, "Push")}>
                      <button type="submit" className="w-full text-left">
                        <DropdownMenuItem>Mark as Push</DropdownMenuItem>
                      </button>
                    </form>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
