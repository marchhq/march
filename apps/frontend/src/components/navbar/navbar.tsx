import { User } from "lucide-react"
import { cookies } from "next/headers"
import Image from "next/image"
import Link from "next/link"

import { NavDropdown } from "./nav-dropdown"
// import { useAuth } from "@/src/contexts/AuthContext"
// import useUserStore from "@/src/lib/store/user.store"
import { Chat } from "../Chat/ChatTrigger"
import { ACCESS_TOKEN } from "@/src/lib/constants/cookie"
import { getUserProfile } from "@/src/lib/server/fetcher/getMyProfile"

export const Navbar = async () => {
  // const { session } = useAuth()
  // const { user } = useUserStore()
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(ACCESS_TOKEN)?.value as string
  const user = await getUserProfile(accessToken)

  return (
    <nav className={` ${user === null ? "hidden" : "flex"}  h-14 items-center`}>
      <div className="flex w-full items-center justify-between px-8">
        <div className="flex items-center">
          {/* Logo */}
          <div className="pl-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/icons/logo.svg"
                alt="March Logo"
                width={16}
                height={16}
                className="text-primary"
              />
              <span className="text-base font-medium">march</span>
            </Link>
          </div>

          {/* Navigation Dropdown */}
          <div className="ml-2">
            <NavDropdown />
          </div>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-4 pr-4">
          <Link href="/profile" className="flex items-center">
            <div className="flex size-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-700">
              {/* {user?.userName?.[0]?.toUpperCase() || 'U'} */}
              {user ? (
                <Image
                  src={user.avatar}
                  width={24}
                  height={24}
                  className="rounded-full"
                  alt={user?.fullName || "User avatar"}
                />
              ) : (
                <User />
              )}
            </div>
          </Link>
          <div>
            <Chat />
          </div>
        </div>
      </div>
    </nav>
  )
}
