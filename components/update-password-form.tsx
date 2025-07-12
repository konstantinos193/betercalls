"use client"
import { useFormState, useFormStatus } from "react-dom"
import { updatePassword } from "@/app/auth/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="bg-cyan-400 text-black font-bold hover:bg-cyan-300">
      {pending ? "Updating..." : "Update Password"}
    </Button>
  )
}

export function UpdatePasswordForm() {
  const initialState = { message: "", success: false }
  const [state, dispatch] = useFormState(updatePassword, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
    }
  }, [state])

  return (
    <form ref={formRef} action={dispatch} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          className="bg-gray-900/80 border-gray-700 focus:ring-cyan-500 focus:border-cyan-500"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          className="bg-gray-900/80 border-gray-700 focus:ring-cyan-500 focus:border-cyan-500"
        />
      </div>
      <SubmitButton />
      {state.message && (
        <p className={cn("text-sm mt-2", state.success ? "text-green-400" : "text-red-400")}>{state.message}</p>
      )}
    </form>
  )
}
