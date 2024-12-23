"use client"

import { usePathname } from "next/navigation"

import { NavLink } from "./nav-link"

const objects = [
  {
    id: 1,
    name: "Todo",
  },
  {
    id: 2,
    name: "Note",
  },
  {
    id: 3,
    name: "Meetings",
  },
  {
    id: 4,
    name: "Bookmarks",
  },
]

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
  return (
    <nav className="flex gap-6">
      {objects.map((object) => (
        <NavLink
          key={object.id}
          label={object.name}
          href={`/objects/${object.name.toLowerCase()}`}
          isActive={pathname.includes(`${object.name.toLowerCase()}`)}
          className="text-sm"
        />
      ))}
      {sources.map((source) => (
        <NavLink
          key={source.id}
          label={source.name}
          href={`/objects/${source.name.toLowerCase()}`}
          isActive={pathname.includes(`${source.name.toLowerCase()}`)}
          className="text-sm"
        />
      ))}
    </nav>
  )
}
