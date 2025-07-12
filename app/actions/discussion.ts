"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export type FormState = {
  message: string
  success: boolean
}

export async function addComment(callId: string, prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { message: "You must be logged in to comment.", success: false }
  }

  const content = formData.get("comment") as string
  if (!content || content.trim().length === 0) {
    return { message: "Comment cannot be empty.", success: false }
  }

  const { error } = await supabase.from("discussions").insert({
    call_id: callId,
    user_id: user.id,
    content: content,
  })

  if (error) {
    console.error("Error adding comment:", error)
    return { message: `Database Error: ${error.message}`, success: false }
  }

  revalidatePath("/calls")
  return { message: "Comment posted.", success: true }
}
