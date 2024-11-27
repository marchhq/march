"use client"

import React from "react"

import { Inbox, Calendar } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { useSidebarCollapse } from "@/src/contexts/SidebarCollapseContext"
import classNames from "@/src/utils/classNames"
import { getCurrentWeek } from "@/src/utils/datetime"

const SidebarMainLink = ({
  href,
  icon,
  isActive,
  isCollapsed,
}: {
  href: string
  icon: React.ReactNode
  isActive: boolean
  isCollapsed: boolean
}) => {
  const activeClass = isActive && "text-foreground"
  return (
    <Link
      className={classNames(
        "flex items-center justify-center w-10 min-h-5",
        activeClass
      )}
      href={href}
    >
      <div className="mr-6 flex w-5 justify-center">{icon}</div>
    </Link>
  )
}

export const SidebarMain: React.FC = () => {
  const pathname = usePathname()
  const weekNumber = getCurrentWeek(new Date())
  const { isCollapsed } = useSidebarCollapse()
  const today = String(new Date().getDate()).padStart(2, "0")

  return (
    <div className="flex flex-col gap-3.5">
      <SidebarMainLink
        href="/inbox"
        icon={<Inbox size={18} className="text-primary-foreground" />}
        isActive={pathname.includes("/inbox")}
        isCollapsed={isCollapsed}
      />
      <SidebarMainLink
        href="/today"
        icon={<span className="text-primary-foreground">{today}</span>}
        isActive={pathname.includes("/today")}
        isCollapsed={isCollapsed}
      />
      <SidebarMainLink
        href="/this-week"
        icon={<Calendar size={18} className="text-primary-foreground" />}
        isActive={pathname.includes("/this-week")}
        isCollapsed={isCollapsed}
      />
    </div>
  )
}
