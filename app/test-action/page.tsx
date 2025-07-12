import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { testPayment } from "@/app/actions/test-payment"

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'

export default function TestActionPage() {
  return (
    <div className="bg-[#0D0D0D] text-gray-200 font-sans min-h-screen">
      <SiteHeader />
      <main className="container mx-auto py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-8">Test Server Action</h1>
          <p className="text-gray-400 mb-8">
            This page tests if server actions are working properly.
          </p>
          
          <form action={testPayment}>
            <Button 
              type="submit"
              size="lg"
              className="bg-cyan-400 text-black font-bold hover:bg-cyan-300"
            >
              Test Server Action
            </Button>
          </form>
          
          <div className="mt-8 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
            <h3 className="font-semibold text-yellow-400 mb-2">Instructions:</h3>
            <p className="text-sm text-gray-300">
              1. Click the button above<br/>
              2. Check your server logs for "=== TEST PAYMENT ACTION CALLED ==="<br/>
              3. If you see the logs, server actions are working<br/>
              4. If you don't see logs, there's a server action issue
            </p>
          </div>
        </div>
      </main>
    </div>
  )
} 