"use server"

import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export type FormState = {
  message: string
  success: boolean
}

export async function createCall(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = createSupabaseAdminClient()

  const callData = {
    expert_id: formData.get("expert-id") as string,
    match_home_team: formData.get("home-team") as string,
    match_away_team: formData.get("away-team") as string,
    bet_type: formData.get("bet-type") as string,
    pick: formData.get("pick") as string,
    odds: formData.get("odds") as string,
    units: Number(formData.get("units")),
    analysis: formData.get("analysis") as string,
  }

  // Basic validation
  if (
    !callData.expert_id ||
    !callData.match_home_team ||
    !callData.match_away_team ||
    !callData.pick ||
    !callData.odds ||
    !callData.units
  ) {
    return { message: "Please fill all required fields.", success: false }
  }

  const { error } = await supabase.from("calls").insert(callData)

  if (error) {
    console.error("Error creating call:", error)
    return { message: `Database Error: ${error.message}`, success: false }
  }

  revalidatePath("/admin")
  revalidatePath("/calls")
  revalidatePath(`/experts/${callData.expert_id}`)
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
  // We would also need to revalidate the expert's page if we were calculating stats
  return { message: `Status updated to ${status}`, success: true }
}

export async function savePlan(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = createSupabaseAdminClient()
  const id = formData.get("id") as string
  const features = (formData.get("features") as string).split("\n").filter((f) => f.trim() !== "")

  const planData = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    price: Number(formData.get("price")),
    interval: formData.get("interval") as "monthly" | "annual" | "lifetime",
    features: features,
    is_active: formData.get("is_active") === "on",
  }

  let error

  if (id) {
    // Update existing plan
    const { error: updateError } = await supabase.from("subscription_plans").update(planData).eq("id", id)
    error = updateError
  } else {
    // Create new plan
    const { error: insertError } = await supabase.from("subscription_plans").insert(planData)
    error = insertError
  }

  if (error) {
    console.error("Error saving plan:", error)
    return { message: `Database Error: ${error.message}`, success: false }
  }

  revalidatePath("/admin/plans")
  revalidatePath("/") // Revalidate public pricing page
  return { message: "Plan saved successfully!", success: true }
}

export async function updateUserSubscription(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = createSupabaseAdminClient()
  const userId = formData.get("userId") as string
  const subscriptionStatus = formData.get("subscriptionStatus") as "active" | "inactive" | "cancelled"

  if (!userId || !subscriptionStatus) {
    return { message: "User ID and status are required.", success: false }
  }

  const { error } = await supabase.from("profiles").update({ subscription_status: subscriptionStatus }).eq("id", userId)

  if (error) {
    console.error("Error updating subscription:", error)
    return { message: `Database Error: ${error.message}`, success: false }
  }

  revalidatePath("/admin/users")
  return { message: "User subscription updated successfully!", success: true }
}
