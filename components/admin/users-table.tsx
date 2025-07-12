"use client"

import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { UserWithProfile } from "@/app/admin/users/page"
import { MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EditSubscriptionModal } from "./edit-subscription-modal"

const statusStyles: { [key: string]: string } = {
  active: "bg-green-500/20 text-green-400 border-green-500/30",
  inactive: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
}

const ITEMS_PER_PAGE = 10

export function UsersTable({ users }: { users: UserWithProfile[] }) {
  const [search, setSearch] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState<UserWithProfile | null>(null)

  const filteredUsers = React.useMemo(() => {
    return users.filter(
      (user) =>
        user.email?.toLowerCase().includes(search.toLowerCase()) ||
        user.profile?.full_name?.toLowerCase().includes(search.toLowerCase()),
    )
  }, [users, search])

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

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

  const handleEditClick = (user: UserWithProfile) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Input
            placeholder="Search by email or name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1) // Reset to first page on search
            }}
            className="max-w-sm bg-gray-900/80 border-gray-700"
          />
        </div>
        <div className="bg-black/30 border border-gray-800/50 rounded-xl">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800/50">
                <TableHead className="text-white">Email</TableHead>
                <TableHead className="text-white">Full Name</TableHead>
                <TableHead className="text-white">Subscription</TableHead>
                <TableHead className="text-white">Joined</TableHead>
                <TableHead className="text-right text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id} className="border-gray-800/50">
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>{user.profile?.full_name || "N/A"}</TableCell>
                  <TableCell>
                    <Badge
                      className={cn("border capitalize", statusStyles[user.profile?.subscription_status || "inactive"])}
                    >
                      {user.profile?.subscription_status || "inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700 text-white">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditClick(user)}>Edit Subscription</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400">Suspend User</DropdownMenuItem>
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
      <EditSubscriptionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} user={selectedUser} />
    </>
  )
}
