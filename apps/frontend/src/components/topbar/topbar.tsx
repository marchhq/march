"use client"

import { useEffect } from "react"

import { BracketsIcon } from "lucide-react"

import { useAuth } from "@/src/contexts/AuthContext"
import useUserStore from "@/src/lib/store/user.store"

export const Topbar = () => {
  const { session } = useAuth()
  const { user, fetchUser } = useUserStore()

  useEffect(() => {
    fetchUser(session)
  }, [session, fetchUser])

  return (
    <div className="flex h-10 items-center justify-center">
      <div className="flex items-center space-x-2">
        <BracketsIcon size={18} className="text-secondary-foreground" />
        <span className="size-1 rounded-full bg-secondary-foreground"></span>
        <p className="text-sm text-secondary-foreground">
          {user?.userName || user?.fullName}
        </p>
      </div>
    </div>
  )
}
