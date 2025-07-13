export const dynamic = "force-dynamic"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { CallsTable } from "../calls-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default async function AdminCallsPage() {
  const supabase = createSupabaseAdminClient()

  // First try to fetch with join, if it fails, fetch without join
  let { data: calls, error } = await supabase
    .from("calls")
    .select("*, experts(*)")
    .order("created_at", { ascending: false })

  if (error && error.message.includes("relationship")) {
    // If join fails, fetch calls without experts
    const { data: callsOnly, error: callsError } = await supabase
      .from("calls")
      .select("*")
      .order("created_at", { ascending: false })
    
    if (callsError) {
      return <p className="text-red-400">Error fetching calls: {callsError.message}</p>
    }
    
    // Add empty experts object to match expected type
    calls = callsOnly?.map(call => ({ ...call, experts: null }))
  } else if (error) {
    return <p className="text-red-400">Error fetching calls: {error.message}</p>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Calls Management</h1>
          <p className="text-gray-400">View, search, and update the status of all calls posted on the platform.</p>
        </div>
        <Link href="/standoda/calls/create">
          <Button className="bg-cyan-400 text-black font-bold hover:bg-cyan-300">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Call
          </Button>
        </Link>
      </div>
      <CallsTable calls={calls || []} />
    </div>
  )
}
