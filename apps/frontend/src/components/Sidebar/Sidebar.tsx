"use client"

import React from "react"

import { CircleHelp, SearchIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../atoms/Tooltip"
import { CreateButton } from "../button/CreateButton"
import { SearchButton } from "../button/SearchButton"
import { useTrackPageView } from "@/src/hooks/useTrackPageView"
import { useUserInfo } from "@/src/hooks/useUserInfo"
import SpaceIcon from "public/icons/spacesicon.svg"

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
    <nav className="flex h-screen bg-background p-4 text-sm text-secondary-foreground">
      <div className="flex h-5/6 flex-col justify-center gap-4">
        <div className="space-y-6 rounded-full border border-border p-3">
          <SearchButton />
          <CreateButton />
          <div>
            <Link href={"https://march.userjot.com/"} target="_blank">
              <CircleHelp
                className="hover-text text-primary-foreground"
                size={18}
              />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
