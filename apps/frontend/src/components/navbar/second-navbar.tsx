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
  {
    id: 5,
    name: "Linear",
  },
  {
    id: 6,
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
          href="#"
          isActive={pathname.includes(object.name)}
          className="text-sm"
        />
      ))}
    </nav>
  )
}
