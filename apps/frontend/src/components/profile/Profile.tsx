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
    <div className="flex min-h-screen w-full p-10">
      <div className="flex w-full max-w-lg flex-col justify-between p-6">
        <div className="flex flex-col space-y-8">
          <UserInfo user={user} />
          <Integrations user={user} />
        </div>

        <footer className="flex flex-col space-y-4 py-6">
          <div className="space-y-2">
            <p className="font-semibold text-primary-foreground">march 0.1</p>
            <p className="text-xs text-secondary-foreground">
              — crafted for the makers to{" "}
              <span className="text-primary-foreground">get things done</span>
            </p>
          </div>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-fit items-center gap-2 rounded-lg bg-[#382826E5] px-4 py-2 text-base font-semibold text-[#EF6258CC] transition-colors hover:bg-[#382826] disabled:opacity-50"
          >
            {isLoggingOut ? (
              <div className="size-5 animate-spin rounded-full border-2 border-[#EF6258CC] border-t-transparent" />
            ) : (
              <LogOutIcon size={20} />
            )}
            Logout
          </button>
        </footer>
      </div>
    </div>
  )
}

export default ProfilePage
