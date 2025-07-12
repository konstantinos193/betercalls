"use client"
import { useFormState, useFormStatus } from "react-dom"
import { updateProfile } from "@/app/auth/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="bg-cyan-400 text-black font-bold hover:bg-cyan-300">
      {pending ? "Saving..." : "Save Changes"}
    </Button>
  )
}

type UpdateProfileFormProps = {
  fullName: string | null
}

export function UpdateProfileForm({ fullName }: UpdateProfileFormProps) {
  const initialState = { message: "", success: false }
  const [state, dispatch] = useFormState(updateProfile, initialState)

  return (
    <form action={dispatch} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="full-name">Display Name</Label>
        <Input
          id="full-name"
          name="full-name"
          type="text"
          required
          defaultValue={fullName || ""}
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
