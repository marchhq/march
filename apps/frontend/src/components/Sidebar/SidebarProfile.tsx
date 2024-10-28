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

  const user = useUserInfo()

  const { isCollapsed } = useSidebarCollapse()

  const isActive = pathname.includes("/profile")

  return (
    <div className={classNames(!isCollapsed && "pr-10")}>
      {user && (
        <Link
          className={classNames(
            isActive && "text-foreground",
            "hover-text group flex items-center gap-2 font-medium min-h-5"
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
          {!isCollapsed && <span>{user.userName}</span>}
        </Link>
      )}
    </div>
  )
}
