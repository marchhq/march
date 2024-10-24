"use client"

import React from "react"

import { SidebarFavorites } from "@/src/components/Sidebar/SidebarFavorites"
import { SidebarMain } from "@/src/components/Sidebar/SidebarMain"
import { SidebarSpaces } from "@/src/components/Sidebar/SidebarSpaces"

export const Sidebar: React.FC = () => {
  return (
    <div className="flex w-full max-w-[calc(min(-40px+100vw,300px))] flex-col justify-between bg-background p-10 text-sm text-secondary-foreground">
      <nav className="flex flex-col gap-7">
        <SidebarMain />
        <SidebarFavorites />
        <SidebarSpaces />
      </nav>
    </div>
  )
}
