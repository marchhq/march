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
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          href="/today"
          className="text-gray-400 transition-colors hover:text-gray-600"
        >
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-xl font-medium text-gray-900">Profile</h1>
      </div>

      {/* Main Content */}
      <div className="space-y-10">
        {/* User Info */}
        <div className="border-b border-gray-100 pb-6">
          <UserInfo user={user} />
        </div>

        {/* Integrations */}
        <div className="pb-6">
          <h2 className="mb-4 text-sm font-medium text-gray-900">
            Integrations
          </h2>
          <div className="bg-white">
            <Integrations user={user} />
          </div>
        </div>

        {/* Logout Section */}
        <div className="pt-4">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700"
          >
            <LogOutIcon size={16} className="mr-2" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
