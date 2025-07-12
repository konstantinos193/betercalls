export default function DebugEnvPage() {
  const envVars = {
    SUPABASE_URL: process.env.SUPABASE_URL ? "Set" : "Missing",
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? "Set" : "Missing",
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "Set" : "Missing",
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Missing",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Missing",
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "Not set",
    HELIO_SECRET_KEY: process.env.HELIO_SECRET_KEY ? "Set" : "Missing",
    HELIO_WEBHOOK_SECRET: process.env.HELIO_WEBHOOK_SECRET ? "Set" : "Missing",
  }

  return (
    <div className="bg-[#0D0D0D] text-gray-200 font-sans min-h-screen p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Environment Variables Debug</h1>
      <div className="space-y-4">
        {Object.entries(envVars).map(([key, value]) => (
          <div key={key} className="bg-gray-900/30 p-4 rounded-lg border border-gray-800/50">
            <span className="font-mono text-cyan-400">{key}:</span>{" "}
            <span className={value === "Missing" ? "text-red-400" : "text-green-400"}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
} 