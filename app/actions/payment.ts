"use server"

import { helio } from "@/lib/helio"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { redirect } from "next/navigation"

export async function createSubscription(planId: string) {
  const supabase = createSupabaseAdminClient()

  // Fetch plan details from DB to ensure price integrity
  const { data: plan, error: planError } = await supabase
    .from("subscription_plans")
    .select("*")
    .eq("id", planId)
    .single()

  if (planError || !plan) {
    console.error("Plan not found:", planError)
    return redirect("/?error=plan-not-found")
  }

  try {
    const response = await helio.createSubscriptionPayLink({
      name: plan.name,
      price: plan.price,
      interval: plan.interval,
    })

    if (response && response.payLinkUrl) {
      redirect(response.payLinkUrl)
    } else {
      throw new Error("Failed to create Helio payment link.")
    }
  } catch (error) {
    console.error("Helio subscription creation failed:", error)
    redirect("/?error=payment-failed")
  }
}
