"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function signUp(formData: FormData) {
  const supabase = createSupabaseServerClient()
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  if (!email || !password) {
    return redirect("/sign-up?message=Email and password are required")
  }
  const { error } = await supabase.auth.signUp({ email, password })
  if (error) {
    console.error("Sign up error:", error)
    return redirect(`/sign-up?message=Could not authenticate user: ${error.message}`)
  }
  revalidatePath("/", "layout")
  redirect("/calls")
}

export async function signIn(formData: FormData) {
  const supabase = createSupabaseServerClient()
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  if (!email || !password) {
    return redirect("/login?message=Email and password are required")
  }
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    console.error("Sign in error:", error)
    return redirect(`/login?message=Could not authenticate user: ${error.message}`)
  }
  revalidatePath("/", "layout")
  redirect("/calls")
}

export async function signOut() {
  const supabase = createSupabaseServerClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/")
}

// For /account page - refactored to return state
export async function updatePassword(
  prevState: { message: string; success: boolean },
  formData: FormData,
): Promise<{ message: string; success: boolean }> {
  const supabase = createSupabaseServerClient()
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (password !== confirmPassword) {
    return { message: "Passwords do not match.", success: false }
  }
  if (!password || password.length < 6) {
    return { message: "Password must be at least 6 characters long.", success: false }
  }

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    console.error("Password update error:", error)
    return { message: `Could not update password: ${error.message}`, success: false }
  }

  return { message: "Password updated successfully!", success: true }
}

export async function updateProfile(prevState: { message: string; success: boolean }, formData: FormData) {
  const supabase = createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { message: "You must be logged in to update your profile.", success: false }
  }

  const fullName = formData.get("full-name") as string
  if (!fullName || fullName.trim().length === 0) {
    return { message: "Full name cannot be empty.", success: false }
  }

  const { error } = await supabase.from("profiles").update({ full_name: fullName }).eq("id", user.id)

  if (error) {
    console.error("Update profile error:", error)
    return { message: `Database Error: ${error.message}`, success: false }
  }

  revalidatePath("/account")
  return { message: "Profile updated successfully!", success: true }
}

// For /forgot-password page
export async function requestPasswordReset(formData: FormData) {
  const supabase = createSupabaseServerClient()
  const email = formData.get("email") as string
  if (!email) {
    return redirect("/forgot-password?message=Email is required")
  }

  // The callback route will handle setting the session cookie and redirecting.
  const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/update-password`

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  })

  if (error) {
    console.error("Password reset request error:", error)
    return redirect(`/forgot-password?message=Could not process request: ${error.message}`)
  }

  redirect("/login?message=Check your email for a password reset link.")
}

// For /update-password page (after email link)
export async function resetUserPassword(formData: FormData) {
  const supabase = createSupabaseServerClient()
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (password !== confirmPassword) {
    return redirect("/update-password?message=Passwords do not match")
  }

  if (!password || password.length < 6) {
    return redirect("/update-password?message=Password must be at least 6 characters")
  }

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    console.error("Password reset error:", error)
    return redirect(`/update-password?message=Could not update password: ${error.message}`)
  }

  // After successful password reset, sign the user out and redirect to login for security.
  await supabase.auth.signOut()
  redirect("/login?message=Password updated successfully. Please log in.")
}

export async function updateAvatar(prevState: { message: string; success: boolean }, formData: FormData) {
  const supabase = createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { message: "You must be logged in to update your avatar.", success: false }
  }

  const file = formData.get("avatar") as File
  if (!file || file.size === 0) {
    return { message: "Please select an image to upload.", success: false }
  }

  const fileExt = file.name.split(".").pop()
  const filePath = `${user.id}/${Date.now()}.${fileExt}`

  const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file)

  if (uploadError) {
    console.error("Avatar upload error:", uploadError)
    return { message: `Storage Error: ${uploadError.message}`, success: false }
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(filePath)

  const { error: profileError } = await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", user.id)

  if (profileError) {
    console.error("Profile update error:", profileError)
    return { message: `Database Error: ${profileError.message}`, success: false }
  }

  revalidatePath("/account")
  revalidatePath("/calls")
  return { message: "Avatar updated successfully!", success: true }
}
