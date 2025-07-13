export const dynamic = "force-dynamic"
import { PostCallForm } from "@/components/admin/post-call-form"
import { RecentCallsTable } from "@/components/admin/recent-calls-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { Megaphone, Target, Users } from "lucide-react"
import { auth } from "@/app/api/auth/[...nextauth]"
import { redirect } from "next/navigation"

export default async function AdminDashboard() {
  const session = await auth()
  if (!session?.user) {
    redirect("/login")
  }
  const supabase = createSupabaseAdminClient()
  const { data: experts } = await supabase.from("experts").select("*")

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-black/30 border-gray-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Calls</CardTitle>
            <Megaphone className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">1,234</div>
          </CardContent>
        </Card>
        <Card className="bg-black/30 border-gray-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Win Rate</CardTitle>
            <Target className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">68.2%</div>
          </CardContent>
        </Card>
        <Card className="bg-black/30 border-gray-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Subscribers</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">573</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-white mb-4">Post a New Call</h2>
          <PostCallForm experts={experts || []} />
        </div>
        <div className="lg:col-span-3">
          <h2 className="text-2xl font-bold text-white mb-4">Recent Calls</h2>
          <RecentCallsTable />
        </div>
      </div>
    </div>
  )
}
