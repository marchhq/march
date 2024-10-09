"use client"

import React, { useEffect } from "react"

import Integrations from "@/src/components/profile/Integrations"
import UserInfo from "@/src/components/profile/UserInfo"
import { useAuth } from "@/src/contexts/AuthContext"
import useUserStore from "@/src/lib/store/user.store"

const ProfilePage: React.FC = () => {
  const { session } = useAuth()
  const { user, isLoading, error, fetchUser } = useUserStore()

  useEffect(() => {
    if (session) {
      fetchUser(session)
    }
  }, [session, fetchUser])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">{error}</div>
  if (!user) return <div>User not found</div>

  return (
    <div className=" mt-28 bg-background text-foreground w-1/2 ml-[15%]">
      <UserInfo user={user} />
      <Integrations user={user} />
      <footer className="text-[16px] text-muted-foreground mt-24 mb-28">
        <p className="font-semibold mb-2">march 0.1</p>
        <p className="text-xs text-secondary-foreground">
          — crafted for the makers to{" "}
          <span className="text-primary-foreground">get things done</span>;
        </p>
      </footer>
    </div>
  )
}

export default ProfilePage
