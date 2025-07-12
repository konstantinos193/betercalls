import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { Zap, Mail, CheckCircle } from "lucide-react"
import { resendConfirmationEmail } from "@/app/auth/actions"

export default function EmailConfirmationPage({ searchParams }: { searchParams: { message: string; email?: string } }) {
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
            <div className="flex justify-center mb-4">
              <Mail className="h-12 w-12 text-cyan-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Check Your Email</CardTitle>
            <CardDescription className="text-gray-400">
              We've sent you a confirmation email. Please check your inbox and click the confirmation link.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-300">
                  <p className="font-medium mb-2">What to do next:</p>
                  <ol className="list-decimal list-inside space-y-1 text-gray-400">
                    <li>Check your email inbox (and spam folder)</li>
                    <li>Click the confirmation link in the email</li>
                    <li>Return here and sign in to your account</li>
                  </ol>
                </div>
              </div>
            </div>
            
            {searchParams.message && (
              <div className="bg-blue-900/20 border border-blue-700/50 p-3 rounded-lg">
                <p className="text-sm text-blue-300">{searchParams.message}</p>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4">
            {/* Resend confirmation form */}
            <div className="w-full border-t border-gray-700 pt-4">
              <p className="text-center text-sm text-gray-400 mb-3">
                Didn't receive the confirmation email?
              </p>
              <form action={resendConfirmationEmail} className="space-y-3">
                <Input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  defaultValue={searchParams.email || ""}
                  required
                  className="bg-gray-900/80 border-gray-700 focus:ring-cyan-500 focus:border-cyan-500"
                />
                <Button type="submit" variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
                  Resend Confirmation Email
                </Button>
              </form>
            </div>
            
            <div className="text-center text-sm text-gray-400">
              Already confirmed your email?{" "}
              <Link href="/login" className="font-medium text-cyan-400 hover:underline">
                Sign in here
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
} 