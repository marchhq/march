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
    name: "Bookmark",
  },
]

export const SecondNavbar = () => {
  const pathname = usePathname()
  const isObjectsPage = pathname?.startsWith("/objects")

  if (!isObjectsPage) return null

  return (
    <nav className="flex h-10 items-center border-b border-gray-100 bg-white px-8">
      <ul className="flex gap-8">
        {objects.map((object) => (
          <NavLink
            key={object.id}
            href={`/objects/${object.name.toLowerCase()}`}
            className="text-sm font-medium text-gray-500 hover:text-gray-900"
            activeClassName="text-gray-900"
          >
            {object.name}
          </NavLink>
        ))}
      </ul>
    </nav>
  )
}
