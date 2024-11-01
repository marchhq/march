"use client"

import React from "react"

import Image from "next/image"

import ChevronDownIcon from "@/public/icons/chevrondown.svg"
import ChevronRightIcon from "@/public/icons/chevronright.svg"
import { SidebarFavorites } from "@/src/components/Sidebar/SidebarFavorites"
import { SidebarMain } from "@/src/components/Sidebar/SidebarMain"
import { SidebarProfile } from "@/src/components/Sidebar/SidebarProfile"
import { SidebarSpaces } from "@/src/components/Sidebar/SidebarSpaces"
import {
  SidebarCollapseProvider,
  useSidebarCollapse,
} from "@/src/contexts/SidebarCollapseContext"
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
        "flex w-full relative flex-col justify-between bg-background p-10 text-sm text-secondary-foreground group",
        isCollapsed
          ? "min-w-fit max-w-fit"
          : "min-w-[calc(min(-40px+100vw,250px))] max-w-[calc(min(-40px+100vw,250px))]"
      )}
    >
      <div className="flex flex-col gap-7">
        <div className="flex gap-4">
          <SidebarProfile />
          <SidebarCollapseButton />
        </div>
        <SidebarMain />
        <SidebarFavorites />
        <SidebarSpaces />
      </div>
    </nav>
  )
}

const SidebarCollapseButton: React.FC = () => {
  const { isCollapsed, toggleCollapse } = useSidebarCollapse()
  return (
    <button
      onClick={toggleCollapse}
      className="group/button invisible group-hover:visible"
    >
      {!isCollapsed ? (
        <Image
          src={ChevronDownIcon}
          alt="chevron down icon"
          width={16}
          height={16}
          className="opacity-50 group-hover/button:opacity-100"
        />
      ) : (
        <Image
          src={ChevronRightIcon}
          alt="chevron right icon"
          width={16}
          height={16}
          className="opacity-50 group-hover/button:opacity-100"
        />
      )}
    </button>
  )
}
