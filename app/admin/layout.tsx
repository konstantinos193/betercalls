import type React from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-[#0D0D0D] text-gray-200 font-sans min-h-screen">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-4 sm:p-8">{children}</main>
      </div>
    </div>
  )
}
