import { SiteHeader } from "@/components/site-header"
import { FooterV2 } from "@/components/footer-v2"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import Link from "next/link"
import { ArrowLeft, CreditCard, Calendar, Zap } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function SubscriptionPage() {
  const session = await getServerSession()
  if (!session?.user) {
    redirect("/login")
  }
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  
  // Fetch user profile and subscription details
  const { data: userProfile } = await supabase
    .from("users")
    .select("*")
    .eq("email", session.user.email)
    .single()

  // Fetch available plans for upgrade/downgrade
  const { data: plans } = await supabase
    .from("subscription_plans")
    .select("*")
    .eq("is_active", true)
    .order("price")

  const subscriptionStatus = userProfile?.subscription_status || "inactive"
  const subscriptionTier = userProfile?.subscription_tier || "none"

  return (
    <div className="bg-[#0D0D0D] text-gray-200 font-sans min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/account">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Account
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-white">Subscription Management</h1>
          </div>

          {/* Current Subscription Status */}
          <Card className="w-full bg-black/30 border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-cyan-400" />
                Current Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-400 text-sm">Status</h3>
                  <Badge 
                    variant={subscriptionStatus === "active" ? "default" : "destructive"}
                    className="text-sm"
                  >
                    {subscriptionStatus === "active" ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-400 text-sm">Plan</h3>
                  <p className="text-white capitalize">{subscriptionTier || "No Plan"}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-400 text-sm">Member Since</h3>
                  <p className="text-white">
                    {userProfile?.created_at 
                      ? new Date(userProfile.created_at).toLocaleDateString()
                      : "N/A"
                    }
                  </p>
                </div>
              </div>

              {subscriptionStatus === "active" && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-400">
                    <CreditCard className="h-4 w-4" />
                    <span className="font-medium">Active Subscription</span>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">
                    You have access to all premium features and expert calls.
                  </p>
                </div>
              )}

              {subscriptionStatus !== "active" && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-yellow-400">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">No Active Subscription</span>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">
                    Subscribe to access premium features and expert calls.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Available Plans */}
          {plans && plans.length > 0 && (
            <Card className="w-full bg-black/30 border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">Available Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className="border border-gray-800/50 rounded-lg p-4 hover:border-cyan-400/50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-white">{plan.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {plan.interval}
                        </Badge>
                      </div>
                      <p className="text-3xl font-bold text-white mb-2">
                        €{plan.price}
                        <span className="text-base font-normal text-gray-500 ml-1">
                          {plan.interval === "monthly" ? "/mo" : plan.interval === "annual" ? "/yr" : ""}
                        </span>
                      </p>
                      <p className="text-sm text-gray-400 mb-4">{plan.description}</p>
                      <Button
                        asChild
                        className="w-full bg-cyan-400 text-black font-bold hover:bg-cyan-300"
                      >
                        <Link href={`/checkout/${plan.id}`}>
                          {subscriptionStatus === "active" ? "Change Plan" : "Subscribe"}
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Billing Information */}
          <Card className="w-full bg-black/30 border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">Billing Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-400 text-sm">Email</h3>
                <p className="text-white">{session.user.email}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-400 text-sm">Payment Method</h3>
                <p className="text-white">Manage your payment methods through your subscription provider.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-400 text-sm">Billing History</h3>
                <p className="text-white">Contact support for billing history and receipts.</p>
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Card className="w-full bg-black/30 border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                If you have questions about your subscription or need to make changes, 
                please contact our support team.
              </p>
              <Button variant="outline" className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <FooterV2 />
    </div>
  )
} 