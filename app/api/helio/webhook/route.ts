import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"
import { headers } from "next/headers"

// In a real-world scenario, you would use a library like `crypto` to verify the signature.
// This is a simplified check for demonstration purposes.
async function verifyHelioSignature(request: Request, body: any): Promise<boolean> {
  const secret = process.env.HELIO_WEBHOOK_SECRET
  if (!secret) {
    console.error("HELIO_WEBHOOK_SECRET is not set. Skipping verification.")
    // In production, you should return false here.
    return true
  }

  const signature = headers().get("helio-signature")
  if (!signature) {
    console.warn("No Helio signature found on webhook request.")
    return false
  }

  // The actual verification logic would involve creating a hash of the
  // request body with the secret and comparing it to the signature.
  // This is a placeholder for that logic.
  // e.g., const hash = crypto.createHmac('sha256', secret).update(JSON.stringify(body)).digest('hex');
  // return hash === signature;

  console.log("Signature verification is a placeholder. Assuming success for now.")
  return true
}

function parseSubscriptionTier(subscriptionName: string): "monthly" | "yearly" | "lifetime" | null {
  const name = subscriptionName.toLowerCase()
  if (name.includes("monthly")) return "monthly"
  if (name.includes("yearly") || name.includes("annual")) return "yearly"
  if (name.includes("lifetime")) return "lifetime"
  return null
}

export async function POST(request: Request) {
  const supabase = createSupabaseAdminClient()
  let event
  try {
    event = await request.json()
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  // 1. Verify the webhook signature for security
  const isVerified = await verifyHelioSignature(request, event)
  if (!isVerified) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  console.log("Received Helio Webhook:", event.type)

  try {
    switch (event.type) {
      case "subscription.started":
      case "subscription.renewed": {
        const { customer, subscription } = event.data

        if (!customer || !customer.email || !subscription || !subscription.id) {
          return NextResponse.json({ error: "Missing required data in webhook payload" }, { status: 400 })
        }

        // 2. Find the user in your database by email
        const { data: user, error: userError } = await supabase.auth.admin.getUserByEmail(customer.email)

        if (userError || !user) {
          console.error(`User with email ${customer.email} not found.`, userError)
          return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // 3. Update the user's profile with subscription details
        const subscriptionTier = parseSubscriptionTier(subscription.name)
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            subscription_status: "active",
            subscription_tier: subscriptionTier,
            helio_subscription_id: subscription.id,
          })
          .eq("id", user.user.id)

        if (profileError) {
          console.error("Failed to update user profile:", profileError)
          return NextResponse.json({ error: "Failed to update user profile" }, { status: 500 })
        }

        console.log(`Successfully activated subscription for ${customer.email}`)
        break
      }

      case "subscription.cancelled": {
        const { subscription } = event.data

        if (!subscription || !subscription.id) {
          return NextResponse.json({ error: "Missing subscription ID in webhook payload" }, { status: 400 })
        }

        // Find the user by their Helio subscription ID and update their status
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            subscription_status: "cancelled",
          })
          .eq("helio_subscription_id", subscription.id)

        if (profileError) {
          console.error("Failed to cancel user subscription:", profileError)
          return NextResponse.json({ error: "Failed to update user profile on cancellation" }, { status: 500 })
        }

        console.log(`Successfully cancelled subscription with Helio ID: ${subscription.id}`)
        break
      }

      default:
        console.log(`Unhandled Helio event type: ${event.type}`)
    }

    return NextResponse.json({ status: "success" }, { status: 200 })
  } catch (error) {
    console.error("Error processing Helio webhook:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
