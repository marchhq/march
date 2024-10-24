"use client"

import React, { useEffect, useState, useCallback } from "react"

import { usePathname } from "next/navigation"

import SecondSidebar from "@/src/components/SecondSidebar"
import SidebarItem from "@/src/components/SidebarItem"
import { useAuth } from "@/src/contexts/AuthContext"
import useSpaceStore from "@/src/lib/store/space.store"

interface Props {
  children: React.ReactNode
}

const SpaceLayout: React.FC<Props> = ({ children }) => {
  const pathname = usePathname()
  const { session } = useAuth()
  const [loading, setLoading] = useState(false)
  const { spaces, fetchSpaces } = useSpaceStore()

  const constructPath = (spaceName: string) => {
    return `space/${spaceName.toLowerCase().replace(/\s+/g, "-")}`
  }

  useEffect(() => {
    fetchSpaces(session)
  }, [session, fetchSpaces])

  const items = spaces.map((space) => {
    const path = constructPath(space.name)
    return (
      <SidebarItem
        href={path}
        key={space._id}
        name={space.name}
        isActive={pathname.includes(path)}
      />
    )
  })

  return (
    <div className="flex h-full">
      {/*
      <div className="ml-[100px] flex">
        <SecondSidebar items={items} />
      </div>
      */}
      <div className="flex-1">{children}</div>
    </div>
  )
}

export default SpaceLayout
