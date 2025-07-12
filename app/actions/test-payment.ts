"use server"

import { redirect } from "next/navigation"

export async function testPayment() {
  console.log("=== TEST PAYMENT ACTION CALLED ===")
  console.log("Timestamp:", new Date().toISOString())
  console.log("This is a test action to verify server actions are working")
  
  // Redirect to homepage with a test parameter
  redirect("/?test=server-action-working")
} 