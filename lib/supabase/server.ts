import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

export const createSupabaseServerClient = () => {
  console.log("=== SUPABASE SERVER CLIENT CREATION STARTED ===")
  console.log("Timestamp:", new Date().toISOString())
  
  try {
    const cookieStore = cookies()
    console.log("Cookie store created successfully")

    // Use standard, non-prefixed variables for server-side code
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

    console.log("=== SUPABASE SERVER CLIENT CREATION ===")
    console.log("SUPABASE_URL:", supabaseUrl ? "Set" : "Missing")
    console.log("SUPABASE_ANON_KEY:", supabaseAnonKey ? "Set" : "Missing")
    console.log("SUPABASE_URL length:", supabaseUrl?.length || 0)
    console.log("SUPABASE_ANON_KEY length:", supabaseAnonKey?.length || 0)

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase environment variables")
      console.error("SUPABASE_URL missing:", !supabaseUrl)
      console.error("SUPABASE_ANON_KEY missing:", !supabaseAnonKey)
      throw new Error(
        "Supabase server environment variables (SUPABASE_URL, SUPABASE_ANON_KEY) are not set. Please check your Vercel project settings.",
      )
    }

    console.log("Supabase environment variables are set, creating client")
    console.log("Supabase URL starts with:", supabaseUrl.substring(0, 20) + "...")
    console.log("Supabase Anon Key starts with:", supabaseAnonKey.substring(0, 10) + "...")
    
    const client = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          const value = cookieStore.get(name)?.value
          console.log(`Cookie get - ${name}:`, value ? "Present" : "Missing")
          return value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            console.log(`Cookie set - ${name}:`, value ? "Present" : "Missing")
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            console.error(`Cookie set error for ${name}:`, error)
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            console.log(`Cookie remove - ${name}`)
            cookieStore.delete({ name, ...options })
          } catch (error) {
            console.error(`Cookie remove error for ${name}:`, error)
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    })

    console.log("Supabase server client created successfully")
    console.log("Client type:", typeof client)
    console.log("Client auth object:", client.auth ? "Available" : "Missing")
    return client
  } catch (error: any) {
    console.error("=== ERROR CREATING SUPABASE SERVER CLIENT ===")
    console.error("Error type:", typeof error)
    console.error("Error message:", error?.message)
    console.error("Error stack:", error?.stack)
    throw error
  }
}
