"use client"

import { usePathname } from "next/navigation"

import { NavLink } from "./nav-link"
import { useAuth } from "@/src/contexts/AuthContext"
import { useTypes } from "@/src/queries/useType"

const sources = [
  {
    id: 1,
    name: "Linear",
  },
  {
    id: 2,
    name: "Pulls",
  },
]

export const SecondNavbar = () => {
  const pathname = usePathname()
  const { session } = useAuth()
  const { data: objects } = useTypes(session)

  if (!objects) return null

  return (
    <nav className="flex gap-6 text-sm">
      {objects.map((object) => (
        <NavLink
          key={object._id}
          label={object.slug}
          href={`/objects/${object.slug.toLowerCase()}`}
          isActive={pathname.includes(`${object.slug.toLowerCase()}`)}
        />
      ))}
      {sources.map((source) => (
        <NavLink
          key={source.id}
          label={source.name}
          href={`/objects/${source.name.toLowerCase()}`}
          isActive={pathname.includes(`${source.name.toLowerCase()}`)}
        />
      ))}
    </nav>
  )
}
