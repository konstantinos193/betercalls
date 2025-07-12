import { SiteHeader } from "@/components/site-header"
import { FooterV2 } from "@/components/footer-v2"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { UpdatePasswordForm } from "@/components/update-password-form"
import { UpdateProfileForm } from "@/components/update-profile-form"
import { AvatarUploadForm } from "@/components/avatar-upload-form"

export default async function AccountPage() {
  const supabase = createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const getPlanName = (tier: string | null) => {
    if (!tier) return "No Plan"
    return tier.charAt(0).toUpperCase() + tier.slice(1) + " Plan"
  }

  return (
    <div className="bg-[#0D0D0D] text-gray-200 font-sans min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold text-white">My Account</h1>

          {/* Account Details Card */}
          <Card className="w-full bg-black/30 border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-semibold text-gray-400 text-sm">Email Address</h3>
                <p className="text-white">{user.email}</p>
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-gray-400 text-sm">Display Name</h3>
                <p className="text-white">{profile?.full_name || "Not set"}</p>
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-gray-400 text-sm">Subscription</h3>
                <div className="flex items-center gap-4">
                  <p className="text-white">{getPlanName(profile?.subscription_tier)}</p>
                  {profile?.subscription_status && (
                    <Badge
                      className={cn(
                        "border",
                        profile.subscription_status === "active"
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-red-500/20 text-red-400 border-red-500/30",
                      )}
                    >
                      {profile.subscription_status}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                variant="outline"
                className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black bg-transparent"
              >
                <Link href="#">Manage Subscription</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Profile Picture Card */}
          <Card className="w-full bg-black/30 border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">Profile Picture</CardTitle>
            </CardHeader>
            <CardContent>
              <AvatarUploadForm
                currentAvatarUrl={profile?.avatar_url || null}
                userName={profile?.full_name || user.email}
              />
            </CardContent>
          </Card>

          {/* Update Profile Card */}
          <Card className="w-full bg-black/30 border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">Update Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <UpdateProfileForm fullName={profile?.full_name || null} />
            </CardContent>
          </Card>

          {/* Change Password Card */}
          <Card className="w-full bg-black/30 border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <UpdatePasswordForm />
            </CardContent>
          </Card>
        </div>
      </main>
      <FooterV2 />
    </div>
  )
}
