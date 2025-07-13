import { SiteHeader } from "@/components/site-header"
import { FooterV2 } from "@/components/footer-v2"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { StatCard } from "@/components/expert-stat-card"
import { FollowButton } from "@/components/follow-button"
import { getServerSession } from "next-auth/next"
import { createClient } from "@supabase/supabase-js"

export const dynamic = 'force-dynamic'

export default async function ExpertPage({ params }: { params: { expertId: string } }) {
  const session = await getServerSession()
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Fetch expert data
  const { data: expert } = await supabase
    .from("experts")
    .select("*")
    .eq("id", params.expertId)
    .single()

  if (!expert) {
    return (
      <div className="bg-[#0D0D0D] text-gray-200 font-sans min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-grow container mx-auto py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Expert Not Found</h1>
            <p className="text-gray-400 mb-8">The expert you're looking for doesn't exist.</p>
            <Button asChild className="bg-cyan-400 text-black font-bold hover:bg-cyan-300">
              <Link href="/experts">Back to Experts</Link>
            </Button>
          </div>
        </main>
        <FooterV2 />
      </div>
    )
  }

  return (
    <div className="bg-[#0D0D0D] text-gray-200 font-sans min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Expert Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">{expert.name}</h1>
              <p className="text-gray-400 mt-2">{expert.description}</p>
            </div>
            <FollowButton expertId={expert.id} />
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard title="Win Rate" value="68%" trend="+5%" />
            <StatCard title="Total Picks" value="247" trend="+12" />
            <StatCard title="ROI" value="+23.4%" trend="+2.1%" />
          </div>

          {/* Recent Calls */}
          <Card className="bg-black/30 border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">Recent Calls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-900/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-white">Chiefs -2.5</h4>
                    <p className="text-sm text-gray-400">vs 49ers • 2 hours ago</p>
                  </div>
                  <Badge className="bg-green-500 text-white">Won</Badge>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-900/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-white">Eagles +150</h4>
                    <p className="text-sm text-gray-400">vs Cowboys • 1 day ago</p>
                  </div>
                  <Badge className="bg-red-500 text-white">Lost</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <FooterV2 />
    </div>
  )
}
