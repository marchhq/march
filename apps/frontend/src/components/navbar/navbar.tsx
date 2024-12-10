"use client"

import { useQuery } from "@tanstack/react-query"
import { usePathname } from "next/navigation"

import { fetchSpaces } from "./action"
import { NavLink } from "./nav-link"
import { useAuth } from "@/src/contexts/AuthContext"
import { Space } from "@/src/lib/@types/Items/Space"
import { getCurrentWeek } from "@/src/utils/datetime"

export const Navbar = () => {
  const { session } = useAuth()
  const pathname = usePathname()
  const weekNumber = getCurrentWeek(new Date())

  const { data: spaces } = useQuery<Space[]>({
    queryKey: ["spaces", session],
    queryFn: () => fetchSpaces(session),
    enabled: !!session,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })

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
