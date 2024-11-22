"use client"

import React, { useState, useEffect, useCallback } from "react"

import { ChevronDown, ChevronRightIcon } from "lucide-react"

import { SidebarHeader } from "./SidebarHeader"
import { SidebarSection } from "./SidebarSection"
import { SidebarSpaceLink } from "@/src/components/Sidebar/SidebarSpaceLink"
import { useSidebarCollapse } from "@/src/contexts/SidebarCollapseContext"
import { useSidebarData } from "@/src/hooks/useSidebarData"
import { Space } from "@/src/lib/@types/Items/Space"

const spaceLinkClassName = "border-l border-border pl-2 -ml-[1px]"

interface SidebarCollapsibleProps {
  title: string
  spaceId: string
  error?: string | null
}

export const SidebarCollapsibleSpaces: React.FC<SidebarCollapsibleProps> = ({
  title,
  spaceId,
}) => {
  const [toggle, setToggle] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const { isCollapsed, toggleCollapse } = useSidebarCollapse()

  const {
    notes,
    readingItems,
    meets,
    setIsMeetsOpen,
    setIsReadingListOpen,
    setIsNotesOpen,
  } = useSidebarData(spaceId, isCollapsed)

  useEffect(() => {
    if (toggle) {
      setToggle(!isCollapsed)
    }
  }, [toggle, isCollapsed])

  useEffect(() => {
    setIsNotesOpen(isOpen)
    setIsMeetsOpen(isOpen)
    setIsReadingListOpen(isOpen)
  }, [isOpen, setIsNotesOpen, setIsMeetsOpen, setIsReadingListOpen])

  const handleToggle = () => {
    if (isCollapsed) toggleCollapse()
    setIsOpen((prev) => !prev)
  }

  return (
    <div className="relative">
      <SidebarHeader name={title} isOpen={isOpen} onToggle={handleToggle} />

      {isOpen && !isCollapsed && (
        <div className="ml-2 mt-1 flex flex-col gap-2 border-l border-border">
          {notes.length > 0 && (
            <SidebarSection items={notes} basePath="notes" />
          )}
          {/* {meets.length > 0 && (
            <SidebarSection items={meets} basePath="meetings" />
          )}
          {readingItems.length > 0 && (
            <SidebarSection items={readingItems} basePath="reading-list" />
          )} */}
        </div>
      )}
    </div>
  )
}
