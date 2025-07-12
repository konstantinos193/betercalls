"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function followExpert(expertId: string) {
  const supabase = createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("You must be logged in to follow an expert.")
  }

  const { error } = await supabase.from("expert_followers").insert({
    user_id: user.id,
    expert_id: expertId,
  })

  if (error) {
    console.error("Error following expert:", error)
    throw new Error(error.message)
  }

  revalidatePath(`/experts/${expertId}`)
}

export async function unfollowExpert(expertId: string) {
  const supabase = createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("You must be logged in to unfollow an expert.")
  }

  const { error } = await supabase.from("expert_followers").delete().eq("user_id", user.id).eq("expert_id", expertId)

  if (error) {
    console.error("Error unfollowing expert:", error)
    throw new Error(error.message)
  }

  revalidatePath(`/experts/${expertId}`)
}
