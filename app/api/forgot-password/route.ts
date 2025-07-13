import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }
  // Find user
  const { data: user } = await supabase.from("users").select("*").eq("email", email).single();
  if (!user) {
    // Don't reveal if user exists
    return NextResponse.json({ success: true });
  }
  // Generate token
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes
  // Store token
  await supabase.from("password_reset_tokens").insert({
    user_id: user.id,
    token,
    expires_at: expiresAt.toISOString(),
  });
  // TODO: Send email with reset link
  // e.g., https://betercalls.com/reset-password?token=TOKEN
  return NextResponse.json({ success: true });
} 