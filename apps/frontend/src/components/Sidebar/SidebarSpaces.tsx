"use client"

import React, { useState, useEffect } from "react"

import Image from "next/image"
import { usePathname } from "next/navigation"

import ChevronDownIcon from "@/public/icons/chevrondown.svg"
import ChevronRightIcon from "@/public/icons/chevronright.svg"
import SpacesIcon from "@/public/icons/spacesicon.svg"
import { SidebarSpaceLink } from "@/src/components/Sidebar/SidebarSpaceLink"
import { useAuth } from "@/src/contexts/AuthContext"
import { useSidebarCollapse } from "@/src/contexts/SidebarCollapseContext"
import useSpaceStore from "@/src/lib/store/space.store"

const spaceLinkClassName = "border-l border-border pl-2 -ml-[1px]"

export const SidebarSpaces: React.FC = () => {
  const pathname = usePathname()
  const { session } = useAuth()

  const [toggle, setToggle] = useState(false)
  const { isCollapsed, toggleCollapse } = useSidebarCollapse()

  const { error, spaces, fetchSpaces } = useSpaceStore()

  useEffect(() => {
    if (toggle) {
      fetchSpaces(session)
    }
  }, [toggle, session, fetchSpaces])

  useEffect(() => {
    if (toggle) {
      setToggle(!isCollapsed)
    }
  }, [toggle, isCollapsed])

  const handleToggle = () => {
    setToggle(!toggle)
    if (isCollapsed) {
      toggleCollapse()
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        className="flex min-h-5 items-center gap-2 font-medium outline-none"
        onClick={handleToggle}
      >
        <Image src={SpacesIcon} alt="spaces icon" width={16} height={16} />
        {!isCollapsed && <span>spaces</span>}
        {toggle ? (
          <Image
            src={ChevronDownIcon}
            alt="chevron down icon"
            width={12}
            height={12}
            className="opacity-50"
          />
        ) : (
          <Image
            src={ChevronRightIcon}
            alt="chevron right icon"
            width={12}
            height={12}
            className="opacity-50"
          />
        )}
      </button>
      {toggle && spaces && (
        <div>
          {error && (
            <div className="truncate text-xs text-danger-foreground">
              <span>{error}</span>
            </div>
          )}
          <div className="ml-2 mt-1 flex flex-col gap-2 border-l border-border">
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
        </div>
      )}
    </div>
  )
}
