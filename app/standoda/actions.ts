"use server"

import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export type FormState = {
  message: string
  success: boolean
}

export async function createCall(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = createSupabaseAdminClient()

  const expertId = formData.get("expertId") as string
  const betType = formData.get("betType") as string
  const matchHomeTeam = formData.get("matchHomeTeam") as string
  const matchAwayTeam = formData.get("matchAwayTeam") as string
  const odds = formData.get("odds") as string
  const pick = formData.get("pick") as string
  const units = formData.get("units") as string
  const analysis = formData.get("analysis") as string
  const status = formData.get("status") as string

  if (!expertId || !betType || !matchHomeTeam || !matchAwayTeam || !odds || !pick || !units || !status) {
    return { message: "All required fields must be filled.", success: false }
  }

  const callData = {
    expert_id: expertId,
    bet_type: betType,
    match_home_team: matchHomeTeam,
    match_away_team: matchAwayTeam,
    odds,
    pick,
    units: Number(units),
    analysis: analysis || null,
    status: status as "Upcoming" | "Won" | "Lost" | "Push",
  }

  // Insert call into database
  const { error: insertError } = await supabase.from("calls").insert(callData)

  if (insertError) {
    console.error("Error creating call:", insertError)
    return { message: `Database Error: ${insertError.message}`, success: false }
  }

  revalidatePath("/admin")
  revalidatePath("/calls")
  return { message: "Call posted successfully!", success: true }
}

export async function updateCallStatus(callId: string, status: "Won" | "Lost" | "Push") {
  const supabase = createSupabaseAdminClient()

  const { error } = await supabase.from("calls").update({ status }).eq("id", callId)

  if (error) {
    console.error("Error updating status:", error)
    return { message: `Database Error: ${error.message}`, success: false }
  }

  revalidatePath("/admin")
  revalidatePath("/calls")
  return { message: `Status updated to ${status}`, success: true }
}

export async function saveExpert(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = createSupabaseAdminClient()
  const id = formData.get("id") as string

  const expertData = {
    name: formData.get("name") as string,
    bio: formData.get("description") as string,
    avatar_url: formData.get("avatar_url") as string,
  }

  let error

  if (id) {
    // Update existing expert
    const { error: updateError } = await supabase.from("experts").update(expertData).eq("id", id)
    error = updateError
  } else {
    // Create new expert
    const { error: insertError } = await supabase.from("experts").insert(expertData)
    error = insertError
  }

  if (error) {
    console.error("Error saving expert:", error)
    return { message: `Database Error: ${error.message}`, success: false }
  }

  revalidatePath("/admin/experts")
  return { message: "Expert saved successfully!", success: true }
}

// TODO: Uncomment after running the categories migration
// export async function saveCategory(prevState: FormState, formData: FormData): Promise<FormState> {
//   const supabase = createSupabaseAdminClient()
//   const id = formData.get("id") as string

//   const categoryData = {
//     name: formData.get("name") as string,
//     description: formData.get("description") as string,
//     icon_name: formData.get("icon_name") as string,
//   }

//   let error

//   if (id) {
//     // Update existing category
//     const { error: updateError } = await supabase.from("categories").update(categoryData).eq("id", id)
//     error = updateError
//   } else {
//     // Create new category
//     const { error: insertError } = await supabase.from("categories").insert(categoryData)
//     error = insertError
//   }

//   if (error) {
//     console.error("Error saving category:", error)
//     return { message: `Database Error: ${error.message}`, success: false }
//   }

//   revalidatePath("/admin/categories")
//   return { message: "Category saved successfully!", success: true }
// }

export async function updateUserSubscription(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = createSupabaseAdminClient()
  const userId = formData.get("userId") as string
  const subscriptionStatus = formData.get("subscriptionStatus") as "active" | "inactive" | "cancelled"

  if (!userId || !subscriptionStatus) {
    return { message: "User ID and status are required.", success: false }
  }

  const { error } = await supabase.from("users").update({ subscription_status: subscriptionStatus }).eq("id", userId)

  if (error) {
    console.error("Error updating subscription:", error)
    return { message: `Database Error: ${error.message}`, success: false }
  }

  revalidatePath("/admin/users")
  return { message: "User subscription updated successfully!", success: true }
} 