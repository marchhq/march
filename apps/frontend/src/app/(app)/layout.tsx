import React from "react"

import { Providers } from "./providers"
import { SearchDialog } from "@/src/components/modals/SearchDialog"
import { Navbar } from "@/src/components/navbar/navbar"
import PageTracker from "@/src/components/PageTracker"
import { Sidebar } from "@/src/components/Sidebar/Sidebar"
import { Topbar } from "@/src/components/topbar/topbar"
import { Toaster } from "@/src/components/ui/toaster"
import { getInitialData } from "@/src/lib/server/actions/initial-data"
import { getSession } from "@/src/lib/server/actions/sessions"
interface Props {
  children: React.ReactNode
}

export default async function AppLayout({ children }: Props) {
  const session = await getSession()
  const initialData = await getInitialData(session)

  return (
    <Providers initialData={initialData}>
      <main className="flex h-screen flex-col">
        <Topbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="ml-52 flex flex-1 flex-col">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
              <PageTracker />
              <section className="flex-1 overflow-auto pt-5">
                {children}
              </section>
            </div>
          </div>
        </div>
        <Toaster />
        <SearchDialog />
      </main>
    </Providers>
  )
}
