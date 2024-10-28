"use client"

import React, { useState, useEffect } from "react"

import { Sparkle } from "lucide-react"
import Image from "next/image"

import ChevronDownIcon from "@/public/icons/chevrondown.svg"
import ChevronRightIcon from "@/public/icons/chevronright.svg"
import { SidebarSpaceLink } from "@/src/components/Sidebar/SidebarSpaceLink"
import { useSidebarCollapse } from "@/src/contexts/SidebarCollapseContext"

export const SidebarFavorites: React.FC = () => {
  const { isCollapsed, toggleCollapse } = useSidebarCollapse()
  const [toggle, setToggle] = useState(false)

  useEffect(() => {
    setToggle(!isCollapsed)
  }, [isCollapsed])

  const handleToggle = () => {
    setToggle(!toggle)
    if (isCollapsed) {
      toggleCollapse()
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        className="flex items-center gap-2 font-medium outline-none"
        onClick={handleToggle}
      >
        <Sparkle className="size-4" />
        {!isCollapsed && <span>favorites</span>}
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
      {toggle && (
        <div className="flex flex-col gap-2 font-medium">
          <SidebarSpaceLink href="/inbox" label="my productive setup" />
          <SidebarSpaceLink href="/inbox" label="my other productive setup" />
        </div>
      )}
    </div>
  )
}
