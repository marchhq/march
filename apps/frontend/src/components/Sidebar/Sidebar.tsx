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
    <nav className="flex h-screen bg-background p-6 text-sm text-secondary-foreground ">
      <div className="flex h-5/6 flex-col justify-center gap-4">
        <SearchIcon size={18} className="cursor-pointer text-white" />
        <BracketsIcon size={18} className="cursor-pointer text-white" />
        <SidebarFeedback />
      </div>
    </nav>
  )
}
