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
      href={"settings/account"}
      key={"account"}
      name="Account"
      isActive={pathname.includes("/settings/account")}
    />,

    <SidebarItem
      href={"settings/preference"}
      key={"preference"}
      name="Preferences"
      isActive={pathname.includes("/settings/preference")}
    />,

    <SidebarItem
      href={"settings/calendars"}
      key={"settings/calendars"}
      name="Calendars"
      isActive={pathname.includes("/settings/calendars")}
    />,

    <SidebarItem
      href={"settings/integrations"}
      key={"integrations"}
      name="Integrations"
      isActive={pathname.includes("/settings/integrations")}
    />,

    <SidebarItem
      href={"settings/about"}
      key={"about"}
      name="About"
      isActive={pathname.includes("/settings/about")}
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
