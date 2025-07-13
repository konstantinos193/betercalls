"use client"

import * as React from "react"
import { useFormState, useFormStatus } from "react-dom"
import { saveExpert, deleteExpert, type FormState } from "@/app/standoda/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Edit, Trash2, User } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import type { Database } from "@/types/supabase"

type Expert = Database["public"]["Tables"]["experts"]["Row"]

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="bg-cyan-400 text-black font-bold hover:bg-cyan-300">
      {pending ? "Saving..." : isEditing ? "Save Changes" : "Create Expert"}
    </Button>
  )
}

type ExpertFormProps = {
  isOpen: boolean
  onClose: () => void
  expert?: Expert | null
}

export function ExpertForm({ isOpen, onClose, expert }: ExpertFormProps) {
  const initialState = { message: "", success: false }
  const [state, dispatch] = useFormState(saveExpert, initialState)

  React.useEffect(() => {
    if (state.success) {
      onClose()
    }
  }, [state, onClose])

  const isEditing = !!expert

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Expert" : "Create New Expert"}</DialogTitle>
          <DialogDescription>
            {isEditing ? `Editing "${expert.name}"` : "Add a new expert analyst to the platform."}
          </DialogDescription>
        </DialogHeader>
        <form action={dispatch} className="space-y-4">
          <input type="hidden" name="id" value={expert?.id || ""} />
          <div className="space-y-2">
            <Label htmlFor="name">Expert Name</Label>
            <Input id="name" name="name" defaultValue={expert?.name || ""} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" name="bio" defaultValue={expert?.bio || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="avatar_url">Avatar URL</Label>
            <Input id="avatar_url" name="avatar_url" defaultValue={expert?.avatar_url || ""} />
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

export function ExpertsManagement({ experts }: { experts: Expert[] }) {
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [selectedExpert, setSelectedExpert] = React.useState<Expert | null>(null)

  const handleEdit = (expert: Expert) => {
    setSelectedExpert(expert)
    setIsFormOpen(true)
  }

  const handleCreate = () => {
    setSelectedExpert(null)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setSelectedExpert(null)
  }

  const handleDelete = async (expertId: string) => {
    if (confirm("Are you sure you want to delete this expert? This action cannot be undone.")) {
      const formData = new FormData()
      formData.append("id", expertId)
      await deleteExpert(formData)
    }
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={handleCreate} className="bg-cyan-400 text-black font-bold hover:bg-cyan-300">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Expert
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experts.map((expert) => (
          <Card key={expert.id} className="bg-black/30 border-gray-800/50">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Avatar className="h-12 w-12 mr-4">
                <AvatarImage src={expert.avatar_url || ""} alt={expert.name} />
                <AvatarFallback>
                  <User className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-lg text-white">{expert.name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {expert.follower_count || 0} followers
                  </Badge>
                  {expert.win_rate && (
                    <Badge variant="outline" className="text-xs">
                      {expert.win_rate.toFixed(1)}% win rate
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(expert)}
                  className="text-gray-400 hover:text-white"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(expert.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400 line-clamp-2">{expert.bio || "No bio available."}</p>
              <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                <span>{expert.total_calls || 0} calls</span>
                <span>{expert.total_units?.toFixed(2) || "0.00"} units</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ExpertForm isOpen={isFormOpen} onClose={handleCloseForm} expert={selectedExpert} />
    </div>
  )
} 