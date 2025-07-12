import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, BarChart, Users, Zap } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { FooterV2 } from "@/components/footer-v2"
import { PickCardV2, type Pick } from "@/components/pick-card-v2"
import { LiveTicker } from "@/components/live-ticker"
import { createSupabaseServerClient } from "@/lib/supabase/server"

const livePicks: Pick[] = [
  {
    id: "1",
    sport: "Football",
    match: { homeTeam: "Chiefs", awayTeam: "49ers", time: "Sun 4:25 PM" },
    betType: "Spread",
    pick: "Chiefs -2.5",
    odds: "-110",
    units: 2,
    status: "Upcoming",
  },
  {
    id: "2",
    sport: "Football",
    match: { homeTeam: "Ravens", awayTeam: "Steelers", time: "Sun 1:00 PM" },
    betType: "Total",
    pick: "Over 44.5",
    odds: "-110",
    units: 1.5,
    status: "Upcoming",
  },
]

const tickerItems = [
  { id: 1, text: "FOOTBALL: Chiefs -2.5 vs 49ers - WIN" },
  { id: 2, text: "FOOTBALL: Ravens/Steelers O44.5 - WIN" },
  { id: 3, text: "NEW CALL: FOOTBALL: Lions ML vs Packers" },
]

export default async function CuttingEdgeLandingPage() {
  const supabase = createSupabaseServerClient()
  const { data: plans } = await supabase.from("subscription_plans").select("*").eq("is_active", true).order("price")

  return (
    <div className="bg-[#0D0D0D] text-gray-200 font-sans">
      <SiteHeader />
      <LiveTicker items={tickerItems} />

      <main className="overflow-hidden">
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center px-4 sm:px-6 lg:px-8 py-20">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-5"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/80 to-transparent z-10"></div>

          <div className="relative z-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white leading-tight">
                Stop Guessing.
                <br />
                <span className="text-cyan-400">Start Winning.</span>
              </h1>
              <p className="mt-4 max-w-lg mx-auto lg:mx-0 text-lg text-gray-400">
                Access elite-level football betting calls. We do the research, you reap the rewards. Join a community
                driven by data, not drama.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <Button
                  asChild
                  size="lg"
                  className="group bg-cyan-400 text-black font-bold hover:bg-cyan-300 transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(56,189,248,0.5)]"
                >
                  <Link href="#pricing">
                    Get Instant Access{" "}
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative h-[450px] lg:h-[550px]">
              <div className="absolute w-full h-full -skew-y-6 space-y-4">
                <PickCardV2 pick={livePicks[0]} className="animate-fade-in-up" />
                <PickCardV2 pick={livePicks[1]} className="ml-12 animate-fade-in-up animation-delay-200" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-white">
              The Ultimate Edge in Football Betting
            </h2>
            <p className="mt-4 text-lg text-gray-400">Everything you need to bet smarter, not harder.</p>
          </div>
          <div className="mt-16 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-900/30 p-8 rounded-xl border border-gray-800/50 transition-all duration-300 hover:border-cyan-400/50 hover:bg-gray-900/50">
              <Zap className="h-8 w-8 text-cyan-400" />
              <h3 className="mt-4 text-xl font-bold text-white">Real-Time Calls</h3>
              <p className="mt-2 text-gray-400">
                Get instant notifications for high-value bets as soon as our experts find them.
              </p>
            </div>
            <div className="bg-gray-900/30 p-8 rounded-xl border border-gray-800/50 transition-all duration-300 hover:border-cyan-400/50 hover:bg-gray-900/50">
              <BarChart className="h-8 w-8 text-cyan-400" />
              <h3 className="mt-4 text-xl font-bold text-white">Expert Analysis</h3>
              <p className="mt-2 text-gray-400">
                Every pick is backed by in-depth research, statistical modeling, and expert insights.
              </p>
            </div>
            <div className="bg-gray-900/30 p-8 rounded-xl border border-gray-800/50 transition-all duration-300 hover:border-cyan-400/50 hover:bg-gray-900/50">
              <Users className="h-8 w-8 text-cyan-400" />
              <h3 className="mt-4 text-xl font-bold text-white">Community Access</h3>
              <p className="mt-2 text-gray-400">
                Join private groups, discuss strategies, and share your wins with fellow members.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gray-900/20">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-white">Find Your Perfect Plan</h2>
            <p className="mt-4 text-lg text-gray-400">Start with a plan that fits your style. Upgrade anytime.</p>
          </div>
          <div className="mt-16 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            {(plans || []).map((plan) => {
              return (
                <div
                  key={plan.id}
                  className={`border border-gray-800 rounded-xl p-8 flex flex-col ${plan.interval === "yearly" ? "border-2 border-cyan-400 bg-gray-900/50 shadow-[0_0_30px_rgba(56,189,248,0.3)]" : ""}`}
                >
                  {plan.interval === "yearly" && (
                    <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-cyan-400 text-black px-4 py-1 rounded-full text-sm font-bold">
                      BEST VALUE
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                  <p className="mt-2 text-gray-400">{plan.description}</p>
                  <div className="mt-6 text-4xl font-bold text-white">
                    €{plan.price}{" "}
                    <span className="text-lg font-medium text-gray-500">
                      / {plan.interval === "monthly" ? "mo" : "yr"}
                    </span>
                  </div>
                  <ul className="mt-8 space-y-4 text-gray-300 flex-grow">
                    {(plan.features as string[])?.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <CheckCircle className="h-6 w-6 text-cyan-400 mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    size="lg"
                    className={`mt-8 w-full font-bold transition-all duration-300 group ${
                      plan.interval === "yearly"
                        ? "bg-cyan-400 text-black hover:bg-cyan-300 shadow-[0_0_20px_rgba(56,189,248,0.5)]"
                        : "bg-gray-800/50 hover:bg-cyan-400/10 border border-gray-700 hover:border-cyan-400 text-cyan-400"
                    }`}
                  >
                    <Link href={`/checkout/${plan.id}`}>
                      Choose Plan <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              )
            })}
          </div>
        </section>
      </main>
      <FooterV2 />
    </div>
  )
}
