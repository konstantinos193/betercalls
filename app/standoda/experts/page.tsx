import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { ExpertsManagement } from "@/components/admin/experts-management"

export default async function ExpertsPage() {
  const supabase = createSupabaseAdminClient()
  
  const { data: experts } = await supabase
    .from("experts")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Experts</h2>
      </div>
      <ExpertsManagement experts={experts || []} />
    </div>
  )
} 