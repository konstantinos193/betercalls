import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// IMPORTANT: This client is for server-side admin actions ONLY.
// It uses the service role key and bypasses RLS.
export const createSupabaseAdminClient = () => {
  // Use standard, non-prefixed variables for server-side code
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Supabase admin environment variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) are not set. Please check your Vercel project settings.",
    )
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}
