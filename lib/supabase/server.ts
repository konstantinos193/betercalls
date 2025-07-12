import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

export const createSupabaseServerClient = () => {
  const cookieStore = cookies()

  // Use standard, non-prefixed variables for server-side code
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

  console.log("=== SUPABASE SERVER CLIENT CREATION ===")
  console.log("SUPABASE_URL:", supabaseUrl ? "Set" : "Missing")
  console.log("SUPABASE_ANON_KEY:", supabaseAnonKey ? "Set" : "Missing")

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables")
    throw new Error(
      "Supabase server environment variables (SUPABASE_URL, SUPABASE_ANON_KEY) are not set. Please check your Vercel project settings.",
    )
  }

  console.log("Supabase environment variables are set, creating client")
  
  const client = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing sessions.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.delete({ name, ...options })
        } catch (error) {
          // The `delete` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing sessions.
        }
      },
    },
  })

  console.log("Supabase server client created successfully")
  return client
}
