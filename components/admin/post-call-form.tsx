"use client"

import * as React from "react"
import { useFormState, useFormStatus } from "react-dom"
import { createCall, type FormState } from "@/app/admin/actions"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Database } from "@/types/supabase"
import { UploadCloud } from "lucide-react"

type Category = Database["public"]["Tables"]["categories"]["Row"]

type PostCallFormProps = {
  categories: Category[]
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full bg-cyan-400 text-black font-bold hover:bg-cyan-300" disabled={pending}>
      {pending ? "Posting..." : "Post Call"}
    </Button>
  )
}

export function PostCallForm({ categories }: PostCallFormProps) {
  const initialState: FormState = { message: "", success: false }
  const [state, dispatch] = useFormState(createCall, initialState)
  const formRef = React.useRef<HTMLFormElement>(null)
  const [fileName, setFileName] = React.useState("")

  React.useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
      setFileName("")
    }
  }, [state])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.files?.[0]?.name || "")
  }

  return (
    <form ref={formRef} action={dispatch}>
      <Card className="bg-black/30 border-gray-800/50">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category-id">Category</Label>
            <Select name="category-id" required>
              <SelectTrigger className="bg-gray-900/80 border-gray-700">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700 text-white">
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="screenshot">Call Screenshot</Label>
            <Label
              htmlFor="screenshot"
              className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-900/50 hover:bg-gray-900/80"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-8 h-8 mb-4 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-600">PNG, JPG or GIF</p>
              </div>
              <Input
                id="screenshot"
                name="screenshot"
                type="file"
                className="hidden"
                required
                onChange={handleFileChange}
              />
            </Label>
            {fileName && <p className="text-xs text-gray-400 text-center">Selected: {fileName}</p>}
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
