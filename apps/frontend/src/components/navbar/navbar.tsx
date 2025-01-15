"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

import { NavDropdown } from "./nav-dropdown"
import { useAuth } from "@/src/contexts/AuthContext"
import useUserStore from "@/src/lib/store/user.store"

export const Navbar = () => {
  const pathname = usePathname()
  const { session } = useAuth()
  const { user } = useUserStore()

  console.log('user', user)

  return (
    <nav className="flex h-14 items-center">
      <div className="flex items-center justify-between w-full px-8">
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
              <span className="font-medium text-base">march</span>
            </Link>
          </div>

          {/* Navigation Dropdown */}
          <div className="ml-2">
            <NavDropdown currentPath={pathname} />
          </div>
        </div>

        {/* Profile */}
        <div className="flex items-center pr-4">
          <Link href="/profile" className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-700">
              {user?.userName?.[0]?.toUpperCase() || 'U'}
            </div>
          </Link>
        </div>
      </div>
    </nav>
  )
}
