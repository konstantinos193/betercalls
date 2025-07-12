"use client"

import * as React from "react"
import { useFormState, useFormStatus } from "react-dom"
import { updateAvatar } from "@/app/auth/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { User, Upload } from "lucide-react"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="bg-cyan-400 text-black font-bold hover:bg-cyan-300">
      {pending ? "Uploading..." : "Upload"}
    </Button>
  )
}

type AvatarUploadFormProps = {
  currentAvatarUrl: string | null
  userName: string | null
}

export function AvatarUploadForm({ currentAvatarUrl, userName }: AvatarUploadFormProps) {
  const [preview, setPreview] = React.useState<string | null>(null)
  const [file, setFile] = React.useState<File | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const initialState = { message: "", success: false }
  const [state, dispatch] = useFormState(updateAvatar, initialState)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  React.useEffect(() => {
    if (state.success) {
      setPreview(null)
      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }, [state.success])

  const displayName = userName || "User"
  const fallback = displayName.charAt(0).toUpperCase()

  return (
    <form action={dispatch} className="space-y-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={preview || currentAvatarUrl || ""} alt={displayName} />
          <AvatarFallback className="bg-gray-700 text-gray-300 text-3xl">
            <User className="h-10 w-10" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="avatar-upload"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer"
          >
            <Upload className="mr-2 h-4 w-4" />
            Choose Image
          </Label>
          <Input
            id="avatar-upload"
            name="avatar"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            ref={fileInputRef}
            accept="image/png, image/jpeg, image/gif"
          />
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB.</p>
        </div>
      </div>

      {file && <SubmitButton />}

      {state.message && (
        <p className={cn("text-sm mt-2", state.success ? "text-green-400" : "text-red-400")}>{state.message}</p>
      )}
    </form>
  )
}
