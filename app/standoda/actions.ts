"use server"

import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export type FormState = {
  message?: string
  errors?: Record<string, string[]>
}

export async function createCall(prevState: FormState, formData: FormData) {
  const supabase = createSupabaseAdminClient()
  
  const expertId = formData.get("expertId") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const status = formData.get("status") as string

  if (!expertId || !title || !description || !status) {
    return {
      message: "All fields are required",
      errors: {
        expertId: ["Expert is required"],
        title: ["Title is required"],
        description: ["Description is required"],
        status: ["Status is required"],
      },
    }
  }

  const { error } = await supabase.from("calls").insert({
    expert_id: expertId,
    title,
    description,
    status,
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
  
  const name = formData.get("name") as string
  const price = formData.get("price") as string
  const description = formData.get("description") as string

  if (!name || !price || !description) {
    return {
      message: "All fields are required",
      errors: {
        name: ["Name is required"],
        price: ["Price is required"],
        description: ["Description is required"],
      },
    }
  }

  const { error } = await supabase.from("plans").insert({
    name,
    price: parseFloat(price),
    description,
  })

  if (error) {
    return {
      message: "Failed to create plan",
      errors: {
        _form: [error.message],
      },
    }
  }

  revalidatePath("/standoda/plans")
  return { message: "Plan created successfully" }
}

export async function updateUserSubscription(userId: string, subscriptionStatus: string) {
  const supabase = createSupabaseAdminClient()
  
  const { error } = await supabase
    .from("profiles")
    .update({ subscription_status: subscriptionStatus })
    .eq("id", userId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/standoda/users")
} 