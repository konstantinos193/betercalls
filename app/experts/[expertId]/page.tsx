"use client"

import { SiteHeader } from "@/components/site-header"
import { FooterV2 } from "@/components/footer-v2"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { OfficialCallCard } from "@/components/official-call-card"
import type { Call } from "@/types/calls"
import { User, Users } from "lucide-react"
import { StatCard } from "@/components/expert-stat-card"
import { FollowButton } from "@/components/follow-button"

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

export default async function ExpertProfilePage({ params }: { params: { expertId: string } }) {
  const supabase = createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: expert, error: expertError } = await supabase
    .from("experts")
    .select("*")
    .eq("id", params.expertId)
    .single()

  if (expertError || !expert) {
    notFound()
  }

  let isFollowing = false
  if (user) {
    const { data: followData } = await supabase
      .from("expert_followers")
      .select("expert_id")
      .eq("user_id", user.id)
      .eq("expert_id", expert.id)
      .single()
    isFollowing = !!followData
  }

  const { data: callsData, error: callsError } = await supabase
    .from("calls")
    .select("*, experts(*)")
    .eq("expert_id", params.expertId)
    .order("created_at", { ascending: false })

  const calls: Call[] = (callsData || []).map((call: any) => ({
    id: call.id,
    expert: {
      id: call.experts.id,
      name: call.experts.name,
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
    discussion: [], // Discussion data not needed for this card view
  }))

  return (
    <div className="bg-[#0D0D0D] text-gray-200 font-sans min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <header className="flex flex-col sm:flex-row items-center gap-6 bg-black/30 p-8 rounded-xl border border-gray-800/50">
            <Avatar className="h-32 w-32 border-4 border-cyan-400/50 flex-shrink-0">
              <AvatarImage src={expert.avatar_url || ""} alt={expert.name} />
              <AvatarFallback className="bg-gray-700">
                <User className="h-16 w-16 text-gray-400" />
              </AvatarFallback>
            </Avatar>
            <div className="w-full text-center sm:text-left">
              <h1 className="text-4xl font-bold text-white">{expert.name}</h1>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 text-gray-400">
                <Users className="h-4 w-4" />
                <span>{expert.follower_count || 0} Followers</span>
              </div>
              <p className="mt-2 text-gray-400">{expert.bio || "No bio available."}</p>
              <div className="mt-4">
                {user && <FollowButton expertId={expert.id} initialIsFollowing={isFollowing} />}
              </div>
            </div>
          </header>

          <section className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard title="Win Rate" value={`${expert.win_rate?.toFixed(2) || "0.00"}%`} />
            <StatCard
              title="Net Units"
              value={`${expert.total_units?.toFixed(2) || "0.00"}`}
              isPositive={expert.total_units && expert.total_units > 0}
              isNegative={expert.total_units && expert.total_units < 0}
            />
            <StatCard
              title="ROI"
              value={`${expert.roi?.toFixed(2) || "0.00"}%`}
              isPositive={expert.roi && expert.roi > 0}
              isNegative={expert.roi && expert.roi < 0}
            />
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Recent Calls</h2>
            <div className="space-y-4">
              {calls.length > 0 ? (
                calls.map((call) => (
                  <OfficialCallCard key={call.id} call={call} onSelect={() => {}} isSelected={false} />
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">This expert hasn't made any calls yet.</div>
              )}
            </div>
          </section>
        </div>
      </main>
      <FooterV2 />
    </div>
  )
}
