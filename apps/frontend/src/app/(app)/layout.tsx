import React from "react"

import { Providers } from "./providers"
import { SecondNavbar } from "@/src/components/navbar/second-navbar"
import PageTracker from "@/src/components/PageTracker"

interface Props {
  children: React.ReactNode
}

export default async function AppLayout({ children }: Props) {
  return (
    <Providers>
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
