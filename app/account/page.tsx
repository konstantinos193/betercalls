import { SiteHeader } from "@/components/site-header"
import { FooterV2 } from "@/components/footer-v2"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { UpdatePasswordForm } from "@/components/update-password-form"
import { UpdateProfileForm } from "@/components/update-profile-form"
import { AvatarUploadForm } from "@/components/avatar-upload-form"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]"
import { redirect } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect("/login")
  }
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  // Fetch user profile from Supabase users table
  const { data: userProfile } = await supabase
    .from("users")
    .select("*")
    .eq("email", session.user.email)
    .single()

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
                <p className="text-white">{session.user.email}</p>
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-gray-400 text-sm">Display Name</h3>
                <p className="text-white">{userProfile?.name || session.user.email}</p>
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
                currentAvatarUrl={userProfile?.avatar_url || null}
                userName={userProfile?.name || session.user.email}
              />
            </CardContent>
          </Card>

          {/* Update Profile Card */}
          <Card className="w-full bg-black/30 border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">Update Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <UpdateProfileForm fullName={userProfile?.name || null} />
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
