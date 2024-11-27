import React, { useState } from "react"

import { ChevronDownIcon, ChevronRightIcon } from "lucide-react"
import Image from "next/image"

import { SidebarSpaceLink } from "./SidebarSpaceLink"

interface CollapsibleProps {
  spaceId: string
  href: string
  label: string
  isActive: boolean
}

export const SidebarCollapsibleSpace = ({
  spaceId,
  href,
  label,
  isActive,
}: CollapsibleProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center p-1"
      >
        {isOpen ? (
          <ChevronDownIcon className="size-3" />
        ) : (
          <ChevronRightIcon className="size-3" />
        )}
      </button>
      <SidebarSpaceLink
        href={href}
        label={label}
        isActive={isActive}
        isSpace={true}
      />
    </div>
  )
}
