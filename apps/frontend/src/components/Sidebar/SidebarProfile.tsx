"use client"

import React, { useEffect } from "react"

import { UserIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { useUserInfo } from "@/src/hooks/useUserInfo"
import classNames from "@/src/utils/classNames"

export const SidebarProfile: React.FC = () => {
  const pathname = usePathname()

  const user = useUserInfo()

  const isActive = pathname.includes("/profile")

  useEffect(() => {
    console.log("user", user)
  }, [user])

  return (
    <div className="flex flex-col gap-3.5">
      {user && (
        <Link
          className={classNames(
            isActive && "text-foreground",
            "hover-text group flex items-center gap-2 font-medium"
          )}
          href="/profile"
        >
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt="user avatar"
              width={16}
              height={16}
              className={classNames(
                isActive && "border-foreground",
                "rounded border border-border group-hover:border-foreground"
              )}
            />
          ) : (
            <UserIcon className="size-4" />
          )}
          <span>{user.fullName}</span>
        </Link>
      )}
    </div>
  )
}
