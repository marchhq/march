"use client"

import React, { useState, useEffect } from "react"

import Image from "next/image"
import { usePathname } from "next/navigation"

import ChevronDownIcon from "@/public/icons/chevrondown.svg"
import ChevronRightIcon from "@/public/icons/chevronright.svg"
import SpacesIcon from "@/public/icons/spacesicon.svg"
import { SidebarSpaceLink } from "@/src/components/Sidebar/SidebarSpaceLink"
import { useAuth } from "@/src/contexts/AuthContext"
import useSpaceStore from "@/src/lib/store/space.store"

const spaceLinkClassName = "border-l border-border pl-2 hover-text -ml-[1px]"

export const SidebarSpaces: React.FC = () => {
  const pathname = usePathname()
  const { session } = useAuth()

  const [toggle, setToggle] = useState(false)

  const { spaces, fetchSpaces } = useSpaceStore()

  useEffect(() => {
    if (toggle) {
      fetchSpaces(session)
    }
  }, [toggle, session, fetchSpaces])

  return (
    <div className="flex flex-col gap-2">
      <button
        className="flex items-center gap-1 text-xs outline-none"
        onClick={() => setToggle(!toggle)}
      >
        <Image src={SpacesIcon} alt="spaces icon" width={10} height={10} />
        <span>spaces</span>
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
      )}
    </div>
  )
}
