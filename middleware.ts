import { NextResponse, type NextRequest } from "next/server"
import { createSupabaseMiddlewareClient } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  console.log("=== MIDDLEWARE EXECUTION ===")
  console.log("Timestamp:", new Date().toISOString())
  console.log("Request pathname:", request.nextUrl.pathname)
  console.log("Request method:", request.method)
  console.log("Request URL:", request.url)
  
  try {
    console.log("Creating Supabase middleware client...")
    const { supabase, response } = createSupabaseMiddlewareClient(request)
    console.log("Supabase middleware client created successfully")

    // Refresh session if expired - required for Server Components
    console.log("Getting session...")
    const {
      data: { session },
    } = await supabase.auth.getSession()

    console.log("Session status:", session ? "Active" : "No session")
    if (session) {
      console.log("User ID:", session.user.id)
      console.log("User email:", session.user.email)
      console.log("Session access token:", session.access_token ? "Present" : "Missing")
      console.log("Session refresh token:", session.refresh_token ? "Present" : "Missing")
    }

  const { pathname } = request.nextUrl

  // If user is not logged in, redirect to login page
  if (!session) {
    console.log("No session found, checking if protected route")
    if (pathname.startsWith("/calls") || pathname.startsWith("/account") || pathname.startsWith("/checkout")) {
      console.log("Redirecting to login page")
      const url = new URL(request.url)
      url.pathname = "/login"
      return NextResponse.redirect(url)
    }
    if (pathname.startsWith("/admin")) {
      console.log("Redirecting to admin login page")
      const url = new URL(request.url)
      url.pathname = "/admin/login"
      return NextResponse.redirect(url)
    }
    console.log("Not a protected route, continuing")
    return response
  }

  // Check admin access for admin routes
  if (pathname.startsWith("/admin")) {
    console.log("User accessing admin route, checking admin status")
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", session.user.id)
      .single()

    console.log("User admin status:", profile?.is_admin)

    if (!profile?.is_admin) {
      console.log("User is not an admin, redirecting to admin login")
      const url = new URL(request.url)
      url.pathname = "/admin/login"
      return NextResponse.redirect(url)
    }
    
    console.log("Admin access granted")
  }

  // If user is logged in, check for active subscription to access /calls
  if (pathname.startsWith("/calls")) {
    console.log("User accessing /calls, checking subscription status")
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_status")
      .eq("id", session.user.id)
      .single()

    console.log("Profile subscription status:", profile?.subscription_status)

    // If no profile or subscription is not active, redirect to pricing page
    if (profile?.subscription_status !== "active") {
      console.log("No active subscription, redirecting to pricing")
      const url = new URL(request.url)
      url.pathname = "/"
      url.hash = "pricing" // Jump to the pricing section
      return NextResponse.redirect(url)
    }
    
    console.log("Subscription active, allowing access to /calls")
  }

  console.log("Middleware completed successfully")
  return response
  } catch (error: any) {
    console.error("=== MIDDLEWARE ERROR ===")
    console.error("Error type:", typeof error)
    console.error("Error message:", error?.message)
    console.error("Error stack:", error?.stack)
    console.error("Full error object:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2))
    
    // Return a basic response to prevent the app from crashing
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
