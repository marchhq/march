"use client"

import React, { useState, useEffect } from "react"

import { Sparkle } from "lucide-react"
import Image from "next/image"

import ChevronDownIcon from "@/public/icons/chevrondown.svg"
import ChevronRightIcon from "@/public/icons/chevronright.svg"
import { SidebarSpaceLink } from "@/src/components/Sidebar/SidebarSpaceLink"
import { useAuth } from "@/src/contexts/AuthContext"
import { useSidebarCollapse } from "@/src/contexts/SidebarCollapseContext"
import { useCycleItemStore } from "@/src/lib/store/cycle.store"

export const SidebarFavorites: React.FC = () => {
  const { session } = useAuth()

  const { isCollapsed, toggleCollapse } = useSidebarCollapse()
  const { favorites, fetchFavorites } = useCycleItemStore()
  const [toggle, setToggle] = useState(false)

  useEffect(() => {
    fetchFavorites(session)
  }, [session, fetchFavorites])

  useEffect(() => {
    if (toggle) {
      setToggle(!isCollapsed)
    }
  }, [toggle, isCollapsed])

  const handleToggle = () => {
    setToggle(!toggle)
    if (isCollapsed) {
      toggleCollapse()
    }
  }

  if (favorites.items.length !== 0) {
    return (
      <div className="flex flex-col gap-2">
        <button
          className="flex min-h-5 items-center gap-2 font-medium outline-none"
          onClick={handleToggle}
        >
          <Sparkle className="size-4" />
          {!isCollapsed && <span>favorites</span>}
          {toggle ? (
            <Image
              src={ChevronDownIcon}
              alt="chevron down icon"
              width={12}
              height={12}
              className="opacity-50"
            />
          ) : (
            <Image
              src={ChevronRightIcon}
              alt="chevron right icon"
              width={12}
              height={12}
              className="opacity-50"
            />
          )}
        </button>
        {toggle && favorites.items.length !== 0 && (
          <div className="flex flex-col gap-2 font-medium">
            {favorites.items.map((favorite) => (
              <SidebarSpaceLink
                key={favorite._id}
                /* todo: dynamic href with space and block id */
                href={"/inbox"}
                label={favorite.title}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return null
}
