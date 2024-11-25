"use client"

import React from "react"

import { Inbox, Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import SpacesIcon from "@/public/icons/spacesicon.svg"
import { useSidebarCollapse } from "@/src/contexts/SidebarCollapseContext"
import classNames from "@/src/utils/classNames"
import { getCurrentWeek } from "@/src/utils/datetime"

const SidebarMainLink = ({
  href,
  icon,
  label,
  isActive,
  isCollapsed,
}: {
  href: string
  icon: React.ReactNode
  label?: string
  isActive: boolean
  isCollapsed?: boolean
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
    </Link>
  )
}

export const SidebarMain: React.FC = () => {
  const pathname = usePathname()

  const weekNumber = getCurrentWeek(new Date())

  const today = String(new Date().getDate()).padStart(2, "0")

  return (
    <div className="flex flex-col gap-5">
      <SidebarMainLink
        href="/inbox"
        icon={<Inbox className="text-primary-foreground" size={18} />}
        isActive={pathname.includes("/inbox")}
      />
      <SidebarMainLink
        href="/today"
        icon={<span className="text-primary-foreground">{today}</span>}
        isActive={pathname.includes("/today")}
      />
      <SidebarMainLink
        href="/this-week"
        icon={<Calendar size={18} className="text-primary-foreground" />}
        isActive={pathname.includes("/this-week")}
      />
      <SidebarMainLink
        href="/space"
        icon={
          <Image
            src={SpacesIcon}
            alt="spaces icon"
            width={18}
            height={18}
            className="text-primary-foreground"
          />
        }
        isActive={pathname.includes("/space")}
      />
    </div>
  )
}
