import React from "react"

import Providers from "./providers"
import PageTracker from "@/src/components/PageTracker"
import { Sidebar } from "@/src/components/Sidebar/Sidebar"
import { Topbar } from "@/src/components/topbar/topbar"
import { Toaster } from "@/src/components/ui/toaster"

interface Props {
  children: React.ReactNode
}

export default function AppLayout({ children }: Props) {
  return (
    <Providers>
      <main className="theme-bg flex h-screen flex-col">
        <Topbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="ml-52 flex flex-1 flex-col">
            <div className="flex flex-1 overflow-hidden">
              <PageTracker />
              <section className="flex-1 overflow-auto pt-5">
                {children}
              </section>
            </div>
          </div>
        </div>
        <Toaster />
      </main>
    </Providers>
  )
}
