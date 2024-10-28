"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

interface SidebarCollapseContextType {
  isCollapsed: boolean
  toggleCollapse: () => void
}

const SidebarCollapseContext = createContext<
  SidebarCollapseContextType | undefined
>(undefined)

export const SidebarCollapseProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleCollapse = () => setIsCollapsed((prev) => !prev)

  return (
    <SidebarCollapseContext.Provider value={{ isCollapsed, toggleCollapse }}>
      {children}
    </SidebarCollapseContext.Provider>
  )
}

export const useSidebarCollapse = () => {
  const context = useContext(SidebarCollapseContext)
  if (context === undefined) {
    throw new Error(
      "useSidebarCollapse must be used within a SidebarCollapseProvider"
    )
  }
  return context
}
