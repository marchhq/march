"use client"

import { usePathname } from "next/navigation"

import { NavLink } from "./nav-link"
import { useAuth } from "@/src/contexts/AuthContext"
import { useSpaces } from "@/src/queries/useSpace"
import { getCurrentWeek } from "@/src/utils/datetime"

export const Navbar = () => {
  const { session } = useAuth()
  const { data: spaces } = useSpaces(session)
  const pathname = usePathname()
  const weekNumber = getCurrentWeek(new Date())

  const validSpaces = Array.isArray(spaces) ? spaces : []

  return (
    <nav className="flex items-center">
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
        {validSpaces?.map((space) => (
          <NavLink
            key={space._id}
            href={`/spaces/${space._id}`}
            label={`${space.name}`}
            isActive={pathname.includes(`/spaces/${space._id}`)}
          />
        ))}
      </div>
    </nav>
  )
}
