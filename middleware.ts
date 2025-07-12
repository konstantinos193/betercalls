import { NextResponse, type NextRequest } from "next/server"
import { createSupabaseMiddlewareClient } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  const { supabase, response } = createSupabaseMiddlewareClient(request)

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl

  // If user is not logged in, redirect to login page
  if (!session) {
    if (pathname.startsWith("/calls") || pathname.startsWith("/admin") || pathname.startsWith("/account")) {
      const url = new URL(request.url)
      url.pathname = "/login"
      return NextResponse.redirect(url)
    }
    return response
  }

  // If user is logged in, check for active subscription to access /calls
  if (pathname.startsWith("/calls")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_status")
      .eq("id", session.user.id)
      .single()

    // If no profile or subscription is not active, redirect to pricing page
    if (profile?.subscription_status !== "active") {
      const url = new URL(request.url)
      url.pathname = "/"
      url.hash = "pricing" // Jump to the pricing section
      return NextResponse.redirect(url)
    }
  }

  return response
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
