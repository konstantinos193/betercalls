import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    console.log("Testing database connection...");
    console.log("SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log("SERVICE_ROLE_KEY exists:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    
    // Test connection by querying users
    const { data: users, error } = await supabase
      .from("users")
      .select("id, email, name, created_at")
      .limit(10);
    
    if (error) {
      console.log("Database error:", error);
      return NextResponse.json({ 
        error: error.message,
        details: error
      }, { status: 500 });
    }
    
    console.log("Users found:", users?.length || 0);
    
    return NextResponse.json({
      success: true,
      userCount: users?.length || 0,
      users: users || [],
      env: {
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET
      }
    });
  } catch (error) {
    console.error("Test DB error:", error);
    return NextResponse.json({ 
      error: "Database connection failed",
      details: error
    }, { status: 500 });
  }
} 