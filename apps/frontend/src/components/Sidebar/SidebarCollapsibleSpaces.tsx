"use client"

import React, { useState, useEffect } from "react"

import { ChevronDown, ChevronRightIcon } from "lucide-react"
import { usePathname } from "next/navigation"

import { SidebarSpaceLink } from "@/src/components/Sidebar/SidebarSpaceLink"
import { useAuth } from "@/src/contexts/AuthContext"
import { useSidebarCollapse } from "@/src/contexts/SidebarCollapseContext"
import { Space } from "@/src/lib/@types/Items/Space"

const spaceLinkClassName = "border-l border-border pl-2 -ml-[1px]"

export const SidebarCollapsibleSpaces: React.FC<{
  spaces: Space
  error?: string | null
}> = ({ spaces, error }) => {
  const pathname = usePathname()
  const { session } = useAuth()

  const [toggle, setToggle] = useState(true)
  const { isCollapsed, toggleCollapse } = useSidebarCollapse()

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
        {toggle ? <ChevronDown size={18} /> : <ChevronRightIcon size={18} />}
        {!isCollapsed && <span>{spaces.name}</span>}
      </button>
      {toggle && spaces && (
        <div>
          {error && (
            <div className="truncate text-xs text-danger-foreground">
              <span>{error}</span>
            </div>
          )}
          <div className="ml-2 mt-1 flex flex-col gap-2 border-l border-border"></div>
        </div>
      )}
    </div>
  )
}
