export const dynamic = "force-dynamic"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { CategoriesManagement } from "@/components/admin/categories-management"

export default async function AdminCategoriesPage() {
  const supabase = createSupabaseAdminClient()
  const { data: categories, error } = await supabase.from("categories").select("*").order("name")

  if (error) {
    return <p className="text-red-400">Error fetching categories: {error.message}</p>
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Categories</h1>
      <p className="text-gray-400">Create and manage the sports categories for calls.</p>
      <CategoriesManagement categories={categories || []} />
    </div>
  )
}
