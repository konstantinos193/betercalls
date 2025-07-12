"use client"

import * as React from "react"
import { useFormState, useFormStatus } from "react-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, User } from "lucide-react"
import type { Call } from "@/types/calls"
import { addComment, type FormState } from "@/app/actions/discussion"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button size="icon" className="bg-cyan-500 hover:bg-cyan-400 flex-shrink-0" disabled={pending}>
      <Send className="h-4 w-4 text-black" />
    </Button>
  )
}

export function ContextualPanel({ call }: { call: Call | null }) {
  const formRef = React.useRef<HTMLFormElement>(null)
  const initialState: FormState = { message: "", success: false }
  // Bind the call.id to the server action
  const addCommentWithId = addComment.bind(null, call?.id || "")
  const [state, dispatch] = useFormState(addCommentWithId, initialState)

  React.useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
    }
  }, [state])

  if (!call) {
    return (
      <div className="h-full bg-black/30 border border-gray-800/50 rounded-xl flex items-center justify-center">
        <p className="text-gray-500">Select a call to see details</p>
      </div>
    )
  }

  return (
    <div className="h-full bg-black/30 border border-gray-800/50 rounded-xl flex flex-col">
      <Tabs defaultValue="discussion" className="w-full flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 bg-gray-900/80 rounded-t-xl rounded-b-none border-b border-gray-800/50">
          <TabsTrigger value="discussion">Discussion</TabsTrigger>
          <TabsTrigger value="analysis">Expert Analysis</TabsTrigger>
        </TabsList>
        <TabsContent value="discussion" className="flex-1 flex flex-col p-4 overflow-y-auto">
          <div className="flex-1 space-y-4">
            {call.discussion.length > 0 ? (
              call.discussion.map((msg) => (
                <div key={msg.id} className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={msg.author.avatarUrl || ""} alt={msg.author.name || "User"} />
                    <AvatarFallback className="bg-gray-700 text-gray-300">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-bold text-sm text-white">{msg.author.name}: </span>
                    <span className="text-sm text-gray-300">{msg.content}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No discussion on this call yet. Be the first to comment!
              </div>
            )}
          </div>
          <form ref={formRef} action={dispatch} className="mt-4 flex items-center gap-2">
            <Input
              name="comment"
              type="text"
              placeholder="Join the discussion..."
              className="bg-gray-900/80 border-gray-700 focus:ring-cyan-500 focus:border-cyan-500"
              required
            />
            <SubmitButton />
          </form>
          {state.message && !state.success && <p className={cn("text-sm text-red-400 mt-2")}>{state.message}</p>}
        </TabsContent>
        <TabsContent value="analysis" className="flex-1 p-4 overflow-y-auto">
          <h3 className="font-bold text-lg text-white mb-2">Analysis from {call.expert.name}</h3>
          <p className="text-gray-300 whitespace-pre-wrap">{call.analysis}</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
