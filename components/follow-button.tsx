"use client"

import * as React from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { followExpert, unfollowExpert } from "@/app/actions/experts"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

function FollowButtonInner({ isFollowing }: { isFollowing: boolean }) {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      variant="outline"
      className={cn(
        "w-full sm:w-auto transition-all duration-200",
        isFollowing
          ? "bg-gray-800/50 text-white hover:bg-gray-700/50 border-gray-700"
          : "border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black bg-transparent",
      )}
      disabled={pending}
    >
      <Heart className={cn("mr-2 h-4 w-4 transition-all", isFollowing && "fill-red-500 text-red-500")} />
      {pending ? (isFollowing ? "Unfollowing..." : "Following...") : isFollowing ? "Following" : "Follow"}
    </Button>
  )
}

type FollowButtonProps = {
  expertId: string
  initialIsFollowing: boolean
}

export function FollowButton({ expertId, initialIsFollowing }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = React.useState(initialIsFollowing)

  const action = async () => {
    // Optimistic update
    setIsFollowing(!isFollowing)
    try {
      if (isFollowing) {
        await unfollowExpert(expertId)
      } else {
        await followExpert(expertId)
      }
    } catch (error) {
      // Revert on error
      setIsFollowing(isFollowing)
      console.error(error)
    }
  }

  return (
    <form action={action}>
      <FollowButtonInner isFollowing={isFollowing} />
    </form>
  )
}
