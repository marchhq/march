"use client"
import React, { useState, ReactElement } from "react"

import classNames from "../utils/classNames"

interface ItemProps {
  href: string
  name: string
  isActive: boolean
  baseUrl?: string
}

interface SecondSidebarProps {
  items: ReactElement<ItemProps>[]
}

const SecondSidebar: React.FC<SecondSidebarProps> = ({ items }) => {
  const [closeToggle, setCloseToggle] = useState(false)
  const handleClose = () => {
    setCloseToggle(!closeToggle)
  }

  return (
    <div className="group relative w-[160px] text-xs font-medium">
      <button
        className="hover-text absolute right-2 top-2 text-secondary-foreground opacity-0 transition-opacity group-hover:opacity-100"
        onClick={handleClose}
      >
        {closeToggle ? "open" : "close"}
      </button>
      <div
        className={classNames(
          closeToggle ? "hidden" : "visible",
          "w-[160px] h-full flex flex-col justify-center gap-2 pr-4 bg-background"
        )}
      >
        {items}
      </div>
    </div>
  )
}

export default SecondSidebar
