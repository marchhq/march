"use client"

import React, { useEffect } from "react"

import Integrations from "@/src/components/profile/Integrations"
import UserInfo from "@/src/components/profile/UserInfo"
import { useAuth } from "@/src/contexts/AuthContext"
import useUserStore from "@/src/lib/store/user.store"
import { Spinner } from "@phosphor-icons/react"
import { Loader2, LogOutIcon, LucideLoader2 } from "lucide-react"

const ProfilePage: React.FC = () => {
  const { session } = useAuth()
  const { user, isLoading, error, fetchUser } = useUserStore()
  const { logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)

  useEffect(() => {
    if (session) {
      fetchUser(session)
    }
  }, [session, fetchUser])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">{error}</div>
  if (!user) return <div>User not found</div>

    const handleLogout = async()=>{
      setIsLoggingOut(true)
      await logout()
      setIsLoggingOut(false)
    }

  return (
    // TODO:: Can have a better way to adjust the layout(left margin) using flex
    <div className="ml-[160px] w-1/2  bg-background p-16 text-foreground">
      <UserInfo user={user} />
      <Integrations user={user} />
      <footer className="text-muted-foreground mb-28 mt-24 text-[16px]">
        <p className="mb-2 font-semibold">march 0.1</p>
        <p className="text-xs text-secondary-foreground">
          — crafted for the makers to{" "}
          <span className="text-primary-foreground">get things done</span>;
        </p>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="px-2 py-1 mt-12 flex gap-2 items-center rounded-lg text-base font-semibold text-[#EF6258CC] bg-[#382826E5]"
        >
          Logout{" "}
          {!isLoggingOut ? (
            <LucideLoader2 size={20} />
          ) : (
            <LogOutIcon size={20} />
          )}
        </button>
      </footer>
    </div>
  )
}

export default ProfilePage
