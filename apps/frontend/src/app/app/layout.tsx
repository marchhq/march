import * as React from "react"

import Sidebar from "@/src/components/Sidebar"
import { AuthProvider } from "@/src/contexts/AuthContext"
import QueryProvider from "@/src/contexts/QueryProvider"
interface Props {
  children: React.ReactNode
}

const AppLayout: React.FC<Props> = ({ children }) => {
  return (
    <AuthProvider>
      <QueryProvider>
        <main className="flex h-screen gap-1 bg-background p-1">
          <Sidebar />
          <section className="flex-1">{children}</section>
        </main>
      </QueryProvider>
    </AuthProvider>
  )
}

export default AppLayout
