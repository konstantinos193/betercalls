"use client"

import * as React from "react"
import { useFormState, useFormStatus } from "react-dom"
import { updateUserSubscription } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { UserWithProfile } from "@/app/admin/users/page"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="bg-cyan-400 text-black font-bold hover:bg-cyan-300">
      {pending ? "Saving..." : "Save Changes"}
    </Button>
  )
}

type EditSubscriptionModalProps = {
  isOpen: boolean
  onClose: () => void
  user: UserWithProfile | null
}

export function EditSubscriptionModal({ isOpen, onClose, user }: EditSubscriptionModalProps) {
  const initialState = { message: "", success: false }
  const [state, dispatch] = useFormState(updateUserSubscription, initialState)

  React.useEffect(() => {
    if (state.success) {
      onClose()
    }
  }, [state, onClose])

  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Edit Subscription</DialogTitle>
          <DialogDescription>Manually update the subscription status for {user.email}.</DialogDescription>
        </DialogHeader>
        <form action={dispatch} className="space-y-4">
          <input type="hidden" name="userId" value={user.id} />
          <div className="space-y-2">
            <Label htmlFor="subscriptionStatus">Subscription Status</Label>
            <Select name="subscriptionStatus" defaultValue={user.profile?.subscription_status || "inactive"}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="ghost" type="button" onClick={onClose}>
              Cancel
            </Button>
            <SubmitButton />
          </DialogFooter>
          {state.message && !state.success && <p className="text-sm text-red-400">{state.message}</p>}
        </form>
      </DialogContent>
    </Dialog>
  )
}
