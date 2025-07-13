import { SiteHeader } from "@/components/site-header"
import { FooterV2 } from "@/components/footer-v2"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import type { Call } from "@/types/calls"

export const dynamic = 'force-dynamic'

export default async function CallsPage() {
  const session = await getServerSession()
  if (!session?.user) {
    redirect("/login")
  }
  
  // TODO: Fetch calls data from Supabase as before, using service role key if needed
  // const calls: Call[] = ...
  
  // Mock data for now
  const calls: Call[] = [
    {
      id: "1",
      title: "Chiefs vs 49ers - Spread Pick",
      description: "Chiefs -2.5 is the play here. Mahomes is healthy and the Chiefs defense is clicking.",
      status: "Won",
      expert: "John Smith",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "2", 
      title: "Eagles vs Cowboys - Moneyline",
      description: "Eagles moneyline at +150 is great value. Hurts is back and the Eagles are rolling.",
      status: "Lost",
      expert: "Mike Johnson",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ]

  return (
    <div className="bg-[#0D0D0D] text-gray-200 font-sans min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">Expert Calls</h1>
            <Button
              asChild
              className="bg-cyan-400 text-black font-bold hover:bg-cyan-300"
            >
              <Link href="/experts">View All Experts</Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {calls.map((call) => (
              <Card key={call.id} className="bg-black/30 border-gray-800/50 hover:border-cyan-400/50 transition-colors">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-bold text-white">{call.title}</CardTitle>
                    <Badge 
                      className={cn(
                        "text-xs font-bold",
                        call.status === "Won" && "bg-green-500 text-white",
                        call.status === "Lost" && "bg-red-500 text-white",
                        call.status === "Push" && "bg-yellow-500 text-black",
                        call.status === "Upcoming" && "bg-blue-500 text-white"
                      )}
                    >
                      {call.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400">by {call.expert}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm">{call.description}</p>
                  <div className="mt-4 text-xs text-gray-500">
                    {new Date(call.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <FooterV2 />
    </div>
  )
}
