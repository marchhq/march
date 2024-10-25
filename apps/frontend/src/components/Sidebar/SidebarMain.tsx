"use client"

import React from "react"

import { Inbox, Calendar } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import classNames from "@/src/utils/classNames"

const SidebarMainLink = ({
  href,
  icon,
  label,
  isActive,
}: {
  href: string
  icon: React.ReactNode
  label: string
  isActive: boolean
}) => {
  const activeClass = isActive && "text-foreground"
  return (
    <Link
      className={classNames(
        "hover-text flex items-center gap-2 font-medium",
        activeClass
      )}
      href={href}
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}

export const SidebarMain: React.FC = () => {
  const pathname = usePathname()
  const today = new Date().getDate()

  return (
    <div className="flex flex-col gap-3.5">
      <SidebarMainLink
        href="/inbox"
        icon={<Inbox className="size-4" />}
        label="inbox"
        isActive={pathname.includes("/inbox")}
      />
      <SidebarMainLink
        href="/today"
        icon={<span>{today}</span>}
        label="today"
        isActive={pathname.includes("/today")}
      />
      <SidebarMainLink
        href="/this-week"
        icon={<Calendar className="size-4" />}
        label="this week"
        isActive={pathname.includes("/this-week")}
      />
    </div>
  )
}
