import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { Zap } from "lucide-react"
import { resetUserPassword } from "@/app/auth/actions"

export default function UpdatePasswordPage({ searchParams }: { searchParams: { message: string } }) {
  return (
    <div className="bg-[#0D0D0D] text-gray-200 font-sans min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-black/30 border-gray-800/50 shadow-[0_0_30px_rgba(56,189,248,0.1)]">
          <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
              <Zap className="h-8 w-8 text-cyan-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Reset Your Password</CardTitle>
            <CardDescription className="text-gray-400">Enter your new password below.</CardDescription>
          </CardHeader>
          <form action={resetUserPassword}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="bg-gray-900/80 border-gray-700 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="bg-gray-900/80 border-gray-700 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full bg-cyan-400 text-black font-bold hover:bg-cyan-300">
                Update Password
              </Button>
              {searchParams.message && <p className="text-center text-sm text-red-400">{searchParams.message}</p>}
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  )
}
