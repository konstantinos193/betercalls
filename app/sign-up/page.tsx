import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { Zap } from "lucide-react"
import { signUp } from "@/app/auth/actions"

export default function SignUpPage({ searchParams }: { searchParams: { message: string } }) {
  return (
    <div className="bg-[#0D0D0D] text-gray-200 font-sans min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-black/30 border-gray-800/50 shadow-[0_0_30px_rgba(56,189,248,0.1)]">
          <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
              <Zap className="h-8 w-8 text-cyan-400" />
              <h1 className="text-2xl font-bold text-white tracking-tighter">BeterCalls</h1>
            </div>
            <CardTitle className="text-2xl font-bold text-white">Create an Account</CardTitle>
            <CardDescription className="text-gray-400">Join the winning team today.</CardDescription>
          </CardHeader>
          <form action={signUp}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="bg-gray-900/80 border-gray-700 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="bg-gray-900/80 border-gray-700 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full bg-cyan-400 text-black font-bold hover:bg-cyan-300">Create Account</Button>
              {searchParams.message && <p className="text-center text-sm text-red-400">{searchParams.message}</p>}
              <div className="text-center text-sm text-gray-400">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-cyan-400 hover:underline">
                  Log in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  )
}
