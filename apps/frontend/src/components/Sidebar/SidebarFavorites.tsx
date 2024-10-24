"use client"

import React, { useState } from "react"

import { ChevronDown, ChevronRight } from "lucide-react"

import { SidebarSpaceLink } from "@/src/components/Sidebar/SidebarSpaceLink"

export const SidebarFavorites: React.FC = () => {
  const [toggle, setToggle] = useState(true)

  return (
    <div className="flex flex-col gap-2">
      <button
        className="flex items-center gap-1 text-xs"
        onClick={() => setToggle(!toggle)}
      >
        <span>favorites</span>
        {toggle ? (
          <ChevronDown className="size-3.5" />
        ) : (
          <ChevronRight className="size-3.5" />
        )}
      </button>
      {toggle && (
        <div className="flex flex-col gap-2">
          <SidebarSpaceLink
            href="/inbox"
            label="my productive setup"
            customClass="hover-text"
          />
          <SidebarSpaceLink
            href="/inbox"
            label="my other productive setup"
            customClass="hover-text"
          />
        </div>
      )}
    </div>
  )
}
