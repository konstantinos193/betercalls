import { PostCallForm } from "@/components/admin/post-call-form"
import { RecentCallsTable } from "@/components/admin/recent-calls-table"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"

export default async function StandodaPage() {
  const supabase = createSupabaseAdminClient()
  
  const { data: calls } = await supabase
    .from("calls")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10)

  const { data: experts } = await supabase
    .from("experts")
    .select("*")
    .order("name", { ascending: true })

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <RecentCallsTable calls={calls || []} />
        </div>
        <div className="col-span-3">
          <PostCallForm experts={experts || []} />
        </div>
      </div>
    </div>
  )
}
