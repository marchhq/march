"use client"

import React from "react"

import { usePathname } from "next/navigation"

import SecondSidebar from "@/src/components/SecondSidebar"
import SidebarItem from "@/src/components/SidebarItem"

interface Props {
  children: React.ReactNode
}

const SpaceLayout: React.FC<Props> = ({ children }) => {
  const pathname = usePathname()

  const items = [
    <SidebarItem
      href={"/space/notes"}
      key={"notes"}
      name="Notes"
      isActive={pathname.includes("/space/notes")}
    />,

    <SidebarItem
      href={"/space/meeting"}
      key={"meeting"}
      name="Meetings"
      isActive={pathname.includes("/space/meetings")}
    />,
  ]

  return (
    <div className="flex h-full">
      <SecondSidebar items={items} />
      <div className="flex-1">{children}</div>
    </div>
  )
}

export default SpaceLayout
