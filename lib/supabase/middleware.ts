import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export const createSupabaseMiddlewareClient = (request: NextRequest) => {
  console.log("=== SUPABASE MIDDLEWARE CLIENT CREATION ===")
  
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

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase middleware environment variables")
    throw new Error("Missing Supabase URL or Anon Key for middleware client.")
  }

  console.log("Supabase middleware environment variables are set, creating client")

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({ name, value, ...options })
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        })
        response.cookies.set({ name, value, ...options })
      },
      remove(name: string, options: CookieOptions) {
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
  return { supabase, response }
}
