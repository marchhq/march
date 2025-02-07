import React from "react"

import { Providers } from "./providers"
import { SecondNavbar } from "@/src/components/navbar/second-navbar"
import PageTracker from "@/src/components/PageTracker"
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
      <div className="flex flex-col">
        <SecondNavbar />
        <main className="">
          <div className="mx-auto max-w-5xl">
            <PageTracker />
            {children}
          </div>
        </main>
      </div>
    </Providers>
  )
}
