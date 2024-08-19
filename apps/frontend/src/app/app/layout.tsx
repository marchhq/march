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
        <main className="flex h-screen gap-1 bg-white p-1 dark:bg-black">
          <Sidebar />
          <section className="flex-1">{children}</section>
        </main>
      </QueryProvider>
    </AuthProvider>
  )
}

export default AppLayout
