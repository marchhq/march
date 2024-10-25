"use client"

import React, { useState } from "react"

import Image from "next/image"

import ChevronDownIcon from "@/public/icons/chevrondown.svg"
import ChevronRightIcon from "@/public/icons/chevronright.svg"
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
