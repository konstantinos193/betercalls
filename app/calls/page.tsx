import { CallsCommandCenter } from "@/components/calls-command-center"
import { SiteHeader } from "@/components/site-header"
import type { Call } from "@/types/calls"
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

function formatDistanceToNow(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000)
  const minutes = Math.round(seconds / 60)
  const hours = Math.round(minutes / 60)
  const days = Math.round(hours / 24)

  if (seconds < 60) return `${seconds}s ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

export default async function CallsPage() {
  const session = await auth()
  if (!session?.user) {
    redirect("/login")
  }
  // TODO: Fetch calls data from Supabase as before, using service role key if needed
  // const calls: Call[] = ...
  // For now, render the UI (replace with real data fetching logic)
  return (
    <div className="bg-[#0D0D0D] text-gray-200 font-sans h-screen flex flex-col overflow-hidden">
      <SiteHeader />
      <main className="flex-grow">
        <CallsCommandCenter initialCalls={[]} />
      </main>
    </div>
  )
}
