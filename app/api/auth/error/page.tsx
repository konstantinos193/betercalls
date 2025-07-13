"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ClientHeader } from "@/components/client-header"
import { AlertCircle } from "lucide-react"
import { Suspense } from "react"

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "There is a problem with the server configuration."
      case "AccessDenied":
        return "You do not have permission to sign in."
      case "Verification":
        return "The verification token has expired or has already been used."
      case "Default":
      default:
        return "An error occurred during authentication."
    }
  }

  return (
    <Card className="w-full max-w-md bg-black/30 border-gray-800/50 shadow-[0_0_30px_rgba(56,189,248,0.1)]">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center gap-2 mb-4">
          <AlertCircle className="h-8 w-8 text-red-400" />
        </div>
        <CardTitle className="text-2xl font-bold text-white">Authentication Error</CardTitle>
        <CardDescription className="text-gray-400">
          {getErrorMessage(error)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <Link href="/login">
            <Button className="w-full bg-cyan-400 text-black font-bold hover:bg-cyan-300">
              Try Again
            </Button>
          </Link>
        </div>
        <div className="text-center">
          <Link href="/" className="text-cyan-400 hover:underline">
            Return to Home
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AuthErrorPage() {
  return (
    <div className="bg-[#0D0D0D] text-gray-200 font-sans min-h-screen flex flex-col">
      <ClientHeader />
      <main className="flex-grow flex items-center justify-center p-4">
        <Suspense fallback={<div className="text-white">Loading...</div>}>
          <AuthErrorContent />
        </Suspense>
      </main>
    </div>
  )
} 