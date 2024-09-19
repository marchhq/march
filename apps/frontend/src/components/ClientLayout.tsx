"use client"

import React from "react"

import { usePathname } from "next/navigation"

import Sidebar from "@/src/components/Sidebar"

interface Props {
  children: React.ReactNode
}

const ClientLayout: React.FC<Props> = ({ children }) => {
  const pathname = usePathname()
  const isAuthPage =
    pathname === "/" || pathname === "/calendar/" || pathname === "/stack/"

  return (
    <main
      className={`flex h-screen bg-background ${isAuthPage ? "" : "flex-row"}`}
    >
      {!isAuthPage && <Sidebar />}
      <section className={`flex-1 ${isAuthPage ? "w-full" : ""}`}>
        {children}
      </section>
    </main>
  )
}

export default ClientLayout
