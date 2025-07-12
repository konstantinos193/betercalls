"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

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

export async function saveExpert(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = createSupabaseAdminClient()
  const id = formData.get("id") as string

  const expertData = {
    name: formData.get("name") as string,
    bio: formData.get("bio") as string,
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

export async function deleteExpert(formData: FormData): Promise<FormState> {
  const supabase = createSupabaseAdminClient()
  const id = formData.get("id") as string

  if (!id) {
    return { message: "Expert ID is required.", success: false }
  }

  const { error } = await supabase.from("experts").delete().eq("id", id)

  if (error) {
    console.error("Error deleting expert:", error)
    return { message: `Database Error: ${error.message}`, success: false }
  }

  revalidatePath("/admin/experts")
  return { message: "Expert deleted successfully!", success: true }
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

export async function adminLogin(formData: FormData) {
  console.log("=== ADMIN LOGIN PROCESS STARTED ===")
  
  const supabase = createSupabaseServerClient()
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  
  console.log("Admin login attempt for email:", email)
  
  if (!email || !password) {
    console.log("Missing email or password")
    return redirect("/admin/login?message=Email and password are required")
  }
  
  try {
    // First, authenticate the user
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (error) {
      console.error("Admin login error:", error)
      return redirect(`/admin/login?message=Authentication failed: ${error.message}`)
    }
    
    if (!data.user) {
      console.error("No user data returned")
      return redirect("/admin/login?message=Authentication failed")
    }
    
    // Check if the user is an admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", data.user.id)
      .single()
    
    if (profileError) {
      console.error("Error checking admin status:", profileError)
      return redirect("/admin/login?message=Error verifying admin status")
    }
    
    if (!profile?.is_admin) {
      console.log("User is not an admin")
      // Sign out the user since they're not an admin
      await supabase.auth.signOut()
      return redirect("/admin/login?message=Access denied. Admin privileges required.")
    }
    
    console.log("Admin login successful for:", email)
    revalidatePath("/admin", "layout")
    return redirect("/admin")
    
  } catch (error) {
    console.error("Unexpected error during admin login:", error)
    
    if (error instanceof Error) {
      return redirect(`/admin/login?message=Unexpected error: ${error.message}`)
    } else {
      return redirect("/admin/login?message=Unexpected error during login")
    }
  }
}
