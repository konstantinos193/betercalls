import { CallsCommandCenter } from "@/components/calls-command-center"
import { SiteHeader } from "@/components/site-header"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { Call } from "@/types/calls"

// Helper function to format time difference
function formatDistanceToNow(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000)
  const minutes = Math.round(seconds / 60)
  const hours = Math.round(minutes / 60)
  const days = Math.round(hours / 24)

  if (seconds < 60) return `${seconds}s ago`
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

export default async function CallsPage() {
  const supabase = createSupabaseServerClient()
  // Fetch calls and join discussions and the author's profile for each discussion
  const { data, error } = await supabase
    .from("calls")
    .select(
      `
      *,
      experts (*),
      discussions (
        id,
        content,
        created_at,
        profiles (
          id,
          full_name,
          avatar_url
        )
      )
    `,
    )
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching calls:", error)
    return (
      <div className="bg-[#0D0D0D] text-gray-200 font-sans h-screen flex flex-col overflow-hidden">
        <SiteHeader />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-red-400">Could not load calls. Please try again later.</p>
        </main>
      </div>
    )
  }

  const calls: Call[] = (data || [])
    .filter((call) => call.experts) // Filter out calls with no expert
    .map((call: any) => ({
      id: call.id,
      expert: {
        id: call.experts.id,
        name: call.experts.name || "Anonymous Expert",
        avatarUrl: call.experts.avatar_url,
      },
      timestamp: formatDistanceToNow(call.created_at),
      sport: "Football",
      match: {
        homeTeam: call.match_home_team,
        awayTeam: call.match_away_team,
        time: new Date(call.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      },
      betType: call.bet_type,
      pick: call.pick,
      odds: call.odds,
      units: call.units,
      status: call.status,
      analysis: call.analysis || "No analysis provided.",
      discussion: (call.discussions || [])
        .map((d: any) => ({
          id: d.id,
          content: d.content,
          created_at: d.created_at,
          author: {
            id: d.profiles.id,
            name: d.profiles.full_name || "Anonymous",
            avatarUrl: d.profiles.avatar_url,
          },
        }))
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()),
    }))

  return (
    <div className="bg-[#0D0D0D] text-gray-200 font-sans h-screen flex flex-col overflow-hidden">
      <SiteHeader />
      <main className="flex-grow">
        <CallsCommandCenter initialCalls={calls} />
      </main>
    </div>
  )
}
