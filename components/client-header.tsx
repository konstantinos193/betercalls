"use client"

import { HeaderV2 } from "@/components/header-v2"
import type { User } from "@supabase/supabase-js"

type ClientHeaderProps = {
  user?: User | null
}

export function ClientHeader({ user }: ClientHeaderProps) {
  return <HeaderV2 user={user} />
} 