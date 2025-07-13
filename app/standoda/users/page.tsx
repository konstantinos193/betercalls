export const dynamic = "force-dynamic"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { UsersTable } from "@/components/admin/users-table"
import type { User } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type UserWithProfile = User & { profile: Profile | null }

export default async function AdminUsersPage() {
  const supabase = createSupabaseAdminClient()

  // Fetch all users from Auth
  const {
    data: { users },
    error: usersError,
  } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000, // Adjust as needed
  })

  if (usersError) {
    return <p className="text-red-400">Error fetching users: {usersError.message}</p>
  }

  // Fetch all profiles
  const { data: profiles, error: profilesError } = await supabase.from("profiles").select("*")

  if (profilesError) {
    return <p className="text-red-400">Error fetching profiles: {profilesError.message}</p>
  }

  // Create a map of profiles for easy lookup
  const profilesMap = new Map(profiles.map((p) => [p.id, p]))

  // Merge user and profile data
  const usersWithProfiles: UserWithProfile[] = users.map((user) => ({
    ...user,
    profile: profilesMap.get(user.id) || null,
  }))

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">User Management</h1>
      <UsersTable users={usersWithProfiles} />
    </div>
  )
}
