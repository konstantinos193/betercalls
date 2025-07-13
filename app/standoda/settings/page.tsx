import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { KeyRound, SlidersHorizontal, AlertTriangle } from "lucide-react"

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Admin Settings</h1>
      <p className="text-gray-400">Manage your application's configuration and API keys.</p>

      <Card className="bg-black/30 border-gray-800/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <KeyRound className="h-6 w-6 text-cyan-400" />
            <CardTitle className="text-xl text-white">API Keys</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            Manage integrations and API keys. Changes here can affect application functionality.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="helio-secret">Helio Secret Key</Label>
            <Input id="helio-secret" type="password" defaultValue="••••••••••••••••" disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="helio-webhook">Helio Webhook Secret</Label>
            <Input id="helio-webhook" type="password" defaultValue="••••••••••••••••" disabled />
          </div>
          <Button variant="outline" disabled>
            Update Keys
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-black/30 border-gray-800/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="h-6 w-6 text-cyan-400" />
            <CardTitle className="text-xl text-white">General Settings</CardTitle>
          </div>
          <CardDescription className="text-gray-400">Configure general application settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-gray-700 p-4">
            <div>
              <Label htmlFor="maintenance-mode" className="font-medium text-white">
                Maintenance Mode
              </Label>
              <p className="text-xs text-gray-500">Temporarily disable public access to the site.</p>
            </div>
            <Switch id="maintenance-mode" disabled />
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-500/50 bg-red-900/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-red-400" />
            <CardTitle className="text-xl text-red-300">Danger Zone</CardTitle>
          </div>
          <CardDescription className="text-red-400/80">
            These actions are irreversible. Please proceed with caution.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" disabled>
            Reset All Stats
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
