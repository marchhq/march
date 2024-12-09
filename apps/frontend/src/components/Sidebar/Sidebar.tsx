"use client"

import React from "react"

import { SidebarFeedback } from "./SidebarFeedback"
import { Switch } from "../atoms/Switch"
import { SidebarFavorites } from "@/src/components/Sidebar/SidebarFavorites"
import { SidebarMain } from "@/src/components/Sidebar/SidebarMain"
import { SidebarProfile } from "@/src/components/Sidebar/SidebarProfile"
import { SidebarSpaces } from "@/src/components/Sidebar/SidebarSpaces"
import {
  SidebarCollapseProvider,
  useSidebarCollapse,
} from "@/src/contexts/SidebarCollapseContext"
import { useTrackPageView } from "@/src/hooks/useTrackPageView"
import { useUserInfo } from "@/src/hooks/useUserInfo"
import classNames from "@/src/utils/classNames"

export const Sidebar: React.FC = () => {
  return (
    <SidebarCollapseProvider>
      <div className="flex flex-col border-r border-border">
        <div className="pl-6 pt-1">
          <SidebarCollapseButton />
        </div>
        <SidebarNav />
      </div>
    </SidebarCollapseProvider>
  )
}

const SidebarNav: React.FC = () => {
  const { isCollapsed } = useSidebarCollapse()
  const { user } = useUserInfo()
  useTrackPageView(user?.userName || "")
  return (
    <nav
      className={classNames(
        "group relative flex h-screen bg-background text-sm p-6 text-secondary-foreground ",
        isCollapsed ? "w-[250px]" : "w-[80px]"
      )}
    >
      <div className="flex h-5/6 flex-col justify-between">
        <div className="flex flex-col gap-4">
          <SidebarMain />
          <SidebarFavorites />
        </div>

        <div className="flex flex-col gap-2">
          <SidebarProfile />
          <SidebarFeedback />
        </div>
      </div>

      {isCollapsed && (
        <div className="mr-4 mt-8">
          <SidebarSpaces />
        </div>
      )}
    </nav>
  )
}

const SidebarCollapseButton: React.FC = () => {
  const { isCollapsed, toggleCollapse } = useSidebarCollapse()
  return (
    <div className="-ml-2.5">
      <Switch checked={isCollapsed} onCheckedChange={toggleCollapse} />
    </div>
  )
}
