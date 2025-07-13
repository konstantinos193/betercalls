import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }
        
        console.log("Attempting to authorize user:", credentials.email);
        
        // 1. Look up user by email
        const { data: user, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", credentials.email)
          .single();

        if (error) {
          console.log("Database error:", error);
          return null;
        }
        
        if (!user) {
          console.log("User not found");
          return null;
        }

        console.log("User found:", { id: user.id, email: user.email });

        // 2. Compare password hash
        const isValid = await bcrypt.compare(credentials.password, user.password_hash);
        if (!isValid) {
          console.log("Invalid password");
          return null;
        }

        console.log("Password valid, returning user");
        // 3. Return user object (omit password_hash)
        const userObject = { 
          id: user.id, 
          name: user.name, 
          email: user.email 
        };
        console.log("Returning user object:", userObject);
        return userObject;
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/api/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}); 