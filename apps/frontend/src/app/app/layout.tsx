import * as React from "react"

import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"

import Sidebar from "@/src/components/Sidebar"

interface Props {
  children: React.ReactNode
}

const AppLayout: React.FC<Props> = ({ children }) => {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <main className="flex h-screen gap-1 bg-black p-1">
        <Sidebar />
        <section className="flex-1">{children}</section>
      </main>
    </ClerkProvider>
  )
}

export default AppLayout
