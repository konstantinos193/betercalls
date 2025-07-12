import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export const createSupabaseMiddlewareClient = (request: NextRequest) => {
  console.log("=== SUPABASE MIDDLEWARE CLIENT CREATION ===")
  console.log("Timestamp:", new Date().toISOString())
  
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })

    // Use standard, non-prefixed variables for server-side code, including middleware
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

    console.log("SUPABASE_URL:", supabaseUrl ? "Set" : "Missing")
    console.log("SUPABASE_ANON_KEY:", supabaseAnonKey ? "Set" : "Missing")
    console.log("SUPABASE_URL length:", supabaseUrl?.length || 0)
    console.log("SUPABASE_ANON_KEY length:", supabaseAnonKey?.length || 0)

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase middleware environment variables")
      console.error("SUPABASE_URL missing:", !supabaseUrl)
      console.error("SUPABASE_ANON_KEY missing:", !supabaseAnonKey)
      throw new Error("Missing Supabase URL or Anon Key for middleware client.")
    }

    console.log("Supabase middleware environment variables are set, creating client")
    console.log("Supabase URL starts with:", supabaseUrl.substring(0, 20) + "...")
    console.log("Supabase Anon Key starts with:", supabaseAnonKey.substring(0, 10) + "...")

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          const value = request.cookies.get(name)?.value
          console.log(`Middleware cookie get - ${name}:`, value ? "Present" : "Missing")
          return value
        },
        set(name: string, value: string, options: CookieOptions) {
          console.log(`Middleware cookie set - ${name}:`, value ? "Present" : "Missing")
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          console.log(`Middleware cookie remove - ${name}`)
          request.cookies.set({ name, value: "", ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value: "", ...options })
        },
      },
    })

    console.log("Supabase middleware client created successfully")
    console.log("Client type:", typeof supabase)
    console.log("Client auth object:", supabase.auth ? "Available" : "Missing")
    return { supabase, response }
  } catch (error: any) {
    console.error("=== ERROR CREATING SUPABASE MIDDLEWARE CLIENT ===")
    console.error("Error type:", typeof error)
    console.error("Error message:", error?.message)
    console.error("Error stack:", error?.stack)
    throw error
  }
}
