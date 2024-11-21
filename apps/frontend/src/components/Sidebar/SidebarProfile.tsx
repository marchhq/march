"use client"

import React from "react"

import { UserIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { useUserInfo } from "@/src/hooks/useUserInfo"
import classNames from "@/src/utils/classNames"

export const SidebarProfile: React.FC = () => {
  const pathname = usePathname()

  const { user, error } = useUserInfo()

  const isActive = pathname.includes("/profile")

  return (
    <div className="flex w-full max-w-[calc(100%-32px)] flex-col gap-2">
      <Link
        className={classNames(
          isActive && "text-foreground",
          "hover-text group flex items-center gap-2 font-medium min-h-5 truncate"
        )}
        href="/profile"
      >
        {user?.avatar ? (
          <Image
            src={user?.avatar}
            alt="user avatar"
            width={18}
            height={18}
            className={classNames(
              isActive && "border-foreground",
              "rounded border border-border group-hover:border-foreground"
            )}
          />
        ) : (
          <UserIcon size={18} />
        )}
      </Link>
      {error && (
        <div className="truncate text-xs text-danger-foreground">
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
