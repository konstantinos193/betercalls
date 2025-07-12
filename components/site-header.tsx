import { createSupabaseServerClient } from "@/lib/supabase/server"
import { HeaderV2 } from "@/components/header-v2"

export async function SiteHeader() {
  const supabase = createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <HeaderV2 user={user} />
}
