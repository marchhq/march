"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown } from "lucide-react"

interface NavDropdownProps {
  currentPath: string
}

export const NavDropdown = ({ currentPath }: NavDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const routes = [
    { path: "/today", label: "today" },
    { path: "/inbox", label: "inbox" },
    { path: "/objects", label: "all objects" },
  ]

  const defaultRoute = routes[0] // Default to "today"
  const currentRoute = routes.find(route => pathname.includes(route.path)) || defaultRoute

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-sm text-gray-700 hover:text-gray-900"
      >
        <span className="text-gray-400">/</span>
        <div className="flex items-center space-x-2">
          <span>{currentRoute.label}</span>
        </div>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          {routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className={`block px-4 py-2 text-sm ${
                pathname.includes(route.path)
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {route.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
