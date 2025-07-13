"use client"

import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { MoreHorizontal, ChevronLeft, ChevronRight, Search } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { updateCallStatus } from "@/app/standoda/actions"
import type { Database } from "@/types/supabase"

type CallWithExpert = Database["public"]["Tables"]["calls"]["Row"] & {
  experts: Database["public"]["Tables"]["experts"]["Row"] | null
}

const statusStyles: { [key: string]: string } = {
  Upcoming: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Won: "bg-green-500/20 text-green-400 border-green-500/30",
  Lost: "bg-red-500/20 text-red-400 border-red-500/30",
  Push: "bg-slate-500/20 text-slate-400 border-slate-500/30",
}

const ITEMS_PER_PAGE = 15

export function CallsTable({ calls }: { calls: CallWithExpert[] }) {
  const [search, setSearch] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)

  const filteredCalls = React.useMemo(() => {
    return calls.filter(
      (call) =>
        call.match_home_team.toLowerCase().includes(search.toLowerCase()) ||
        call.match_away_team.toLowerCase().includes(search.toLowerCase()) ||
        call.pick.toLowerCase().includes(search.toLowerCase()) ||
        call.experts?.name?.toLowerCase().includes(search.toLowerCase()),
    )
  }, [calls, search])

  const totalPages = Math.ceil(filteredCalls.length / ITEMS_PER_PAGE)
  const paginatedCalls = filteredCalls.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search by team, pick, or expert..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setCurrentPage(1)
          }}
          className="max-w-sm bg-gray-900/80 border-gray-700 pl-10"
        />
      </div>
      <div className="bg-black/30 border border-gray-800/50 rounded-xl">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800/50">
              <TableHead className="text-white">Match</TableHead>
              <TableHead className="text-white">Pick</TableHead>
              <TableHead className="text-white">Expert</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-right text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCalls.map((call) => (
              <TableRow key={call.id} className="border-gray-800/50">
                <TableCell className="font-medium">{`${call.match_away_team} @ ${call.match_home_team}`}</TableCell>
                <TableCell>{call.pick}</TableCell>
                <TableCell>{call.experts?.name || "N/A"}</TableCell>
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <span className="text-sm text-gray-400">
          Page {currentPage} of {totalPages}
        </span>
        <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={currentPage === 1}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
