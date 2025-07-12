import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield } from "lucide-react"
import { adminLogin } from "@/app/admin/actions"

export default function AdminLoginPage({ searchParams }: { searchParams: { message?: string } }) {
  return (
    <div className="bg-[#0D0D0D] text-gray-200 font-sans min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm bg-black/30 border-gray-800/50">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-2">
            <Shield className="h-8 w-8 text-cyan-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Admin Access</CardTitle>
          <CardDescription className="text-gray-400">BeterCalls Control Panel</CardDescription>
        </CardHeader>
        <form action={adminLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@betercalls.com"
                required
                className="bg-gray-900/80 border-gray-700 focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="bg-gray-900/80 border-gray-700 focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>
            <Button type="submit" className="w-full bg-cyan-400 text-black font-bold hover:bg-cyan-300">
              Log In
            </Button>
            {searchParams.message && (
              <p className="text-center text-sm text-red-400">{searchParams.message}</p>
            )}
          </CardContent>
        </form>
      </Card>
    </div>
  )
}
