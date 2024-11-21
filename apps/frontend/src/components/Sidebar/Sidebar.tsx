"use client"

import React, { useEffect } from "react"

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
  return (
    <nav
      className={classNames(
        "flex w-full relative flex-col justify-between bg-background p-10 pr-0 text-sm text-secondary-foreground group border-r border-border",
        isCollapsed
          ? "min-w-fit max-w-fit"
          : "min-w-[calc(min(-20px+100vw,300px))] max-w-[calc(min(-20px+100vw,300px))]"
      )}
    >
      <div
        className={classNames(
          "flex h-5/6 justify-between",
          isCollapsed ? "" : "mr-14"
        )}
      >
        <div className="flex flex-col justify-between">
          <div>
            <SidebarCollapseButton />
            <SidebarMain />
            <SidebarFavorites />
          </div>
          <div className="flex flex-col gap-2">
            <SidebarProfile />
            <SidebarFeedback />
          </div>
        </div>
        <div>
          <SecondSidebar />
        </div>
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

  return !isCollapsed
    ? spaces.map((space) => (
        <SidebarCollapsibleSpaces
          spaces={space}
          key={space._id}
          error={error}
        />
      ))
    : null
}

const SidebarCollapseButton: React.FC = () => {
  const { isCollapsed, toggleCollapse } = useSidebarCollapse()
  return <Switch checked={isCollapsed} onCheckedChange={toggleCollapse} />
}
