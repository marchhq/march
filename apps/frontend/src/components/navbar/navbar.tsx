"use client"

import { usePathname } from "next/navigation"

import { NavLink } from "./nav-link"
import { getCurrentWeek } from "@/src/utils/datetime"

export const Navbar = () => {
  const pathname = usePathname()
  const weekNumber = getCurrentWeek(new Date())
  return (
    <nav className="flex items-center px-60">
      <div className="flex gap-12 text-[16px] font-medium">
        <NavLink
          href="/inbox"
          label="Inbox"
          isActive={pathname.includes("/inbox")}
        />
        <NavLink
          href="/today"
          label="Today"
          isActive={pathname.includes("/today")}
        />
        <NavLink
          href="/this-week"
          label={`Week ${weekNumber}`}
          isActive={pathname.includes("/this-week")}
        />
      </div>

    </nav>
  )
}
