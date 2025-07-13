export const dynamic = "force-dynamic"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { UsersTable } from "@/components/admin/users-table"
import type { Database } from "@/types/supabase"

type User = Database["public"]["Tables"]["users"]["Row"]

export default async function AdminUsersPage() {
  const supabase = createSupabaseAdminClient()

  // Fetch all users from the users table
  const { data: users, error: usersError } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false })

  if (usersError) {
    return <p className="text-red-400">Error fetching users: {usersError.message}</p>
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">User Management</h1>
      <UsersTable users={users || []} />
    </div>
  )
}
