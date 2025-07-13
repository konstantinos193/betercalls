import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default function StandodaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <AdminSidebar />
      <main className="flex-1">{children}</main>
    </div>
  )
}
