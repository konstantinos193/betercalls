import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export const createSupabaseMiddlewareClient = (request: NextRequest) => {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Use standard, non-prefixed variables for server-side code, including middleware
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase URL or Anon Key for middleware client.")
  }

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

  return { supabase, response }
}
