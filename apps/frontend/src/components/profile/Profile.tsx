"use client"

import React, { useEffect } from "react"

import { Icon } from "@iconify-icon/react/dist/iconify.mjs"
import { ChevronLeft, LogOutIcon } from "lucide-react"
import Link from "next/link"

import { Separator } from "../ui/separator"
import Integrations from "@/src/components/profile/Integrations"
import UserInfo from "@/src/components/profile/UserInfo"
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
    <div className="flex w-full p-10">
      <div className="flex w-full max-w-lg flex-col justify-between p-6">
        <div className="flex grow flex-col">
          <div className="mb-8 flex flex-col space-y-8">
            <Link
              href={"/today"}
              className="flex items-center text-secondary-foreground"
            >
              <ChevronLeft size={16} />
              <span className="text-[13px] font-semibold">back</span>
            </Link>
            <UserInfo user={user} />
          </div>
          <Integrations user={user} />
        </div>

        <div className="mt-6">
          <Separator />
          <footer className="flex flex-col space-y-4 pt-8">
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
              className="mt-2 flex items-center gap-1 text-secondary-foreground"
            >
              {isLoggingOut ? (
                <div className="size-5 animate-spin rounded-full border-2 border-[#EF6258CC] border-t-transparent" />
              ) : (
                <Icon icon={"hugeicons:logout-01"} />
              )}
              <span className="hover-text text-[13px] font-semibold">
                Logout
              </span>
            </button>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
