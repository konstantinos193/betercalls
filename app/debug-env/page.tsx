import { SiteHeader } from "@/components/site-header"

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'

export default async function DebugEnvPage() {
  const envVars = {
    HELIO_SECRET_KEY: process.env.HELIO_SECRET_KEY ? "Set" : "Missing",
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "Not set",
    SUPABASE_URL: process.env.SUPABASE_URL ? "Set" : "Missing",
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? "Set" : "Missing",
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "Set" : "Missing",
  }

  return (
    <div className="bg-[#0D0D0D] text-gray-200 font-sans min-h-screen">
      <SiteHeader />
      <main className="container mx-auto py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Environment Variables Debug</h1>
          
          <div className="space-y-4">
            {Object.entries(envVars).map(([key, value]) => (
              <div key={key} className="bg-black/30 p-4 rounded-lg border border-gray-800/50">
                <h3 className="font-semibold text-white">{key}</h3>
                <p className={`text-sm ${value === "Set" ? "text-green-400" : value === "Missing" ? "text-red-400" : "text-gray-400"}`}>
                  {value}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
            <h3 className="font-semibold text-yellow-400 mb-2">Note:</h3>
            <p className="text-sm text-gray-300">
              If HELIO_SECRET_KEY shows as "Missing", that's why the payment redirect is failing. 
              You need to set this environment variable in your production environment.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
} 