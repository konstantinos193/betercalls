"use server"

import { getHelioClient } from "@/lib/helio"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { redirect } from "next/navigation"

export async function createSubscription(planId: string) {
  console.log("=== PAYMENT ACTION STARTED ===")
  console.log("Plan ID:", planId)
  
  const supabase = createSupabaseAdminClient()

  // Fetch plan details from DB to ensure price integrity
  const { data: plan, error: planError } = await supabase
    .from("subscription_plans")
    .select("*")
    .eq("id", planId)
    .single()

  console.log("Plan data:", plan)
  console.log("Plan error:", planError)

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
    redirect("/?error=payment-failed")
  }
}
