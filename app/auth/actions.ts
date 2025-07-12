"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function signUp(formData: FormData) {
  console.log("=== SIGN UP PROCESS STARTED ===")
  
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  
  console.log("Form data received:", { email: email ? "***" : "missing", password: password ? "***" : "missing" })
  
  if (!email || !password) {
    console.log("Missing email or password")
    return redirect("/sign-up?message=Email and password are required")
  }
  
  console.log("Creating Supabase client...")
  const supabase = createSupabaseServerClient()
  console.log("Supabase client created successfully")
  
  console.log("Attempting to sign up user with email:", email)
  
  // First, try to sign up the user
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
  
  if (!data.user) {
    console.error("No user data returned from sign up")
    return redirect("/sign-up?message=Account creation failed. Please try again.")
  }
  
  console.log("Sign up successful, user created")
  console.log("User ID:", data.user.id)
  console.log("Session:", data.session ? "Session created" : "No session")
  
  // Ensure profile exists (in case trigger didn't fire)
  try {
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
          subscription_status: "inactive",
          is_admin: false
        })
      
      if (insertError) {
        console.error("Failed to create profile:", insertError)
        return redirect(`/sign-up?message=Account created but profile setup failed. Please contact support.`)
      }
    } else if (profileError) {
      console.error("Error checking profile:", profileError)
      return redirect(`/sign-up?message=Account created but profile verification failed. Please contact support.`)
    }
  } catch (profileError) {
    console.error("Unexpected error during profile creation:", profileError)
    return redirect(`/sign-up?message=Account created but profile setup failed. Please contact support.`)
  }
  
  revalidatePath("/", "layout")
  console.log("Redirecting to /calls")
  return redirect("/calls")
}

export async function signIn(formData: FormData) {
  console.log("=== SIGN IN PROCESS STARTED ===")
  console.log("Timestamp:", new Date().toISOString())
  
  try {
    console.log("Creating Supabase server client...")
    const supabase = createSupabaseServerClient()
    console.log("Supabase client created successfully")
    
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    
    console.log("Form data received:", { 
      email: email ? "***" : "missing", 
      password: password ? "***" : "missing",
      emailLength: email?.length || 0,
      passwordLength: password?.length || 0
    })
    
    if (!email || !password) {
      console.log("Missing email or password")
      return redirect("/login?message=Email and password are required")
    }
    
    console.log("Attempting to sign in user with email:", email)
    console.log("Supabase client type:", typeof supabase)
    console.log("Supabase auth object:", supabase.auth ? "Available" : "Missing")
    
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    
    console.log("Sign in response received")
    console.log("Response data type:", typeof data)
    console.log("Response error type:", typeof error)
    console.log("Data:", data ? "User data present" : "No user data")
    console.log("Error:", error ? error.message : "No error")
    
    if (data) {
      console.log("User data details:", {
        userId: data.user?.id,
        userEmail: data.user?.email,
        sessionExists: !!data.session,
        sessionAccessToken: data.session?.access_token ? "Present" : "Missing",
        sessionRefreshToken: data.session?.refresh_token ? "Present" : "Missing"
      })
    }
    
    if (error) {
      console.error("Sign in error details:", {
        message: error.message,
        status: error.status,
        name: error.name,
        stack: error.stack
      })
      return redirect(`/login?message=Could not authenticate user: ${error.message}`)
    }
    
    console.log("Sign in successful")
    console.log("User ID:", data.user?.id)
    console.log("Session:", data.session ? "Session created" : "No session")
    
    console.log("Calling revalidatePath...")
    revalidatePath("/", "layout")
    console.log("RevalidatePath completed")
    
    console.log("Redirecting to /calls")
    redirect("/calls")
  } catch (error: any) {
    console.error("=== UNEXPECTED ERROR DURING SIGN IN ===")
    console.error("Error type:", typeof error)
    console.error("Error constructor:", error?.constructor?.name)
    console.error("Error message:", error?.message)
    console.error("Error stack:", error?.stack)
    console.error("Error details:", {
      name: error?.name,
      code: error?.code,
      status: error?.status,
      statusCode: error?.statusCode
    })
    console.error("Full error object:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2))
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
