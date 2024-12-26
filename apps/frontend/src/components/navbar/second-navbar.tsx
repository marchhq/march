"use client"

import { usePathname } from "next/navigation"

import { NavLink } from "./nav-link"
import { Separator } from "../ui/separator"
import { useAuth } from "@/src/contexts/AuthContext"
import { useSources } from "@/src/queries/useSource"
import { useTypes } from "@/src/queries/useType"

export const SecondNavbar = () => {
  const pathname = usePathname()
  const { session } = useAuth()
  const { data: objects } = useTypes(session)
  const { data: sources } = useSources(session)

  if (!objects || !sources) return null

  return (
    <nav className="flex h-4 gap-6 text-sm">
      {objects.map((object) => (
        <NavLink
          key={object._id}
          label={object.slug}
          href={`/objects/${object.slug.toLowerCase()}`}
          isActive={pathname.includes(`${object.slug.toLowerCase()}`)}
        />
      ))}
      <Separator orientation="vertical" />
      {sources.map((source) => (
        <NavLink
          key={source._id}
          label={source.slug}
          href={`/objects/${source.slug.toLowerCase()}`}
          isActive={pathname.includes(`${source.slug.toLowerCase()}`)}
        />
      ))}
    </nav>
  )
}
