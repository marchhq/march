"use client"

import React, { useEffect } from "react"

import Image from "next/image"

import { SidebarCollapsibleSpaces } from "./SidebarCollapsibleSpaces"
import { SidebarFeedback } from "./SidebarFeedback"
import { Switch } from "../atoms/Switch"
import { SidebarFavorites } from "@/src/components/Sidebar/SidebarFavorites"
import { SidebarMain } from "@/src/components/Sidebar/SidebarMain"
import { SidebarProfile } from "@/src/components/Sidebar/SidebarProfile"
import { useAuth } from "@/src/contexts/AuthContext"
import {
  SidebarCollapseProvider,
  useSidebarCollapse,
} from "@/src/contexts/SidebarCollapseContext"
import { useTrackPageView } from "@/src/hooks/useTrackPageView"
import { useUserInfo } from "@/src/hooks/useUserInfo"
import useSpaceStore from "@/src/lib/store/space.store"
import classNames from "@/src/utils/classNames"

export const Sidebar: React.FC = () => {
  return (
    <SidebarCollapseProvider>
      <SidebarNav />
    </SidebarCollapseProvider>
  )
}

const SidebarNav: React.FC = () => {
  const { isCollapsed } = useSidebarCollapse()
  const { user } = useUserInfo()
  useTrackPageView(user?.userName || "")
  return (
    <nav
      className={`group relative flex w-full border-r border-border bg-background p-6 text-sm text-secondary-foreground
        ${isCollapsed ? "min-w-fit max-w-fit" : "min-w-[calc(min(-20px+100vw,280px))] max-w-[calc(min(-20px+100vw,280px))]"}`}
    >
      <div className="flex h-5/6 w-full">
        <div className="flex flex-col items-center justify-between">
          <div className="flex flex-col gap-4">
            <SidebarCollapseButton />
            <SidebarMain />
            <SidebarFavorites />
          </div>
          <div className="flex flex-col gap-2">
            <SidebarProfile />
            <SidebarFeedback />
          </div>
        </div>

        {!isCollapsed && (
          <div className="ml-8 mt-10 w-36">
            <SecondSidebar />
          </div>
        )}
      </div>
    </nav>
  )
}

const SecondSidebar: React.FC = () => {
  const { isCollapsed } = useSidebarCollapse()
  const { session } = useAuth()
  const { error, spaces, fetchSpaces } = useSpaceStore()

  useEffect(() => {
    if (!isCollapsed) {
      fetchSpaces(session)
    }
  }, [isCollapsed, session, fetchSpaces])

  if (isCollapsed) return null

  return (
    <div>
      {spaces.map((space) => (
        <SidebarCollapsibleSpaces
          key={space._id}
          title={space.name.toLowerCase()}
          spaceId={space._id}
          error={error}
        />
      ))}
    </div>
  )
}

const SidebarCollapseButton: React.FC = () => {
  const { isCollapsed, toggleCollapse } = useSidebarCollapse()
  return (
    <div className="-ml-1.5">
      <Switch checked={isCollapsed} onCheckedChange={toggleCollapse} />
    </div>
  )
}
