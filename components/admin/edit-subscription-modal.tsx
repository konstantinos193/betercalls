"use client"

import * as React from "react"
import { useFormState, useFormStatus } from "react-dom"
import { updateUserSubscription } from "@/app/standoda/actions"
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
import type { Database } from "@/types/supabase"

type User = Database["public"]["Tables"]["users"]["Row"]

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
  user: User | null
}

export function EditSubscriptionModal({ isOpen, onClose, user }: EditSubscriptionModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [message, setMessage] = React.useState("")

  React.useEffect(() => {
    if (message && !isSubmitting) {
      onClose()
    }
  }, [message, isSubmitting, onClose])

  if (!user) return null

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage("")
    
    const formData = new FormData(e.currentTarget)
    const userId = formData.get("userId") as string
    const subscriptionStatus = formData.get("subscriptionStatus") as string
    
    try {
      await updateUserSubscription(userId, subscriptionStatus)
      setMessage("Subscription updated successfully!")
    } catch (error) {
      setMessage("Failed to update subscription")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Edit Subscription</DialogTitle>
          <DialogDescription>Manually update the subscription status for {user.email}.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="userId" value={user.id} />
          <div className="space-y-2">
            <Label htmlFor="subscriptionStatus">Subscription Status</Label>
            <Select name="subscriptionStatus" defaultValue={user.subscription_status || "inactive"}>
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
            <Button type="submit" disabled={isSubmitting} className="bg-cyan-400 text-black font-bold hover:bg-cyan-300">
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
          {message && <p className="text-sm text-red-400">{message}</p>}
        </form>
      </DialogContent>
    </Dialog>
  )
}
