"use client"

import React, { useState, useEffect } from "react"

import { ChevronRight, ChevronDown, Orbit } from "lucide-react"
import { usePathname } from "next/navigation"

import { SidebarSpaceLink } from "@/src/components/Sidebar/SidebarSpaceLink"
import { useAuth } from "@/src/contexts/AuthContext"
import useSpaceStore from "@/src/lib/store/space.store"

const spaceLinkClassName = "border-l border-border pl-2 hover-text -ml-[1px]"

export const SidebarSpaces: React.FC = () => {
  const pathname = usePathname()
  const { session } = useAuth()

  const [toggle, setToggle] = useState(true)

  const { spaces, fetchSpaces } = useSpaceStore()

  useEffect(() => {
    fetchSpaces(session)
  }, [session, fetchSpaces])

  return (
    <div className="flex flex-col gap-2">
      <button
        className="flex items-center gap-1 text-xs"
        onClick={() => setToggle(!toggle)}
      >
        {/* i think its better without the icon */}
        {/*<Orbit className="size-3" />*/}
        <span>spaces</span>
        {toggle ? (
          <ChevronDown className="size-3.5" />
        ) : (
          <ChevronRight className="size-3.5" />
        )}
      </button>
      {toggle && (
        <div className="ml-2 flex flex-col gap-2 border-l border-border">
          {spaces.map((space) => (
            <SidebarSpaceLink
              key={space._id}
              href={`/space/${space.name.toLowerCase().replace(/\s+/g, "-")}`}
              label={space.name}
              customClass={spaceLinkClassName}
              isActive={pathname.includes(
                `/space/${space.name.toLowerCase().replace(/\s+/g, "-")}`
              )}
              isSpace={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}
