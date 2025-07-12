import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { ExpertsManagement } from "@/components/admin/experts-management"

export default async function AdminExpertsPage() {
  const supabase = createSupabaseAdminClient()

  const { data: experts, error } = await supabase
    .from("experts")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return <p className="text-red-400">Error fetching experts: {error.message}</p>
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Expert Management</h1>
      <ExpertsManagement experts={experts || []} />
    </div>
  )
} 