export const dynamic = "force-dynamic"
import { SiteHeader } from "@/components/site-header"
import { FooterV2 } from "@/components/footer-v2"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { ExpertCard } from "@/components/expert-card"

export default async function ExpertsPage() {
  const supabase = createSupabaseServerClient()
  const { data: experts, error } = await supabase
    .from("experts")
    .select("*")
    .order("follower_count", { ascending: false })

  if (error) {
    console.error("Error fetching experts:", error)
    // Fallback or error message
  }

  return (
    <div className="bg-[#0D0D0D] text-gray-200 font-sans min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-grow container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">Meet Our Experts</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
            Discover top-tier analysts, track their performance, and follow the ones that match your style.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(experts || []).map((expert) => (
            <ExpertCard key={expert.id} expert={expert} />
          ))}
        </div>
      </main>
      <FooterV2 />
    </div>
  )
}
