"use client"

import * as React from "react"
import { useFormState, useFormStatus } from "react-dom"
import { saveCategory } from "@/app/standoda/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import type { Database } from "@/types/supabase"

type Category = Database["public"]["Tables"]["categories"]["Row"]

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="bg-cyan-400 text-black font-bold hover:bg-cyan-300">
      {pending ? "Saving..." : isEditing ? "Save Changes" : "Create Category"}
    </Button>
  )
}

type CategoryFormProps = {
  isOpen: boolean
  onClose: () => void
  category: Category | null
}

export function CategoryForm({ isOpen, onClose, category }: CategoryFormProps) {
  const initialState = { message: "", success: false }
  const [state, dispatch] = useFormState(saveCategory, initialState)

  React.useEffect(() => {
    if (state.success) {
      onClose()
    }
  }, [state, onClose])

  const isEditing = !!category

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Category" : "Create New Category"}</DialogTitle>
        </DialogHeader>
        <form action={dispatch} className="space-y-4">
          <input type="hidden" name="id" value={category?.id || ""} />
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input id="name" name="name" defaultValue={category?.name || ""} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" defaultValue={category?.description || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="icon_name">Icon Name (from Lucide)</Label>
            <Input
              id="icon_name"
              name="icon_name"
              placeholder="e.g., 'Football'"
              defaultValue={category?.icon_name || ""}
            />
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
