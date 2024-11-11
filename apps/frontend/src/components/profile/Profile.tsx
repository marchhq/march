"use client"

import React, { useEffect } from "react"

import { LogOutIcon } from "lucide-react"

import Integrations from "@/src/components/profile/Integrations"
import UserInfo from "@/src/components/profile/UserInfo"
import Spinner from "@/src/components/ui/spinner"
import { useAuth } from "@/src/contexts/AuthContext"
import useUserStore from "@/src/lib/store/user.store"

const ProfilePage: React.FC = () => {
  const { session } = useAuth()
  const { user, isLoading, fetchUser } = useUserStore()
  const { logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)

  useEffect(() => {
    if (session) {
      fetchUser(session)
    }
  }, [session, fetchUser])

  if (isLoading) return <div>Loading...</div>
  // if (error) return <div className="text-red-500">{error}</div>
  if (!user) return <div>User not found</div>

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await logout()
    setIsLoggingOut(false)
  }

  return (
    // TODO:: Can have a better way to adjust the layout(left margin) using flex
    <div className="mt-8  w-1/2 bg-background p-10 text-foreground">
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
          className="mt-12 flex items-center gap-2 rounded-lg bg-[#382826E5] px-2 py-1 text-base font-semibold text-[#EF6258CC]"
        >
          {isLoggingOut ? (
            <Spinner color="blue" size={5} />
          ) : (
            <LogOutIcon size={20} />
          )}{" "}
          Logout{" "}
        </button>
      </footer>
    </div>
  )
}

export default ProfilePage
