import { createSupabaseServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { FooterV2 } from "@/components/footer-v2"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight, ShieldCheck, Zap, Lock } from "lucide-react"
import { createSubscription } from "@/app/actions/payment"

// Force dynamic rendering for this page since it fetches data from database
export const dynamic = 'force-dynamic'

export default async function CheckoutPage({ params }: { params: { planId: string } }) {
  const supabase = createSupabaseServerClient()

  const { data: plan, error } = await supabase
    .from("subscription_plans")
    .select("*")
    .eq("id", params.planId)
    .eq("is_active", true)
    .single()

  if (error || !plan) {
    notFound()
  }

  const createSubscriptionWithId = createSubscription.bind(null, plan.id)

  return (
    <div className="bg-[#0D0D0D] text-gray-200 font-sans min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-grow container mx-auto py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">Secure Checkout</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
              You're one step away from joining the winners' circle. Confirm your plan and proceed to payment.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Order Summary Card */}
            <Card className="bg-black/30 border-2 border-cyan-400/50 shadow-[0_0_30px_rgba(56,189,248,0.2)] flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Your Plan</CardTitle>
                <CardDescription className="text-gray-400">Review your selection below.</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    <p className="text-4xl font-bold text-cyan-400 mt-2">
                      €{plan.price}{" "}
                      <span className="text-lg font-medium text-gray-500">
                        {plan.interval === "monthly" ? "/ month" : plan.interval === "annual" ? "/ year" : " once"}
                      </span>
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-white">Features included:</h4>
                    <ul className="space-y-2 text-gray-300">
                      {(plan.features as string[])?.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-cyan-400 mr-3 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <form action={createSubscriptionWithId} className="w-full">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full group bg-cyan-400 text-black font-bold hover:bg-cyan-300 transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(56,189,248,0.5)]"
                  >
                    Proceed to Payment
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </form>
              </CardFooter>
            </Card>

            {/* Trust & Security Info */}
            <div className="space-y-6">
              <div className="bg-black/30 p-6 rounded-xl border border-gray-800/50">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-green-400" />
                  Why BeterCalls?
                </h3>
                <ul className="mt-4 space-y-3 text-gray-400 text-sm">
                  <li className="flex items-center gap-3">
                    <Zap className="h-4 w-4 text-cyan-400" />
                    <span>Instant access to all expert calls after payment.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Lock className="h-4 w-4 text-cyan-400" />
                    <span>All payments are securely processed by Helio.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-cyan-400" />
                    <span>Join a proven community of successful bettors.</span>
                  </li>
                </ul>
              </div>
              <div className="text-center text-xs text-gray-600">
                <p>
                  By clicking "Proceed to Payment", you will be redirected to our secure payment partner, Helio, to
                  complete your transaction. Your subscription will be activated immediately upon successful payment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <FooterV2 />
    </div>
  )
}
