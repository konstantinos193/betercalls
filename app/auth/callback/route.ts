import { createSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  console.log("=== AUTH CALLBACK ROUTE ===")
  console.log("Request URL:", request.url)
  
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"
  
  console.log("Origin:", origin)
  console.log("Code present:", !!code)
  console.log("Next redirect:", next)

  if (code) {
    console.log("Exchanging code for session...")
    const supabase = createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      console.log("Session exchange successful, redirecting to:", `${origin}${next}`)
      return NextResponse.redirect(`${origin}${next}`)
    } else {
      console.error("Session exchange error:", error)
    }
  }

  // return the user to an error page with instructions
  console.error("Could not exchange code for session.")
  return NextResponse.redirect(`${origin}/login?message=Authentication failed. Please try again.`)
}
