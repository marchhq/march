"use client"

import * as React from "react"
import { Tray, Sun, User, Stack, Info, Gear } from "@phosphor-icons/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/atoms/Tooltip"

const navLinkClassName =
  "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-secondary-foreground hover-bg cursor-pointer"

const SidebarLink = ({
  href,
  icon: Icon,
  label,
  isActive,
}: {
  href: string
  icon: React.ElementType
  label: string
  isActive: boolean
}) => {
  const activeClass = isActive ? "text-foreground" : ""
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link className={navLinkClassName} href={href}>
            <Icon size={18} weight="duotone" className={activeClass} />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

const Sidebar: React.FC = () => {
  const pathname = usePathname()

  if (pathname.includes("auth")) {
    return null
  } else {
    return (
      <div className="flex flex-col justify-between px-3 pb-3 pt-5 border border-border rounded-xl bg-secondary">
        <div className="flex flex-col gap-0.5">
          <SidebarLink
            href="/app/inbox/"
            icon={Tray}
            label="inbox"
            isActive={pathname === "/app/inbox/"}
          />
          <SidebarLink
            href="/app/today/"
            icon={Sun}
            label="today"
            isActive={pathname === "/app/today/"}
          />
          <hr className="my-3 border-border" />
          <SidebarLink
            href="/app/space/"
            icon={Stack}
            label="space"
            isActive={pathname === "/app/space/"}
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <SidebarLink
            href="/app/profile/"
            icon={User}
            label="profile"
            isActive={pathname === "/app/profile/"}
          />
          <SidebarLink
            href="/app/settings/"
            icon={Gear}
            label="settings"
            isActive={pathname === "/app/settings/"}
          />
        </div>
      </div>
    )
  }
}

export default Sidebar
