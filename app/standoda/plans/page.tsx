export const dynamic = "force-dynamic"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { PlansManagement } from "@/components/admin/plans-management"

export default async function PlansPage() {
  const supabase = createSupabaseAdminClient()
  
  const { data: plans, error } = await supabase
    .from("subscription_plans")
    .select("*")
    .order("id", { ascending: false })

  if (error) {
    console.error("Error fetching plans:", error)
    return <p className="text-red-400">Error fetching plans: {error.message}</p>
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Plans</h2>
      </div>
      <PlansManagement plans={plans || []} />
    </div>
  )
}
