"use server"

import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function signUp(formData: FormData) {
  console.log("=== SIGN UP PROCESS STARTED ===")
  
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string
  
  console.log("Form data received:", { email: email ? "***" : "missing", password: password ? "***" : "missing" })
  
  if (!email || !password) {
    console.log("Missing email or password")
    return redirect("/sign-up?message=Email and password are required")
  }
  
  // Check if user already exists
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single()

  if (existingUser) {
    return redirect("/sign-up?message=User with this email already exists")
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 12)
  
  // Create user in our users table
  const { data: newUser, error } = await supabase
    .from("users")
    .insert({
      email,
      password_hash: hashedPassword,
      name: name || email.split('@')[0] // Use email prefix as name if not provided
    })
    .select()
    .single()

  if (error) {
    console.error("Sign up error:", error)
    return redirect(`/sign-up?message=Could not create account: ${error.message}`)
  }
  
  console.log("Sign up successful, user created")
  console.log("User ID:", newUser.id)
  
  return redirect("/login?message=Account created successfully! Please sign in.")
}

export async function signIn(formData: FormData) {
  console.log("=== SIGN IN PROCESS STARTED ===")
  
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  
  console.log("Form data received:", { 
    email: email ? "***" : "missing", 
    password: password ? "***" : "missing"
  })
  
  if (!email || !password) {
    console.log("Missing email or password")
    return redirect("/login?message=Email and password are required")
  }
  
  // Find user by email
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single()

  if (error || !user) {
    console.log("User not found")
    return redirect("/login?message=Invalid email or password")
  }

  // Verify password
  const isValid = await bcrypt.compare(password, user.password_hash)
  if (!isValid) {
    console.log("Invalid password")
    return redirect("/login?message=Invalid email or password")
  }

  console.log("Sign in successful")
  console.log("User ID:", user.id)
  
  // For NextAuth, we redirect to the signin page which will handle the authentication
  return redirect("/api/auth/signin?callbackUrl=/calls")
}

export async function signOut() {
  revalidatePath("/", "layout")
  redirect("/api/auth/signout")
}

export async function resendConfirmationEmail(formData: FormData) {
  const email = formData.get("email") as string
  
  if (!email) {
    return redirect("/sign-up?message=Email is required")
  }
  
  // Check if user exists
  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single()

  if (!user) {
    return redirect("/sign-up?message=No account found with this email")
  }
  
  return redirect(`/email-confirmation?message=If an account exists with this email, you will receive a confirmation.&email=${encodeURIComponent(email)}`)
}

// For /account page - refactored to return state
export async function updatePassword(
  prevState: { message: string; success: boolean },
  formData: FormData,
): Promise<{ message: string; success: boolean }> {
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (password !== confirmPassword) {
    return { message: "Passwords do not match.", success: false }
  }
  if (!password || password.length < 6) {
    return { message: "Password must be at least 6 characters long.", success: false }
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(password, 12)

  // Update password in users table
  const { error } = await supabase
    .from("users")
    .update({ password_hash: hashedPassword })
    .eq("email", "user@example.com") // This should be the current user's email

  if (error) {
    console.error("Password update error:", error)
    return { message: `Could not update password: ${error.message}`, success: false }
  }

  return { message: "Password updated successfully!", success: true }
}

export async function updateProfile(prevState: { message: string; success: boolean }, formData: FormData) {
  const fullName = formData.get("full-name") as string
  if (!fullName || fullName.trim().length === 0) {
    return { message: "Full name cannot be empty.", success: false }
  }

  const { error } = await supabase
    .from("users")
    .update({ name: fullName })
    .eq("email", "user@example.com") // This should be the current user's email

  if (error) {
    console.error("Update profile error:", error)
    return { message: `Database Error: ${error.message}`, success: false }
  }

  revalidatePath("/account")
  return { message: "Profile updated successfully!", success: true }
}

// For /forgot-password page
export async function requestPasswordReset(formData: FormData) {
  const email = formData.get("email") as string
  if (!email) {
    return redirect("/forgot-password?message=Email is required")
  }

  // Check if user exists
  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single()

  if (!user) {
    return redirect("/forgot-password?message=If an account exists with this email, you will receive a reset link.")
  }

  // For now, just redirect to a message page
  // In production, you'd send an email with a reset link
  return redirect("/forgot-password?message=If an account exists with this email, you will receive a reset link.")
}

export async function resetUserPassword(formData: FormData) {
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (password !== confirmPassword) {
    return redirect("/update-password?message=Passwords do not match")
  }
  if (!password || password.length < 6) {
    return redirect("/update-password?message=Password must be at least 6 characters long")
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(password, 12)

  // Update password in users table
  const { error } = await supabase
    .from("users")
    .update({ password_hash: hashedPassword })
    .eq("email", "user@example.com") // This should be the current user's email

  if (error) {
    console.error("Password reset error:", error)
    return redirect(`/update-password?message=Could not reset password: ${error.message}`)
  }

  return redirect("/login?message=Password reset successfully! Please sign in with your new password.")
}

export async function updateAvatar(prevState: { message: string; success: boolean }, formData: FormData) {
  const avatarUrl = formData.get("avatarUrl") as string
  if (!avatarUrl) {
    return { message: "Avatar URL is required.", success: false }
  }

  const { error } = await supabase
    .from("users")
    .update({ avatar_url: avatarUrl })
    .eq("email", "user@example.com") // This should be the current user's email

  if (error) {
    console.error("Avatar update error:", error)
    return { message: `Could not update avatar: ${error.message}`, success: false }
  }

  revalidatePath("/account")
  return { message: "Avatar updated successfully!", success: true }
}
