"use client"

import React from "react"

import { UserIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { useSidebarCollapse } from "@/src/contexts/SidebarCollapseContext"
import { useUserInfo } from "@/src/hooks/useUserInfo"
import classNames from "@/src/utils/classNames"

export const SidebarProfile: React.FC = () => {
  const pathname = usePathname()

  const { user, error } = useUserInfo()

  const { isCollapsed } = useSidebarCollapse()

  const isActive = pathname.includes("/profile")

  if (user) {
    return (
      <div className="flex w-full max-w-[calc(100%-32px)] flex-col gap-2">
        <Link
          className={classNames(
            isActive && "text-foreground",
            "hover-text group flex items-center gap-2 font-medium min-h-5 truncate"
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
            <UserIcon size={16} />
          )}
          {!isCollapsed && (
            <span className="max-w-[calc(100%-24px)] truncate">
              {user.userName}
            </span>
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

  return null
}
