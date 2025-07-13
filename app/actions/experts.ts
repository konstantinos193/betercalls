"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"

export async function followExpert(expertId: string) {
  const session = await getServerSession()
  if (!session?.user) {
    throw new Error("You must be logged in to follow an expert.")
  }

  const supabase = createSupabaseServerClient()
  const { error } = await supabase.from("expert_followers").insert({
    user_id: session.user.id,
    expert_id: expertId,
  })

  if (error) {
    console.error("Error following expert:", error)
    throw new Error(error.message)
  }

  revalidatePath(`/experts/${expertId}`)
}

export async function unfollowExpert(expertId: string) {
  const session = await getServerSession()
  if (!session?.user) {
    throw new Error("You must be logged in to unfollow an expert.")
  }

  const supabase = createSupabaseServerClient()
  const { error } = await supabase.from("expert_followers").delete().eq("user_id", session.user.id).eq("expert_id", expertId)

  if (error) {
    console.error("Error unfollowing expert:", error)
    throw new Error(error.message)
  }

  revalidatePath(`/experts/${expertId}`)
}
