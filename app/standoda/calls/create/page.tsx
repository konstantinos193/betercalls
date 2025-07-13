export const dynamic = "force-dynamic"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { CreateCallForm } from "@/components/admin/create-call-form"

export default async function CreateCallPage() {
  const supabase = createSupabaseAdminClient()

  // Fetch experts for the dropdown
  const { data: experts, error: expertsError } = await supabase
    .from("experts")
    .select("id, name")
    .order("name")

  if (expertsError) {
    return <p className="text-red-400">Error fetching experts: {expertsError.message}</p>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Create New Call</h1>
        <p className="text-gray-400">Add a new betting call to the platform.</p>
      </div>
      <CreateCallForm experts={experts || []} />
    </div>
  )
} 