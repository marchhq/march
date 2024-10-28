"use client"

import React from "react"

import { Inbox, Calendar } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { useSidebarCollapse } from "@/src/contexts/SidebarCollapseContext"
import classNames from "@/src/utils/classNames"

function getWeekNumber(date: Date) {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
  const dayOfMonth = date.getDate()
  const dayOfWeek = startOfMonth.getDay()
  return Math.ceil((dayOfMonth + dayOfWeek) / 7)
}

const SidebarMainLink = ({
  href,
  icon,
  label,
  isActive,
  isCollapsed,
}: {
  href: string
  icon: React.ReactNode
  label: string
  isActive: boolean
  isCollapsed: boolean
}) => {
  const activeClass = isActive && "text-foreground"
  return (
    <Link
      className={classNames(
        "hover-text flex items-center gap-2 font-medium min-h-5",
        activeClass
      )}
      href={href}
    >
      {icon}
      {!isCollapsed && <span>{label}</span>}
    </Link>
  )
}

export const SidebarMain: React.FC = () => {
  const pathname = usePathname()

  const { isCollapsed } = useSidebarCollapse()

  const today = new Date().getDate()
  const currentWeek = getWeekNumber(new Date())

  return (
    <div className="flex flex-col gap-3.5">
      <SidebarMainLink
        href="/inbox"
        icon={<Inbox className="size-4" />}
        label="inbox"
        isActive={pathname.includes("/inbox")}
        isCollapsed={isCollapsed}
      />
      <SidebarMainLink
        href="/today"
        icon={<span>{today}</span>}
        label="today"
        isActive={pathname.includes("/today")}
        isCollapsed={isCollapsed}
      />
      <SidebarMainLink
        href="/this-week"
        icon={<Calendar className="size-4" />}
        label={`week ${currentWeek}`}
        isActive={pathname.includes("/this-week")}
        isCollapsed={isCollapsed}
      />
    </div>
  )
}
