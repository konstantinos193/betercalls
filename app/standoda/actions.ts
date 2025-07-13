"use server"

import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import type { Database } from "@/types/supabase"

export type FormState = {
  message?: string
  errors?: Record<string, string[]>
}

export async function createCall(prevState: FormState, formData: FormData) {
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
    return {
      message: "All fields are required",
      errors: {
        expertId: ["Expert is required"],
        betType: ["Bet type is required"],
        matchHomeTeam: ["Home team is required"],
        matchAwayTeam: ["Away team is required"],
        odds: ["Odds are required"],
        pick: ["Pick is required"],
        units: ["Units are required"],
        status: ["Status is required"],
      },
    }
  }

  const { error } = await supabase.from("calls").insert({
    expert_id: expertId,
    bet_type: betType,
    match_home_team: matchHomeTeam,
    match_away_team: matchAwayTeam,
    odds,
    pick,
    units: parseFloat(units),
    analysis: analysis || null,
    status: status as Database["public"]["Enums"]["call_status"],
  })

  if (error) {
    return {
      message: "Failed to create call",
      errors: {
        _form: [error.message],
      },
    }
  }

  revalidatePath("/standoda")
  return { message: "Call created successfully" }
}

export async function updateCallStatus(callId: string, status: string) {
  const supabase = createSupabaseAdminClient()
  
  const { error } = await supabase
    .from("calls")
    .update({ status })
    .eq("id", callId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/standoda")
}

export async function saveExpert(prevState: FormState, formData: FormData) {
  const supabase = createSupabaseAdminClient()
  
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const roi = formData.get("roi") as string

  if (!name || !description || !roi) {
    return {
      message: "All fields are required",
      errors: {
        name: ["Name is required"],
        description: ["Description is required"],
        roi: ["ROI is required"],
      },
    }
  }

  const { error } = await supabase.from("experts").insert({
    name,
    description,
    roi: parseFloat(roi),
  })

  if (error) {
    return {
      message: "Failed to create expert",
      errors: {
        _form: [error.message],
      },
    }
  }

  revalidatePath("/standoda/experts")
  return { message: "Expert created successfully" }
}

export async function deleteExpert(expertId: string) {
  const supabase = createSupabaseAdminClient()
  
  const { error } = await supabase
    .from("experts")
    .delete()
    .eq("id", expertId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/standoda/experts")
}

export async function savePlan(prevState: FormState, formData: FormData) {
  const supabase = createSupabaseAdminClient()
  
  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const price = formData.get("price") as string
  const description = formData.get("description") as string
  const interval = formData.get("interval") as string
  const features = formData.get("features") as string
  const is_active = formData.get("is_active") === "on"

  if (!name || !price || !description || !interval) {
    return {
      message: "All fields are required",
      errors: {
        name: ["Name is required"],
        price: ["Price is required"],
        description: ["Description is required"],
        interval: ["Interval is required"],
      },
    }
  }

  // Parse features from textarea (one per line)
  const featuresArray = features ? features.split('\n').filter(f => f.trim()) : []

  const planData = {
    name,
    price: parseFloat(price),
    description,
    interval: interval as "monthly" | "annual" | "lifetime",
    features: featuresArray,
    is_active,
    currency: "EUR"
  }

  let error
  if (id) {
    // Update existing plan
    const { error: updateError } = await supabase
      .from("subscription_plans")
      .update(planData)
      .eq("id", id)
    error = updateError
  } else {
    // Create new plan
    const { error: insertError } = await supabase
      .from("subscription_plans")
      .insert(planData)
    error = insertError
  }

  if (error) {
    return {
      message: "Failed to save plan",
      errors: {
        _form: [error.message],
      },
    }
  }

  revalidatePath("/standoda/plans")
  return { message: id ? "Plan updated successfully" : "Plan created successfully", success: true }
}

export async function updateUserSubscription(userId: string, subscriptionStatus: string) {
  const supabase = createSupabaseAdminClient()
  
  const { error } = await supabase
    .from("users")
    .update({ subscription_status: subscriptionStatus })
    .eq("id", userId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/standoda/users")
} 