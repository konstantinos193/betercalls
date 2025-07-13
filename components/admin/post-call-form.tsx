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
            <Label htmlFor="expert-id">Expert</Label>
            <Select name="expert-id" required>
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="home-team">Home Team</Label>
              <Input
                id="home-team"
                name="home-team"
                placeholder="e.g., Chiefs"
                className="bg-gray-900/80 border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="away-team">Away Team</Label>
              <Input
                id="away-team"
                name="away-team"
                placeholder="e.g., 49ers"
                className="bg-gray-900/80 border-gray-700"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bet-type">Bet Type</Label>
            <Select name="bet-type">
              <SelectTrigger className="bg-gray-900/80 border-gray-700">
                <SelectValue placeholder="Select a bet type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700 text-white">
                <SelectItem value="Spread">Spread</SelectItem>
                <SelectItem value="Moneyline">Moneyline</SelectItem>
                <SelectItem value="Total">Total (Over/Under)</SelectItem>
                <SelectItem value="Prop">Player Prop</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pick">Pick</Label>
              <Input id="pick" name="pick" placeholder="e.g., Chiefs -2.5" className="bg-gray-900/80 border-gray-700" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="odds">Odds</Label>
              <Input id="odds" name="odds" placeholder="e.g., -110" className="bg-gray-900/80 border-gray-700" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="units">Units</Label>
            <Input
              id="units"
              name="units"
              type="number"
              placeholder="1-5"
              min="0.1"
              step="0.1"
              className="bg-gray-900/80 border-gray-700"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="analysis">Expert Analysis</Label>
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
