import { NextResponse, type NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  console.log("=== MIDDLEWARE EXECUTION ===")
  console.log("Timestamp:", new Date().toISOString())
  console.log("Request pathname:", request.nextUrl.pathname)
  console.log("Request method:", request.method)
  console.log("Request URL:", request.url)
  
  try {
    // Get the token using NextAuth
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    })

    console.log("Token status:", token ? "Active" : "No token")
    if (token) {
      console.log("User ID:", token.id)
      console.log("User email:", token.email)
    }

  const { pathname } = request.nextUrl

  // If user is not logged in, redirect to login page
  if (!token) {
    console.log("No token found, checking if protected route")
    if (pathname.startsWith("/calls") || pathname.startsWith("/account") || pathname.startsWith("/checkout")) {
      console.log("Redirecting to login page")
      const url = new URL(request.url)
      url.pathname = "/login"
      return NextResponse.redirect(url)
    }
    if (pathname.startsWith("/standoda")) {
      console.log("Redirecting to standoda login page")
      const url = new URL(request.url)
      url.pathname = "/standoda/login"
      return NextResponse.redirect(url)
    }
    console.log("Not a protected route, continuing")
    return NextResponse.next()
  }

  // Check admin access for standoda routes
  if (pathname.startsWith("/standoda")) {
    console.log("User accessing standoda route, checking admin status")
    
    // Check admin status in users table
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    const { data: user } = await supabase
      .from("users")
      .select("is_admin")
      .eq("email", token.email)
      .single()

    console.log("User admin status:", user?.is_admin)

    if (!user?.is_admin) {
      console.log("User is not an admin, redirecting to standoda login")
      const url = new URL(request.url)
      url.pathname = "/standoda/login"
      return NextResponse.redirect(url)
    }
    
    console.log("Admin access granted")
  }

  // If user is logged in, check for active subscription to access /calls
  if (pathname.startsWith("/calls")) {
    console.log("User accessing /calls, checking subscription status")
    
    // Check subscription status in users table
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    const { data: user } = await supabase
      .from("users")
      .select("subscription_status")
      .eq("email", token.email)
      .single()

    console.log("User subscription status:", user?.subscription_status)

    // If no user or subscription is not active, redirect to pricing page
    if (user?.subscription_status !== "active") {
      console.log("No active subscription, redirecting to pricing")
      const url = new URL(request.url)
      url.pathname = "/"
      url.hash = "pricing" // Jump to the pricing section
      return NextResponse.redirect(url)
    }
    
    console.log("Subscription active, allowing access to /calls")
  }

  console.log("Middleware completed successfully")
  return NextResponse.next()
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
