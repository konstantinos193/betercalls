import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();
  if (!token || !password) {
    return NextResponse.json({ error: "Token and password are required." }, { status: 400 });
  }
  // Find token
  const { data: resetToken } = await supabase
    .from("password_reset_tokens")
    .select("*")
    .eq("token", token)
    .eq("used", false)
    .single();
  if (!resetToken || new Date(resetToken.expires_at) < new Date()) {
    return NextResponse.json({ error: "Invalid or expired token." }, { status: 400 });
  }
  // Update password
  const password_hash = await bcrypt.hash(password, 10);
  await supabase
    .from("users")
    .update({ password_hash })
    .eq("id", resetToken.user_id);
  // Invalidate token
  await supabase
    .from("password_reset_tokens")
    .update({ used: true })
    .eq("id", resetToken.id);
  return NextResponse.json({ success: true });
} 