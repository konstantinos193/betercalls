"use server"

import { getHelioClient } from "@/lib/helio"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { redirect } from "next/navigation"

export async function createSubscription(planId: string) {
  console.log("=== PAYMENT ACTION STARTED ===")
  console.log("Plan ID:", planId)
  console.log("Timestamp:", new Date().toISOString())
  console.log("Environment check - HELIO_SECRET_KEY present:", !!process.env.HELIO_SECRET_KEY)
  
  let plan: any = null
  let planError: any = null
  
  try {
    const supabase = createSupabaseAdminClient()
    console.log("Supabase admin client created successfully")

    // Fetch plan details from DB to ensure price integrity
    const result = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("id", planId)
      .single()

    plan = result.data
    planError = result.error

    console.log("Plan data:", plan)
    console.log("Plan error:", planError)

  } catch (error) {
    console.error("Supabase or plan fetch failed:", error)
    console.error("Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    })
    redirect("/?error=plan-not-found")
  }

  if (planError || !plan) {
    console.error("Plan not found:", planError)
    return redirect("/?error=plan-not-found")
  }

  try {
    console.log("Creating Helio client...")
    const helio = getHelioClient()
    console.log("Helio client created, creating payment link...")
    
    const response = await helio.createSubscriptionPayLink({
      name: plan.name,
      price: plan.price,
      interval: plan.interval,
    })

    console.log("Helio response:", response)

    if (response && response.payLinkUrl) {
      console.log("Redirecting to payment URL:", response.payLinkUrl)
      redirect(response.payLinkUrl)
    } else {
      console.error("No payment URL in response:", response)
      throw new Error("Failed to create Helio payment link.")
    }
  } catch (error) {
    console.error("Helio subscription creation failed:", error)
    console.error("Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    })
    redirect("/?error=payment-failed")
  }
}
