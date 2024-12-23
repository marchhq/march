"use client"

import { usePathname } from "next/navigation"

import { NavLink } from "./nav-link"
import { Separator } from "../ui/separator"

export const Navbar = () => {
  const pathname = usePathname()

  return (
    <nav className="flex items-center">
      <div className="flex h-4 gap-8 text-[16px] font-medium">
        <NavLink
          href="/today"
          label="Today"
          isActive={pathname.includes("/today")}
        />
        <Separator orientation="vertical" />
        <NavLink
          href="/inbox"
          label="Inbox"
          isActive={pathname.includes("/inbox")}
        />
        <NavLink
          href="/objects"
          label="All Objects"
          isActive={pathname.includes("/objects")}
        />
      </div>
    </nav>
  )
}
