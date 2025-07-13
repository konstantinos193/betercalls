import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();
    console.log("Signup request received for:", email);
    
    if (!email || !password) {
      console.log("Missing email or password");
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }
    
    const password_hash = await bcrypt.hash(password, 10);
    console.log("Password hashed, inserting user...");
    
    const { data, error } = await supabase
      .from("users")
      .insert([{ email, password_hash, name }])
      .select()
      .single();
      
    if (error) {
      console.log("Database error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    console.log("User created successfully:", { id: data.id, email: data.email });
    return NextResponse.json({ user: { id: data.id, email: data.email, name: data.name } });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 