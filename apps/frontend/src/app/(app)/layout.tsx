import React from "react"

import { Providers } from "./providers"
import { CreateItem } from "@/src/components/CreateItem"
import { SearchDialog } from "@/src/components/modals/SearchDialog"
import { SecondNavbar } from "@/src/components/navbar/second-navbar"
import PageTracker from "@/src/components/PageTracker"
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
      <div className="flex h-screen flex-col">
        <SecondNavbar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-5xl p-4">
            <PageTracker />
            {children}
          </div>
        </main>
        <Toaster />
        <SearchDialog />
        <CreateItem />
      </div>
    </Providers>
  )
}
