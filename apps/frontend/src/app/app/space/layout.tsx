"use client"

import React from "react"

import { usePathname } from "next/navigation"
import SecondSidebar from "@/src/components/SecondSidebar"

interface Props {
  children: React.ReactNode
}

const SpaceLayout: React.FC<Props> = ({ children }) => {
  const pathname = usePathname()

  return (
    <div className="h-full flex">
      <SecondSidebar />
      <div className="flex-1">{children}</div>
    </div>
  )
}

export default SpaceLayout
