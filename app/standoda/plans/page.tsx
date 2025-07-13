export const dynamic = "force-dynamic"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { PlansManagement } from "@/components/admin/plans-management"

export default async function AdminPlansPage() {
  const supabase = createSupabaseAdminClient()
  const { data: plans, error } = await supabase.from("subscription_plans").select("*").order("price")

  if (error) {
    return <p className="text-red-400">Error fetching plans: {error.message}</p>
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Subscription Plans</h1>
      <p className="text-gray-400">Create, edit, and manage the subscription plans offered to users.</p>
      <PlansManagement plans={plans || []} />
    </div>
  )
}
