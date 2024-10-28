import React from "react"

import { SidebarFavorites } from "@/src/components/Sidebar/SidebarFavorites"
import { SidebarMain } from "@/src/components/Sidebar/SidebarMain"
import { SidebarProfile } from "@/src/components/Sidebar/SidebarProfile"
import { SidebarSpaces } from "@/src/components/Sidebar/SidebarSpaces"

export const Sidebar: React.FC = () => {
  return (
    <nav className="flex w-full max-w-[calc(min(-40px+100vw,300px))] flex-col justify-between bg-background p-10 text-sm text-secondary-foreground">
      <div className="flex flex-col gap-7">
        <SidebarProfile />
        <SidebarMain />
        <SidebarFavorites />
        <SidebarSpaces />
      </div>
    </nav>
  )
}
