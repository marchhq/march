"use client"

import React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import classNames from "../utils/classNames"

const navLinkClassName =
  "flex items-center gap-2 text-secondary-foreground cursor-pointer hover-text"

const Item = ({
  href,
  name,
  isActive,
}: {
  href: string
  name: string
  isActive: boolean
}) => {
  const activeClass = isActive ? "text-foreground" : ""
  return (
    <Link href={`/app/space/${href}`} className={navLinkClassName}>
      <span className={classNames(activeClass, "truncate")}>{name}</span>
    </Link>
  )
}

const SecondSidebar: React.FC = () => {
  const pathname = usePathname()
  const [closeToggle, setCloseToggle] = useState(false)

  const handleClose = () => {
    setCloseToggle(!closeToggle)
  }

  return (
    <div className="w-[160px] relative text-xs font-medium group">
      <button
        className="absolute right-2 top-2 text-secondary-foreground hover-text opacity-0 group-hover:opacity-100 transition-opacity"
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
        <Item
          href="notes"
          name="Notes"
          isActive={pathname.includes("/app/space/notes/")}
        />
        <Item
          href="meeting"
          name="Meeting"
          isActive={pathname.includes("/app/space/meeting/")}
        />
      </div>
    </div>
  )
}

export default SecondSidebar
