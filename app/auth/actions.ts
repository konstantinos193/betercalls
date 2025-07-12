"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function signUp(formData: FormData) {
  console.log("=== SIGN UP PROCESS STARTED ===")
  
  console.log("Creating Supabase client...")
  const supabase = createSupabaseServerClient()
  console.log("Supabase client created successfully")
  
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  
  console.log("Form data received:", { email: email ? "***" : "missing", password: password ? "***" : "missing" })
  
  if (!email || !password) {
    console.log("Missing email or password")
    return redirect("/sign-up?message=Email and password are required")
  }
  
  console.log("Attempting to sign up user with email:", email)
  
  try {
    const { data, error } = await supabase.auth.signUp({ email, password })
    
    console.log("Sign up response received")
    console.log("Data:", data ? "User data present" : "No user data")
    console.log("Error:", error ? error.message : "No error")
    
    if (error) {
      console.error("Sign up error details:", {
        message: error.message,
        status: error.status,
        name: error.name
      })
      return redirect(`/sign-up?message=Could not authenticate user: ${error.message}`)
    }
    
    console.log("Sign up successful, user created")
    console.log("User ID:", data.user?.id)
    console.log("Session:", data.session ? "Session created" : "No session")
    
    // Ensure profile exists (in case trigger didn't fire)
    if (data.user?.id) {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", data.user.id)
        .single()
      
      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        console.log("Profile not found, creating one")
        const { error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: data.user.id,
            subscription_status: "inactive"
          })
        
        if (insertError) {
          console.error("Failed to create profile:", insertError)
          return redirect(`/sign-up?message=Account created but profile setup failed. Please contact support.`)
        }
      } else if (profileError) {
        console.error("Error checking profile:", profileError)
        return redirect(`/sign-up?message=Account created but profile verification failed. Please contact support.`)
      }
    }
    
    revalidatePath("/", "layout")
    console.log("Redirecting to /calls")
    redirect("/calls")
  } catch (error) {
    console.error("Unexpected error during sign up:", error)
    
    // Log more details about the error
    if (error instanceof Error) {
      console.error("Error name:", error.name)
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
      return redirect(`/sign-up?message=Unexpected error: ${error.message}`)
    } else {
      console.error("Unknown error type:", typeof error)
      console.error("Error value:", error)
      return redirect(`/sign-up?message=Unexpected error during sign up`)
    }
  }
}

export async function signIn(formData: FormData) {
  console.log("=== SIGN IN PROCESS STARTED ===")
  
  const supabase = createSupabaseServerClient()
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  
  console.log("Form data received:", { email: email ? "***" : "missing", password: password ? "***" : "missing" })
  
  if (!email || !password) {
    console.log("Missing email or password")
    return redirect("/login?message=Email and password are required")
  }
  
  console.log("Attempting to sign in user with email:", email)
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    
    console.log("Sign in response received")
    console.log("Data:", data ? "User data present" : "No user data")
    console.log("Error:", error ? error.message : "No error")
    
    if (error) {
      console.error("Sign in error details:", {
        message: error.message,
        status: error.status,
        name: error.name
      })
      return redirect(`/login?message=Could not authenticate user: ${error.message}`)
    }
    
    console.log("Sign in successful")
    console.log("User ID:", data.user?.id)
    console.log("Session:", data.session ? "Session created" : "No session")
    
    revalidatePath("/", "layout")
    console.log("Redirecting to /calls")
    redirect("/calls")
  } catch (error) {
    console.error("Unexpected error during sign in:", error)
    return redirect(`/login?message=Unexpected error during sign in`)
  }
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
