"use client"

import * as React from "react"
import { useFormState, useFormStatus } from "react-dom"
import { savePlan } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Database } from "@/types/supabase"

type Plan = Database["public"]["Tables"]["subscription_plans"]["Row"]

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="bg-cyan-400 text-black font-bold hover:bg-cyan-300">
      {pending ? "Saving..." : isEditing ? "Save Changes" : "Create Plan"}
    </Button>
  )
}

type PlanFormProps = {
  isOpen: boolean
  onClose: () => void
  plan: Plan | null
}

export function PlanForm({ isOpen, onClose, plan }: PlanFormProps) {
  const initialState = { message: "", success: false }
  const [state, dispatch] = useFormState(savePlan, initialState)

  React.useEffect(() => {
    if (state.success) {
      onClose()
    }
  }, [state, onClose])

  const isEditing = !!plan

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Plan" : "Create New Plan"}</DialogTitle>
          <DialogDescription>
            {isEditing ? `Editing the "${plan.name}" plan.` : "Define a new subscription plan for your users."}
          </DialogDescription>
        </DialogHeader>
        <form action={dispatch} className="space-y-4">
          <input type="hidden" name="id" value={plan?.id || ""} />
          <div className="space-y-2">
            <Label htmlFor="name">Plan Name</Label>
            <Input id="name" name="name" defaultValue={plan?.name || ""} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" defaultValue={plan?.description || ""} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (€)</Label>
              <Input id="price" name="price" type="number" step="0.01" defaultValue={plan?.price || ""} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interval">Interval</Label>
              <Select name="interval" defaultValue={plan?.interval || "monthly"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="features">Features (one per line)</Label>
            <Textarea id="features" name="features" defaultValue={(plan?.features as string[])?.join("\n") || ""} />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="is_active" name="is_active" defaultChecked={plan?.is_active ?? true} />
            <Label htmlFor="is_active">Plan is Active</Label>
          </div>
          <DialogFooter>
            <Button variant="ghost" type="button" onClick={onClose}>
              Cancel
            </Button>
            <SubmitButton isEditing={isEditing} />
          </DialogFooter>
          {state.message && !state.success && <p className="text-sm text-red-400">{state.message}</p>}
        </form>
      </DialogContent>
    </Dialog>
  )
}
