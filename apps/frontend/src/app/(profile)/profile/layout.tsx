import React from "react"

import Providers from "./providers"
import PageTracker from "@/src/components/PageTracker"
import { Toaster } from "@/src/components/ui/toaster"

interface Props {
  children: React.ReactNode
}

export default function ProfileLayout({ children }: Props) {
  return (
    <Providers>
      <div className="flex h-screen flex-col">
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-4 py-4">
            <PageTracker />
            {children}
          </div>
        </main>
        <Toaster />
      </div>
    </Providers>
  )
}
