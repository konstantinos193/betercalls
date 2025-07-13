export const dynamic = "force-dynamic"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { CallsTable } from "../calls-table"

export default async function AdminCallsPage() {
  const supabase = createSupabaseAdminClient()

  const { data: calls, error } = await supabase
    .from("calls")
    .select("*, experts(*)")
    .order("created_at", { ascending: false })

  if (error) {
    return <p className="text-red-400">Error fetching calls: {error.message}</p>
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Calls Management</h1>
      <p className="text-gray-400">View, search, and update the status of all calls posted on the platform.</p>
      <CallsTable calls={calls || []} />
    </div>
  )
}
