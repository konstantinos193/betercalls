"use client"

import * as React from "react"
import { useFormState, useFormStatus } from "react-dom"
import { createCall, type FormState } from "@/app/standoda/actions"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Database } from "@/types/supabase"
import { UploadCloud } from "lucide-react"

type Expert = Database["public"]["Tables"]["experts"]["Row"]

type PostCallFormProps = {
  experts: Expert[]
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full bg-cyan-400 text-black font-bold hover:bg-cyan-300" disabled={pending}>
      {pending ? "Posting..." : "Post Call"}
    </Button>
  )
}

export function PostCallForm({ experts }: PostCallFormProps) {
  const initialState: FormState = { message: "", success: false }
  const [state, dispatch] = useFormState(createCall, initialState)
  const formRef = React.useRef<HTMLFormElement>(null)

  React.useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
    }
  }, [state])

  return (
    <form ref={formRef} action={dispatch}>
      <Card className="bg-black/30 border-gray-800/50">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="expertId">Expert</Label>
            <Select name="expertId" required>
              <SelectTrigger className="bg-gray-900/80 border-gray-700">
                <SelectValue placeholder="Select an expert" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700 text-white">
                {experts.map((expert) => (
                  <SelectItem key={expert.id} value={expert.id}>
                    {expert.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="betType">Bet Type</Label>
            <Input
              id="betType"
              name="betType"
              placeholder="e.g., Moneyline, Spread, Over/Under"
              className="bg-gray-900/80 border-gray-700"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="matchHomeTeam">Home Team</Label>
              <Input
                id="matchHomeTeam"
                name="matchHomeTeam"
                placeholder="Home team name"
                className="bg-gray-900/80 border-gray-700"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="matchAwayTeam">Away Team</Label>
              <Input
                id="matchAwayTeam"
                name="matchAwayTeam"
                placeholder="Away team name"
                className="bg-gray-900/80 border-gray-700"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="odds">Odds</Label>
              <Input
                id="odds"
                name="odds"
                placeholder="e.g., -110, +150"
                className="bg-gray-900/80 border-gray-700"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pick">Pick</Label>
              <Input
                id="pick"
                name="pick"
                placeholder="e.g., Home Team -3.5"
                className="bg-gray-900/80 border-gray-700"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="units">Units</Label>
            <Input
              id="units"
              name="units"
              type="number"
              placeholder="e.g., 1.5"
              min="0.1"
              step="0.1"
              className="bg-gray-900/80 border-gray-700"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select name="status" required>
              <SelectTrigger className="bg-gray-900/80 border-gray-700">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700 text-white">
                <SelectItem value="Upcoming">Upcoming</SelectItem>
                <SelectItem value="Won">Won</SelectItem>
                <SelectItem value="Lost">Lost</SelectItem>
                <SelectItem value="Push">Push</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="analysis">Expert Analysis (Optional)</Label>
            <Textarea
              id="analysis"
              name="analysis"
              placeholder="Explain the reasoning behind the pick..."
              className="bg-gray-900/80 border-gray-700"
            />
          </div>
          <SubmitButton />
          {state.message && (
            <p className={cn("text-sm text-center", state.success ? "text-green-400" : "text-red-400")}>
              {state.message}
            </p>
          )}
        </CardContent>
      </Card>
    </form>
  )
}
