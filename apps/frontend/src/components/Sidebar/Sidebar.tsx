"use client"

import React from "react"

import { BracketsIcon, SearchIcon } from "lucide-react"

import { SidebarFeedback } from "./SidebarFeedback"
import { useTrackPageView } from "@/src/hooks/useTrackPageView"
import { useUserInfo } from "@/src/hooks/useUserInfo"

export const Sidebar: React.FC = () => {
  return (
    <div className="flex flex-col">
      <SidebarNav />
    </div>
  )
}

const SidebarNav: React.FC = () => {
  const { user } = useUserInfo()
  useTrackPageView(user?.userName || "")
  return (
    <nav className="flex h-screen bg-background p-4 text-sm text-secondary-foreground ">
      <div className="flex h-5/6 flex-col justify-center gap-4">
        <div className="space-y-6 rounded-full border border-border p-3">
          <SearchIcon
            size={18}
            className="cursor-pointer text-primary-foreground hover:text-white"
          />
          <BracketsIcon
            size={18}
            className="cursor-pointer text-primary-foreground hover:text-white"
          />
          <SidebarFeedback />
        </div>
      </div>
    </nav>
  )
}
